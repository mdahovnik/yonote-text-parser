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

export type Document = {
  id: string,
  parsedData: Record<string, string>,
  raw: string,
  symbols: number,
  time: string,
  title: string,
  words: number,
}

export type Setting = {
  tagName: string,
  label: string,
  isSelected: boolean
}

export type SettingList = {
  block: Setting[],
  text: Setting[],
  count: Setting[]
}

export type Storage = {
  documents: Document[],
  settings: SettingList
}

export type TextNodeTree = {
  tag: string;
  words: {
    word: string;
    tags: string[];
  }[];
  children: TextNodeTree[];
}
