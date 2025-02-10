import {TParsedData, TRecord, TStorage} from "./types.ts";

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

// chrome.runtime.onMessage.addListener((settings, sender, sendResponse) => {
chrome.runtime.onMessage.addListener((message, {}, sendResponse) => {

  const textBoxNodes = document.querySelectorAll('[role="textbox"]');
  const mainDocContainer = document.getElementsByClassName("main-document-container");
  const documentId = mainDocContainer[0].getAttribute("id");
  // console.log(documentId);
  // console.log(textBoxNodes);

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
  // console.log(textDataArr)

  // function calculateData() {
  //
  // }

  // сохраняем в хранилище распарсенный документ
  chrome.storage.local.get("records", (storage: { [p: string]: TRecord }) => {
    //заголовок документа используем в качестве ключа
    const key = textBoxNodes[0].textContent;

    if (key === null) return;
    if (!storage['records']) return;

    storage['records'][key] = {
      id: documentId ?? crypto.randomUUID(),
      time: new Date().toLocaleTimeString(),
      title: textDataArr[0].text,
      words: words,
      symbols: symbols,
      raw: rawString.trim()
    }
    const data = storage['records'];
    chrome.storage.local.set({"records": {...data}});
  });

  if (message.action === "getData") {
    const data: TStorage = {
      raw: rawString.trim(),
      symbols: symbols,
      time: new Date().toLocaleTimeString(),
      title: textBoxNodes[0].textContent ?? '',
      words: words,
    }
    sendResponse(data);
  }
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


