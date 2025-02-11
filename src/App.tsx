import {Dispatch, SetStateAction, useEffect, useState} from 'react'
import './App.css'
import {SettingsPage} from "./components/settingsPage.tsx";
import {MainPage} from "./components/mainPage.tsx";
import {TDocument} from "./types.ts";
import {blockTypeSettings, countTypeSettings, textTypeSettings} from "./constants/constants.ts";

const ACT = {
  GET_DOCUMENT: 'GET_DOCUMENT',
  GET_RECORDS: 'GET_RECORDS',
  SAVE_DOCUMENT: 'SAVE_DOCUMENT',
  SAVE_SETTINGS: 'SAVE_SETTINGS'
}

async function getRecords<T>(setData: Dispatch<SetStateAction<T[]>>) {
  const tab = (await chrome.tabs.query({active: true, currentWindow: true}))[0];
  const id = tab?.id as number;

  chrome.tabs.sendMessage(id, {action: ACT.GET_RECORDS}, (records: T[]) => {
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
  // const [host, setHost] = useState("");
  // const [tab, setTab] = useState<chrome.tabs.Tab>();
  // const [words, setWords] = useState(10);
  // const [symbols, setSymbols] = useState(0);

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


  // const initial = () => {
  //   // Получаем данные из chrome.storage.local
  //   chrome.storage.local.get('records', (storage) => {
  //     const rec = storage['records'];
  //     if (rec.records) {
  //       setData([...rec]);
  //     }
  //   });
  // }

  // const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, namespace: string) => {
  //   if (namespace === "local" && changes.keyName) {
  //     setData(changes.keyName.newValue);
  //   }
  //   // if (namespace === "local") {
  //   //   Object.keys(changes).forEach((key) => {
  //   //     setData(changes[key].newValue);
  //   //   });
  //   // }
  // }

  // const handleStorageChange = (message: { [key: string]: chrome.storage.StorageChange }) => {
  //   const newData = message['records']
  //   console.log(newData.newValue)
  //   setData([...newData.newValue])
  // }

  // const fetchData = () => {
  //   chrome.storage.sync.get('records`', (record) => {
  //     const newRecord = record['records'];
  //     console.log(newRecord)
  //     if (record['records']) {
  //       setRecord([newRecord]);
  //     }
  //   });
  // }

  useEffect(() => {
    getUrl();
    getRecords(setDocuments);
  }, [])

  const onSettingClick = async (isVisible: boolean) => {
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

  const onPlusClickHandler = async () => {
    const tab = (await chrome.tabs.query({active: true, currentWindow: true}))[0];
    const tabId = tab?.id as number;

    chrome.tabs.sendMessage(tabId, {action: ACT.GET_DOCUMENT}, (documents: TDocument[]) => {
      setDocuments(documents);
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
            onSettingClick={onSettingClick}/>
          : <MainPage
            onSettingClick={onSettingClick}
            onPlusClick={onPlusClickHandler}
            data={documents}
            isActive={isActive}
            countTypeSettings={countSettings}/>
      }
    </>
  )
}

export default App
