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
            <input className={item.name}
                   type={type}
                   value={type}
                   checked={item.checked}
                   onChange={() => {
                     onSettingsChanged(item.title)
                   }}/>
            <label>
              {item.title}
            </label>
          </div>
        ))}
      </div>
    </>
  )
}