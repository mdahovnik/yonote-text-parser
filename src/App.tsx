import {useLayoutEffect, useState} from 'react'
import './App.css'
import {SettingsPage} from "./components/settingsPage.tsx";
import {MainPage} from "./components/mainPage.tsx";
import {
  defaultBlockSettings,
  defaultCountTypeSettings, defaultRecords,
  // defaultRecords,
  defaultTextTypesSettings, TRecord, TStorage
} from "./types.ts";

function App() {
  const [settingIsVisible, setSettingIsVisible] = useState(false);
  const [blockSettings, setBlockSettings] = useState(defaultBlockSettings);
  const [textTypesSettings, setTextTypesSettings] = useState(defaultTextTypesSettings);
  const [countTypeSettings, setCountTypeSettings] = useState(defaultCountTypeSettings);
  const [record, setRecord] = useState<TRecord[]>(defaultRecords)
  const [isActive, setIsActive] = useState(false);
  const [data, setData] = useState<TStorage[]>([]);
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

  useLayoutEffect(() => {
    getUrl();
    // fetchData()

  }, [])

  const onSettingClick = async (isVisible: boolean) => {
    setSettingIsVisible(isVisible);
    // initial()
    const newRecord = await chrome.storage.local.get('records`')
    const keys = Object.keys(newRecord)
    if (newRecord["records"][keys[0]]) {
      const data = newRecord["records"];
      setRecord([...record, data])
    }
    console.log(record)
  }

  const onPlusClickHandler = async () => {
    const tab = (await chrome.tabs.query({active: true, currentWindow: true}))[0];
    const id = tab?.id as number;
    const settings = await chrome.storage.local.get("defaultBlockSettings");
    // chrome.tabs.sendMessage(id, settings);
    chrome.tabs.sendMessage(id, settings, (response) => {
      setData([...data, response])
    })
  }
  const testData = [
    {
      raw: "raw_string",
      symbols: 820,
      time: "8:15:58 PM",
      title: "testTitle",
      words: 158
    },
    {
      raw: "raw_string",
      symbols: 820,
      time: "8:15:58 PM",
      title: "testTitle ваолор цуцудлдл ывыовыовыоxcxc",
      words: 158
    },
    {
      raw: "raw_string",
      symbols: 820,
      time: "8:15:58 PM",
      title: "testTitle ваолор цуцудлдл ывыовopqыовыо",
      words: 158
    },
    {
      raw: "raw_string",
      symbols: 820,
      time: "8:15:58 PM",
      title: "testTitleлололо hhjhjhjhjT Yuhjshjh",
      words: 158
    },
    {
      raw: "raw_string",
      symbols: 820,
      time: "8:15:58 PM",
      title: "testTitle ваолор цу",
      words: 158
    },
    {
      raw: "raw_string",
      symbols: 820,
      time: "8:15:58 PM",
      title: "testTitle ваолор цуцудлдл ывыовыовыо",
      words: 158
    }
  ]
  return (
    <>
      {settingIsVisible
        ? <SettingsPage blockSettings={blockSettings}
                        setBlockSettings={setBlockSettings}
                        textTypesSettings={textTypesSettings}
                        setTextTypesSettings={setTextTypesSettings}
                        countTypeSettings={countTypeSettings}
                        setCountTypeSettings={setCountTypeSettings}
                        onSettingClick={onSettingClick}/>
        :
        <MainPage onSettingClick={onSettingClick}
                  onPlusClick={onPlusClickHandler}
                  data={testData}
                  isActive={isActive}/>
      }
    </>
  )
}

export default App
