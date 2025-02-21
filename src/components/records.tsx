import {Setting, Document} from "../types.ts";
import {ButtonAction} from "./buttonAction.tsx";


type TRecordList = {
  data: Document[];
  settings: Setting[];
  documentId: string;
  onDeleteClick: (id: string) => void;
  onCopyClick: (count: number) => void;
}

export function Records(
  {
    data,
    documentId,
    onDeleteClick,
    onCopyClick,
    settings
  }: TRecordList) {
  return (
    <>
      <div id="records">
        <hr/>
        {
          data.map((item, index) => (
              <div className={"record"}
                   key={index}>
                <ButtonAction className={"record-remove danger"}
                              onClick={() => onDeleteClick(item.id)}
                              type={"remove"}/>
                <div className="title">
                  <span className={item.id === documentId ? "record opened" : "record"}>{item.title}</span>
                </div>
                <ButtonAction className={"record-counter"}
                              onClick={() => onCopyClick(settings[0].isAllowed ? item.words : item.symbols)}
                              type={"copy"}
                              text={`${settings[0].isAllowed ? item.words : item.symbols}`}/>
              </div>
            )
          )}
      </div>
    </>
  )
}
