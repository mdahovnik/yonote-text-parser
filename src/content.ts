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
  "notice-block warning",
  "notice-block tip",
  'ordered_list',
  'bullet_list',
  'toggle',
  'checkbox_list',
  'columns',
  'code-block'
  // 'scrollable-wrapper table-wrapper'
]

// let toggleH1 = false;
// let toggleH2 = false;
// let toggleH3 = false;

let currentToggle: "H1" | "H2" | "H3" | null = null;

chrome.runtime.onMessage.addListener((message: TMessage, {}, sendResponse) => {
  if (message.action === ACT.GET_DOCUMENT_ID) {
    const openedDocumentId = getCurrentDocumentId();
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

// Отслеживаем изменения в document.head, мутации в head происходят только
// при выборе нового документа для редактирования. Этот observer работает постоянно и каскадно запускает остальные.
function waitForOpenNewDocument(callback: Function) {
  const observer = new MutationObserver((mutations) => {
    console.log('🟢 NewDocument_Observer working...')
    console.log("=> new document is opened: ", mutations);
    callback();
  })

  observer.observe(document.head, {childList: true, subtree: false, attributes: false, characterData: false});
}

// Ищем блок с class='hrehUE', он при обновлении документа мутирует и его можно отследить обзёрвером
// После обнаружения блока дисконнектим его.
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

// В блоке с class='hrehUE' ждем монтирования нод с атрибутом role="textbox".
// В них находятся все текстовые узлы документа. После обнаружения блока дисконнектим его.
function waitForTextboxes(element: HTMLElement, callback: (textBoxNodes: Node[]) => void) {
  const documentId = getCurrentDocumentId();
  let debounceTimer: number | null = null;

  const observer = new MutationObserver(() => {
    console.log('🟢 TextBoxes_Observer working...')
    if (debounceTimer) clearTimeout(debounceTimer);

    const textBoxNodes = element.querySelectorAll('[role="textbox"]');
    let nodesTree: TextNodeTree[] = [];

    // 300мс для нахождения всех текстовых узлов
    debounceTimer = setTimeout(() => {
      // toggleH1 = false;
      // toggleH2 = false;
      // toggleH3 = false;
      currentToggle = null;
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

// Наблюдаем за всеми текстовыми узлами в элементах с атрибутом role="textbox".
// И в лайф-режиме фиксируем изменения.
function watchForTextChanges(textBoxNodes: Node[]) {
  if (!textBoxNodes || textBoxNodes.length === 0) {
    console.warn("⚠️ no text nodes for observation.");
    return null;
  }

  const documentId = getCurrentDocumentId();
  let debounceTimer: number | null = null;

  const observer = new MutationObserver((mutations) => {
    console.log('👀 TextChanges_Observer working...');

    let nodesTree: TextNodeTree[] = [];
    if (debounceTimer) clearTimeout(debounceTimer);

    // мутации текстовых узлов формируем с задержкой 200мс
    debounceTimer = setTimeout(() => {
      // toggleH1 = false;
      // toggleH2 = false;
      // toggleH3 = false;
      currentToggle = null;
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

// Отправляем дерево текстовых узлов спарсенного в background-script
function sendNodesTree(nodesTree: TextNodeTree[], id: string) {
  chrome.runtime.sendMessage({
    action: ACT.GET_NODE_TREE,
    data: {nodeTree: nodesTree, id: id}
  }, () => {
    if (chrome.runtime.lastError) {
      console.error("Ошибка при отправке сообщения ACT.GET_NODE_TREE:", chrome.runtime.lastError.message);
    } else {
      console.log("✉️ send message ACT.GET_NODE_TREE:", {
        nodeTree: nodesTree,
        id: id
      }, JSON.stringify({nodeTree: nodesTree, id: id}, null, 2))
    }
  });
}

// рекурсивно обходим текстовый блок документа и строим узловое дерево
function createNodeTree(nodeElement: Node, parentNodeNames: string[] = []) {
  const isNodeNameNeutral = NEUTRAL_TAGS.includes(nodeElement.nodeName);
  const isNodeContainClass = VALID_CLASS_NAMES.includes(getNodeNameFromClass(nodeElement));
  // console.log("====>", getNodeNameFromClass(nodeElement))
  let nodeNames = isNodeNameNeutral
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

      if (currentToggle && nodeNames.includes(currentToggle))
        nodeNames = nodeNames.filter(name => name === currentToggle);

      // разбиваем текст на слова, фильтром убираем пустые строки и сохраняем их
      const words = node.textContent?.trim().split(/\s+/).filter(w => w) || [];

      // в tags с помощью new Set() оставляем только уникальные теги
      words.forEach(word => nodeTreeElement.words.push({word, tags: [...new Set(nodeNames)]}));

    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (!IGNORED_TAGS.includes(node.nodeName)) {

        // if (node.nodeName === "H1") {
        //   toggleH1 = true;
        //   toggleH2 = false;
        //   toggleH3 = false;
        // }
        // if (node.nodeName === "H2") {
        //   toggleH1 = false;
        //   toggleH2 = true;
        //   toggleH3 = false;
        // }
        // if (node.nodeName === "H3") {
        //   toggleH1 = false;
        //   toggleH2 = false;
        //   toggleH3 = true;
        // }
        //
        // if (toggleH1) nodeNames.push('H1_toggle_content');
        // if (toggleH2) nodeNames.push('H2_toggle_content');
        // if (toggleH3) nodeNames.push('H3_toggle_content');

        switch (node.nodeName) {
          case "H1":
            currentToggle = "H1";
            break;
          case "H2":
            currentToggle = "H2";
            break;
          case "H3":
            currentToggle = "H3";
            break;
        }

        if (currentToggle)
          nodeNames.push(`${currentToggle}_toggle_content`);

        // рекурсивно обрабатываем вложенные элементы
        nodeTreeElement.children.push(createNodeTree(node, nodeNames));
      }
    }
  })

  return nodeTreeElement;
}

// Если нода содержит class, то получаем его.
// Нужны для дальнейшего парсинга с учетом VALID_CLASS_NAMES
function getNodeNameFromClass(node: Node) {
  if (node instanceof Element) {
    return node.classList.length > 0
      ? `${node.className}`
      : `${node.nodeName}`
  } else
    return node.nodeName;
}

function getCurrentDocumentId() {
  const mainDocContainer = document.getElementsByClassName("main-document-container");
  return mainDocContainer[0]?.getAttribute("id") || crypto.randomUUID();
}

//TODO: рассмотреть этот вариант.
//Если только один из флагов (H1, H2, H3) может быть активен одновременно,
// можно использовать одну переменную для хранения текущего состояния:
//
// let currentToggle = null; // Может быть "H1", "H2", "H3" или null
//
// switch (node.nodeName) {
//   case "H1":
//     currentToggle = "H1";
//     break;
//   case "H2":
//     currentToggle = "H2";
//     break;
//   case "H3":
//     currentToggle = "H3";
//     break;
// }
//
// if (currentToggle) {
//   nodeNames.push(`${currentToggle}_toggle_content`);
// }