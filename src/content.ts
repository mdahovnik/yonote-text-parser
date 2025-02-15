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
  const textBoxNodes = document.querySelectorAll('[role="textbox"]');

  let rawString = '';
  let textContent: string[] = [];
  let nodeSymbols = 0;
  let nodeWords = 0;
  let nodePath = '';

  function extractNodeData(nodeElement: ChildNode): TParsedData {
    nodeElement.childNodes?.forEach((node) => {
      if (node && node.nodeType === Node.TEXT_NODE) {

        textContent.push(node.textContent ? node.textContent : '');
        nodePath += node.parentNode?.nodeName + ',';
        rawString = textContent.join(' ');
        nodeSymbols = textContent.join('').length;
        nodeWords = getWordCount(rawString);

      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.nodeName !== NODE_NAME.OPTION && node.nodeName !== NODE_NAME.BUTTON) { //TODO: пропустить выпадающий список OPTION
          nodePath += node.parentNode?.nodeName + ',';
          extractNodeData(node)
        }
      }
    })

    return {
      type: extractNodeType(nodeElement),
      text: textContent,
      nodePath: nodePath,
      words: nodeWords,
      symbols: nodeSymbols,
      raw: rawString,
    }
  }

  if (message.action === ACT.SAVE_DOCUMENT) {
    chrome.storage.local.get("documents", (storage: TStorage) => {
      if (!storage.documents) return;

      const documents = storage.documents;
      const id = getDocumentId();
      let title: string = textBoxNodes[0].textContent ? textBoxNodes[0].textContent : 'No title';

      // парсим данные
      const parsedDocument: TParsedData[] = [];
      textBoxNodes.forEach(textBoxNode => {
        textBoxNode.childNodes.forEach((node) => {
          if (node instanceof Element)
            if (node.textContent) parsedDocument.push(extractNodeData(node));

          textContent = [];
          nodeSymbols = 0;
          nodeWords = 0;
          nodePath = '';
        })
        console.dir(parsedDocument)
      })

      const {words, symbols} = getTotals(parsedDocument)//TODO: исправить
      const newDocument: TDocument = {
        id: id,
        time: new Date().toLocaleTimeString(),
        title: title,
        words: words,
        symbols: symbols,
        raw: rawString.trim()
      }

      // проверяем наличие документа в хранилище, если есть - обновляем, нет - добавляем в хранилище
      const foundDocument = findDocumentById(documents, id);
      if (foundDocument) {
        const updatedDocument = updateFoundDocument(foundDocument, newDocument);
        documents.splice(documents.indexOf(foundDocument), 1, updatedDocument);
      } else {
        documents.push(newDocument);
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

function getWordCount(strings: string) {
  const matches = strings.match(/\S+/g);
  return matches ? matches.length : 0;
}

function getDocumentId() {
  const mainDocContainer = document.getElementsByClassName("main-document-container");
  return mainDocContainer[0].getAttribute("id") ?? crypto.randomUUID();
}

function getTotals(data: TParsedData[]) {
  return data.reduce((a, b) => ({
    words: a.words + b.words,
    symbols: a.symbols + b.symbols
  }), {words: 0, symbols: 0});
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

function extractNodeType(node: ChildNode) {
  if (node instanceof Element) {
    return node.classList.length > 0 ? `${node.className}` : `node-${node.nodeName}`
  } else
    return `node-${node.nodeName}`;
}
