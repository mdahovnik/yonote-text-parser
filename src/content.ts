import {TextNodeTree} from "./types/types.ts";

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
]
let currentHeading: "H1" | "H2" | "H3" | null = null;
let nodesTree: TextNodeTree[] = [];
let selectionToolbar: HTMLElement | null = null;

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

waitForOpenNewDocument(() => {
  waitForDocumentContainer(".hrehUE", (element: HTMLElement) => {
    waitForTextboxes(element, (textBoxes: Node[]) => {
      watchForTextChanges(textBoxes);
    });
  });
});

// Индикатор количества символов в выделенной части текста, работает при выделении мышкой и ctrl+a.
const characterIndicator = (() => {
  const characterIndicator = document.createElement('span');
  characterIndicator.textContent = '0';
  characterIndicator.style.fontSize = '18px';
  characterIndicator.style.display = 'flex';
  characterIndicator.style.alignItems = 'center';
  characterIndicator.style.borderRadius = '10%';
  characterIndicator.style.paddingInline = "5px";
  characterIndicator.style.backgroundColor = 'lightgreen';
  return characterIndicator;
})()

// Вешаем индикатор количества символов во всплывающее меню появляющееся при выделении (.selection-toolbar)
document.addEventListener('selectionchange', () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  if (!selectionToolbar) {
    selectionToolbar = document.querySelector('.selection-toolbar');
    selectionToolbar?.appendChild(characterIndicator);
  } else {
    characterIndicator.textContent = `${selection?.toString().replace(/\n/g, '').length}`;
  }
})

// Отслеживаем изменения в document.head, мутации в head происходят только
// при выборе нового документа для редактирования. Очищаем ссылку на selectionToolbar, так как он тоже мутирует.
// Этот observer работает постоянно и каскадно запускает остальные.
function waitForOpenNewDocument(callback: Function) {
  const observer = new MutationObserver(() => {
    console.log('🟢 NewDocument_Observer WORKING...');
    selectionToolbar = null;
    callback();
  })
  observer.observe(document.head, {childList: true, subtree: false, attributes: false, characterData: false});
}

// Ищем блок с class='hrehUE', он при обновлении документа мутирует и его можно отследить DocumentContainer_Observer
// После обнаружения блока дисконнектим DocumentContainer_Observer.
function waitForDocumentContainer(selector: string, callback: (element: HTMLElement) => void) {
  const element = document.querySelector(selector) as HTMLElement;
  if (element) {
    callback(element);
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
    console.log("‼️ no text nodes for observation.");
    return;
  }

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
}

function sendNodesTree(nodesTree: TextNodeTree[], id: string) {
  if (!nodesTree || nodesTree.length === 0) {
    console.log("‼️ no nodesTree for sending.");
    return;
  }
  port.postMessage({
    action: ACT.GET_NODE_TREE,
    data: {nodeTree: nodesTree, id: id}
  });
}

// рекурсивно обходим текстовый блок документа и строим узловое дерево documentEditableTitle
function createNodeTree(nodeElement: Node, parentNodeNames: string[] = []) {
  const isNodeNameNeutral = NEUTRAL_TAGS.includes(nodeElement.nodeName);
  const isNodeContainClass = VALID_CLASS_NAMES.includes(getNodeNameFromClass(nodeElement));
  const titleNodeAttribute = (nodeElement as HTMLElement).hasAttribute('data-testid')
    ? (nodeElement as HTMLElement).getAttribute('data-testid')
    : '';

  let nodeNames = isNodeNameNeutral
    ? [...parentNodeNames]
    : [...parentNodeNames, isNodeContainClass
      ? getNodeNameFromClass(nodeElement)
      : nodeElement.nodeName]

  if (titleNodeAttribute && titleNodeAttribute.length > 0) nodeNames.push(titleNodeAttribute)

  const nodeTreeElement: TextNodeTree = {
    tag: nodeElement.nodeName,
    words: [],
    children: []
  };

  nodeElement.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (currentHeading && nodeNames.includes(currentHeading))
        nodeNames = nodeNames.filter(name => name === currentHeading);

      // Разбиваем текст на слова, фильтром убираем пустые строки и сохраняем их
      // В tags с помощью new Set() оставляем только уникальные теги
      const words = node.textContent?.trim().split(/\s+/).filter(w => w) || [];
      words.forEach(word => nodeTreeElement.words.push({word, tags: [...new Set(nodeNames)]}));

    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (!IGNORED_TAGS.includes(node.nodeName)) {
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

        if (currentHeading) {
          nodeNames = nodeNames.filter(name => !name.includes(`_toggle_content`));
          nodeNames.push(`${currentHeading}_toggle_content`);
        }
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
