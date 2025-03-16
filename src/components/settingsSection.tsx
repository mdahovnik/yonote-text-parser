import {TSetting, TSettingList} from "../types.ts";
import {SettingItem} from "./settingItem.tsx";
import {FC} from "react";
import {Heading} from "./heading.tsx";
import {Separator} from "./separator.tsx";

type TSettingsBlock = {
  title: string;
  settings: TSetting[];
  categorySettings: keyof TSettingList
  onSettingsChange: (key: keyof TSettingList, type: string) => void;
}

export const SettingsSection: FC<TSettingsBlock> = ({title, settings, onSettingsChange, categorySettings}) => (
  <>
    <Separator/>
    <Heading level={3} className="settings-title">{title}</Heading>
    <div className="settings-grid">
      {settings.map((setting, index) => (
        <SettingItem setting={setting}
                     key={index}
                     onSettingsChange={onSettingsChange}
                     categorySettings={categorySettings}/>
      ))}
    </div>
  </>
)
