import {ACT, appSettings} from "./constants.ts";
import {TMessage, TStorage, TextNodeTree, TDocument, TSettingList} from "./types.ts";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    "settings": appSettings,
    "documents": []
  });
});

// chrome.tabs.onActivated.addListener((activeInfo) => {
//   chrome.tabs.get(activeInfo.tabId, (tab) => {
//     if (tab.url && tab.url.includes("yonote.ru/doc/")) {
//       console.log("******** chrome.tabs.onActivated.addListener ***********");
//       chrome.scripting.executeScript({
//         target: {tabId: activeInfo.tabId},
//         func: () => {
//           if (typeof window.startWatchingDocument === "function") {
//             window.startWatchingDocument();
//           }else{
//             console.error("startWatchingDocument не найдена в window!");
//           }
//         }
//       });
//     }
//   })
// })

let textNodesCache: TextNodeTree[] = [];// Для хранения текстовых узлов кешируемых в live-режиме из content-script
let currentDocumentId = "";

chrome.runtime.onMessage.addListener((message: TMessage, {}, sendResponse) => {

  if (message.action === ACT.GET_NODE_TREE) {
    // console.log("🟢 ACT.", message.action);
    textNodesCache = message.data.nodeTree ?? [];
    currentDocumentId = message.data.id;
    console.log("ACT.GET_NODE_TREE*********************", textNodesCache)
    chrome.storage.local.get("settings", (storage: TStorage) => {
      const storageSettings = storage.settings;
      const currentDocument = getCurrentDocument(textNodesCache, storageSettings, currentDocumentId);
      setBadge(currentDocument, storageSettings);
      // sendResponse({});
    });
    // return true;
  }


  if (message.action === ACT.SAVE_DOCUMENT) {
    // console.log("🟢 ACT.", message.action);
    // if (!textNodesCache.length) return;

    chrome.storage.local.get(["documents", "settings"], (storage: TStorage) => {
      const storageDocuments = storage.documents;
      const storageSettings = storage.settings;
      const currentDocument = getCurrentDocument(textNodesCache, storageSettings, currentDocumentId);
      const foundDocument = findDocumentById(storageDocuments, currentDocumentId);

      //проверяем наличие документа по id в хранилище, если есть - обновляем его, нет - сохраняем новый
      if (foundDocument)
        storageDocuments.splice(storageDocuments.indexOf(foundDocument), 1, currentDocument);
      else
        storageDocuments.push(currentDocument);

      chrome.storage.local.set({"documents": storageDocuments}, () => {
        chrome.storage.local.get(["documents"], (storage: TStorage) => {
          // console.log("🎯 localStorage is updated on ACT.SAVE_DOCUMENT");
          sendResponse(storage.documents);
        });
      });
    });
    return true;
  }

  if (message.action === ACT.REMOVE_DOCUMENT) {
    // console.log("🟢ACT.", message.action);
    chrome.storage.local.get("documents", (storage: TStorage) => {
      const filteredRecords = storage.documents.filter((document) => document.id !== message.data.id);
      chrome.storage.local.set({"documents": filteredRecords}, () => {
        sendResponse(filteredRecords);
      });
    });
    return true;
  }

  if (message.action === ACT.GET_RECORDS) {
    // console.log("🟢ACT.", message.action);
    chrome.storage.local.get("documents", (storage: TStorage) => {
      sendResponse(storage.documents);
    })
    return true;
  }

  if (message.action === ACT.GET_SETTINGS) {
    // console.log("🟢ACT.", message.action);
    chrome.storage.local.get("settings", (storage: TStorage) => {
      sendResponse(storage.settings);
    })
    return true;
  }

  if (message.action === ACT.CLEAR_RECORDS) {
    // console.log("🟢ACT.", message.action);
    chrome.storage.local.set({"documents": []}, () => {
      sendResponse(null);
    })
    return true;
  }

  // function updateStorageDocuments(
  //   storageDocuments: TDocument[],
  //   currentDocument: TDocument,
  //   foundDocument: TDocument | null
  // ) {
  //   let isSuccess: boolean;
  //   if (foundDocument) {
  //     storageDocuments.splice(storageDocuments.indexOf(foundDocument), 1, currentDocument);
  //     isSuccess = true;
  //     console.log("️🗘 UPDATED document (exists)")
  //   } else {
  //     storageDocuments.push(currentDocument);
  //     isSuccess = true;
  //     console.log("️️💾  SAVED document (new)")
  //   }
  //   return isSuccess;
  // }

  if (message.action === ACT.SAVE_SETTINGS) {
    // console.log("🟢ACT.", message.action);
    const newSettings = message.data.newSettings;

    chrome.storage.local.set({"settings": newSettings}, () => {
      chrome.storage.local.get(["documents", "settings"], (storage: TStorage) => {
        const storageDocuments = storage.documents;
        const storageSettings = storage.settings;

        const currentDocument = getCurrentDocument(textNodesCache, storageSettings, currentDocumentId);
        setBadge(currentDocument, storageSettings);

        //проверяем наличие документа с таким-же id в хранилище, если есть - обновляем его данные и
        // передаем в App.ts для обновления счетчика этого документа в списке
        const foundDocument = findDocumentById(storageDocuments, currentDocumentId);

        if (foundDocument)
          storageDocuments.splice(storageDocuments.indexOf(foundDocument), 1, currentDocument);

        chrome.storage.local.set({"documents": storageDocuments}, () => {
          chrome.storage.local.get(["documents", "settings"], (storage: TStorage) => {
            const data = {
              savedDocuments: storage.documents,
              savedSettings: storage.settings
            };
            sendResponse(data);
          })
        });
      })
    })
    return true;
  }
});

