import {FC,} from "react";
import {ISettingItem} from "./type.ts";
import style from "./setting-item.module.css";

export const SettingItem: FC<ISettingItem> = (
  {
    setting,
    onSettingsChange,
    categorySettings,
    ...props
  }) => (
  <label className={style.setting} {...props}>
    <input type={setting.type}
           checked={setting.isAllowed}
           onChange={() => {
             onSettingsChange(categorySettings, setting.label);
           }}/>
    {setting.label}
  </label>
)
