import {SettingList} from "./types.ts";

chrome.runtime.onInstalled.addListener(() => {
  const settings: SettingList = {
    block: [
      {tagName: "allow_title", label: "Page title", isAllowed: false},
      {
        tagName: "BLOCKQUOTE",
        label: "Quote block",
        isAllowed: false
      },
      {
        tagName: "DIV",
        label: "Text block",
        isAllowed: true
      },
      // {tagName: "allow_callout", label: "Callout block", isAllowed: false},
      {
        tagName: "H1",
        label: "Heading 1",
        isAllowed: false
      },
      // {tagName: "allow_toggle_h1_title", label: "H1 title", isAllowed: false},
      {
        tagName: "H2",
        label: "Heading 2",
        isAllowed: false
      },
      // {tagName: "allow_toggle_h1_content", label: "H1 content", isAllowed: false},
      {
        tagName: "H3",
        label: "Heading 3",
        isAllowed: false
      },
      // {tagName: "allow_toggle_h2_title", label: "H2 title", isAllowed: false},
      {
        tagName: "CHECKBOX_LIST",
        label: "To-do list",
        isAllowed: false
      },
      {tagName: "allow_toggle_h2_content", label: "H2 content", isAllowed: false},
      {
        tagName: "BULLET_LIST",
        label: "Bulleted list",
        isAllowed: false
      },
      {tagName: "allow_toggle_h3_title", label: "H3 title", isAllowed: false},
      {
        tagName: "ORDERED_LIST",
        label: "Numbered list",
        isAllowed: false
      },
      {tagName: "allow_toggle_h3_content", label: "H3 content", isAllowed: false},
      {
        tagName: "TOGGLE",
        label: "Toggle block",
        isAllowed: false
      },
      {
        tagName: "COLUMNS",
        label: "Columns",
        isAllowed: false
      },
      {tagName: "allow_toggle_content", label: "Content", isAllowed: false},
      {
        tagName: "TABLE",
        label: "Table",
        isAllowed: false
      },
      {
        tagName: "CODE-BLOCK",
        label: "Code block",
        isAllowed: false
      },
    ],
    text: [
      {
        tagName: "STRONG",
        label: "Bold",
        isAllowed: true
      },
      {
        tagName: "EM",
        label: "Italic",
        isAllowed: true
      },
      {
        tagName: "U",
        label: "Underline",
        isAllowed: false
      },
      {
        tagName: "DEL",
        label: "Strike",
        isAllowed: false
      },
      {
        tagName: "CODE",
        label: "Code",
        isAllowed: false
      },
    ],
    count: [
      {
        tagName: "count_words",
        label: "Words",
        isAllowed: true
      },
      {
        tagName: "count_symbols",
        label: "Symbols",
        isAllowed: false
      }]
  }

  chrome.storage.local.set({
    "settings": settings,
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


// const settings: SettingList = {
//   block: [
//     {name: "allow_title", title: "Page title", checked: false},
//     {name: "allow_quote", title: "Quote block", checked: false},
//     {name: "allow_text", title: "Text block", checked: false},
//     {name: "allow_callout", title: "Callout block", checked: false},
//     {name: "allow_h1", title: "Heading 1", checked: false},
//     {name: "allow_toggle_h1_title", title: "H1 title", checked: false},
//     {name: "allow_h2", title: "Heading 2", checked: false},
//     {name: "allow_toggle_h1_content", title: "H1 content", checked: false},
//     {name: "allow_h3", title: "Heading 3", checked: false},
//     {name: "allow_toggle_h2_title", title: "H2 title", checked: false},
//     {name: "allow_to_do", title: "To-do list", checked: false},
//     {name: "allow_toggle_h2_content", title: "H2 content", checked: false},
//     {name: "allow_bulleted_list", title: "Bulleted list", checked: false},
//     {name: "allow_toggle_h3_title", title: "H3 title", checked: false},
//     {name: "allow_numbered_list", title: "Numbered list", checked: false},
//     {name: "allow_toggle_h3_content", title: "H3 content", checked: false},
//     {name: "allow_toggle_title", title: "Title", checked: false},
//     {name: "allow_column", title: "Columns", checked: false},
//     {name: "allow_toggle_content", title: "Content", checked: false},
//     {name: "allow_table", title: "Table", checked: false},
//     {name: "allow_code", title: "Code block", checked: false},
//   ],
//   text: [
//     {name: "allow_formatting_bold", title: "Bold", checked: false},
//     {name: "allow_formatting_italic", title: "Italic", checked: false},
//     {name: "allow_formatting_underline", title: "Underline", checked: false},
//     {name: "allow_formatting_strike", title: "Strike", checked: false},
//     {name: "allow_formatting_code", title: "Code", checked: false},
//   ],
//   count: [
//     {name: "count_words", title: "Words", checked: true},
//     {name: "count_symbols", title: "Symbols", checked: false}]
// }

