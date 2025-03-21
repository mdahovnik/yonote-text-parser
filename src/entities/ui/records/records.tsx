import {FC} from "react";
import {RecordItem} from "../record-item/record-item.tsx";
import style from "./records.module.css";
import {TRecordList} from "./type.ts";

export const Records: FC<TRecordList> = (
  {
    documents,
    currentDocumentId, onDeleteClick, onCopyClick,
    settings
  }) => {

  const isWordCountAllowed = settings.type5_counter.length > 0 && settings.type5_counter[0].isAllowed;
  return (
    <div className={style.recordsWrapper}>
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
