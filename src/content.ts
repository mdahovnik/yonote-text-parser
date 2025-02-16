import {TDocument, TParsedData, TSetting, TStorage, TData} from "./types.ts";

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
  // let textContent: string[] = [];
  let nodePath = '';
  let nodeData: TData[] = []

  function extractNodeData(nodeElement: ChildNode): TParsedData {
    nodeElement.childNodes?.forEach((node) => {
      if (node && node.nodeType === Node.TEXT_NODE) {
        nodePath += node.parentNode?.nodeName + ',';
        nodeData.push({
          text: node.textContent ?? '',
          path: nodePath//node.parentNode?.nodeName + ','
        });
        nodePath = '';

      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.nodeName !== NODE_NAME.OPTION && node.nodeName !== NODE_NAME.BUTTON) { // узлы которые не надо парсить
          nodePath += node.parentNode?.nodeName + ',';
          extractNodeData(node)
        }
      }
    })

    let textContent = nodeData.map((item) => item.text);

    return {
      nodeType: extractNodeType(nodeElement),
      data: nodeData,
      // nodePath: nodePath,
      words: getWordCount(textContent.join(' ')),
      symbols: textContent.join('').length,
      raw: textContent.join(' ')
    }
  }

  if (message.action === ACT.SAVE_DOCUMENT) {
    chrome.storage.local.get("documents", (storage: TStorage) => {
      if (!storage.documents) return;

      // парсим данные
      let parsedDocument: TParsedData[] = [];
      textBoxNodes.forEach(textBoxNode => {
        parsedDocument = [];
        textBoxNode.childNodes.forEach((node) => {
          if (node instanceof Element && node.textContent) parsedDocument.push(extractNodeData(node));
          // textContent = [];
          nodePath = '';
          nodeData = [];
        })
        console.log(parsedDocument)
      })

      // создаем новый документ
      const id = getDocumentId();
      let title: string = textBoxNodes[0].textContent ? textBoxNodes[0].textContent : 'No title';
      const {words, symbols} = getTotals(parsedDocument);
      const {raw} = getRawString(parsedDocument);
      const newDocument: TDocument = {
        id: id,
        time: new Date().toLocaleTimeString(),
        title: title,
        words: words,
        symbols: symbols,
        rawString: raw
      }

      // проверяем наличие созданного документа в хранилище, если есть - обновляем его данные, нет - сохраняем в хранилище
      const documents = storage.documents;
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

  if (message.action === ACT.REMOVE_DOCUMENT) {
    chrome.storage.local.get("documents", (storage: TStorage) => {
      const filteredRecords = storage.documents.filter((document) => document.id !== message.data.id);

      chrome.storage.local.set({"documents": filteredRecords}, () => {
        sendResponse(filteredRecords);
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

  if (message.action === ACT.GET_SETTINGS) {
    chrome.storage.local.get("settings", (storage: TStorage) => {
      const settings = storage.settings;
      sendResponse(settings);
    })
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

function getWordCount(string: string) {
  const matches = string.match(/[\p{L}\d]+/gu) || [];  //(/\b\w+\b/g)    //(/\b[\w\dА-Яа-яЁё]+\b/g)   //(/\S+/g);
  return matches.length;
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
    raw: parsedDocument.rawString
  }
}

function extractNodeType(node: ChildNode) {
  if (node instanceof Element) {
    return node.classList.length > 0 ? `${node.className}` : `${node.nodeName}`
  } else
    return `node-${node.nodeName}`;
}

function getRawString(parsedDocument: TParsedData[]) {
  return parsedDocument.reduce((a, b) => ({raw: a.raw + ' ' + b.raw}), {raw: ''})
}
