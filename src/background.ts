import {ACT, appSettings} from "./constants.ts";
import {TMessage, TStorage, TextNodeTree, TDocument, TSettingList} from "./types.ts";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    "settings": appSettings,
    "documents": []
  });
});

let textNodesCache: TextNodeTree[] = [];
let openedDocumentId = "";
let currentDocument: TDocument | null = null;

chrome.runtime.onMessage.addListener((message: TMessage, {}, sendResponse) => {

  if (message.action === ACT.GET_NODE_TREE) {
    console.log("🟢 ACT.", message.action);

    textNodesCache = [];
    currentDocument = null;
    textNodesCache = message.data.nodeTree ?? [];
    openedDocumentId = message.data.id;
    console.log(`=> textNodesCache received ${new Date().toLocaleTimeString()}on ACT.GET_NODE_TREE: `, message.data.nodeTree);

    chrome.storage.local.get(["settings"], (storage: TStorage) => {
      if (!storage.settings) {
        console.error("Ошибка получения настроек из storageLocal");
        return;
      }

      const currentSettings = message.data.newSettings || storage.settings;

      let settingsDataSet: string[] = Object.values(currentSettings)
        .flatMap(array => array.filter(item => item.isAllowed && item.tagName)
          .map(item => item.tagName).join());

      console.log("=> settingsDataSet: ", settingsDataSet);

      const parsedData = getNewDocumentData(textNodesCache, settingsDataSet);
      const title = getDocumentTitle(textNodesCache);
      currentDocument = createNewDocument(parsedData, title, openedDocumentId);

      // вывод счетчика на иконку
      setBadge(currentDocument, currentSettings,);

      sendResponse({});
      console.log("🟥 ACT.", message.action);
    });
  }


  if (message.action === ACT.SAVE_DOCUMENT) {
    console.log("🟢 ACT.", message.action);
    if (!textNodesCache.length) return;

    chrome.storage.local.get(["documents", "settings"], (storage: TStorage) => {
      // if (!storage.documents) return;
      // console.log("=> textBoxNodes in SAVE_DOCUMENT: ", textNodesCache);

      const currentSettings = message.data.newSettings || storage.settings;

      let settingsDataSet: string[] = Object.values(currentSettings)
        .flatMap(array => array.filter(item => item.isAllowed && item.tagName)
          .map(item => item.tagName).join());

      console.log("=> settingsDataSet: ", settingsDataSet);
      const documents = saveOrUpdateDocument(textNodesCache, storage.documents, settingsDataSet, openedDocumentId);

      chrome.storage.local.set({"documents": documents}, () => {
        console.log("=> 🎯 storageLocal is updated on ACT.SAVE_DOCUMENT: ", documents);
        sendResponse(storage.documents);
      });
      console.log("🟥 ACT.", message.action);
    });
  }


  if (message.action === ACT.REMOVE_DOCUMENT) {
    console.log("🟢ACT.", message.action);

    chrome.storage.local.get("documents", (storage: TStorage) => {
      const filteredRecords = storage.documents.filter((document) => document.id !== message.data.id);
      chrome.storage.local.set({"documents": filteredRecords}, () => {
        sendResponse(filteredRecords);
      });
      console.log("🟥 ACT.", message.action);
    });
  }


  if (message.action === ACT.GET_RECORDS) {
    console.log("🟢ACT.", message.action);

    chrome.storage.local.get("documents", (storage: TStorage) => {
      const records = storage.documents;
      sendResponse(records);
      console.log("🟥 ACT.", message.action);
    })
  }


  if (message.action === ACT.GET_SETTINGS) {
    console.log("🟢ACT.", message.action);

    chrome.storage.local.get("settings", (storage: TStorage) => {
      const settings = storage.settings;
      sendResponse(settings);
      console.log("🟥 ACT.", message.action);
    })
  }


  if (message.action === ACT.CLEAR_RECORDS) {
    console.log("🟢ACT.", message.action);

    chrome.storage.local.set({"documents": []}, () => {
      sendResponse(null);
      console.log("🟥 ACT.", message.action);
    })
  }


  if (message.action === ACT.SAVE_SETTINGS) {
    console.log("🟢ACT.", message.action);

    const newSettings = message.data.newSettings;
    chrome.storage.local.set({"settings": newSettings}, () => {
      chrome.storage.local.get(["settings"], (storage: TStorage) => {
        // const parsedData = storage.documents[0]?.parsedData;
        // let {words, symbols} = getApplySettingsTotal(parsedData, 'STRONG');
        // sendResponse({savedSettings: storage.settings, words: words, symbols: symbols});
        sendResponse(storage.settings);
        console.log("🟥 ACT.", message.action);
      })
    })
  }

  return true;
});


