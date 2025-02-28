import {useEffect, useState} from 'react'
import './App.css'
import {SettingsPage} from "./components/settingsPage.tsx";
import {MainPage} from "./components/mainPage.tsx";
import {TDocument, TSettingList} from "./types.ts";
import {ACT, appSettings} from "./constants.ts";


async function getTabId() {
  const tab = (await chrome.tabs.query({active: true, currentWindow: true}))[0];
  return tab?.id as number;
}

async function fetchFromLocalStorage<T>(actionType: keyof typeof ACT) {
  // const tabId = await getTabId()
  return new Promise<T>((resolve, reject) => {
    chrome.runtime.sendMessage({action: actionType}, (data: T) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(data)
      }
    })
  });
}

async function fetchDocumentId() {
  const tabId = await getTabId()
  return new Promise<string>((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, {action: ACT.GET_DOCUMENT_ID}, (openedDocumentId: string) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(openedDocumentId)
      }
    })
  })
}


async function getUrl() {
  const tabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  if (tabs.length > 0 && tabs[0]?.url) {
    return new URL(tabs[0].url).hostname;
  } else return "";
}

function App() {
  // const [tabId, setTabId] = useState<number>(0);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [settings, setSettings] = useState<TSettingList>(appSettings);
  const [isValidPageOpen, setIsValidPageOpen] = useState(false);
  const [documentId, setDocumentId] = useState<string>("");
  const [documents, setDocuments] = useState<TDocument[]>([]);

  useEffect(() => {
    // getTabId()
    //   .then((tabId: number) =>
    //     setTabId(tabId));

    getUrl()
      .then((host: string) =>
        setIsValidPageOpen(host === "yppm.yonote.ru"));

    fetchFromLocalStorage<TSettingList>("GET_SETTINGS")
      .then((data) =>
        setSettings(data));

    fetchFromLocalStorage<TDocument[]>("GET_RECORDS")
      .then((data) => setDocuments(data));

    fetchDocumentId()
      .then((id) =>
        setDocumentId(id));
  }, [])

  const handleSettingsChange = (category: keyof TSettingList, label: string) => {
    const updatedSettings = {
      ...settings,
      [category]: settings[category].map((item) => {
        if (category === "count")
          return {...item, isAllowed: item.label === label};
        else
          return {...item, isAllowed: item.label === label ? !item.isAllowed : item.isAllowed};
      })
    };

    chrome.runtime.sendMessage({
      action: ACT.SAVE_SETTINGS,
      data: {newSettings: {...updatedSettings}}
    }, (savedSettings: TSettingList) => {
      if (chrome.runtime.lastError) {
        console.error("Ошибка при отправке сообщения:", chrome.runtime.lastError);
      } else {
        setSettings(savedSettings);
        console.log("💾 settings are SAVED", savedSettings);
      }
    })
  }

  const handleSettingsClick = () => {
    const isOpen = !isSettingOpen;
    setIsSettingOpen(isOpen);
  }

  const handlePlusClick = () => {
    chrome.runtime.sendMessage({action: ACT.SAVE_DOCUMENT, data: {newSettings: settings}}, (documents: TDocument[]) => {
      if (chrome.runtime.lastError) {
        console.error("Ошибка при сохранении документа:", chrome.runtime.lastError);
      } else {
        setDocuments(documents);
        console.log("💾 document is SAVED");
      }
      // chrome.runtime.sendMessage({action: ACT.SET_BADGE, data: {words: documents[0].words}})//TODO: вывод счетчика на иконку
    })
  }

  const handleClearClick = () => {
    chrome.runtime.sendMessage({action: ACT.CLEAR_RECORDS}, () => {
      if (chrome.runtime.lastError) {
        console.error("Ошибка при удалении всех документов:", chrome.runtime.lastError);
      } else {
        setDocuments([]);
        console.log("🗑️ all documents are DELETED")
      }
    })
  }

  const handleDeleteClick = (id: string) => {
    chrome.runtime.sendMessage({action: ACT.REMOVE_DOCUMENT, data: {id: id}}, (documents: TDocument[]) => {
      if (chrome.runtime.lastError) {
        console.error("Ошибка при удалении документа по id:", chrome.runtime.lastError);
      } else {
        setDocuments(documents);
        console.log("🗑️ document is DELETED BY ID", id);
      }
    })
  }

  return (
    <>
      {
        isSettingOpen
          ? <SettingsPage settings={settings}
                          onSettingsChange={handleSettingsChange}
                          onBackButtonClick={handleSettingsClick}/>
          : <MainPage onPlusClick={handlePlusClick}
                      onClearClick={handleClearClick}
                      onDeleteClick={handleDeleteClick}
                      onSettingClick={handleSettingsClick}
                      data={documents}
                      documentId={documentId}
                      isActive={isValidPageOpen}
                      settings={settings}/>
      }
    </>
  )
}

export default App
