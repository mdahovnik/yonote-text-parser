import {TSettingList} from "../../../types/types.ts";

export type TOptions = {
  settings: TSettingList;//TSetting[];
  // categorySettings: keyof TSettingList
  onOptionChangeClick: (key: keyof TSettingList, type: string) => void;
}