function normalizeSettings(settings: TSettingList) {
  return Object.values(settings)
    .flatMap(array => array.filter(item => item.isAllowed)
      .map(item => item.tagName).flat());
}

function setBadge(
  document: TDocument | null,
  currentSettings: TSettingList
) {
  if (!document) return;

  const count = Object.values(currentSettings.count).find(count => count.isAllowed);

  chrome.action.setBadgeText({
    text: count?.label === "Words"
      ? document.words.toString()
      : document.symbols.toString()
  });

  chrome.action.setBadgeBackgroundColor({color: "lightgreen"});
}

function getCurrentDocument(
  textNodesCache: TextNodeTree[],
  storageSettings: TSettingList,
  documentId: string
) {
  const normalizeSettingsString = normalizeSettings(storageSettings);
  const parsedDocumentData = parseNewDocumentData(textNodesCache, normalizeSettingsString);
  const documentTitle = getDocumentTitle(textNodesCache);
  return createNewDocument(parsedDocumentData, normalizeSettingsString, documentTitle, documentId);
}

function getWordCount(string: string) {
  const matches = string.match(/[\p{L}\d]+/gu) || []; //string.match(/[\p{L}\d\-']+/gu)
  return matches.length;
}

function getTotalsFromRecordType(data: Record<string, string>) {
  let total = {words: 0, symbols: 0, raw: ''};
  for (const [key, value] of Object.entries(data)) {
    if (key !== 'UNREAD') {
      total.words += getWordCount(value);
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

function parseNewDocumentData(
  textNodes: TextNodeTree[],
  settings: string[]
) {
  let parsedData: Record<string, string> = {};
  textNodes.forEach(textNode => {
    parsedData = extractDataFromNodeTree(textNode, parsedData, settings);
  })
  return parsedData;
}

function findDocumentById(
  documents: TDocument[],
  id: string
) {
  return documents.find((document) => document.id === id) || null;
}

function createNewDocument(
  data: Record<string, string>,
  normalizeSettings: string[],
  title: string,
  openedDocumentId: string
): TDocument {
  const {words, symbols, raw} = getTotalsFromRecordType(data);
  return {
    id: openedDocumentId,
    parsedData: data,
    settings: normalizeSettings,
    raw: raw,
    symbols: symbols,
    time: new Date().toLocaleTimeString(),
    title: title,
    words: words
  }
}

// рекурсивно собираем форматированный текст в объект
function extractDataFromNodeTree(
  nodeTree: TextNodeTree,
  totalTree: Record<string, string> = {},
  settings: string[]
) {
  let filteredTags = [''];

  nodeTree.words.forEach(({word, tags}) => {
    const isTagsRespondSettings = tags.every(item => {
      return settings.includes(item)
    });

    if (isTagsRespondSettings) filteredTags = tags;

    const key = filteredTags.join(',') || "UNREAD";

    if (!totalTree[key]) totalTree[key] = '';
    totalTree[key] += word + ' ';
  })

  nodeTree.children.forEach(child => extractDataFromNodeTree(child, totalTree, settings))
  return totalTree;
}

console.log("💡 background.ts is running");