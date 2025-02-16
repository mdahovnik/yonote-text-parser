chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    "settings": {
      block: [
        {name: "allow_title", title: "Page title", checked: false},
        {name: "allow_quote", title: "Quote block", checked: false},
        {name: "allow_text", title: "Text block", checked: false},
        {name: "allow_callout", title: "Callout block", checked: false},
        {name: "allow_h1", title: "Heading 1", checked: false},
        {name: "allow_toggle_h1_title", title: "H1 title", checked: false},
        {name: "allow_h2", title: "Heading 2", checked: false},
        {name: "allow_toggle_h1_content", title: "H1 content", checked: false},
        {name: "allow_h3", title: "Heading 3", checked: false},
        {name: "allow_toggle_h2_title", title: "H2 title", checked: false},
        {name: "allow_to_do", title: "To-do list", checked: false},
        {name: "allow_toggle_h2_content", title: "H2 content", checked: false},
        {name: "allow_bulleted_list", title: "Bulleted list", checked: false},
        {name: "allow_toggle_h3_title", title: "H3 title", checked: false},
        {name: "allow_numbered_list", title: "Numbered list", checked: false},
        {name: "allow_toggle_h3_content", title: "H3 content", checked: false},
        {name: "allow_toggle_title", title: "Title", checked: false},
        {name: "allow_column", title: "Columns", checked: false},
        {name: "allow_toggle_content", title: "Content", checked: false},
        {name: "allow_table", title: "Table", checked: false},
        {name: "allow_code", title: "Code block", checked: false},
      ],
      text: [
        {name: "allow_formatting_bold", title: "Bold", checked: false},
        {name: "allow_formatting_italic", title: "Italic", checked: false},
        {name: "allow_formatting_underline", title: "Underline", checked: false},
        {name: "allow_formatting_strike", title: "Strike", checked: false},
        {name: "allow_formatting_code", title: "Code", checked: false},
      ],
      count: [
        {name: "count_words", title: "Words", checked: true},
        {name: "count_symbols", title: "Symbols", checked: false}]
    },
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

