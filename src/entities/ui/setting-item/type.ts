import {HTMLAttributes} from "react";
import {TSetting, TSettingList} from "../../../types/types.ts";

export interface ISettingItem extends HTMLAttributes<HTMLLabelElement> {
  setting: TSetting,
  onSettingsChange: (key: keyof TSettingList, type: string) => void;
  categorySettings: keyof TSettingList;
}