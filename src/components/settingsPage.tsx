import {TSettingList} from "../types.ts";
import {SettingsSection} from "./settingsSection.tsx";
import {Button} from "./button.tsx";

type TSettingPage = {
  onBackButtonClick: () => void;
  onSettingsChange: (category: keyof TSettingList, type: string) => void;
  onCopyRawText: () => void
  settings: TSettingList;
}

export function SettingsPage(
  {
    onBackButtonClick,
    onSettingsChange,
    onCopyRawText,
    settings
  }: TSettingPage) {

  return (
    <div id="settings-page">
      <div className="menu">
        <Button onClick={onBackButtonClick}
                id={"to-main"}
                type={"back"}/>
        <div className="title">Settings</div>
        <div/>
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
                id={"debug"}
                type={"copy"}
                text={"Copy raw text"}/>
      </div>
    </div>
  )
}