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
const NEUTRAL_TAGS = ["SPAN", "LI", "P", 'TBODY', 'TR', 'TH', 'TD', 'PRE'];
const IGNORED_TAGS = ['BUTTON', 'OPTION'];
const VALID_CLASS_NAMES = [
  'notice-block info',
  'ordered_list',
  'bullet_list',
  'toggle',
  'checkbox_list',
  'columns',
  'code-block',
  // 'scrollable-wrapper table-wrapper'
]

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

// отслеживаем изменения в document.head, это говорит о том что изменился документ для редактирования
// этот observer работает постоянно
function waitForOpenNewDocument(callback: Function) {
  const observer = new MutationObserver((mutations) => {
    console.log('🟢 NewDocument_Observer working...')
    console.log("=> new document is opened: ", mutations);
    callback();
  })

  observer.observe(document.head, {childList: true, subtree: false, attributes: false, characterData: false});
}

// ищем блок с class='hrehUE'
function waitForDocumentContainer(selector: string, callback: (element: HTMLElement) => void) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element as HTMLElement);
    console.log("=> element with class='hrehUE' are found in DOM:", element);
    return;
  }

  const observer = new MutationObserver((mutations) => {
    console.log('🟢 DocumentContainer_Observer working...')
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement && node.matches(selector)) {
          callback(node);
          console.log("=> element with class='hrehUE' are found:", node);
          observer.disconnect();
          console.log('🟥 DocumentContainer_Observer stopped');
        }
      })
    }
  })

  observer.observe(document.body, {childList: true, subtree: true});
}


// наблюдаем за блоком с class='hrehUE' и ждем монтирования текстовых узлов с атрибутом role="textbox"
function waitForTextboxes(element: HTMLElement, callback: (textBoxNodes: Node[]) => void) {
  const documentId = getOpenedDocumentId();
  let debounceTimer: number | null = null;

  const observer = new MutationObserver(() => {
    console.log('🟢 TextBoxes_Observer working...')
    if (debounceTimer) clearTimeout(debounceTimer);

    const textBoxNodes = element.querySelectorAll('[role="textbox"]');
    let nodesTree: TextNodeTree[] = [];

    // 300мс для нахождения всех текстовых узлов
    debounceTimer = setTimeout(() => {
      for (const textBoxNode of textBoxNodes) {
        nodesTree.push(createNodeTree(textBoxNode));
      }

      callback(Array.from(textBoxNodes));
      sendNodesTree(nodesTree, documentId);
      observer.disconnect();

      console.log('=> textBoxNodes are found:', textBoxNodes);
      console.log('🟥 TextBoxes_Observer stopped');
    }, 300)

  });

  observer.observe(element, {childList: true, subtree: true});
}


// наблюдаем за всеми текстовыми узлами в элементах с атрибутом role="textbox"
function watchForTextChanges(textBoxNodes: Node[]) {
  if (!textBoxNodes || textBoxNodes.length === 0) {
    console.warn("⚠️ no text nodes for observation.");
    return null;
  }

  const documentId = getOpenedDocumentId();
  let debounceTimer: number | null = null;

  const observer = new MutationObserver((mutations) => {
    console.log('👀 TextChanges_Observer working...');

    let nodesTree: TextNodeTree[] = [];
    if (debounceTimer) clearTimeout(debounceTimer);

    // мутации текстовых узлов формируем с задержкой 200мс
    debounceTimer = setTimeout(() => {
      for (const mutation of mutations) {
        console.log("✏️", mutation.target.nodeValue);

        for (const textBoxNode of textBoxNodes) {
          nodesTree.push(createNodeTree(textBoxNode));
        }
      }
      sendNodesTree(nodesTree, documentId);
    }, 200)
  })

  // Запускаем слежение за всеми текстовыми узлами страницы
  for (const textBoxNode of textBoxNodes)
    observer.observe(textBoxNode, {characterData: true, subtree: true});

  return observer;
}


function sendNodesTree(nodesTree: TextNodeTree[], id: string) {
  chrome.runtime.sendMessage({
    action: ACT.GET_NODE_TREE,
    data: {nodeTree: nodesTree, id: id}
  }, () => {
    if (chrome.runtime.lastError) {
      console.error("Ошибка при отправке сообщения:", chrome.runtime.lastError.message);
    } else {
      console.log("=> ✉️ send message ACT.GET_NODE_TREE:", JSON.stringify({nodeTree: nodesTree, id: id}, null, 2))
    }
  });
}


// рекурсивно обходим текстовый блок документа и строим узловое дерево
function createNodeTree(nodeElement: Node, parentNodeNames: string[] = []) {
  const isNodeNameNeutral = NEUTRAL_TAGS.includes(nodeElement.nodeName);
  const isNodeContainClass = VALID_CLASS_NAMES.includes(getNodeNameFromClass(nodeElement));

  const nodeNames = isNodeNameNeutral
    ? [...parentNodeNames]
    : [...parentNodeNames, isNodeContainClass
      ? getNodeNameFromClass(nodeElement)
      : nodeElement.nodeName]

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
      if (!IGNORED_TAGS.includes(node.nodeName)) {
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
