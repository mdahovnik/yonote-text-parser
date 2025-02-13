import {Dispatch, SetStateAction, useEffect, useState} from 'react'
import './App.css'
import {SettingsPage} from "./components/settingsPage.tsx";
import {MainPage} from "./components/mainPage.tsx";
import {TDocument} from "./types.ts";
import {blockTypeSettings, countTypeSettings, textTypeSettings} from "./constants.ts";

const ACT = {
  GET_DOCUMENT: 'GET_DOCUMENT',
  GET_RECORDS: 'GET_RECORDS',
  CLEAR_RECORDS: 'CLEAR_RECORDS',
  SAVE_DOCUMENT: 'SAVE_DOCUMENT',
  SAVE_COUNT_SETTINGS: 'SAVE_COUNT_SETTINGS',
  REMOVE_DOCUMENT: 'REMOVE_DOCUMENT',
  APPLY_SETTINGS: 'APPLY_SETTINGS',
}

async function getTabId() {
  const tab = (await chrome.tabs.query({active: true, currentWindow: true}))[0];
  return tab?.id as number;
}

async function getRecords<T>(setData: Dispatch<SetStateAction<T[]>>) {
  const tabId = await getTabId()
  chrome.tabs.sendMessage(tabId, {action: ACT.GET_RECORDS}, (records: T[]) => {
    if (records) setData(records);
  })
}


//TODO: реализовать сохранение настроек через отправку экшена в content.ts
// async function saveSettings(setSettings: Dispatch<SetStateAction<TSetting[]>>) {
//   const tab = (await chrome.tabs.query({active: true, currentWindow: true}))[0];
//   const tabId = tab?.id as number;
//
//   chrome.tabs.sendMessage(tabId, {action: "saveSettings"}, (settings: TSetting[]) => {
//     setSettings(settings);
//     // chrome.storage.local.set({"records": {...documents, res}});
//   })
// }

function App() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [blockSettings, setBlockTypeSettings] = useState(blockTypeSettings);
  const [textSettings, setTextTypesSettings] = useState(textTypeSettings);
  const [countSettings, setCountTypeSettings] = useState(countTypeSettings);
  const [isActive, setIsActive] = useState(false);
  const [documents, setDocuments] = useState<TDocument[]>([]);

  //TODO: вынести из компонента
  const getUrl = async () => {
    const tabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    if (tabs.length > 0 && tabs[0]?.url) {
      const host = new URL(tabs[0].url).hostname;
      setIsActive(host === "yppm.yonote.ru");
      // setIsActive(host === "www.notion.so");
    }
  }

  //TODO: реализовать сохранение настроек через отправку экшена в content.ts
  const handleTextTypeChange = (type: string) => {
    const updatedSettings = textSettings.map((item) => item.title === type
      ? {...item, checked: !item.checked}
      : {...item});
    // saveSettings(setBlockTypeSettings)
    setTextTypesSettings(updatedSettings)
  }

  //TODO: реализовать сохранение настроек через отправку экшена в content.ts
  const handleBlockTypeChange = (type: string) => {
    const updatedSettings = blockSettings.map((item) => item.title === type
      ? {...item, checked: !item.checked}
      : {...item});
    // saveSettings(setBlockTypeSettings)
    setBlockTypeSettings(updatedSettings)
  }

  //TODO: реализовать сохранение настроек через отправку экшена в content.ts
  const handleCountTypeChange = async (type: string) => {
    const updatedSettings = countSettings.map((item) => {
      return {...item, checked: item.title === type}
    });
    setCountTypeSettings(updatedSettings);
    // const tabId = await getTabId();
    // chrome.tabs.sendMessage(tabId, {
    //   action: ACT.SAVE_COUNT_SETTINGS,
    //   data: {newCountTypeSettings: updatedSettings}
    // }, (savedSettings: TSetting[]) => {
    //   setCountTypeSettings(savedSettings);
    // })
  }

  useEffect(() => {
    getUrl();
    getRecords(setDocuments);
  }, [])

  const handleSettingsClick = async () => {
    const isOpen = !isSettingOpen;
    setIsSettingOpen(isOpen);
    // if (!isSettingOpen) {
    //   const tabId = await getTabId();
    //   chrome.tabs.sendMessage(tabId, {action: ACT.SETTING_APPLIED}, (documents: TDocument[]) => {
    //     setDocuments(documents);
    //   });
    // }


    // // initial()
    // const newRecord = await chrome.storage.local.get('records`')
    // const keys = Object.keys(newRecord)
    // if (newRecord["records"][keys[0]]) {
    //   const documents = newRecord["records"];
    //   setRecord([...record, documents])
    // }
    // // console.log(record) //TODO: console.log(record)
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
    console.log(id)
    const tabId = await getTabId();
    chrome.tabs.sendMessage(tabId, {action: ACT.REMOVE_DOCUMENT, data: {id: id}}, (documents: TDocument[]) => {
      setDocuments(documents);
    })
  }

  return (
    <>
      {
        isSettingOpen
          ? <SettingsPage blockSettings={blockSettings}
                          textTypesSettings={textSettings}
                          countTypeSettings={countSettings}
                          onBlockTypeChange={handleBlockTypeChange}
                          onTextTypeChange={handleTextTypeChange}
                          onCountTypeChange={handleCountTypeChange}
                          onBackButtonClick={handleSettingsClick}/>
          : <MainPage onPlusClick={handlePlusClick}
                      onClearClick={handleClearClick}
                      onDeleteClick={handleDeleteClick}
                      onSettingClick={handleSettingsClick}
                      data={documents}
                      isActive={isActive}
                      countTypeSettings={countSettings}/>
      }
    </>
  )
}

export default App
