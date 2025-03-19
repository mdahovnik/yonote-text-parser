import './App.css'
import {useEffect, useState} from 'react'
import {SettingsPage} from "./pages/settings-page/settings-page.tsx";
import {MainPage} from "./pages/main-page/main-page.tsx";
import {TDocument, TSettingList} from "./types/types.ts";
import {Act, appSettings} from "./constants/constants.ts";

async function fetchFromLocalStorage<T>(actionType: keyof typeof Act) {
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
  const [currentDocumentId, setCurrentDocumentId] = useState<string>("");
  const [documents, setDocuments] = useState<TDocument[]>([]);


  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        const host = await getUrl();
        setIsValidPageOpen(host.includes("yonote.ru"));

        const [settings, documents, documentId] = await Promise.all([
          fetchFromLocalStorage<TSettingList>("GET_SETTINGS"),
          fetchFromLocalStorage<TDocument[]>("GET_DOCUMENTS"),
          fetchFromLocalStorage<string>("GET_DOCUMENT_ID"),
        ])

        setSettings(settings);
        setDocuments(documents);
        setCurrentDocumentId(documentId);

      } catch (error) {
        console.error("Ошибка при получении данных", error)
      }
    }

    fetchData().then(() => console.log("Данные загружены"));

    return () => abortController.abort();
  }, [])

  const changeSettingField = (category: keyof TSettingList, label: string) => {
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
      action: Act.SAVE_SETTINGS,
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

  const togglePage = () => {
    const isOpen = !isSettingOpen;
    setIsSettingOpen(isOpen);
  }

  const saveCurrentDocument = () => {
    chrome.runtime.sendMessage({action: Act.SAVE_DOCUMENT, data: {newSettings: settings}}, (documents: TDocument[]) => {
      if (chrome.runtime.lastError) {
        console.error("Error on ACT.SAVE_DOCUMENT:", chrome.runtime.lastError.message);
      } else {
        setDocuments(documents);
        console.log("💾 document is SAVED");
      }
    })
  }

  const deleteAllDocuments = () => {
    chrome.runtime.sendMessage({action: Act.CLEAR_RECORDS}, () => {
      if (chrome.runtime.lastError) {
        console.error('Error on ACT.CLEAR_RECORDS:', chrome.runtime.lastError.message);
      } else {
        setDocuments([]);
        console.log("🗑️ all documents are DELETED");
      }
    })
  }

  const deleteSelectedDocument = (id: string) => {
    chrome.runtime.sendMessage({action: Act.REMOVE_DOCUMENT, data: {id: id}}, (documents: TDocument[]) => {
      if (chrome.runtime.lastError) {
        console.error("Error on ACT.REMOVE_DOCUMENT:", chrome.runtime.lastError.message);
      } else {
        setDocuments(documents);
        console.log("🗑️ document is DELETED BY ID", id);
      }
    })
  }

  const copyRawTextToClipboard = async () => {
    const document = documents.find((document) => document.id === currentDocumentId);
    await navigator.clipboard.writeText(document?.raw || "");
  }


  return (
    isSettingOpen
      ? <SettingsPage settings={settings}
                      onSettingChangeClick={changeSettingField}
                      onBackButtonClick={togglePage}/>
      : <MainPage onPlusClick={saveCurrentDocument}
                  onClearClick={deleteAllDocuments}
                  onDeleteClick={deleteSelectedDocument}
                  onSettingClick={togglePage}
                  documents={documents}
                  currentDocumentId={currentDocumentId}
                  isValidPageOpen={isValidPageOpen}
                  settings={settings}
                  onCopyRawTextClick={copyRawTextToClipboard}/>
  )
}

export default App
