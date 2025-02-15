import {TDocument, TParsedData, TSetting, TStorage} from "./types.ts";

type TMessage = {
  action: keyof typeof ACT;
  data: {
    id?: string,
    newSettings?: TSetting[]
  }
}

const ACT = {
  GET_DOCUMENT: 'GET_DOCUMENT',
  GET_RECORDS: 'GET_RECORDS',
  GET_SETTINGS: 'GET_SETTINGS',
  CLEAR_RECORDS: 'CLEAR_RECORDS',
  SAVE_DOCUMENT: 'SAVE_DOCUMENT',
  SAVE_SETTINGS: 'SAVE_SETTINGS',
  REMOVE_DOCUMENT: 'REMOVE_DOCUMENT',
  APPLY_SETTINGS: 'APPLY_SETTINGS',
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
  // let textContent: string = '';
  // let nodePath = '';
  // let classList: string[][] = [];
  // const textDataArr: TParsedData[] = [];
  // const parsedDocument: TParsedNode = {};
  let symbols = 0;
  let words = 0;
  let rawString = '';
  let nodeType: string = "";

  // const parsedDocument: TParsedData[] = [];
  const textBoxNodes = document.querySelectorAll('[role="textbox"]');

  let textContent: string = '';
  let nodeSymbols = 0;
  let nodeWords = 0;
  let classList: string[][] = [];
  let nodePath = '';

  function extractNodeData(nodeElement: ChildNode) {
    nodeElement.childNodes.forEach((node) => {
        if (node && node.nodeType === Node.TEXT_NODE) {
          textContent += node.textContent ? node.textContent + ' ' : '';
          // if (textContent && textContent.length > 0) {
          nodePath += node.parentNode?.nodeName;
          symbols += nodeSymbols = textContent.length;
          words += nodeWords = getWordCount(textContent);
          rawString += " " + textContent;

          // textDataArr.push({
          //   text: textContent.trim(),
          //   nodePath: nodePath,
          //   words: nodeWords,
          //   symbols: nodeSymbols,
          //   classList: classList,
          // });

          // parsedDataArray.push({
          //   text: textContent,
          //   nodePath: nodePath,
          //   words: nodeWords,
          //   symbols: nodeSymbols,
          //   classList: classList,
          // });
          // }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.nodeName !== NODE_NAME.OPTION) { //TODO: пропустить выпадающий список OPTION
            nodePath += node.parentNode?.nodeName + ',';
            extractNodeData(node)
          }
        }
      }
    )
    // return textDataArr;
    return {
      type: extractNodeType(nodeElement),
      text: textContent.trim(),
      nodePath: nodePath,
      words: nodeWords,
      symbols: nodeSymbols,
      classList: classList,
    };
  }

  function extractNodeType(node: ChildNode) {
    if (node instanceof Element) {
      nodeType = node.classList.length > 0 ? `class:${node.className}` : `node:${node.nodeName}`
    } else {
      nodeType = `node-${node.nodeName}`;
    }
    return nodeType;
  }

  console.log(textBoxNodes[1].childNodes);

  textBoxNodes.forEach(textBoxNode => {
    const parsedDocument: TParsedData[] = [];
    textBoxNode.childNodes.forEach((node) => {
      if (node instanceof Element) {
        if (node.textContent) parsedDocument.push(extractNodeData(node));
      }
      textContent = '';
      nodeSymbols = 0;
      nodeWords = 0;
      classList = [];
      nodePath = '';
    })
    console.dir(parsedDocument)
  })
  // })


  if (message.action === ACT.SAVE_DOCUMENT) {
    // console.dir(parsedDataArray)//TODO: вывод в консоль распарсенного массива
    chrome.storage.local.get("documents", (storage: TStorage) => {
      if (!storage.documents) return;

      const documents = storage.documents;
      const localTime = new Date().toLocaleTimeString();
      const id = getDocumentId();
      let title: string = textBoxNodes[0].textContent ? textBoxNodes[0].textContent : 'No title';

      const parsedData: TDocument = {
        id: id,
        time: localTime,
        title: title,
        words: words,
        symbols: symbols,
        raw: rawString.trim()
      }

      const foundDocument = findDocumentById(documents, id);
      if (foundDocument) {
        const updatedDocument = updateFoundDocument(foundDocument, parsedData);
        documents.splice(documents.indexOf(foundDocument), 1, updatedDocument);
      } else {
        documents.push(parsedData);
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

  if (message.action === ACT.GET_SETTINGS) {
    chrome.storage.local.get("settings", (storage: TStorage) => {
      const settings = storage.settings;
      sendResponse(settings);
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

  if (message.action === ACT.SAVE_SETTINGS) {
    const newCountTypeSettings = message.data.newSettings;
    chrome.storage.local.set({"settings": newCountTypeSettings}, () => {
      chrome.storage.local.get("settings", (storage: TStorage) => {
        sendResponse(storage.settings)
      })
    })
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

// "https://*.yonote.ru/doc/*"