function setBadge(document: TDocument, currentSettings: TSettingList) {
  const count = Object.values(currentSettings.count).find(count => count.isAllowed);

  chrome.action.setBadgeText({
    text: count?.label === "Words"
      ? document.words.toString()
      : document.symbols.toString()
  });

  chrome.action.setBadgeBackgroundColor({color: "lightgreen"});
}


function getWordCount(string: string) {
  const matches = string.match(/[\p{L}\d]+/gu) || [];  //(/\b\w+\b/g)    //(/\b[\w\dА-Яа-яЁё]+\b/g)   //(/\S+/g);
  return matches.length;
}


function getTotalsFromRecordType(data: Record<string, string>) {
  let total = {words: 0, symbols: 0, raw: ''};
  for (const [key, value] of Object.entries(data)) {
    if (key !== 'UNREAD') {
      total.words += getWordCount(value);
      // total.symbols += value.length;
      total.raw += value;
    }
  }
  total.raw = total.raw.trim();
  total.symbols = total.raw.length
  return total;
}


function getDocumentTitle(textNodesCache: TextNodeTree[]) {
  return textNodesCache[0].words.map(w => w.word).join(' ') ?? 'No title';
}

function getNewDocumentData(textNodes: TextNodeTree[], settings: string[]) {
  let parsedData: Record<string, string> = {};
  textNodes.forEach(textNode => {
    parsedData = extractDataFromNodeTree(textNode, parsedData, settings);
    // console.log("💡💡💡extractDataFromNodeTree => nodeTree", nodeTree);
    // console.log("💡💡💡extractDataFromNodeTree => parsedData", parsedData);
  })

  return parsedData;
}

function saveOrUpdateDocument(textNodes: TextNodeTree[], documents: TDocument[], settings: string[], id: string) {
  let parsedData: Record<string, string> = {};
  textNodes.forEach(textNode => {
    parsedData = extractDataFromNodeTree(textNode, parsedData, settings);
    // console.log("💡💡💡extractDataFromNodeTree => nodeTree", nodeTree);
    // console.log("💡💡💡extractDataFromNodeTree => parsedData", parsedData);
  })

  const title = getDocumentTitle(textNodes);//nodeTreeArray[0].words.map(w => w.word).join(' ') ?? 'No title';
  console.log("=> document title: ", title)
  const newDocument = createNewDocument(parsedData, title, id);


  //проверяем наличие документа с таким-же id в хранилище, если есть - обновляем его данные, нет - сохраняем в хранилище
  const foundDocument = findDocumentById(documents, id);

  if (foundDocument) {
    documents.splice(documents.indexOf(foundDocument), 1, newDocument);
    console.log("=>️ document exists (UPDATED): ", title)
  } else {
    documents.push(newDocument);
    console.log("️=>️  document is new (SAVED): ", title)
  }

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
    // const nodeTreeWordsLength = nodeTree.words.length;

    const isTagsRespondSettings = tags.every(item => settings.includes(item));
    if (isTagsRespondSettings) {
      filteredTags = tags;
    }
    // console.log(isTagsRespondSettings ? "included =>" : "skipped =>", word, ':', tags, ":", settings);//TODO: Все tags, word, tags, Содержатся в settings
    console.log("=> word: ", word, word.length, '=> tags: ', tags);//TODO: Все tags, word, tags, Содержатся в settings
    const key = filteredTags.join(',') || "UNREAD";

    if (!totalTree[key]) totalTree[key] = '';
    totalTree[key] += word + ' ';

    // if (index < nodeTreeWordsLength - 1)
    //   totalTree[key] = totalTree[key].trim();
  })

  nodeTree.children.forEach(child => extractDataFromNodeTree(child, totalTree, settings))
  return totalTree;
}


console.log("💡 background.ts is running");
