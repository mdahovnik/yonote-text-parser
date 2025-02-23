import {useEffect, useState} from 'react'
import './App.css'
import {SettingsPage} from "./components/settingsPage.tsx";
import {MainPage} from "./components/mainPage.tsx";
import {Document, SettingList} from "./types.ts";
import {ACT, appSettings} from "./constants.ts";
//
// const ACT = {
//   GET_DOCUMENT: 'GET_DOCUMENT',
//   GET_RECORDS: 'GET_RECORDS',
//   GET_SETTINGS: 'GET_SETTINGS',
//   CLEAR_RECORDS: 'CLEAR_RECORDS',
//   SAVE_DOCUMENT: 'SAVE_DOCUMENT',
//   SAVE_SETTINGS: 'SAVE_SETTINGS',
//   REMOVE_DOCUMENT: 'REMOVE_DOCUMENT',
//   APPLY_SETTINGS: 'APPLY_SETTINGS',
// }

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
  const [isValidPageOpen, setIsValidPageOpen] = useState(false);
  const [documentId, setDocumentId] = useState<string>("");
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    getTabId()
      .then((tabId: number) =>
        setTabId(tabId));

    getUrl()
      .then((host: string) =>
        setIsValidPageOpen(host === "yppm.yonote.ru"));

    fetchFromLocalStorage<SettingList>("GET_SETTINGS")
      .then((data) =>
        setSettings(data));

    fetchFromLocalStorage<Document[]>("GET_RECORDS")
      .then((data) =>
        setDocuments(data));

    fetchFromLocalStorage<string>("GET_DOCUMENT_ID")
      .then((data) =>
        setDocumentId(data));
  }, [])

  const handleSettingsChange = (category: keyof SettingList, label: string) => {
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

  const handleSettingsClick = () => {
    const isOpen = !isSettingOpen;
    setIsSettingOpen(isOpen);
  }

  const handlePlusClick = () => {
    chrome.tabs.sendMessage(tabId, {
      action: ACT.SAVE_DOCUMENT,
      data: {newSettings: settings}
    }, (documents: Document[]) => {
      setDocuments(documents);
      // chrome.runtime.sendMessage({action: ACT.SET_BADGE, data: {words: documents[0].words}})//TODO: вывод счетчика на иконку
    })

  }

  const handleClearClick = () => {
    chrome.tabs.sendMessage(tabId, {action: ACT.CLEAR_RECORDS}, (documents: Document[]) => {
      if (!documents)
        setDocuments([]);
    })
  }

  const handleDeleteClick = (id: string) => {
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
                      documentId={documentId}
                      isActive={isValidPageOpen}
                      settings={settings}/>
      }
    </>
  )
}

export default App
