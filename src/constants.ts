import {TSetting} from "./types.ts";

export const ACT = {
  GET_DOCUMENT: 'GET_DOCUMENT',
  GET_RECORDS: 'GET_RECORDS',
  SAVE_DOCUMENT: 'SAVE_DOCUMENT',
  SAVE_SETTINGS: 'SAVE_SETTINGS'
}

export const blockTypeSettings: TSetting[] = [
  {type: "allow_title", title: "Page title", checked: true},
  {type: "allow_quote", title: "Quote block", checked: false},
  {type: "allow_text", title: "Text block", checked: false},
  {type: "allow_callout", title: "Callout block", checked: false},
  {type: "allow_h1", title: "Heading 1", checked: true},
  {type: "allow_toggle_h1_title", title: "H1 title", checked: false},
  {type: "allow_h2", title: "Heading 2", checked: true},
  {type: "allow_toggle_h1_content", title: "H1 content", checked: false},
  {type: "allow_h3", title: "Heading 3", checked: true},
  {type: "allow_toggle_h2_title", title: "H2 title", checked: false},
  {type: "allow_to_do", title: "To-do list", checked: false},
  {type: "allow_toggle_h2_content", title: "H2 content", checked: false},
  {type: "allow_bulleted_list", title: "Bulleted list", checked: false},
  {type: "allow_toggle_h3_title", title: "H3 title", checked: false},
  {type: "allow_numbered_list", title: "Numbered list", checked: false},
  {type: "allow_toggle_h3_content", title: "H3 content", checked: false},
  {type: "allow_toggle_title", title: "Title", checked: false},
  {type: "allow_column", title: "Columns", checked: false},
  {type: "allow_toggle_content", title: "Content", checked: false},
  {type: "allow_table", title: "Table", checked: false},
  {type: "allow_code", title: "Code block", checked: false}
];

export const textTypeSettings: TSetting[] = [
  {type: "allow_formatting_bold", title: "Bold", checked: false},
  {type: "allow_formatting_italic", title: "Italic", checked: false},
  {type: "allow_formatting_underline", title: "Underline", checked: false},
  {type: "allow_formatting_strike", title: "Strike", checked: false},
  {type: "allow_formatting_code", title: "Code", checked: false},
]

export const countTypeSettings: TSetting[] = [
  {type: "count_words", title: "Words", checked: true},
  {type: "count_symbols", title: "Symbols", checked: false},
]
