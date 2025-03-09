// export type TextNodeData = {
//   text: string,
//   path: string
// }
//
// export type ParsedData = {
//   nodeType: string,
//   data: TextNodeData[],
//   words: number,
//   symbols: number,
//   raw: string,
// }

import {ACT} from "./constants.ts";
import {HTMLInputTypeAttribute} from "react";

export type TDocument = {
  id: string,
  parsedData: Record<string, string>,
  settings: string[],
  raw: string,
  symbols: number,
  time: string,
  title: string,
  words: number,
}

export type TSetting = {
  tagName: string[],
  label: string,
  isAllowed: boolean,
  type: HTMLInputTypeAttribute
}

export type TSettingList = {
  block: TSetting[],
  text: TSetting[],
  count: TSetting[]
}

export type TStorage = {
  documents: TDocument[],
  settings: TSettingList,
  cache: {
    currentDocumentId: string
    nodesTreeCache: TextNodeTree[]
  }
}

export type TextNodeTree = {
  tag: string;
  words: {
    word: string;
    tags: string[];
  }[];
  children: TextNodeTree[];
}

export type TMessage = {
  action: keyof typeof ACT;
  data: {
    id: string,
    newSettings?: TSettingList,
    words?: number,
    nodeTree?: TextNodeTree[],
    selectionText?: string
  }
}