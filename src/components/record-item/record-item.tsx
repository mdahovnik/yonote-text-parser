import {FC} from "react";
import {Button} from "../button/button.tsx";
import {IRecordItem} from "./type.ts";
import style from "./record-item.module.css";

export const RecordItem: FC<IRecordItem> = (
  {
    className,
    document,
    isWordCountAllowed,
    currentDocumentId,
    onDeleteClick,
    onCopyClick,
    ...props
  }) => {
  return (
    <div className={document.id === currentDocumentId
      ? `${style.record} ${style.selected}`
      : `${style.record}`} {...props}>
      <Button onClick={() => onDeleteClick(document.id)}
              iconType={"remove"}/>
      <div className={`${style.recordTitle} ${className}`}>
        <span>{props.children}</span>
      </div>
      <Button onClick={() => onCopyClick(isWordCountAllowed ? document.words : document.symbols)}
              iconType={"copy"}>
        {`${isWordCountAllowed ? document.words : document.symbols}`}
      </Button>
    </div>
  )
}
