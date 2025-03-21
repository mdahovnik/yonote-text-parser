import {TDocument, TSettingList} from "../../../types/types.ts";

export type TRecordList = {
  documents: TDocument[];
  settings: TSettingList;
  currentDocumentId: string;
  onDeleteClick: (id: string) => void;
  onCopyClick: (count: number) => void;
}