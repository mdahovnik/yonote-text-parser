import {TSetting, TSettingList} from "../types.ts";

type TOptionField = {
  setting: TSetting,
  onSettingsChange: (key: keyof TSettingList, type: string) => void;
  categorySettings: keyof TSettingList;
}

export function OptionField(
  {
    setting,
    onSettingsChange,
    categorySettings
  }: TOptionField) {
  return (
    <label className={'action setting'}>
      <input type={setting.type}
             checked={setting.isAllowed}
             onChange={() => {
               onSettingsChange(categorySettings, setting.label);
             }}/>
      {setting.label}
    </label>
  )
}