import {TDocument, TSetting} from "../../../types/types.ts";

export type TRecordList = {
  documents: TDocument[];
  settings: TSetting[];
  currentDocumentId: string;
  onDeleteClick: (id: string) => void;
  onCopyClick: (count: number) => void;
}