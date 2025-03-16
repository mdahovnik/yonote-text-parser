import {TSetting, TDocument} from "../types.ts";
import {FC} from "react";
import {RecordItem} from "./recordItem.tsx";

type TRecordList = {
  documents: TDocument[];
  settings: TSetting[];
  currentDocumentId: string;
  onDeleteClick: (id: string) => void;
  onCopyClick: (count: number) => void;
}

export const Records: FC<TRecordList> = (
  {
    documents,
    currentDocumentId, onDeleteClick, onCopyClick,
    settings
  }) => {

  const isWordCountAllowed = settings.length > 0 && settings[0].isAllowed;
  return (
    <div className={"records-wrapper"}>
      {documents.map((document) => (
        <RecordItem key={document.id}
                    document={document}
                    onDeleteClick={onDeleteClick}
                    onCopyClick={onCopyClick}
                    isWordCountAllowed={isWordCountAllowed}
                    currentDocumentId={currentDocumentId}>
          {document.title}
        </RecordItem>
      ))}
    </div>
  )
}
