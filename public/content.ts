const VALIDTAGS = {
  DIV: 'DIV',
  H1: 'H1',
  H2: 'H2',
  H3: 'H3',
  SPAN: 'SPAN',
  BUTTON: `BUTTON`,
  OPTION: 'OPTION',
  P: 'P',
  A: 'A',
  CODE: 'CODE',
  EM: 'EM',
  STRONG: 'STRONG',
  TABLE: 'TABLE',
  BLOCKQUOTE: 'BLOCKQUOTE',
  U: 'U',
  DEL: 'DEL'
}

const INVALIDTAGS = {
  OPTION: 'OPTION',
  CODE: 'CODE'
}

chrome.runtime.onMessage.addListener((settings, sender, sendResponse) => {
  const textBoxNodes = document.querySelectorAll('[role="textbox"]');
  console.log(textBoxNodes);

  const nodesTextContentArray = [];
  let symbols = 0;
  let words = 0;
  let textContent = '';
  const textInfoArr = [];
  let nodePath = '';

  function extractText(nodeElement) {
    nodeElement.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        textContent = node.textContent.trim();
        nodePath += node.parentNode.nodeName;
        symbols += textContent.length;
        words += getWordCount(textContent);
        if (textContent.length > 0) {
          textInfoArr.push({text: textContent, path: nodePath});
        }
        nodePath = '';
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.nodeName !== INVALIDTAGS.OPTION) {
          nodePath += node.parentNode.nodeName + ',';
          extractText(node)
        }
      }
    })
    return textInfoArr;
  }

  textBoxNodes.forEach(node => {
    extractText(node)
  })
  console.log(textInfoArr)

  // textBoxNodes.forEach(node => {
  //     if (node.childNodes.length > 1) {
  //       node.childNodes.forEach(textNode => {
  //         const trimmedText = textNode.textContent.trim();
  //         if (trimmedText.length > 0) {
  //           nodesTextContentArray.push(trimmedText);
  //           symbols += trimmedText.length;
  //           words += getWordCount(trimmedText);
  //         }
  //       })
  //     } else {
  //       if (node.textContent.length > 0) {
  //         nodesTextContentArray.push(node.textContent)
  //         symbols += node.textContent.length;
  //         words += getWordCount(node.textContent);
  //       }
  //     }
  //   }
  // )
  // console.log(nodesTextContentArray)

  // сохраняем в хранилище records
  chrome.storage.local.get("records", (storage) => {
    storage['records'][nodesTextContentArray[0]] = {
      time: new Date().toLocaleTimeString(),
      title: nodesTextContentArray[0],
      words: words,
      symbols: symbols,
      raw: 'raw_string'
    }
    const data = storage['records'];
    chrome.storage.local.set({"records": {...data}});
  });

  sendResponse({
    title: textBoxNodes[0].textContent,
    words: words,
    symbols: symbols,
    raw: 'raw_string'
  });
});

function prepareDataResponse() {
  const data = {};
  return data;
}

// Подсчет слов
function getWordCount(str) {
  const matches = str.match(/\S+/g);
  return matches ? matches.length : 0;
}

