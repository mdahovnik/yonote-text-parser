import {Setting, SettingList} from "../types.ts";
import {HTMLInputTypeAttribute} from "react";

type TSettingsBlock = {
  type: HTMLInputTypeAttribute;
  title: string;
  settings: Setting[];
  categorySettings: keyof SettingList
  onSettingsChange: (key: keyof SettingList, type: string) => void;
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
            <div key={index}>
              <input className={item.name}
                     type={type}
                     checked={item.checked}
                     onChange={() => {
                       onSettingsChange(categorySettings, item.title)
                     }}/>
              <label>
                {item.title}
              </label>
            </div>
          )
        })}
      </div>
    </>
  )
}