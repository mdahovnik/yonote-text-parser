import {TextNodeTree, TMessage} from "./types.ts";

console.log("💡 content.ts is running:", document.readyState);

const ACT = {
  GET_DOCUMENT: 'GET_DOCUMENT',
  GET_RECORDS: 'GET_RECORDS',
  GET_SETTINGS: 'GET_SETTINGS',
  GET_DOCUMENT_ID: 'GET_DOCUMENT_ID',
  CLEAR_RECORDS: 'CLEAR_RECORDS',
  SAVE_DOCUMENT: 'SAVE_DOCUMENT',
  SAVE_SETTINGS: 'SAVE_SETTINGS',
  REMOVE_DOCUMENT: 'REMOVE_DOCUMENT',
  APPLY_SETTINGS: 'APPLY_SETTINGS',
  SET_BADGE: 'SET_BADGE',
  TEXT_CHANGED: 'TEXT_CHANGED',
  GET_NODE_TREE: 'GET_NODE_TREE'
}
const NEUTRAL_TAGS = new Set(["SPAN", "LI", "P", 'TBODY', 'TR', 'TH', 'TD', 'PRE']);
const IGNORED_TAGS = new Set(['BUTTON', 'OPTION']);
const VALID_CLASS_NAMES = new Set([
  'notice-block info',
  'ordered_list',
  'bullet_list',
  'toggle',
  'checkbox_list',
  'columns',
  'code-block',
  // 'scrollable-wrapper table-wrapper'
])

chrome.runtime.onMessage.addListener((message: TMessage, {}, sendResponse) => {
  if (message.action === ACT.GET_DOCUMENT_ID) {
    const openedDocumentId = getOpenedDocumentId();
    sendResponse(openedDocumentId)
  }
})

waitForOpenNewDocument(() => {
  waitForDocumentContainer(".hrehUE", (element: HTMLElement) => {
    waitForTextboxes(element, (textBoxes: Node[]) => {
      watchForTextChanges(textBoxes);
    });
  });
});

function waitForOpenNewDocument(callback: Function) {
  const observer = new MutationObserver((mutations) => {
    console.log('🟢 NewDocument_Observer')
    console.log("=> new document is opened: ", mutations);
    callback();
  })

  observer.observe(document.head, {childList: true, subtree: false, attributes: false, characterData: false});
}


function waitForDocumentContainer(selector: string, callback: (element: HTMLElement) => void) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element as HTMLElement);
    console.log("💡element hrehUE are found in DOM:", element);
    return;
  }

  const observer = new MutationObserver((mutations) => {
    console.log('🟢 DocumentContainer_Observer')
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement && node.matches(selector)) {
          callback(node);
          console.log("💡element hrehUE are found: ", node);
          observer.disconnect();
          console.log('🟥 DocumentContainer_Observer');
        }
      })
    })
  })

  observer.observe(document.body, {childList: true, subtree: true});
}


function waitForTextboxes(element: HTMLElement, callback: (textBoxNodes: Node[]) => void) {
  const documentId = getOpenedDocumentId();

  const observer = new MutationObserver(() => {
    console.log('🟢 TextBoxes_Observer')
    const textBoxNodes = element.querySelectorAll('[role="textbox"]');

    let nodesTree: TextNodeTree[] = [];
    // if (textBoxNodes.length > 1) {
    for (const textBoxNode of textBoxNodes)
      nodesTree.push(createNodeTree(textBoxNode));

    callback(Array.from(textBoxNodes));
    console.log('💡textBoxNodes are found: ', textBoxNodes);

    // observer.disconnect();
    // console.log('🟥 TextBoxes_Observer')
    sendNodesTree(nodesTree, documentId);
    // }
  });

  observer.observe(element, {childList: true, subtree: true});
  console.log("👀 watching for textBoxes changes...");
}


