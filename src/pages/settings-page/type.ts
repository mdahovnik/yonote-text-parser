import {TSettingList} from "../../types/types.ts";

export type TSettingPage = {
  onBackButtonClick: () => void;
  onSettingChangeClick: (category: keyof TSettingList, type: string) => void;
  settings: TSettingList;
}
