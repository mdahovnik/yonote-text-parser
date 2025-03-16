import {HTMLAttributes} from "react";
import {TDocument} from "../../types.ts";

export interface IRecordItem extends HTMLAttributes<HTMLDivElement> {
  document: TDocument;
  isWordCountAllowed: boolean;
  currentDocumentId: string;
  onDeleteClick: (id: string) => void;
  onCopyClick: (count: number) => void;
}