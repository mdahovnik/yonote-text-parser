import {Act} from "../constants/constants.ts";
import {HTMLInputTypeAttribute} from "react";
import en from "../locales/en/en.json" assert {type: "json"};

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
type TTranslation = keyof typeof en;

export type TSetting = {
  tagName: string[],
  label: TTranslation,
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
  action: keyof typeof Act;
  data: {
    id: string,
    newSettings?: TSettingList,
    words?: number,
    nodeTree?: TextNodeTree[],
    selectionText?: string
  }
}

export type TAppLanguage = 'en' | 'ru';