import {TextNodeTree, TMessage} from "./types.ts";

console.log("💡 content.ts is running:", document.readyState);

const ACT = {
  GET_DOCUMENT: 'GET_DOCUMENT',
  GET_DOCUMENTS: 'GET_DOCUMENTS',
  GET_SETTINGS: 'GET_SETTINGS',
  GET_DOCUMENT_ID: 'GET_DOCUMENT_ID',
  CLEAR_RECORDS: 'CLEAR_RECORDS',
  SAVE_DOCUMENT: 'SAVE_DOCUMENT',
  SAVE_SETTINGS: 'SAVE_SETTINGS',
  REMOVE_DOCUMENT: 'REMOVE_DOCUMENT',
  APPLY_SETTINGS: 'APPLY_SETTINGS',
  SET_BADGE: 'SET_BADGE',
  TEXT_CHANGED: 'TEXT_CHANGED',
  GET_NODE_TREE: 'GET_NODE_TREE',
  SELECTION_TEXT_CHANGED: 'SELECTION_TEXT_CHANGED'
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
]
let currentHeading: "H1" | "H2" | "H3" | null = null;
let nodesTree: TextNodeTree[] = [];

// открываем постоянное соединение которое будем использовать в background.ts
let port = chrome.runtime.connect({name: "content-to-background"});
port.onDisconnect.addListener(reconnectPort);

function reconnectPort() {
  setTimeout(() => {
    port = chrome.runtime.connect({name: "content-to-background"});

    if (port) {
      port.onDisconnect.addListener(reconnectPort);
      console.log("Порт переподключен к background...");
    } else {
      console.warn("Не удалось перезапустить порт. Пробуем снова...");
      reconnectPort();
    }
  }, 500)
}

function createCharacterIndicator() {
  const characterIndicator = document.createElement('div');
  characterIndicator.textContent = '';
  characterIndicator.style.fontSize = '18px';
  characterIndicator.style.display = 'flex';
  characterIndicator.style.alignItems = 'center';
  characterIndicator.style.borderRadius = '10%';
  characterIndicator.style.paddingInline = "5px";
  characterIndicator.style.backgroundColor = 'lightgreen';
  return characterIndicator;
}

let selectionToolbar: HTMLElement | null = null;
const characterIndicator = createCharacterIndicator();

document.addEventListener('selectionchange', () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  if (!selectionToolbar) {
    selectionToolbar = document.querySelector('.selection-toolbar');
  }

  if (selectionToolbar) {
    characterIndicator.textContent = `${selection?.toString().length || ''}`;
    selectionToolbar.appendChild(characterIndicator);
  }
})


chrome.runtime.onMessage.addListener((message: TMessage, {}, sendMessage) => {
  if (message.action === ACT.GET_DOCUMENT_ID) {
    const openedDocumentId = getCurrentDocumentId();
    sendMessage(openedDocumentId)
  }
})

const startWatchingDocument = () => {
  waitForOpenNewDocument(() => {
    waitForDocumentContainer(".hrehUE", (element: HTMLElement) => {
      waitForTextboxes(element, (textBoxes: Node[]) => {
        watchForTextChanges(textBoxes);
      });
    });
  });
}

startWatchingDocument();

// Отслеживаем изменения в document.head, мутации в head происходят только
// при выборе нового документа для редактирования. Этот observer работает постоянно и каскадно запускает остальные.
function waitForOpenNewDocument(callback: Function) {
  const observer = new MutationObserver((mutations) => {
    console.log('🟢 NewDocument_Observer WORKING...')
    console.log("=> new document is opened: ", mutations);
    callback();
  })
  observer.observe(document.head, {childList: true, subtree: false, attributes: false, characterData: false});
}

// Ищем блок с class='hrehUE', он при обновлении документа мутирует и его можно отследить DocumentContainer_Observer
// После обнаружения блока дисконнектим DocumentContainer_Observer.
function waitForDocumentContainer(selector: string, callback: (element: HTMLElement) => void) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element as HTMLElement);
    return;
  }

  const observer = new MutationObserver((mutations) => {
    console.log('🟢 DocumentContainer_Observer WORKING...')
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement && node.matches(selector)) {
          callback(node);
          observer.disconnect();
          console.log('🟥 DocumentContainer_Observer DISCONNECTED');
        }
      })
    }
  })
  observer.observe(document.body, {childList: true, subtree: true});
}

// В блоке с class='hrehUE' ждем монтирования тегов с атрибутом role="textbox".
// В них находятся все текстовые узлы документа. После обнаружения блока дисконнектим его.
function waitForTextboxes(element: HTMLElement, callback: (textBoxNodes: Node[]) => void) {
  const documentId = getCurrentDocumentId();
  let debounceTimer: number | null = null;

  const observer = new MutationObserver(() => {
    console.log('🟢 TextBoxes_Observer WORKING...')

    if (debounceTimer) clearTimeout(debounceTimer);
    const textBoxNodes = element.querySelectorAll('[role="textbox"]');

    debounceTimer = setTimeout(() => {
      currentHeading = null;
      nodesTree = [];

      for (const textBoxNode of textBoxNodes) {
        nodesTree.push(createNodeTree(textBoxNode));
      }

      callback(Array.from(textBoxNodes));
      sendNodesTree(nodesTree, documentId);
      observer.disconnect();

      console.log('🟥 TextBoxes_Observer DISCONNECTED');
    }, 300)
  });
  observer.observe(element, {childList: true, subtree: true});
}

// Наблюдаем за всеми текстовыми узлами в элементах с role="textbox" и в режиме реального времени фиксируем изменения в nodesTree.
// Отправляем nodesTree спарсенного документа в background.ts для сохранения в nodesTreeCache
function watchForTextChanges(textBoxNodes: Node[]) {
  if (!textBoxNodes || textBoxNodes.length === 0) {
    console.warn("⚠️ no text nodes for observation.");
    return null;
  }

  console.log('=> textBoxNodes are found:', textBoxNodes);
  const documentId = getCurrentDocumentId();
  let debounceTimer: number | null = null;

  const observer = new MutationObserver(() => {
    console.log('👀 TextChanges_Observer WORKING...');

    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      currentHeading = null;
      nodesTree = [];

      for (const textBoxNode of textBoxNodes) {
        nodesTree.push(createNodeTree(textBoxNode));
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
  port.postMessage({action: ACT.GET_NODE_TREE, data: {nodeTree: nodesTree, id: id}});
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

      if (currentHeading && nodeNames.includes(currentHeading))
        nodeNames = nodeNames.filter(name => name === currentHeading);

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
            currentHeading = "H1";
            break;
          case "H2":
            currentHeading = "H2";
            break;
          case "H3":
            currentHeading = "H3";
            break;
        }

        if (currentHeading)
          nodeNames.push(`${currentHeading}_toggle_content`);

        // рекурсивно обрабатываем вложенные элементы
        nodeTreeElement.children.push(createNodeTree(node, nodeNames));
      }
    }
  })

  return nodeTreeElement;
}

// Если нода содержит class, то получаем его и сохраняем в массив тегов, они нужны для дальнейшего парсинга
// с учетом VALID_CLASS_NAMES
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
