import {useEffect, useState} from 'react'
import './App.css'
import {SettingsPage} from "./components/settingsPage.tsx";
import {MainPage} from "./components/mainPage.tsx";
import {Document, SettingList} from "./types.ts";
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
  const [tabId, setTabId] = useState<number>(0);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [settings, setSettings] = useState<SettingList>(appSettings);
  const [isActive, setIsActive] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  // const [totals, setTotals] = useState<{ words: number, symbols: number }>({words: 0, symbols: 0});

  useEffect(() => {
    getTabId()
      .then((tabId: number) => setTabId(tabId));

    getUrl()
      .then((host: string) => setIsActive(host === "yppm.yonote.ru"));

    fetchFromLocalStorage<SettingList>("GET_SETTINGS")
      .then((data) => setSettings(data));

    fetchFromLocalStorage<Document[]>("GET_RECORDS")
      .then((data) => setDocuments(data))
  }, [])

  const handleSettingsChange = async (category: keyof SettingList, label: string) => {
    const updatedSettings = {
      ...settings,
      [category]: settings[category].map((item) => {
        if (category === "count")
          return {...item, isAllowed: item.label === label};
        else
          return {...item, isAllowed: item.label === label ? !item.isAllowed : item.isAllowed};
      })
    };

    chrome.tabs.sendMessage(tabId, {
      action: ACT.SAVE_SETTINGS,
      data: {newSettings: {...updatedSettings}}
    }, (savedSettings: SettingList) => {
      setSettings(savedSettings);
    })
  }

  const handleSettingsClick = async () => {
    const isOpen = !isSettingOpen;
    setIsSettingOpen(isOpen);
  }

  const handlePlusClick = async () => {
    chrome.tabs.sendMessage(tabId, {
      action: ACT.SAVE_DOCUMENT,
      data: {newSettings: settings}
    }, (documents: Document[]) => {
      setDocuments(documents);
    })
  }

  const handleClearClick = async () => {
    chrome.tabs.sendMessage(tabId, {action: ACT.CLEAR_RECORDS}, (documents: Document[]) => {
      if (!documents)
        setDocuments([]);
    })
  }

  const handleDeleteClick = async (id: string) => {
    chrome.tabs.sendMessage(tabId, {action: ACT.REMOVE_DOCUMENT, data: {id: id}}, (documents: Document[]) => {
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
