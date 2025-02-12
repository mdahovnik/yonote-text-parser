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
  SAVE_SETTINGS: 'SAVE_SETTINGS',
}

async function getTabId() {
  const tab = (await chrome.tabs.query({active: true, currentWindow: true}))[0];
  return tab?.id as number;
}

async function getRecords<T>(setData: Dispatch<SetStateAction<T[]>>) {
  const tabId = await getTabId()
  chrome.tabs.sendMessage(tabId, {action: ACT.GET_RECORDS}, (records: T[]) => {
    if (records.length > 0) setData(records);
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
  const [isSettingChecked, setIsSettingChecked] = useState(false);
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
    }
  }

  //TODO: реализовать сохранение настроек через отправку экшена в content.ts
  const onTextTypeChanged = (type: string) => {
    const updatedSettings = textSettings.map((item) => item.title === type
      ? {...item, checked: !item.checked}
      : {...item});
    // saveSettings(setBlockTypeSettings)
    setTextTypesSettings(updatedSettings)
  }

  //TODO: реализовать сохранение настроек через отправку экшена в content.ts
  const onBlockTypeChanged = (type: string) => {
    const updatedSettings = blockSettings.map((item) => item.title === type
      ? {...item, checked: !item.checked}
      : {...item});
    // saveSettings(setBlockTypeSettings)
    setBlockTypeSettings(updatedSettings)
  }

  //TODO: реализовать сохранение настроек через отправку экшена в content.ts
  const onCountTypeChanged = (type: string) => {
    const updatedSettings = countSettings.map((item) => {
      return {...item, checked: item.title === type}
    });
    // saveSettings(setBlockTypeSettings)
    setCountTypeSettings(updatedSettings);
  }

  useEffect(() => {
    getUrl();
    getRecords(setDocuments);
  }, [])

  const handleSettingsClick = () => {
    const isVisible = !isSettingChecked;
    setIsSettingChecked(isVisible);
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
    chrome.tabs.sendMessage(tabId, {action: ACT.GET_DOCUMENT}, (documents: TDocument[]) => {
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

  return (
    <>
      {
        isSettingChecked
          ? <SettingsPage
            blockSettings={blockSettings}
            onBlockTypeChange={onBlockTypeChanged}
            textTypesSettings={textSettings}
            onTextTypeChange={onTextTypeChanged}
            countTypeSettings={countSettings}
            onCountTypeChange={onCountTypeChanged}
            onSettingClick={handleSettingsClick}/>
          : <MainPage
            onSettingClick={handleSettingsClick}
            onPlusClick={handlePlusClick}
            onClearClick={handleClearClick}
            data={documents}
            isActive={isActive}
            countTypeSettings={countSettings}/>
      }
    </>
  )
}

export default App
