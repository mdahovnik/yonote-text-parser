import {HTMLAttributes} from "react";
import {TSetting, TSettingList} from "../../../types/types.ts";

export interface IOptionItem extends HTMLAttributes<HTMLLabelElement> {
  setting: TSetting,
  onOptionChangeClick: (key: keyof TSettingList, type: string) => void;
  categorySettings: keyof TSettingList;
}