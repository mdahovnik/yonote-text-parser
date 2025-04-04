import {TDocument, TSettingList} from "../../types/types.ts";

export type TMainPage = {
  isValidPageOpen: boolean;
  documents: TDocument[];
  currentDocumentId: string;
  settings: TSettingList;
  onSettingClick: () => void;
  onPlusClick: () => void;
  onAllClearClick: () => void;
  onDeleteClick: (id: string) => void;
  onCopyRawTextClick: () => void;
}