import {TDocument, TSettingList} from "../../types.ts";

export type TMainPage = {
  isValidPageOpen: boolean;
  documents: TDocument[];
  currentDocumentId: string;
  settings: TSettingList;
  onSettingClick: () => void;
  onPlusClick: () => void;
  onClearClick: () => void;
  onDeleteClick: (id: string) => void;
}