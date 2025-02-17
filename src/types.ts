export type TextNodeData = {
  text: string,
  path: string
}

export type ParsedData = {
  nodeType: string,
  data: TextNodeData[],
  words: number,
  symbols: number,
  raw: string,
}

export type Document = {
  id: string,
  parsedData: ParsedData[],
  raw: string,
  symbols: number,
  time: string,
  title: string,
  words: number,
}

export type Setting = {
  name: string,
  title: string,
  checked: boolean
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
