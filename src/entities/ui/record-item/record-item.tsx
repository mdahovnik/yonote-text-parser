import {FC} from "react";
import {ActionButton} from "../action-button/action-button.tsx";
import {IRecordItem} from "./type.ts";
import style from "./record-item.module.css";
import {Icon} from "../../../constants/constants.ts";

export const RecordItem: FC<IRecordItem> = (
  {
    document,
    isWordCountAllowed,
    currentDocumentId,
    onDeleteClick,
    onCopyClick,
    ...props
  }) => {

  const className = document.id === currentDocumentId
    ? `${style.record} ${style.selected}`
    : `${style.record}`;

  return (
    <div className={className} {...props}>
      <ActionButton onClick={() => onDeleteClick(document.id)}
                    iconType={Icon.REMOVE}/>
      <div className={`${style.recordTitle}`}>
        <span>{props.children}</span>
      </div>
      <ActionButton className={className}
                    onClick={() => onCopyClick(isWordCountAllowed ? document.words : document.symbols)}
                    iconType={Icon.COPY}>
        {`${isWordCountAllowed ? document.words : document.symbols}`}
      </ActionButton>
    </div>
  )
}
