import {ACT, appSettings} from "./constants/constants.ts";
import {TMessage, TStorage, TextNodeTree, TDocument, TSettingList} from "./types.ts";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    "settings": appSettings,
    "documents": [],
    "cache": {
      "currentDocumentId": '',
      "nodesTreeCache": []
    }
  });
});

chrome.runtime.onRestartRequired.addListener((reason) => {
  console.log("Требуется перезапуск. Причина:", reason);

  // Показать уведомление пользователю
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon.png",
    title: "Требуется перезапуск",
    message: "Расширение необходимо перезапустить для применения изменений.",
  });

  // Перезапустить расширение
  chrome.runtime.restart();
});

// для предотвращения автоматической выгрузки Service Worker при отсутствии активных событий после 30сек простоя
chrome.alarms.create("keepServiceWorkerAlive", {
  periodInMinutes: 0.5
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "keepServiceWorkerAlive") {
    console.log("Будим Service Worker");
  }
});

// Поскольку текстовые ноды мутируют постоянно и передаются из content.ts сюда в реальном времени для сохранения в nodesTreeCache,
// используем chrome.runtime.connect(). Это постоянное соединение, в данном случае более оптимизированный и быстрый способ,
// чем sendMessage(), меньше накладных расходов.
chrome.runtime.onConnect.addListener((port) => {
  console.log("Content.ts подключился:", port.name);

  port.onMessage.addListener((message: TMessage) => {
    if (message.action === ACT.GET_NODE_TREE) {
      chrome.storage.local.set({
        cache: {
          currentDocumentId: message.data.id,
          nodesTreeCache: message.data.nodeTree ?? []
        }
      }, () => {
        //TODO: убрать логирование
        console.log(
          "ACT.GET_NODE_TREE***********",
          message.data.nodeTree?.length,
          JSON.stringify(message.data.nodeTree, null, 2)
        )

        chrome.storage.local.get(["documents", "settings", "cache"], (storage: TStorage) => {

          const {storageSettings, storageDocuments, currentDocumentId, nodesTreeCache} = getDataFromStorage(storage);
          const currentDocument = getCurrentDocument(nodesTreeCache, storageSettings, currentDocumentId);

          //проверяем наличие документа по id в хранилище, если есть - обновляем его
          const foundDocument = findDocumentById(storageDocuments, currentDocumentId);
          if (foundDocument) {
            storageDocuments.splice(storageDocuments.indexOf(foundDocument), 1, currentDocument);
            chrome.storage.local.set({"documents": storageDocuments});
          }

          setBadge(currentDocument, storageSettings);
        });
      })
    }
  });
})

// для передачи сообщений из App.tsx постоянное соединение не важно, поэтому используем chrome.runtime.onMessage().
chrome.runtime.onMessage.addListener((message: TMessage, {}, sendResponse) => {
  if (message.action === ACT.GET_DOCUMENT_ID) {
    chrome.storage.local.get("cache", (storage: TStorage) => {
      sendResponse(storage.cache.currentDocumentId)
    })
    return true;
  }

  if (message.action === ACT.SAVE_DOCUMENT) {
    chrome.storage.local.get(["documents", "settings", "cache"], (storage: TStorage) => {

      const {storageSettings, storageDocuments, currentDocumentId, nodesTreeCache} = getDataFromStorage(storage);
      const currentDocument = getCurrentDocument(nodesTreeCache, storageSettings, currentDocumentId);
      const foundDocument = findDocumentById(storageDocuments, currentDocumentId);

      //проверяем наличие документа по id в хранилище, если есть - обновляем его, нет - сохраняем новый
      if (foundDocument)
        storageDocuments.splice(storageDocuments.indexOf(foundDocument), 1, currentDocument);
      else
        storageDocuments.push(currentDocument);

      chrome.storage.local.set({"documents": storageDocuments}, () => {
        chrome.storage.local.get(["documents"], (storage: TStorage) => {
          sendResponse(storage.documents);
        });
      });
    });
    return true;
  }

  if (message.action === ACT.REMOVE_DOCUMENT) {
    chrome.storage.local.get("documents", (storage: TStorage) => {
      const filteredRecords = storage.documents.filter((document) => document.id !== message.data.id);
      chrome.storage.local.set({"documents": filteredRecords}, () => {
        sendResponse(filteredRecords);
      });
    });
    return true;
  }

  if (message.action === ACT.GET_DOCUMENTS) {
    chrome.storage.local.get("documents", (storage: TStorage) => {
      sendResponse(storage.documents);
    })
    return true;
  }

  if (message.action === ACT.GET_SETTINGS) {
    chrome.storage.local.get("settings", (storage: TStorage) => {
      sendResponse(storage.settings);
    })
    return true;
  }

  if (message.action === ACT.CLEAR_RECORDS) {
    chrome.storage.local.set({"documents": []}, () => {
      sendResponse(null);
    })
    return true;
  }

  if (message.action === ACT.SAVE_SETTINGS) {
    // console.log("🟢ACT.", message.action);
    const newSettings = message.data.newSettings;

    chrome.storage.local.set({"settings": newSettings}, () => {
      chrome.storage.local.get(["documents", "settings", "cache"], (storage: TStorage) => {

        const {storageSettings, storageDocuments, currentDocumentId, nodesTreeCache} = getDataFromStorage(storage);
        const currentDocument = getCurrentDocument(nodesTreeCache, storageSettings, currentDocumentId);
        setBadge(currentDocument, storageSettings);

        //проверяем наличие документа с таким-же id в хранилище, если есть - обновляем его данные и
        // передаем в App.ts для обновления счетчика этого документа в списке
        const foundDocument = findDocumentById(storageDocuments, currentDocumentId);
        if (foundDocument)
          storageDocuments.splice(storageDocuments.indexOf(foundDocument), 1, currentDocument);

        chrome.storage.local.set({"documents": storageDocuments}, () => {
          chrome.storage.local.get(["documents", "settings"], (storage: TStorage) => {
            const data = {savedDocuments: storage.documents, savedSettings: storage.settings};
            sendResponse(data);
          })
        });
      })
    })
    return true;
  }
})

function getDataFromStorage(storage: TStorage) {
  const storageSettings = storage.settings;
  const storageDocuments = storage.documents;
  const currentDocumentId = storage.cache.currentDocumentId;
  const nodesTreeCache = storage.cache.nodesTreeCache;
  return {storageSettings, storageDocuments, currentDocumentId, nodesTreeCache}
}

function normalizeSettings(settings: TSettingList) {
  return Object.values(settings)
    .flatMap(settingsList =>
      settingsList.filter(item => item.isAllowed)
        .map(item => item.tagName).flat());
}

function setBadge(document: TDocument | null, currentSettings: TSettingList) {
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

function parseNewDocumentData(textNodes: TextNodeTree[], settings: string[]) {
  let parsedData: Record<string, string> = {};
  textNodes.forEach(textNode => {
    parsedData = extractDataFromNodeTree(textNode, parsedData, settings);
  })
  return parsedData;
}

function findDocumentById(documents: TDocument[], id: string) {
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