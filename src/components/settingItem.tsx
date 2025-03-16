import {TSetting, TSettingList} from "../types.ts";
import {FC, HTMLAttributes} from "react";

interface ISettingItem extends HTMLAttributes<HTMLLabelElement> {
  setting: TSetting,
  onSettingsChange: (key: keyof TSettingList, type: string) => void;
  categorySettings: keyof TSettingList;
}

export const SettingItem: FC<ISettingItem> = (
  {
    setting,
    onSettingsChange,
    categorySettings,
    ...props
  }) => (
  <label className={'setting'} {...props}>
    <input type={setting.type}
           checked={setting.isAllowed}
           onChange={() => {
             onSettingsChange(categorySettings, setting.label);
           }}/>
    {setting.label}
  </label>
)
