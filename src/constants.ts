// import {TSetting} from "./types.ts";

import {SettingList} from "./types.ts";

export const ACT = {
  GET_DOCUMENT: 'GET_DOCUMENT',
  GET_RECORDS: 'GET_RECORDS',
  SAVE_DOCUMENT: 'SAVE_DOCUMENT',
  SAVE_SETTINGS: 'SAVE_SETTINGS'
}

// export const blockTypeSettings: TSetting[] = [
//   {type: "block", name: "allow_title", title: "Page title", checked: false},
//   {type: "block", name: "allow_quote", title: "Quote block", checked: false},
//   {type: "block", name: "allow_text", title: "Text block", checked: false},
//   {type: "block", name: "allow_callout", title: "Callout block", checked: false},
//   {type: "block", name: "allow_h1", title: "Heading 1", checked: false},
//   {type: "block", name: "allow_toggle_h1_title", title: "H1 title", checked: false},
//   {type: "block", name: "allow_h2", title: "Heading 2", checked: false},
//   {type: "block", name: "allow_toggle_h1_content", title: "H1 content", checked: false},
//   {type: "block", name: "allow_h3", title: "Heading 3", checked: false},
//   {type: "block", name: "allow_toggle_h2_title", title: "H2 title", checked: false},
//   {type: "block", name: "allow_to_do", title: "To-do list", checked: false},
//   {type: "block", name: "allow_toggle_h2_content", title: "H2 content", checked: false},
//   {type: "block", name: "allow_bulleted_list", title: "Bulleted list", checked: false},
//   {type: "block", name: "allow_toggle_h3_title", title: "H3 title", checked: false},
//   {type: "block", name: "allow_numbered_list", title: "Numbered list", checked: false},
//   {type: "block", name: "allow_toggle_h3_content", title: "H3 content", checked: false},
//   {type: "block", name: "allow_toggle_title", title: "Title", checked: false},
//   {type: "block", name: "allow_column", title: "Columns", checked: false},
//   {type: "block", name: "allow_toggle_content", title: "Content", checked: false},
//   {type: "block", name: "allow_table", title: "Table", checked: false},
//   {type: "block", name: "allow_code", title: "Code block", checked: false}
// ];
//
// export const textTypeSettings: TSetting[] = [
//   {type: "text", name: "allow_formatting_bold", title: "Bold", checked: false},
//   {type: "text", name: "allow_formatting_italic", title: "Italic", checked: false},
//   {type: "text", name: "allow_formatting_underline", title: "Underline", checked: false},
//   {type: "text", name: "allow_formatting_strike", title: "Strike", checked: false},
//   {type: "text", name: "allow_formatting_code", title: "Code", checked: false},
// ]
//
// export const countTypeSettings: TSetting[] = [
//   {type: "count", name: "count_words", title: "Words", checked: true},
//   {type: "count", name: "count_symbols", title: "Symbols", checked: false},
// ]


// export const appSettings: TSetting[] = [
//   {type: "block", name: "allow_title", title: "Page title", checked: false},
//   {type: "block", name: "allow_quote", title: "Quote block", checked: false},
//   {type: "block", name: "allow_text", title: "Text block", checked: false},
//   {type: "block", name: "allow_callout", title: "Callout block", checked: false},
//   {type: "block", name: "allow_h1", title: "Heading 1", checked: false},
//   {type: "block", name: "allow_toggle_h1_title", title: "H1 title", checked: false},
//   {type: "block", name: "allow_h2", title: "Heading 2", checked: false},
//   {type: "block", name: "allow_toggle_h1_content", title: "H1 content", checked: false},
//   {type: "block", name: "allow_h3", title: "Heading 3", checked: false},
//   {type: "block", name: "allow_toggle_h2_title", title: "H2 title", checked: false},
//   {type: "block", name: "allow_to_do", title: "To-do list", checked: false},
//   {type: "block", name: "allow_toggle_h2_content", title: "H2 content", checked: false},
//   {type: "block", name: "allow_bulleted_list", title: "Bulleted list", checked: false},
//   {type: "block", name: "allow_toggle_h3_title", title: "H3 title", checked: false},
//   {type: "block", name: "allow_numbered_list", title: "Numbered list", checked: false},
//   {type: "block", name: "allow_toggle_h3_content", title: "H3 content", checked: false},
//   {type: "block", name: "allow_toggle_title", title: "Title", checked: false},
//   {type: "block", name: "allow_column", title: "Columns", checked: false},
//   {type: "block", name: "allow_toggle_content", title: "Content", checked: false},
//   {type: "block", name: "allow_table", title: "Table", checked: false},
//   {type: "block", name: "allow_code", title: "Code block", checked: false},
//   {type: "text", name: "allow_formatting_bold", title: "Bold", checked: false},
//   {type: "text", name: "allow_formatting_italic", title: "Italic", checked: false},
//   {type: "text", name: "allow_formatting_underline", title: "Underline", checked: false},
//   {type: "text", name: "allow_formatting_strike", title: "Strike", checked: false},
//   {type: "text", name: "allow_formatting_code", title: "Code", checked: false},
//   {type: "count", name: "count_words", title: "Words", checked: true},
//   {type: "count", name: "count_symbols", title: "Symbols", checked: false},
// ]


export const appSettings: SettingList = {
  block: [
    {tagName: "allow_title", label: "Page title", isAllowed: false},
    {tagName: "allow_quote", label: "Quote block", isAllowed: false},
    {tagName: "allow_text", label: "Text block", isAllowed: false},
    {tagName: "allow_callout", label: "Callout block", isAllowed: false},
    {tagName: "allow_h1", label: "Heading 1", isAllowed: true},
    {tagName: "allow_toggle_h1_title", label: "H1 title", isAllowed: false},
    {tagName: "allow_h2", label: "Heading 2", isAllowed: false},
    {tagName: "allow_toggle_h1_content", label: "H1 content", isAllowed: false},
    {tagName: "allow_h3", label: "Heading 3", isAllowed: false},
    {tagName: "allow_toggle_h2_title", label: "H2 title", isAllowed: false},
    {tagName: "allow_to_do", label: "To-do list", isAllowed: false},
    {tagName: "allow_toggle_h2_content", label: "H2 content", isAllowed: false},
    {tagName: "allow_bulleted_list", label: "Bulleted list", isAllowed: false},
    {tagName: "allow_toggle_h3_title", label: "H3 title", isAllowed: false},
    {tagName: "allow_numbered_list", label: "Numbered list", isAllowed: false},
    {tagName: "allow_toggle_h3_content", label: "H3 content", isAllowed: false},
    {tagName: "allow_toggle_title", label: "Title", isAllowed: false},
    {tagName: "allow_column", label: "Columns", isAllowed: false},
    {tagName: "allow_toggle_content", label: "Content", isAllowed: false},
    {tagName: "allow_table", label: "Table", isAllowed: false},
    {tagName: "allow_code", label: "Code block", isAllowed: false},
  ],
  text: [
    {tagName: "allow_formatting_bold", label: "Bold", isAllowed: false},
    {tagName: "allow_formatting_italic", label: "Italic", isAllowed: false},
    {tagName: "allow_formatting_underline", label: "Underline", isAllowed: false},
    {tagName: "allow_formatting_strike", label: "Strike", isAllowed: false},
    {tagName: "allow_formatting_code", label: "Code", isAllowed: false},
  ],
  count: [
    {tagName: "count_words", label: "Words", isAllowed: true},
    {tagName: "count_symbols", label: "Symbols", isAllowed: false},
  ]
}
