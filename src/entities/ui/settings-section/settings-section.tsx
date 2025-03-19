import {SettingItem} from "../setting-item/setting-item.tsx";
import {FC} from "react";
import {Heading} from "../../../shared/ui/heading/heading.tsx";
import {TSettingsBlock} from "./type.ts";
import style from "./settings-section.module.css"

export const SettingsSection: FC<TSettingsBlock> = ({title, settings, onSettingsChange, categorySettings}) => (
  <>
    <Heading level={3}
             className={style.settingsSectionTitle}>
      {title}
    </Heading>
    <div className={style.settingsSectionGrid}>
      {settings.map((setting, index) => (
        <SettingItem setting={setting}
                     key={index}
                     onSettingsChange={onSettingsChange}
                     categorySettings={categorySettings}/>
      ))}
    </div>
  </>
)
