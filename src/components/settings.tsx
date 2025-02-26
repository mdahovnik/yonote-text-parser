import {TSetting, TSettingList} from "../types.ts";
import {HTMLInputTypeAttribute} from "react";

type TSettingsBlock = {
  type: HTMLInputTypeAttribute;
  title: string;
  settings: TSetting[];
  categorySettings: keyof TSettingList
  onSettingsChange: (key: keyof TSettingList, type: string) => void;
}

export function Settings(
  {
    type,
    title,
    settings,
    onSettingsChange,
    categorySettings
  }: TSettingsBlock) {
  return (
    <>
      <hr/>
      <div className="settings-title">
        {title}
      </div>
      <div className="settings-grid"
           id="settings-formatting">
        {settings.map((item, index) => {
          return (
            <div key={index} className={'action setting'} >
              <input className={item.tagName[0]}
                     id={item.label}
                     type={type}
                     checked={item.isAllowed}
                     onChange={() => {
                       onSettingsChange(categorySettings, item.label);
                     }}/>
              <label htmlFor={item.label}>
                {item.label}
              </label>
            </div>
          )
        })}
      </div>
    </>
  )
}