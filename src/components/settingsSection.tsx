import {TSetting, TSettingList} from "../types.ts";
import {OptionField} from "./optionField.tsx";

type TSettingsBlock = {
  title: string;
  settings: TSetting[];
  categorySettings: keyof TSettingList
  onSettingsChange: (key: keyof TSettingList, type: string) => void;
}

export function SettingsSection({title, settings, onSettingsChange, categorySettings}: TSettingsBlock) {
  return (
    <>
      <hr/>
      <div className="settings-title">{title}</div>
      <div className="settings-grid" id="settings-formatting">
        {settings.map((item, index) => (
          <OptionField setting={item}
                       key={index}
                       onSettingsChange={onSettingsChange}
                       categorySettings={categorySettings}/>
        ))}
      </div>
    </>
  )
}