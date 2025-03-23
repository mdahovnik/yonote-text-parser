import {FC} from "react";
import {RecordItem} from "../record-item/record-item.tsx";
import style from "./records.module.css";
import {IRecordList} from "./type.ts";

export const Records: FC<IRecordList> = (
  {
    documents,
    currentDocumentId,
    onDeleteClick,
    onCopyClick,
    settings,
    ...props
  }) => {

  const isWordCountAllowed = settings.type5_counter.length > 0 && settings.type5_counter[0].isAllowed;
  return (
    <div className={style.recordsWrapper} {...props}>
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
