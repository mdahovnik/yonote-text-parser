import {TSetting} from "../types.ts";
import {Dispatch, SetStateAction} from "react";
import {Settings} from "./settings.tsx";
import {ButtonAction} from "./buttonAction.tsx";

type TSettingPage = {
  onSettingClick: (isVisible: boolean) => void;
  blockSettings: TSetting[];
  setBlockSettings: Dispatch<SetStateAction<TSetting[]>>;
  textTypesSettings: TSetting[];
  setTextTypesSettings: Dispatch<SetStateAction<TSetting[]>>;
  countTypeSettings: TSetting[];
  setCountTypeSettings: Dispatch<SetStateAction<TSetting[]>>;
}

export function SettingsPage(
  {
    onSettingClick,
    blockSettings,
    setBlockSettings,
    textTypesSettings,
    setTextTypesSettings,
    countTypeSettings,
    setCountTypeSettings
  }: TSettingPage) {
  const onClickHandler = () => {
    onSettingClick(false);
  }

  const onTextTypesSettingsChanged = (type: string) => {
    const elements = textTypesSettings.map((item) => item.title === type
      ? {...item, checked: !item.checked}
      : {...item});
    setTextTypesSettings(elements)
  }

  const onBlockSettingsChanged = (type: string) => {
    const newState = blockSettings.map((item) => item.title === type
      ? {...item, checked: !item.checked}
      : {...item});
    setBlockSettings(newState)
  }

  const onCountTypeSettingsChanged = (type: string) => {
    const newState = countTypeSettings.map((item) => {
      return {...item, checked: item.title === type}
    });
    setCountTypeSettings(newState);
  }
  //TODO: реализовать копирование настроек
  const onCopyHandler = () => {
  }

  return (
    <div id="settings-page">
      <div className="menu">
        <ButtonAction onClick={onClickHandler}
                      id={"to-main"}
                      type={"back"}/>
        <div className="title">Settings</div>
        <div/>
      </div>
      <Settings type={"checkbox"}
                title={"Types of blocks to be counted:"}
                settings={blockSettings}
                onSettingsChanged={onBlockSettingsChanged}/>
      <Settings type={"checkbox"}
                title={"Types of text style to be counted:"}
                settings={textTypesSettings}
                onSettingsChanged={onTextTypesSettingsChanged}/>
      <Settings type={"radio"}
                title={"Counter type:"}
                settings={countTypeSettings}
                onSettingsChanged={onCountTypeSettingsChanged}/>
      <hr/>
      <ButtonAction onClick={onCopyHandler}
                    id={"debug"}
                    type={"copy"}
                    text={"Copy raw text to check your settings"}/>
    </div>
  )
}