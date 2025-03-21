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

export type TTranslation = keyof typeof en;

export type TSetting = {
  id: string
  label: TTranslation,
  tagName: string[],
  isAllowed: boolean,
  type: HTMLInputTypeAttribute
}

export type TSettingList = {
  type1_strings: TSetting[],
  type2_blocks: TSetting[],
  type3_lists: TSetting[],
  type4_text: TSetting[],
  type5_counter: TSetting[]
}

export type TStorage = {
  settings: TSettingList,
  documents: TDocument[],
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