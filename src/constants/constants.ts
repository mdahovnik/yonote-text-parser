import {TSettingList} from "../types/types.ts";
import {v4 as uuidv4} from 'uuid';

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

export const appSettings: TSettingList = {
  type1_strings: [
    {id: uuidv4(), label: "Page title", tagName: ["documentEditableTitle"], isAllowed: true, type: "checkbox"},
    {id: uuidv4(), label: "Heading 1", tagName: ["H1"], isAllowed: true, type: "checkbox"},
    {id: uuidv4(), label: "H1 content", tagName: ["H1_toggle_content"], isAllowed: true, type: "checkbox"},
    {id: uuidv4(), label: "Heading 2", tagName: ["H2"], isAllowed: true, type: "checkbox"},
    {id: uuidv4(), label: "H2 content", tagName: ["H2_toggle_content"], isAllowed: true, type: "checkbox"},
    {id: uuidv4(), label: "Heading 3", tagName: ["H3"], isAllowed: false, type: "checkbox"},
    {id: uuidv4(), label: "H3 content", tagName: ["H3_toggle_content"], isAllowed: false, type: "checkbox"},
    {id: uuidv4(), label: "Code", tagName: ["CODE"], isAllowed: false, type: "checkbox"}
  ],
  type2_blocks: [
    {id: uuidv4(), label: "Text block", tagName: ["DIV"], isAllowed: true, type: "checkbox"},
    {id: uuidv4(), label: "Quote block", tagName: ["BLOCKQUOTE"], isAllowed: false, type: "checkbox"},
    {id: uuidv4(), label: "Toggle block", tagName: ['toggle'], isAllowed: false, type: "checkbox"},
    {id: uuidv4(), label: "Columns", tagName: ['columns'], isAllowed: false, type: "checkbox"},
    {id: uuidv4(), label: "Content", tagName: ["allow_toggle_content"], isAllowed: false, type: "checkbox"},
    {id: uuidv4(), label: "Table", tagName: ["TABLE"], isAllowed: false, type: "checkbox"},
    {id: uuidv4(), label: "Code block", tagName: ['code-block'], isAllowed: false, type: "checkbox"},
    {
      id: uuidv4(),
      label: "Callout block",
      tagName: ["notice-block info", "notice-block warning", "notice-block tip"],
      isAllowed: false,
      type: "checkbox"
    }
  ],
  type3_lists: [
    {id: uuidv4(), label: "To-do list", tagName: ['checkbox_list'], isAllowed: false, type: "checkbox"},
    {id: uuidv4(), label: "Bulleted list", tagName: ['bullet_list'], isAllowed: false, type: "checkbox"},
    {id: uuidv4(), label: "Numbered list", tagName: ['ordered_list'], isAllowed: false, type: "checkbox"},
  ],
  type4_text: [
    {id: uuidv4(), label: "Bold", tagName: ["STRONG"], isAllowed: true, type: "checkbox"},
    {id: uuidv4(), label: "Italic", tagName: ["EM"], isAllowed: true, type: "checkbox"},
    {id: uuidv4(), label: "Underline", tagName: ["U"], isAllowed: false, type: "checkbox"},
    {id: uuidv4(), label: "Strike", tagName: ["DEL"], isAllowed: false, type: "checkbox"}
  ],
  type5_counter: [
    {id: uuidv4(), label: "Words", tagName: ["count_words"], isAllowed: true, type: "radio"},
    {id: uuidv4(), label: "Symbols", tagName: ["count_symbols"], isAllowed: false, type: "radio"}
  ]
};
