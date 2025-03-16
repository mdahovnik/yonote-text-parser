import {TSetting, TSettingList} from "../../types.ts";

export type TSettingsBlock = {
  title: string;
  settings: TSetting[];
  categorySettings: keyof TSettingList
  onSettingsChange: (key: keyof TSettingList, type: string) => void;
}