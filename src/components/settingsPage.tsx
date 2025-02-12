import {TSetting} from "../types.ts";
import {Settings} from "./settings.tsx";
import {ButtonAction} from "./buttonAction.tsx";

type TSettingPage = {
  onSettingClick: (isVisible: boolean) => void;
  blockSettings: TSetting[];
  onBlockTypeChange: (type: string) => void;
  textTypesSettings: TSetting[];
  onTextTypeChange: (type: string) => void;
  countTypeSettings: TSetting[];
  onCountTypeChange: (type: string) => void;
}

export function SettingsPage(
  {
    onSettingClick,
    blockSettings,
    onBlockTypeChange,
    textTypesSettings,
    onTextTypeChange,
    countTypeSettings,
    onCountTypeChange
  }: TSettingPage) {

  const onClickHandler = () => {
    onSettingClick(false);
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
                onSettingsChanged={onBlockTypeChange}/>
      <Settings type={"checkbox"}
                title={"Types of text style to be counted:"}
                settings={textTypesSettings}
                onSettingsChanged={onTextTypeChange}/>
      <Settings type={"radio"}
                title={"Counter type:"}
                settings={countTypeSettings}
                onSettingsChanged={onCountTypeChange}/>
      <hr/>
      <ButtonAction onClick={onCopyHandler}
                    id={"debug"}
                    type={"copy"}
                    text={"Copy raw text to check your settings"}/>
    </div>
  )
}