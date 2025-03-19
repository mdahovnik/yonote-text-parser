import {FC,} from "react";
import {ISettingItem} from "./type.ts";
import style from "./setting-item.module.css";
import {useTranslation} from "react-i18next";

export const SettingItem: FC<ISettingItem> = (
  {
    setting,
    onSettingsChange,
    categorySettings,
    ...props
  }) => {
  const {t} = useTranslation();
  return (
    <label className={style.setting} {...props}>
      <input type={setting.type}
             checked={setting.isAllowed}
             onChange={() => {
               onSettingsChange(categorySettings, setting.label);
             }}/>
      {t(setting.label)}
    </label>
  )
}
