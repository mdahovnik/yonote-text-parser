export type TDocument = {
  id: string,
  time: string,
  title: string,
  words: number,
  symbols: number,
  raw: string,
}

export type TSetting = {
  type: string,
  title: string,
  checked: boolean,
}

export type TStorage = {
  records: TDocument[],
  blockTypeSettings: TSetting[],
  textTypeSettings: TSetting[],
  countTypeSettings: TSetting[]
}

export type TParsedData = {
  text: string,
  nodePath: string,
  words: number,
  symbols: number
}


