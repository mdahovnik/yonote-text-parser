export type TDocument = {
  id: string,
  time: string,
  title: string,
  words: number,
  symbols: number,
  raw: string,
}

export type TSetting = {
  name: string,
  type: string,
  title: string,
  checked: boolean,
}

export type TStorage = {
  documents: TDocument[],
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


