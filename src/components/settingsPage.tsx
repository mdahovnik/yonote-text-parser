import {TSettingList} from "../types.ts";
import {SettingsSection} from "./settingsSection.tsx";
import {Button} from "./button/button.tsx";
import {FC} from "react";
import {Heading} from "./heading.tsx";

type TSettingPage = {
  onBackButtonClick: () => void;
  onLanguageAppClick: () => void;
  onSettingsChange: (category: keyof TSettingList, type: string) => void;
  onCopyRawText: () => void
  settings: TSettingList;
}

export const SettingsPage: FC<TSettingPage> = (
  {
    onBackButtonClick,
    onLanguageAppClick,
    onSettingsChange,
    onCopyRawText,
    settings
  }) => (
  <div id="settings-page">
    <div className="menu">
      <Button onClick={onBackButtonClick}
              iconType={"back"}/>
      <Heading level={2}>Settings</Heading>
      <Button onClick={onLanguageAppClick}
              iconType={"lng"}>
        {"ru"}
      </Button>
    </div>
    <SettingsSection title={"Types of blocks to be counted:"}
                     settings={settings.block}
                     categorySettings={"block"}
                     onSettingsChange={onSettingsChange}/>
    <SettingsSection title={"Types of text style to be counted:"}
                     settings={settings.text}
                     categorySettings={"text"}
                     onSettingsChange={onSettingsChange}/>
    <SettingsSection title={"Counter type:"}
                     settings={settings.count}
                     categorySettings={"count"}
                     onSettingsChange={onSettingsChange}/>
    <hr/>
    <div className="setting-copy-rawtext">
      <Button onClick={onCopyRawText}
              iconType={"copy"}>
        {"Copy raw text"}
      </Button>
    </div>
  </div>
)