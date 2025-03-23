import {TDocument, TSettingList} from "../../../types/types.ts";
import {HTMLAttributes} from "react";

export interface IRecordList extends HTMLAttributes<HTMLDivElement> {
  documents: TDocument[];
  settings: TSettingList;
  currentDocumentId: string;
  onDeleteClick: (id: string) => void;
  onCopyClick: (count: number) => void;
}