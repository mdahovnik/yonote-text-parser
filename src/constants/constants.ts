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
    {
      label: "Page title",
      id: uuidv4(),
      tagName: ["documentEditableTitle"],
      isAllowed: true,
      type: "checkbox"
    },
    {
      label: "Heading 1",
      id: uuidv4(),
      tagName: ["H1"],
      isAllowed: true,
      type: "checkbox"
    },
    {
      label: "H1 content",
      id: uuidv4(),
      tagName: ["H1_toggle_content"],
      isAllowed: true,
      type: "checkbox"
    },
    {
      label: "Heading 2",
      id: uuidv4(),
      tagName: ["H2"],
      isAllowed: true,
      type: "checkbox"
    },
    {
      label: "H2 content",
      id: uuidv4(),
      tagName: ["H2_toggle_content"],
      isAllowed: true,
      type: "checkbox"
    },
    {
      label: "Heading 3",
      id: uuidv4(),
      tagName: ["H3"],
      isAllowed: false,
      type: "checkbox"
    },
    {
      label: "H3 content",
      id: uuidv4(),
      tagName: ["H3_toggle_content"],
      isAllowed: false,
      type: "checkbox"
    },
    {
      label: "Code",
      id: uuidv4(),
      tagName: ["CODE"],
      isAllowed: false,
      type: "checkbox"
    }
  ],
  type2_blocks: [
    {
      label: "Text block",
      id: uuidv4(),
      tagName: ["DIV"],
      isAllowed: true,
      type: "checkbox"
    },
    {
      label: "Quote block",
      id: uuidv4(),
      tagName: ["BLOCKQUOTE"],
      isAllowed: false,
      type: "checkbox"
    },
    {
      id: uuidv4(),
      label: "Toggle block",
      tagName: ['toggle'],
      isAllowed: false,
      type: "checkbox"
    },
    {
      id: uuidv4(),
      label: "Columns",
      tagName: ['columns'],
      isAllowed: false,
      type: "checkbox"
    },
    {
      id: uuidv4(),
      label: "Content",
      tagName: ["allow_toggle_content"],
      isAllowed: false,
      type: "checkbox"
    },
    {
      id: uuidv4(),
      label: "Table",
      tagName: ["TABLE"],
      isAllowed: false,
      type: "checkbox"
    },
    {
      id: uuidv4(),
      label: "Code block",
      tagName: ['code-block'],
      isAllowed: false,
      type: "checkbox"
    },
    {
      id: uuidv4(),
      label: "Callout block",
      tagName: ["notice-block info", "notice-block warning", "notice-block tip"],
      isAllowed: false,
      type: "checkbox"
    }
  ],
  type3_lists: [
    {
      label: "To-do list",
      id: uuidv4(),
      tagName: ['checkbox_list'],
      isAllowed: false,
      type: "checkbox"
    },
    {
      label: "Bulleted list",
      id: uuidv4(),
      tagName: ['bullet_list'],
      isAllowed: false,
      type: "checkbox"
    },
    {
      label: "Numbered list",
      id: uuidv4(),
      tagName: ['ordered_list'],
      isAllowed: false,
      type: "checkbox"
    },
  ],
  type4_text: [
    {
      label: "Bold",
      id: uuidv4(),
      tagName: ["STRONG"],
      isAllowed: true,
      type: "checkbox"
    },
    {
      label: "Italic",
      id: uuidv4(),
      tagName: ["EM"],
      isAllowed: true,
      type: "checkbox"
    },
    {
      label: "Underline",
      id: uuidv4(),
      tagName: ["U"], isAllowed: false, type: "checkbox"
    },
    {
      label: "Strike",
      id: uuidv4(),
      tagName: ["DEL"],
      isAllowed: false, type: "checkbox"
    }
  ],
  type5_counter: [
    {
      label: "Words",
      id: uuidv4(),
      tagName: ["count_words"],
      isAllowed: true,
      type: "radio"
    },
    {
      label: "Symbols",
      id: uuidv4(),
      tagName: ["count_symbols"],
      isAllowed: false,
      type: "radio"
    }
  ]
};
