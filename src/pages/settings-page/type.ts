import {TSettingList} from "../../types/types.ts";

export type TSettingPage = {
  onBackButtonClick: () => void;
  onOptionChangeClick: (category: keyof TSettingList, type: string) => void;
  settings: TSettingList;
}
