// import {TStorage} from "./types.ts";

// import {TStorage} from "./types.ts";

chrome.runtime.onInstalled.addListener(() => {

  chrome.storage.local.set({
    "settings": [
      {type: "block", name: "allow_title", title: "Page title", checked: false},
      {type: "block", name: "allow_quote", title: "Quote block", checked: false},
      {type: "block", name: "allow_text", title: "Text block", checked: false},
      {type: "block", name: "allow_callout", title: "Callout block", checked: false},
      {type: "block", name: "allow_h1", title: "Heading 1", checked: false},
      {type: "block", name: "allow_toggle_h1_title", title: "H1 title", checked: false},
      {type: "block", name: "allow_h2", title: "Heading 2", checked: false},
      {type: "block", name: "allow_toggle_h1_content", title: "H1 content", checked: false},
      {type: "block", name: "allow_h3", title: "Heading 3", checked: false},
      {type: "block", name: "allow_toggle_h2_title", title: "H2 title", checked: false},
      {type: "block", name: "allow_to_do", title: "To-do list", checked: false},
      {type: "block", name: "allow_toggle_h2_content", title: "H2 content", checked: false},
      {type: "block", name: "allow_bulleted_list", title: "Bulleted list", checked: false},
      {type: "block", name: "allow_toggle_h3_title", title: "H3 title", checked: false},
      {type: "block", name: "allow_numbered_list", title: "Numbered list", checked: false},
      {type: "block", name: "allow_toggle_h3_content", title: "H3 content", checked: false},
      {type: "block", name: "allow_toggle_title", title: "Title", checked: false},
      {type: "block", name: "allow_column", title: "Columns", checked: false},
      {type: "block", name: "allow_toggle_content", title: "Content", checked: false},
      {type: "block", name: "allow_table", title: "Table", checked: false},
      {type: "block", name: "allow_code", title: "Code block", checked: false},
      {type: "text", name: "allow_formatting_bold", title: "Bold", checked: false},
      {type: "text", name: "allow_formatting_italic", title: "Italic", checked: false},
      {type: "text", name: "allow_formatting_underline", title: "Underline", checked: false},
      {type: "text", name: "allow_formatting_strike", title: "Strike", checked: false},
      {type: "text", name: "allow_formatting_code", title: "Code", checked: false},
      {type: "count", name: "count_words", title: "Words", checked: true},
      {type: "count", name: "count_symbols", title: "Symbols", checked: false},
    ],
    "documents": []
  });

  // chrome.runtime.onStartup.addListener(() => {
  //   // await chrome.storage.local.clear();
  //   const defaultSettings: TStorage = {}
  //
  //
  //   chrome.storage.local.get("settings", (storage: TStorage) => {
  //     const savedSettings = storage.settings;
  //     if (savedSettings) {
  //
  //       chrome.storage.local.set()
  //     }
  //   });
  // })

  //активировать кнопку расширения Chrome только на определённом сайте
  // chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
  //     chrome.declarativeContent.onPageChanged.addRules([
  //         {
  //             conditions: [
  //                 new chrome.declarativeContent.PageStateMatcher({
  //                     pageUrl: {hostEquals: "*.yonote.ru"} // Замените на нужный сайт
  //                 })
  //             ],
  //             actions: [new chrome.declarativeContent.ShowAction()]
  //         }
  //     ]);
  // });

});

// const loadDataFromStorage = () => {
//     chrome.storage.local.get("records", (data) => {
//         chrome.runtime.sendMessage(data['records'])
//     })
// }
//
// chrome.runtime.onStartup.addListener((sendResponse) => {
//     let res = []
//     chrome.storage.local.get("records", (result) => {
//         res = storage['records'];
//         console.log(res)
//     })
//     // sendResponse([res])
// })


// chrome.runtime.onStartup.addListener(() => {
//   async function getRecords(setState: Dispatch<SetStateAction<TStorage[]>>) {
//   const tab = (await chrome.tabs.query({active: true, currentWindow: true}))[0];
//   const id = tab?.id as number;
//   chrome.tabs.sendMessage(id, {action: "getRecords"}, (response: TStorage) => {
//     setState([response])
//   })
// }
// })
