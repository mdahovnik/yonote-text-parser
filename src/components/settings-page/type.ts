import {TSettingList} from "../../types.ts";

export type TSettingPage = {
  onBackButtonClick: () => void;
  onLanguageAppClick: () => void;
  onSettingChangeClick: (category: keyof TSettingList, type: string) => void;
  onCopyRawTextClick: () => void
  settings: TSettingList;
}
