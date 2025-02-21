import {Document, SettingList, Storage, TextNodeTree} from "./types.ts";

type TMessage = {
  action: keyof typeof ACT;
  data: {
    id?: string,
    newSettings?: SettingList
  }
}

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
}

// enum NODE_NAME {
//   A = "A",
//   BLOCKQUOTE = "BLOCKQUOTE",
//   BUTTON = "BUTTON",
//   DEL = "DEL",
//   DIV = "DIV",
//   EM = "EM",
//   CODE = "CODE",
//   H1 = "H1",
//   H2 = "H2",
//   H3 = "H3",
//   OPTION = "OPTION",
//   P = "P",
//   SPAN = "SPAN",
//   STRONG = "STRONG",
//   TABLE = "TABLE",
//   U = "U",
// }

chrome.runtime.onMessage.addListener((message: TMessage, {}, sendResponse) => {
  const textBoxNodes = document.querySelectorAll('[role="textbox"]');
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

  // парсим данные
  function saveOrUpdateDocument(documents: Document[], settings: string[]) {
    let parsedData: Record<string, string> = {};

    textBoxNodes.forEach(textBoxNode => {
      const nodeTree = createNodeTree(textBoxNode);
      // console.dir(nodeTree);//TODO:console.dir(nodeTree)
      parsedData = extractDataFromNodeTree(nodeTree, parsedData, settings);
    })

    const title = textBoxNodes[0].textContent ? textBoxNodes[0].textContent : 'No title';
    const newDocument = createNewDocument(parsedData, title);

    console.dir(parsedData);//TODO:console.dir(parsedData)
    //проверяем наличие документа с таким-же id в хранилище, если есть - обновляем его данные, нет - сохраняем в хранилище
    const foundDocument = findDocumentById(documents, getOpenedDocumentId());

    if (foundDocument)
      documents.splice(documents.indexOf(foundDocument), 1, newDocument);
    else
      documents.push(newDocument);

    return documents;
  }

  // рекурсивно обходим текстовый блок документа и строим узловое дерево
  function createNodeTree(nodeElement: ChildNode, parentNodeNames: string[] = []) {
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
        // Разбиваем текст на слова, фильтром убираем пустые строки и сохраняем их
        const words = node.textContent?.trim().split(/\s+/).filter(w => w) || [];
        // В tags с помощью new Set() оставляем только уникальные теги
        words.forEach(word => nodeTreeElement.words.push({word, tags: [...new Set(nodeNames)]}));

      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (!IGNORED_TAGS.includes(node.nodeName))
          nodeTreeElement.children.push(createNodeTree(node, nodeNames));// Рекурсивно обрабатываем вложенные элементы
      }
    })
    return nodeTreeElement;
  }

  // рекурсивно собираем форматированный текст в объект
  function extractDataFromNodeTree(nodeTree: TextNodeTree, totalTree: Record<string, string> = {}, settings: string[]) {
    let filteredTags = [''];
    nodeTree.words.forEach(({word, tags}) => {
      const isTagsRespondSettings = tags.every(item => settings.includes(item));
      if (isTagsRespondSettings) {
        filteredTags = tags;
      }
      console.log(isTagsRespondSettings, word, '==>', tags, "==>", settings);//TODO: Все tags, word, tags, Содержатся в settings
      const key = filteredTags.join(',') || "UNREAD";

      if (!totalTree[key]) totalTree[key] = '';
      totalTree[key] += word + ' ';
    })

    nodeTree.children.forEach(child => extractDataFromNodeTree(child, totalTree, settings))
    return totalTree;
  }

  // function updateDocumentById(documents: Document[], id: string) {
  //
  //   const foundDocument = findDocumentById(documents, getDocumentId());
  //     documents.splice(documents.indexOf(foundDocument), 1, newDocument);
  // }

  if (message.action === ACT.SAVE_DOCUMENT) {
    console.log("Импортируем:", chrome.runtime.getURL("assets/constants.js"));

    chrome.storage.local.get("documents", (storage: Storage) => {
      if (!storage.documents) return;

      const currentSettings = message.data.newSettings || storage.settings;
      // console.log('settings', currentSettings.text ?? 'no settings');//TODO: console settings

      let settingsDataSet = Object.values(currentSettings)
        .flatMap(array => array
          .filter(item => item.isAllowed)
          .map(item => item.tagName)).flat();

      // Object.keys(currentSettings).forEach(key => {
      //   settingsDataSet = currentSettings[key as keyof typeof currentSettings].reduce((a, b) => {
      //     if (b.isAllowed) a.push(b.tagName);
      //     return a;
      //   }, [] as string[]);
      // })
      // const settingsDataSet = currentSettings.text.reduce((a, b) => {
      //   if (b.isAllowed) a.push(b.tagName);
      //   return a;
      // }, ['DIV']);

      const documents = saveOrUpdateDocument(storage.documents, settingsDataSet);

      chrome.storage.local.set({"documents": documents}, () => {
        sendResponse(storage.documents);
      });
    });
  }

  if (message.action === ACT.GET_DOCUMENT_ID) {
    const documentId = getOpenedDocumentId();
    sendResponse(documentId);
  }

  if (message.action === ACT.REMOVE_DOCUMENT) {
    chrome.storage.local.get("documents", (storage: Storage) => {
      const filteredRecords = storage.documents.filter((document) => document.id !== message.data.id);

      chrome.storage.local.set({"documents": filteredRecords}, () => {
        sendResponse(filteredRecords);
      });
    });
  }

  if (message.action === ACT.GET_RECORDS) {
    chrome.storage.local.get("documents", (storage: Storage) => {
      const records = storage.documents;
      sendResponse(records);
    })
  }

  if (message.action === ACT.GET_SETTINGS) {
    chrome.storage.local.get("settings", (storage: Storage) => {
      const settings = storage.settings;
      sendResponse(settings);
    })
  }

  if (message.action === ACT.CLEAR_RECORDS) {
    chrome.storage.local.set({"documents": []}, () => {
      sendResponse(null)
    })
  }

  if (message.action === ACT.SAVE_SETTINGS) {
    const newSettings = message.data.newSettings;
    chrome.storage.local.set({"settings": newSettings}, () => {
      chrome.storage.local.get(["settings"], (storage: Storage) => {
        // const parsedData = storage.documents[0]?.parsedData;
        // let {words, symbols} = getApplySettingsTotal(parsedData, 'STRONG');
        // sendResponse({savedSettings: storage.settings, words: words, symbols: symbols});
        sendResponse(storage.settings);
      })
    })
  }

  return true;
});


