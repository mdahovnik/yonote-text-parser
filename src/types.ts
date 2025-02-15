export type TDocument = {
  id: string,
  time: string,
  title: string,
  words: number,
  symbols: number,
  raw: string,
}

export type TParsedData = {
  type: string,
  text: string[],
  nodePath: string,
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

