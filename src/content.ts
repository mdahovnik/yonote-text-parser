import {TDocument, TParsedData, TStorage} from "./types.ts";

type TMessage = {
  action: string;
  data: { id: string }
}

const ACT = {
  GET_DOCUMENT: 'GET_DOCUMENT',
  GET_RECORDS: 'GET_RECORDS',
  CLEAR_RECORDS: 'CLEAR_RECORDS',
  SAVE_DOCUMENT: 'SAVE_DOCUMENT',
  SAVE_SETTINGS: 'SAVE_SETTINGS',
  REMOVE_DOCUMENT: 'REMOVE_DOCUMENT'
}

enum NODE_NAME {
  A = "A",
  BLOCKQUOTE = "BLOCKQUOTE",
  BUTTON = "BUTTON",
  DEL = "DEL",
  DIV = "DIV",
  EM = "EM",
  CODE = "CODE",
  H1 = "H1",
  H2 = "H2",
  H3 = "H3",
  OPTION = "OPTION",
  P = "P",
  SPAN = "SPAN",
  STRONG = "STRONG",
  TABLE = "TABLE",
  U = "U",
}

chrome.runtime.onMessage.addListener((message: TMessage, {}, sendResponse) => {
  let symbols = 0;
  let words = 0;
  let textContent: string = '';
  const textDataArr: TParsedData[] = [];
  let nodePath = '';
  let rawString = '';
  const textBoxNodes = document.querySelectorAll('[role="textbox"]');

  function extractData(nodeElement: ChildNode) {
    nodeElement.childNodes.forEach((node) => {
      let nodeWords = 0;
      let nodeSymbols = 0;

      if (node && node.nodeType === Node.TEXT_NODE) {
        textContent = node.textContent ?? '';

        if (textContent && textContent.length > 0) {
          nodePath += node.parentNode?.nodeName;
          symbols += nodeSymbols = textContent.length;
          words += nodeWords = getWordCount(textContent);
          rawString += " " + textContent;

          textDataArr.push({
            text: textContent,
            nodePath: nodePath,
            words: nodeWords,
            symbols: nodeSymbols
          });
        }
        nodePath = '';
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.nodeName !== NODE_NAME.OPTION) {
          nodePath += node.parentNode?.nodeName + ',';
          extractData(node)
        }
      }
    })
    return textDataArr; //TODO: вывод в консоль распарсенного массива
  }

  textBoxNodes.forEach(node => {
    extractData(node)
  })

  // if (message.action === ACT.SAVE_DOCUMENT) {
  // chrome.storage.local.get("records", (storage: TStorage) => {
  //   if (!storage.records) return;
  //
  //   storage.records.push({ // TODO: сохраняется только один документ
  //     id: getDocumentId(),
  //     time: new Date().toLocaleTimeString(),
  //     title: textDataArr[0].text,
  //     words: words,
  //     symbols: symbols,
  //     raw: rawString.trim()
  //   });
  //
  //   const data = storage.records;
  //   chrome.storage.local.set({"records": {...data}}, () => {
  //   });
  // });
  // }

  // сохраняем в хранилище распарсенный документ
  if (message.action === ACT.SAVE_DOCUMENT) {
    chrome.storage.local.get("documents", (storage: TStorage) => {
      if (!storage.documents) return;

      const documents = storage.documents;
      const localTime = new Date().toLocaleTimeString();
      const id = getDocumentId();

      const parsedDocument: TDocument = {
        id: id,
        time: localTime,
        title: textDataArr[0].text ?? '',
        words: words,
        symbols: symbols,
        raw: rawString.trim()
      }

      const foundDocument = findDocumentById(documents, id);
      if (foundDocument) {
        const updatedDocument = updateFoundDocument(foundDocument, parsedDocument);

        documents.splice(documents.indexOf(foundDocument), 1, updatedDocument);
      } else {
        documents.push(parsedDocument);
      }

      chrome.storage.local.set({"documents": documents}, () => {
        sendResponse(storage.documents);
      });
    });
  }

  if (message.action === ACT.GET_RECORDS) {
    chrome.storage.local.get("documents", (storage: TStorage) => {
      const records = storage.documents;
      sendResponse(records);
    })
  }

  if (message.action === ACT.CLEAR_RECORDS) {
    chrome.storage.local.set({"documents": []}, () => {
      sendResponse(null)
    })
  }

  if (message.action === ACT.REMOVE_DOCUMENT) {
    chrome.storage.local.get("documents", (storage: TStorage) => {
      const filteredRecords = storage.documents.filter((document) => document.id !== message.data.id);

      chrome.storage.local.set({"documents": filteredRecords}, () => {
        sendResponse(filteredRecords);
      });
    });
  }

  return true;
});

function getWordCount(str: string) {
  const matches = str.match(/\S+/g);
  return matches ? matches.length : 0;
}

function getDocumentId() {
  const mainDocContainer = document.getElementsByClassName("main-document-container");
  return mainDocContainer[0].getAttribute("id") ?? crypto.randomUUID();
}

function findDocumentById(documents: TDocument[], id: string) {
  console.log(id)
  return documents.find((document) => document.id === id);
}

function updateFoundDocument(foundDocument: TDocument, parsedDocument: TDocument) {
  if (!foundDocument) return parsedDocument;
  return {
    ...foundDocument,
    time: parsedDocument.time,
    title: parsedDocument.title,
    words: parsedDocument.words,
    symbols: parsedDocument.symbols,
    raw: parsedDocument.raw
  }
}
