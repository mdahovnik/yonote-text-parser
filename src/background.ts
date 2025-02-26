import {ACT, appSettings} from "./constants.ts";
import {TMessage, TStorage, TextNodeTree, TDocument} from "./types.ts";
// import {SettingList} from "./types.ts";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    "settings": appSettings,
    "documents": []
  });
});

let textBoxNodes: TextNodeTree[] = [];
let openedDocumentId = "";

chrome.runtime.onMessage.addListener((message: TMessage, {}, sendResponse) => {

  if (message.action === ACT.GET_NODE_TREE) {
    textBoxNodes = message.data.nodeTree ?? [];
    openedDocumentId = message.data.id;

    // if (!textBoxNodes.length) return;

    console.log("✏️ textBoxNodes received on GET_NODE_TREE action =>", textBoxNodes);

    // chrome.storage.local.get(["documents", "settings"], (storage: TStorage) => {
    //   if (!storage.documents) return;
    //   const currentSettings = message.data.newSettings || storage.settings;
    //
    //   let settingsDataSet = Object.values(currentSettings)
    //     .flatMap(array => array
    //       .filter(item => item.isAllowed)
    //       .map(item => item.tagName)).flat();
    //
    //   const documents = saveOrUpdateDocument(textBoxNodes, storage.documents, settingsDataSet, openedDocumentId);
    //   console.log("✏️ raw string =>", documents[0].raw);
    //
    //   chrome.storage.local.set({"documents": documents}, () => {
    //     sendResponse(storage.documents);
    //   });
    // });
    sendResponse({})
  }

  if (message.action === ACT.SAVE_DOCUMENT) {
    console.log("action", message.action);
    chrome.storage.local.get(["documents", "settings"], (storage: TStorage) => {
      // if (!storage.documents) return;
      console.log("textBoxNodes in SAVE_DOCUMENT =>", textBoxNodes.length);

      if (!textBoxNodes.length) return;

      const currentSettings = message.data.newSettings || storage.settings;

      let settingsDataSet: string[] = Object.values(currentSettings)
        .flatMap(array => array.filter(item => item.isAllowed && item.tagName)
          .map(item => item.tagName).join());

      console.log("✏️ settingsDataSet =>", settingsDataSet);
      const documents = saveOrUpdateDocument(textBoxNodes, storage.documents, settingsDataSet, openedDocumentId);
      console.log("✏️ raw =>", documents[0].raw);

      chrome.storage.local.set({"documents": documents}, () => {
        sendResponse(storage.documents);
      });
    });
  }
  if (message.action === ACT.REMOVE_DOCUMENT) {
    console.log("action", message.action);
    chrome.storage.local.get("documents", (storage: TStorage) => {
      const filteredRecords = storage.documents.filter((document) => document.id !== message.data.id);

      chrome.storage.local.set({"documents": filteredRecords}, () => {
        sendResponse(filteredRecords);
      });
    });
  }

  if (message.action === ACT.GET_RECORDS) {
    console.log("action", message.action);
    chrome.storage.local.get("documents", (storage: TStorage) => {
      const records = storage.documents;
      sendResponse(records);
    })
  }

  if (message.action === ACT.GET_SETTINGS) {
    console.log("action", message.action);
    chrome.storage.local.get("settings", (storage: TStorage) => {
      const settings = storage.settings;
      sendResponse(settings);
    })
  }

  if (message.action === ACT.CLEAR_RECORDS) {
    console.log("action", message.action);
    chrome.storage.local.set({"documents": []}, () => {
      sendResponse(null)
    })
  }

  if (message.action === ACT.SAVE_SETTINGS) {
    console.log("action", message.action);
    const newSettings = message.data.newSettings;
    chrome.storage.local.set({"settings": newSettings}, () => {
      chrome.storage.local.get(["settings"], (storage: TStorage) => {
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

function saveOrUpdateDocument(nodeTreeArray: TextNodeTree[], documents: TDocument[], settings: string[], id: string) {
  let parsedData: Record<string, string> = {};
  nodeTreeArray.forEach(nodeTree => {
    parsedData = extractDataFromNodeTree(nodeTree, parsedData, settings);
  })

  const title = nodeTreeArray[0].words.map(w => w.word).join(' ') ?? 'No title';
  console.log("✏️ document title =>", title)
  const newDocument = createNewDocument(parsedData, title, id);

  //TODO: вывод счетчика на иконку
  chrome.action.setBadgeText({text: newDocument.words.toString()});
  // chrome.action.setBadgeBackgroundColor({color: 'white'});

  //проверяем наличие документа с таким-же id в хранилище, если есть - обновляем его данные, нет - сохраняем в хранилище
  const foundDocument = findDocumentById(documents, id);

  if (foundDocument) documents.splice(documents.indexOf(foundDocument), 1, newDocument);
  else documents.push(newDocument);

  return documents;
}

function findDocumentById(documents: TDocument[], id: string) {
  // const foundDocument = documents.find((document) => document.id === id);
  // if (!foundDocument) {
  //   console.error(`Не найден документ с id: ${id}`);
  // }
  return documents.find((document) => document.id === id) || null;
}

function createNewDocument(data: Record<string, string>, title: string, openedDocumentId: string): TDocument {
  // const id = getOpenedDocumentId();
  const {words, symbols, raw} = getTotalsFromRecordType(data);
  return {
    id: openedDocumentId,
    parsedData: data,
    raw: raw,
    symbols: symbols,
    time: new Date().toLocaleTimeString(),
    title: title,
    words: words
  }
}

// рекурсивно собираем форматированный текст в объект
function extractDataFromNodeTree(nodeTree: TextNodeTree, totalTree: Record<string, string> = {}, settings: string[]) {
  let filteredTags = [''];
  nodeTree.words.forEach(({word, tags}) => {
    const isTagsRespondSettings = tags.every(item => settings.includes(item));
    if (isTagsRespondSettings) {
      filteredTags = tags;
    }
    console.log(isTagsRespondSettings, word, '/', tags, "==>", settings);//TODO: Все tags, word, tags, Содержатся в settings
    const key = filteredTags.join(',') || "UNREAD";

    if (!totalTree[key]) totalTree[key] = '';
    totalTree[key] += word + ' ';
  })

  nodeTree.children.forEach(child => extractDataFromNodeTree(child, totalTree, settings))
  return totalTree;
}

console.log("💡 background.ts is running");