function getWordCount(string: string) {
  const matches = string.match(/[\p{L}\d]+/gu) || [];  //(/\b\w+\b/g)    //(/\b[\w\dА-Яа-яЁё]+\b/g)   //(/\S+/g);
  return matches.length;
}

function getOpenedDocumentId() {
  const mainDocContainer = document.getElementsByClassName("main-document-container");
  return mainDocContainer[0].getAttribute("id") ?? crypto.randomUUID();
}

function getTotalsFromRecordType(data: Record<string, string>) {
  let total = {words: 0, symbols: 0, raw: ''};
  for (const [key, value] of Object.entries(data)) {
    if (key !== 'UNREAD') {
      total.words += getWordCount(value);
      total.symbols += value.length;
      total.raw += value;
    }
  }
  return total;
}

function findDocumentById(documents: Document[], id: string) {
  return documents.find((document) => document.id === id);
}

function getNodeNameFromClass(node: ChildNode) {
  if (node instanceof Element) {
    return node.classList.length > 0
      ? `${node.className}`
      : `${node.nodeName}`
  } else
    return node.nodeName;
}

function createNewDocument(data: Record<string, string>, title: string) {
  const id = getOpenedDocumentId();
  const {words, symbols, raw} = getTotalsFromRecordType(data);
  return {
    id: id,
    parsedData: data,
    raw: raw,
    symbols: symbols,
    time: new Date().toLocaleTimeString(),
    title: title,
    words: words
  }
}

// function getApplySettingsTotal(parsedData: ParsedData[], setting: string) {
//   let {words, symbols} = {words: 0, symbols: 0}
//   // const raw: string = "";
//
//   parsedData.forEach((node) => {
//     node.data.forEach((item) => {
//       if (item.path.includes(setting)) {
//         words += getWordCount(item.text);
//         symbols += item.text.length;
//         console.log({words, symbols, raw: item.text})
//       }
//     })
//   })
//   return {words, symbols}
//


