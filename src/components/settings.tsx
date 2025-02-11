import {TSetting} from "../types.ts";
import {HTMLInputTypeAttribute} from "react";

type TSettingsBlock = {
  type: HTMLInputTypeAttribute;
  title: string;
  settings: TSetting[];
  onSettingsChanged: (type: string) => void;
}

export function Settings({type, title, settings, onSettingsChanged}: TSettingsBlock) {
  return (
    <>
      <hr/>
      <div className="settings-title">
        {title}
      </div>
      <div className="settings-grid"
           id="settings-formatting">
        {settings.map((item, index) => (
          <div key={index}>
            <input className={item.type}
                   type={type}
                   value={type}
                   checked={item.checked}
                   onChange={() => {
                     console.log(item.title, item.checked)
                     onSettingsChanged(item.title)}}/>
            <label>
              {item.title}
            </label>
          </div>
        ))}
      </div>
    </>
  )
}