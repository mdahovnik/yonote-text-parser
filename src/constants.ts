import {SettingList} from "./types.ts";

export const ACT = {
  GET_DOCUMENT: 'GET_DOCUMENT',
  GET_RECORDS: 'GET_RECORDS',
  GET_SETTINGS: 'GET_SETTINGS',
  GET_DOCUMENT_ID: 'GET_DOCUMENT_ID',
  CLEAR_RECORDS: 'CLEAR_RECORDS',
  SAVE_DOCUMENT: 'SAVE_DOCUMENT',
  SAVE_SETTINGS: 'SAVE_SETTINGS',
  REMOVE_DOCUMENT: 'REMOVE_DOCUMENT',
  APPLY_SETTINGS: 'APPLY_SETTINGS',
  SET_BADGE: 'SET_BADGE',
  TEXT_CHANGED: 'TEXT_CHANGED'
}

export const appSettings: SettingList = {
  block: [
    {tagName: ["allow_title"], label: "Page title", isAllowed: false},
    {
      tagName: ["BLOCKQUOTE"],
      label: "Quote block",
      isAllowed: false
    },
    {
      tagName: ["DIV"],
      label: "Text block",
      isAllowed: true
    },
    // {tagName: "allow_callout", label: "Callout block", isAllowed: false},
    {
      tagName: ["H1"],
      label: "Heading 1",
      isAllowed: false
    },
    // {tagName: "allow_toggle_h1_title", label: "H1 title", isAllowed: false},
    {
      tagName: ["H2"],
      label: "Heading 2",
      isAllowed: false
    },
    // {tagName: "allow_toggle_h1_content", label: "H1 content", isAllowed: false},
    {
      tagName: ["H3"],
      label: "Heading 3",
      isAllowed: false
    },
    // {tagName: "allow_toggle_h2_title", label: "H2 title", isAllowed: false},
    {
      tagName: ['checkbox_list'],
      label: "To-do list",
      isAllowed: false
    },
    {tagName: ["allow_toggle_h2_content"], label: "H2 content", isAllowed: false},
    {
      tagName: ['bullet_list'],
      label: "Bulleted list",
      isAllowed: false
    },
    {tagName: ["allow_toggle_h3_title"], label: "H3 title", isAllowed: false},
    {
      tagName: ['ordered_list'],
      label: "Numbered list",
      isAllowed: false
    },
    {tagName: ["allow_toggle_h3_content"], label: "H3 content", isAllowed: false},
    {
      tagName: ['toggle'],
      label: "Toggle block",
      isAllowed: false
    },
    {
      tagName: ['columns'],
      label: "Columns",
      isAllowed: false
    },
    {tagName: ["allow_toggle_content"], label: "Content", isAllowed: false},
    {
      tagName: ["TABLE"],
      label: "Table",
      isAllowed: false
    },
    {
      tagName: ['code-block'],
      label: "Code block",
      isAllowed: false
    },
  ],
  text: [
    {
      tagName: ["STRONG"],
      label: "Bold",
      isAllowed: true
    },
    {
      tagName: ["EM"],
      label: "Italic",
      isAllowed: true
    },
    {
      tagName: ["U"],
      label: "Underline",
      isAllowed: false
    },
    {
      tagName: ["DEL"],
      label: "Strike",
      isAllowed: false
    },
    {
      tagName: ["CODE"],
      label: "Code",
      isAllowed: false
    },
  ],
  count: [
    {
      tagName: ["count_words"],
      label: "Words",
      isAllowed: true
    },
    {
      tagName: ["count_symbols"],
      label: "Symbols",
      isAllowed: false
    }]
}