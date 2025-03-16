import {FC, HTMLAttributes} from "react";
import {Button} from "./button/button.tsx";
import {TDocument} from "../types.ts";

interface IRecordItem extends HTMLAttributes<HTMLDivElement> {
  document: TDocument;
  isWordCountAllowed: boolean;
  currentDocumentId: string;
  onDeleteClick: (id: string) => void;
  onCopyClick: (count: number) => void;
}

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
    <div className={document.id === currentDocumentId ? "record selected" : "record"} {...props}>
      <Button className={"danger"}
              onClick={() => onDeleteClick(document.id)}
              iconType={"remove"}/>
      <div className={`record-title ${className}`}>
        <span>{props.children}</span>
      </div>
      <Button className={"record-counter"}
              onClick={() => onCopyClick(isWordCountAllowed ? document.words : document.symbols)}
              iconType={"copy"}>
        {`${isWordCountAllowed ? document.words : document.symbols}`}
      </Button>
    </div>
  )
}
