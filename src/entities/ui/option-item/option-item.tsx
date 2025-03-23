import {FC,} from "react";
import {IOptionItem} from "./type.ts";
import style from "./option-item.module.css";
import {useTranslation} from "react-i18next";

export const OptionItem: FC<IOptionItem> = ({setting, onOptionChangeClick, categorySettings, ...props}) => {
  const {t} = useTranslation();
  return (
    <label className={style.setting} {...props}>
      <input type={setting.type}
             checked={setting.isAllowed}
             onChange={() => {
               onOptionChangeClick(categorySettings, setting.label);
             }}/>
      {t(setting.label)}
    </label>
  )
}