// Функция для запуска наблюдателя
function watchForTextChanges(textBoxNodes: Node[]) {
  if (!textBoxNodes || textBoxNodes.length === 0) {
    console.warn("⚠️ No text nodes provided for observation.");
    return null;
  }

  const documentId = getOpenedDocumentId();
  let debounceTimer: number | null = null;

  const observer = new MutationObserver((mutations) => {
    console.log('🟢 TextChanges_Observer');

    let nodesTree: TextNodeTree[] = [];

    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      for (const mutation of mutations) {
        if (mutation.target.TEXT_NODE) {
          for (const textBoxNode of textBoxNodes) {
            nodesTree.push(createNodeTree(textBoxNode));
          }
          console.log("✏️ CHANGED_TEXT: ", mutation.target.nodeValue);//, mutation.target.nodeValue
          sendNodesTree(nodesTree, documentId);
        }
      }
    }, 200)
  })

  // Запускаем слежение за всеми текстовыми узлами страницы
  for (const textBoxNode of textBoxNodes)
    observer.observe(textBoxNode, {characterData: true, subtree: true});

  console.log("👀 watching for text changes...");
  return observer;
}


function sendNodesTree(nodesTree: TextNodeTree[], id: string) {
  chrome.runtime.sendMessage({
    action: ACT.GET_NODE_TREE,
    data: {nodeTree: nodesTree, id: id}
  }, () => {
    if (chrome.runtime.lastError) {
      console.error("Ошибка при отправке сообщения:", chrome.runtime.lastError);
    } else {
      console.log("=>  send message ACT.GET_NODE_TREE: ", {nodeTree: nodesTree, id: id})
    }
  });
}


// рекурсивно обходим текстовый блок документа и строим узловое дерево
function createNodeTree(nodeElement: Node, parentNodeNames: string[] = []) {
  const isNodeNameNeutral = NEUTRAL_TAGS.has(nodeElement?.nodeName);
  const isNodeContainClass = VALID_CLASS_NAMES.has(getNodeNameFromClass(nodeElement));

  const nodeNames = isNodeNameNeutral
    ? [...parentNodeNames]
    : [...parentNodeNames, isNodeContainClass
      ? getNodeNameFromClass(nodeElement)
      : nodeElement?.nodeName]

  const nodeTreeElement: TextNodeTree = {
    tag: nodeElement.nodeName,
    words: [],
    children: []
  };

  nodeElement.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {

      // разбиваем текст на слова, фильтром убираем пустые строки и сохраняем их
      const words = node.textContent?.trim().split(/\s+/).filter(w => w) || [];

      // в tags с помощью new Set() оставляем только уникальные теги
      words.forEach(word => nodeTreeElement.words.push({word, tags: [...new Set(nodeNames)]}));

    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (!IGNORED_TAGS.has(node.nodeName)) {
        // рекурсивно обрабатываем вложенные элементы
        nodeTreeElement.children.push(createNodeTree(node, nodeNames));
      }
    }
  })
  return nodeTreeElement;
}


function getNodeNameFromClass(node: Node) {
  if (node instanceof Element) {
    return node.classList.length > 0
      ? `${node.className}`
      : `${node.nodeName}`
  } else
    return node.nodeName;
}


function getOpenedDocumentId() {
  const mainDocContainer = document.getElementsByClassName("main-document-container");
  return mainDocContainer[0]?.getAttribute("id") || crypto.randomUUID();
}

// function waitForTextboxes(element: HTMLElement, callback: (textBoxes: Node[]) => void) {
//   const nodes = element.querySelectorAll('[role="textbox"]');
//   if (nodes.length > 1) {
//     callback(Array.from(nodes));
//     console.log("✔️ в DOM найдены textBoxes:", nodes);
//     return;
//   }
//
//   const textBoxNodes: Node[] = [];
//   const observer = new MutationObserver((mutations) => {
//     console.log('🟢 WORKING  waitForTextboxes observer')
//     for (const mutation of mutations) {
//       mutation.addedNodes.forEach((node) => {
//         if (node instanceof HTMLElement && node.hasAttribute("role") && node.getAttribute("role") === "textbox") {
//           textBoxNodes.push(node)
//         }
//       })
//     }
//     console.log("textBoxNodes", textBoxNodes.length)
//     if (textBoxNodes.length > 1) {
//       callback(Array.from(textBoxNodes));
//       console.log("✔️ найдены textBoxes:", textBoxNodes);
//       observer.disconnect();
//       console.log('🟥 STOP waitForTextboxes observer')
//     }
//   });
//   observer.observe(element, {childList: true, subtree: true});
// }