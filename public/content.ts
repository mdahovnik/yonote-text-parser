const TAGS = {
  A: 'A',
  BLOCKQUOTE: 'BLOCKQUOTE',
  BUTTON: `BUTTON`,
  DEL: 'DEL',
  DIV: 'DIV',
  EM: 'EM',
  CODE: 'CODE',
  H1: 'H1',
  H2: 'H2',
  H3: 'H3',
  OPTION: 'OPTION',
  P: 'P',
  SPAN: 'SPAN',
  STRONG: 'STRONG',
  TABLE: 'TABLE',
  U: 'U'
}

chrome.runtime.onMessage.addListener((settings, sender, sendResponse) => {
  const textBoxNodes = document.querySelectorAll('[role="textbox"]');
  console.log(textBoxNodes);

  const nodesTextContentArray = [];
  let symbols = 0;
  let words = 0;
  let textContent = '';
  const textDataArr = [];
  let nodePath = '';

  function extractData(nodeElement) {
    nodeElement.childNodes.forEach((node) => {
      let nodeWords = 0;
      let nodeSymbols = 0;

      if (node.nodeType === Node.TEXT_NODE) {
        textContent = node.textContent;

        if (textContent.length > 0) {
          nodePath += node.parentNode.nodeName;
          symbols += nodeSymbols = textContent.length;
          words += nodeWords = getWordCount(textContent);

          textDataArr.push({
            text: textContent,
            nodePath: nodePath,
            words: nodeWords,
            symbols: nodeSymbols
          });
        }
        nodePath = '';
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.nodeName !== TAGS.OPTION) {
          nodePath += node.parentNode.nodeName + ',';
          extractData(node)
        }
      }
    })
    return textDataArr;
  }

  textBoxNodes.forEach(node => {
    extractData(node)
  })
  console.log(textDataArr)

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

  function calculateData() {

  }

  // сохраняем в хранилище records
  chrome.storage.local.get("records", (storage) => {
    storage['records'][textBoxNodes[0].textContent] = {
      time: new Date().toLocaleTimeString(),
      title: textDataArr[0],
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

