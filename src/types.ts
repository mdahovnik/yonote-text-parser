export type TDocument = {
  id: string,
  time: string,
  title: string,
  words: number,
  symbols: number,
  rawString: string,
}

export type TParsedData = {
  nodeType: string,
  data: TData[],
  // nodePath: string,
  words: number,
  symbols: number,
  raw: string,
}

export type TSetting = {
  name: string,
  title: string,
  checked: boolean
}

export type TSettingList = {
  block: TSetting[],
  text: TSetting[],
  count: TSetting[]
}

export type TStorage = {
  documents: TDocument[],
  settings: TSettingList
}
export type TData = {
  text: string,
  path: string
}
