import {useEffect, useState} from 'react'
import './App.css'
import {SettingsPage} from "./components/settingsPage.tsx";
import {MainPage} from "./components/mainPage.tsx";
import {TDocument, TSettingList} from "./types.ts";
import {appSettings} from "./constants.ts";

const ACT = {
  GET_DOCUMENT: 'GET_DOCUMENT',
  GET_RECORDS: 'GET_RECORDS',
  GET_SETTINGS: 'GET_SETTINGS',
  CLEAR_RECORDS: 'CLEAR_RECORDS',
  SAVE_DOCUMENT: 'SAVE_DOCUMENT',
  SAVE_SETTINGS: 'SAVE_SETTINGS',
  REMOVE_DOCUMENT: 'REMOVE_DOCUMENT',
  APPLY_SETTINGS: 'APPLY_SETTINGS',
}

async function getTabId() {
  const tab = (await chrome.tabs.query({active: true, currentWindow: true}))[0];
  return tab?.id as number;
}

async function fetchFromLocalStorage<T>(actionType: keyof typeof ACT) {
  const tabId = await getTabId()
  return new Promise<T>((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, {action: actionType}, (data: T) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(data)
      }
    })
  });
}

async function getUrl() {
  const tabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  if (tabs.length > 0 && tabs[0]?.url) {
    return new URL(tabs[0].url).hostname;
  } else return "";
}

function App() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [settings, setSettings] = useState<TSettingList>(appSettings);
  const [isActive, setIsActive] = useState(false);
  const [documents, setDocuments] = useState<TDocument[]>([]);

  useEffect(() => {
    getUrl()
      .then((host: string) => setIsActive(host === "yppm.yonote.ru"));

    fetchFromLocalStorage<TSettingList>("GET_SETTINGS")
      .then((data) => setSettings(data));

    fetchFromLocalStorage<TDocument[]>("GET_RECORDS")
      .then((data) => setDocuments(data))
  }, [])

  const handleSettingsChange = async (category: keyof TSettingList, title: string) => {
    const updatedSettings = {
      ...settings,
      [category]: settings[category].map((item) => {
        if (category === "count")
          return {...item, checked: item.title === title};
        else
          return {...item, checked: item.title === title ? !item.checked : item.checked};
      })
    };

    const tabId = await getTabId();
    chrome.tabs.sendMessage(tabId, {
      action: ACT.SAVE_SETTINGS,
      data: {newSettings: {...updatedSettings}}
    }, (savedSettings: TSettingList) => {
      setSettings(savedSettings);
    })
  }

  const handleSettingsClick = async () => {
    const isOpen = !isSettingOpen;
    setIsSettingOpen(isOpen);
  }

  const handlePlusClick = async () => {
    const tabId = await getTabId()
    chrome.tabs.sendMessage(tabId, {action: ACT.SAVE_DOCUMENT}, (documents: TDocument[]) => {
      setDocuments(documents);
    })
  }

  const handleClearClick = async () => {
    const tabId = await getTabId();
    chrome.tabs.sendMessage(tabId, {action: ACT.CLEAR_RECORDS}, (documents: TDocument[]) => {
      if (!documents)
        setDocuments([]);
    })
  }

  const handleDeleteClick = async (id: string) => {
    // console.log(id)
    const tabId = await getTabId();
    chrome.tabs.sendMessage(tabId, {action: ACT.REMOVE_DOCUMENT, data: {id: id}}, (documents: TDocument[]) => {
      setDocuments(documents);
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
                      isActive={isActive}
                      countTypeSettings={settings.count}
                      settings={settings}/>
      }
    </>
  )
}

export default App
