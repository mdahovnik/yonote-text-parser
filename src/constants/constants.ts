import {TSettingList} from "../types/types.ts";

export const Act = {
  GET_DOCUMENT: 'GET_DOCUMENT',
  GET_DOCUMENTS: 'GET_DOCUMENTS',
  GET_SETTINGS: 'GET_SETTINGS',
  GET_DOCUMENT_ID: 'GET_DOCUMENT_ID',
  CLEAR_RECORDS: 'CLEAR_RECORDS',
  SAVE_DOCUMENT: 'SAVE_DOCUMENT',
  SAVE_SETTINGS: 'SAVE_SETTINGS',
  REMOVE_DOCUMENT: 'REMOVE_DOCUMENT',
  APPLY_SETTINGS: 'APPLY_SETTINGS',
  SET_BADGE: 'SET_BADGE',
  TEXT_CHANGED: 'TEXT_CHANGED',
  GET_NODE_TREE: 'GET_NODE_TREE'
}

export const Icon = {
  PLUS: "plus",
  TRASH: "trash",
  REMOVE: "remove",
  COPY: "copy",
  SETTINGS: "settings",
  BACK: "back",
  LNG: "lng"
}

// export const appSettings: TSettingList = {
//   block: [
//     {tagName: ["documentEditableTitle"], label: "Page title", isAllowed: true, type: "checkbox"},
//     {tagName: ["DIV"], label: "Text block", isAllowed: true, type: "checkbox"},
//     {tagName: ["H1"], label: "Heading 1", isAllowed: true, type: "checkbox"},
//     {tagName: ["H1_toggle_content"], label: "H1 content", isAllowed: true, type: "checkbox"},
//     {tagName: ["H2"], label: "Heading 2", isAllowed: true, type: "checkbox"},
//     {tagName: ["H2_toggle_content"], label: "H2 content", isAllowed: true, type: "checkbox"},
//     {tagName: ["H3"], label: "Heading 3", isAllowed: false, type: "checkbox"},
//     {tagName: ["H3_toggle_content"], label: "H3 content", isAllowed: false, type: "checkbox"},
//     {tagName: ["BLOCKQUOTE"], label: "Quote block", isAllowed: false, type: "checkbox"},
//     {tagName: ['checkbox_list'], label: "To-do list", isAllowed: false, type: "checkbox"},
//     {tagName: ['bullet_list'], label: "Bulleted list", isAllowed: false, type: "checkbox"},
//     {tagName: ['ordered_list'], label: "Numbered list", isAllowed: false, type: "checkbox"},
//     {tagName: ['toggle'], label: "Toggle block", isAllowed: false, type: "checkbox"},
//     {tagName: ['columns'], label: "Columns", isAllowed: false, type: "checkbox"},
//     {tagName: ["allow_toggle_content"], label: "Content", isAllowed: false, type: "checkbox"},
//     {tagName: ["TABLE"], label: "Table", isAllowed: false, type: "checkbox"},
//     {tagName: ['code-block'], label: "Code block", isAllowed: false, type: "checkbox"},
//     {
//       tagName: ["notice-block info", "notice-block warning", "notice-block tip"],
//       label: "Callout block",
//       isAllowed: false,
//       type: "checkbox"
//     },
//     // {tagName: "allow_toggle_h1_title", label: "H1 title", isAllowed: false},
//     // {tagName: ["allow_toggle_h2_content"], label: "H2 content", isAllowed: false},
//     // {tagName: ["allow_toggle_h3_title"], label: "H3 title", isAllowed: false},
//   ],
//   text: [
//     {
//       tagName: ["STRONG"],
//       label: "Bold",
//       isAllowed: true,
//       type: "checkbox"
//     },
//     {
//       tagName: ["EM"],
//       label: "Italic",
//       isAllowed: true,
//       type: "checkbox"
//     },
//     {
//       tagName: ["U"],
//       label: "Underline",
//       isAllowed: false, type: "checkbox"
//     },
//     {
//       tagName: ["DEL"],
//       label: "Strike",
//       isAllowed: false, type: "checkbox"
//     },
//     {
//       tagName: ["CODE"],
//       label: "Code", isAllowed: false, type: "checkbox"
//     },
//   ],
//   count: [
//     {tagName: ["count_words"], label: "Words", isAllowed: true, type: "radio"},
//     {tagName: ["count_symbols"], label: "Symbols", isAllowed: false, type: "radio"}
//   ]
// }

export const appSettings: TSettingList = {
  block: [
    {label: "Page title", tagName: ["documentEditableTitle"], isAllowed: true, type: "checkbox"},
    {label: "Text block", tagName: ["DIV"], isAllowed: true, type: "checkbox"},
    {label: "Heading 1", tagName: ["H1"], isAllowed: true, type: "checkbox"},
    {label: "H1 content", tagName: ["H1_toggle_content"], isAllowed: true, type: "checkbox"},
    {label: "Heading 2", tagName: ["H2"], isAllowed: true, type: "checkbox"},
    {label: "H2 content", tagName: ["H2_toggle_content"], isAllowed: true, type: "checkbox"},
    {label: "Heading 3", tagName: ["H3"], isAllowed: false, type: "checkbox"},
    {label: "H3 content", tagName: ["H3_toggle_content"], isAllowed: false, type: "checkbox"},
    {label: "Quote block", tagName: ["BLOCKQUOTE"], isAllowed: false, type: "checkbox"},
    {label: "To-do list", tagName: ['checkbox_list'], isAllowed: false, type: "checkbox"},
    {label: "Bulleted list", tagName: ['bullet_list'], isAllowed: false, type: "checkbox"},
    {label: "Numbered list", tagName: ['ordered_list'], isAllowed: false, type: "checkbox"},
    {label: "Toggle block", tagName: ['toggle'], isAllowed: false, type: "checkbox"},
    {label: "Columns", tagName: ['columns'], isAllowed: false, type: "checkbox"},
    {label: "Content", tagName: ["allow_toggle_content"], isAllowed: false, type: "checkbox"},
    {label: "Table", tagName: ["TABLE"], isAllowed: false, type: "checkbox"},
    {label: "Code block", tagName: ['code-block'], isAllowed: false, type: "checkbox"},
    {
      label: "Callout block",
      tagName: ["notice-block info", "notice-block warning", "notice-block tip"],
      isAllowed: false,
      type: "checkbox"
    }
  ],
  text: [
    {label: "Bold", tagName: ["STRONG"], isAllowed: true, type: "checkbox"},
    {label: "Italic", tagName: ["EM"], isAllowed: true, type: "checkbox"},
    {label: "Underline", tagName: ["U"], isAllowed: false, type: "checkbox"},
    {label: "Strike", tagName: ["DEL"], isAllowed: false, type: "checkbox"},
    {label: "Code", tagName: ["CODE"], isAllowed: false, type: "checkbox"}
  ],
  count: [
    {label: "Words", tagName: ["count_words"], isAllowed: true, type: "radio"},
    {label: "Symbols", tagName: ["count_symbols"], isAllowed: false, type: "radio"}
  ]
};
