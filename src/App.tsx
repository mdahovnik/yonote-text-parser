import {useEffect, useState} from 'react'
import './App.css'
import {SettingsPage} from "./components/settingsPage.tsx";
import {MainPage} from "./components/mainPage.tsx";
import {
  defaultBlockSettings,
  defaultCountTypeSettings,
  // defaultRecords,
  defaultTextTypesSettings, TDocument
} from "./types.ts";

// async function getRecords(setData: Dispatch<SetStateAction<TDocument[]>>) {
//   const tab = (await chrome.tabs.query({active: true, currentWindow: true}))[0];
//   const id = tab?.id as number;
//   chrome.tabs.sendMessage(id, {action: "getRecords"}, (response: TDocument[]) => {
//     if (response) setData([...response])
//   })
// }

function App() {
  const [settingIsVisible, setSettingIsVisible] = useState(false);
  const [blockSettings, setBlockSettings] = useState(defaultBlockSettings);
  const [textTypesSettings, setTextTypesSettings] = useState(defaultTextTypesSettings);
  const [countTypeSettings, setCountTypeSettings] = useState(defaultCountTypeSettings);
  // const [record, setRecord] = useState<TRecord[]>([])
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
    // getRecords(setData);//TODO: при монтировании компонента загружать documents из chrome.storage.local

    //TODO: при монтировании компонента загружать documents из chrome.storage.local
    // chrome.storage.local.get("records", (response) => {
    //   if (response["records"]) {
    //     setData([response["records"]])
    //   }
    //   console.log('при монтировании компонента загружать documents из chrome.storage.local')
    //   console.log(response["records"])
    // })

    return () => {
      //TODO: при размонтировании компонента сохранять documents в chrome.storage.local
    }
  }, [])

  const onSettingClick = async (isVisible: boolean) => {
    setSettingIsVisible(isVisible);
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
    // const settings = await chrome.storage.local.get("defaultBlockSettings");
    // chrome.tabs.sendMessage(id, settings);

    chrome.tabs.sendMessage(tabId, {action: "getParsedDocument"}, (documents: TDocument[]) => {
      setDocuments(documents);
      // chrome.storage.local.set({"records": {...documents, res}});
    })
  }

  // const testData: TStorage[] = [
  //   {
  //     time: "8:15:58 PM",
  //     title: "Что такое Yonote?",
  //     raw: "raw_string",
  //     symbols: 820,
  //     words: 8,
  //   },
  //   {
  //     raw: "raw_string",
  //     symbols: 820,
  //     time: "8:15:58 PM",
  //     title: "Ваолор цуцудлдл ывыовыовыоxcxc",
  //     words: 25
  //   },
  //   {
  //     raw: "raw_string",
  //     symbols: 820,
  //     time: "8:15:58 PM",
  //     title: "Фаолор цуцудлдл ывыовopqыовыо",
  //     words: 158
  //   },
  //   {
  //     raw: "raw_string",
  //     symbols: 820,
  //     time: "8:15:58 PM",
  //     title: "Практика поможет",
  //     words: 89
  //   },
  //   {
  //     raw: "raw_string",
  //     symbols: 820,
  //     time: "8:15:58 PM",
  //     title: "Йаолор цу",
  //     words: 73
  //   },
  //   {
  //     raw: "raw_string",
  //     symbols: 820,
  //     time: "8:15:58 PM",
  //     title: "Ууцудлдл ваа ывыовыовыо - ававпапа",
  //     words: 158
  //   },
  //   {
  //     raw: "raw_string",
  //     symbols: 820,
  //     time: "8:15:58 PM",
  //     title: "Ваолор цуцудлдл ывыовыовыоxcxc",
  //     words: 18
  //   },
  //   {
  //     raw: "raw_string",
  //     symbols: 820,
  //     time: "8:15:58 PM",
  //     title: "Фаолор цуцудлдл ывыовopqыовыо",
  //     words: 58
  //   },
  //   {
  //     raw: "raw_string",
  //     symbols: 820,
  //     time: "8:15:58 PM",
  //     title: "Практика поможет",
  //     words: 358
  //   }
  // ]
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
        : <MainPage onSettingClick={onSettingClick}
                    onPlusClick={onPlusClickHandler}
                    data={documents}
                    isActive={isActive}
                    countTypeSettings={countTypeSettings}/>
      }
    </>
  )
}

export default App
