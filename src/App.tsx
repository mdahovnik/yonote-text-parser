import {useEffect, useState} from 'react'
import './App.css'
import {SettingsPage} from "./components/settingsPage.tsx";
import {MainPage} from "./components/mainPage.tsx";
import {TDocument, TSettingList} from "./types.ts";
import {ACT, appSettings} from "./constants.ts";

async function fetchFromLocalStorage<T>(actionType: keyof typeof ACT) {
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

async function getUrl() {
  const tabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  if (tabs.length > 0 && tabs[0]?.url) {
    return new URL(tabs[0].url).hostname;
  } else return "";
}

function App() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [settings, setSettings] = useState<TSettingList>(appSettings);
  const [isValidPageOpen, setIsValidPageOpen] = useState(false);
  const [documentId, setDocumentId] = useState<string>("");
  const [documents, setDocuments] = useState<TDocument[]>([]);

  useEffect(() => {
    getUrl()
      .then((host: string) =>
        setIsValidPageOpen(host === "yppm.yonote.ru"));

    fetchFromLocalStorage<TSettingList>("GET_SETTINGS")
      .then((data) => setSettings(data));

    fetchFromLocalStorage<TDocument[]>("GET_DOCUMENTS")
      .then((data) => setDocuments(data));

    fetchFromLocalStorage<string>("GET_DOCUMENT_ID")
      .then((data) => setDocumentId(data));
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
    }, (data: { savedDocuments: TDocument[], savedSettings: TSettingList }) => {
      if (chrome.runtime.lastError) {
        console.error("Error on ACT.SAVE_SETTINGS:", chrome.runtime.lastError.message);
      } else {
        setSettings(data.savedSettings);
        setDocuments(data.savedDocuments);
        console.log("💾 settings are SAVED", data.savedSettings);
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
        console.error("Error on ACT.SAVE_DOCUMENT:", chrome.runtime.lastError.message);
      } else {
        setDocuments(documents);
        console.log("💾 document is SAVED");
      }
    })
  }

  const handleClearClick = () => {
    chrome.runtime.sendMessage({action: ACT.CLEAR_RECORDS}, () => {
      if (chrome.runtime.lastError) {
        console.error('Error on ACT.CLEAR_RECORDS:', chrome.runtime.lastError.message);
      } else {
        setDocuments([]);
        console.log("🗑️ all documents are DELETED");
      }
    })
  }

  const handleDeleteClick = (id: string) => {
    chrome.runtime.sendMessage({action: ACT.REMOVE_DOCUMENT, data: {id: id}}, (documents: TDocument[]) => {
      if (chrome.runtime.lastError) {
        console.error("Error on ACT.REMOVE_DOCUMENT:", chrome.runtime.lastError.message);
      } else {
        setDocuments(documents);
        console.log("🗑️ document is DELETED BY ID", id);
      }
    })
  }

  const handleCopyRawText = async () => {
    const document = documents.find((document) => document.id === documentId);
    await navigator.clipboard.writeText(document?.raw || "");
  }

  return (
    isSettingOpen
      ? <SettingsPage settings={settings}
                      onSettingsChange={handleSettingsChange}
                      onBackButtonClick={handleSettingsClick}
                      onCopyRawText={handleCopyRawText}/>
      : <MainPage onPlusClick={handlePlusClick}
                  onClearClick={handleClearClick}
                  onDeleteClick={handleDeleteClick}
                  onSettingClick={handleSettingsClick}
                  documents={documents}
                  documentId={documentId}
                  isActive={isValidPageOpen}
                  settings={settings}/>
  )
}

export default App
