import {SettingList} from "../types.ts";
import {Settings} from "./settings.tsx";
import {ButtonAction} from "./buttonAction.tsx";

type TSettingPage = {
  onBackButtonClick: () => void;
  onSettingsChange: (category: keyof SettingList, type: string) => void;
  settings: SettingList;
}

export function SettingsPage(
  {
    onBackButtonClick,
    onSettingsChange,
    settings
  }: TSettingPage) {

  //TODO: реализовать копирование настроек
  const onCopyHandler = () => {
  }

  return (
    <div id="settings-page">
      <div className="menu">
        <ButtonAction onClick={onBackButtonClick}
                      id={"to-main"}
                      type={"back"}/>
        <div className="title">Settings</div>
        <div/>
      </div>
      <Settings type={"checkbox"}
                title={"Types of blocks to be counted:"}
                settings={settings.block}
                categorySettings={"block"}
                onSettingsChange={onSettingsChange}/>
      <Settings type={"checkbox"}
                title={"Types of text style to be counted:"}
                settings={settings.text}
                categorySettings={"text"}
                onSettingsChange={onSettingsChange}/>
      <Settings type={"radio"}
                title={"Counter type:"}
                settings={settings.count}
                categorySettings={"count"}
                onSettingsChange={onSettingsChange}/>
      <hr/>
      <ButtonAction onClick={onCopyHandler}
                    id={"debug"}
                    type={"copy"}
                    text={"Copy raw text to check your settings"}/>
    </div>
  )
}