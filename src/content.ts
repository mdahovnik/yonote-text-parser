import {TDocument, TParsedData, TStorage} from "./types.ts";

const ACT = {
  GET_DOCUMENT: 'GET_DOCUMENT',
  GET_RECORDS: 'GET_RECORDS',
  SAVE_DOCUMENT: 'SAVE_DOCUMENT',
  SAVE_SETTINGS: 'SAVE_SETTINGS'
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

chrome.runtime.onMessage.addListener((message, {}, sendResponse) => {
  const textBoxNodes = document.querySelectorAll('[role="textbox"]');

  let symbols = 0;
  let words = 0;
  let textContent: string = '';
  const textDataArr: TParsedData[] = [];
  let nodePath = '';
  let rawString = '';

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

  if (message.action === ACT.SAVE_DOCUMENT) {
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
  }

  // сохраняем в хранилище распарсенный документ
  if (message.action === ACT.GET_DOCUMENT) {
    chrome.storage.local.get("records", (storage: TStorage) => {
      if (!storage.records) return;

      const records = storage.records;
      const docId = getDocumentId();
      const localTime = new Date().toLocaleTimeString();
      const mewDocument: TDocument = {
        id: docId,
        time: localTime,
        title: textDataArr[0].text ?? '',
        words: words,
        symbols: symbols,
        raw: rawString.trim()
      }

      records.push(mewDocument);

      chrome.storage.local.set({"records": records}, () => {
        sendResponse(storage.records);
      });
    });
  }

  if (message.action === ACT.GET_RECORDS) {
    console.log("getRecords")
    chrome.storage.local.get("records", (storage: TStorage) => {
      const records = storage.records;
      sendResponse(records);
    })
  }

  return true;  //TODO: под вопросом
});

// function prepareDataResponse() {
//   const data = {};
//   return data;
// }

// type data = {
//   text: string,
//   nodePath: Element,
//   words: number,
//   symbols: number
// }

// function getTotalCounts(data: data) {
//
//   return {
//     words: 0,
//     symbols: 0
//   }
// }

// Подсчет слов
function getWordCount(str: string) {
  const matches = str.match(/\S+/g);
  return matches ? matches.length : 0;
}

function getDocumentId() {
  const mainDocContainer = document.getElementsByClassName("main-document-container");
  return mainDocContainer[0].getAttribute("id") ?? crypto.randomUUID();
}


