import {Setting, Document} from "../types.ts";
import {ButtonAction} from "./buttonAction.tsx";


type TRecordList = {
  data: Document[];
  countTypeSettings: Setting[];
  onDeleteClick: (id: string) => void;
}

export function Records(
  {
    data,
    onDeleteClick,
    countTypeSettings
  }: TRecordList) {
  return (
    <>
      <div id="records">
        <hr/>
        {
          data.map((item, index) => (
              <div className="record"
                   key={index}>
                <ButtonAction className={"record-remove danger"}
                              onClick={() => onDeleteClick(item.id)}
                              type={"remove"}/>
                <div className="title">
                  <span className="record title">{item.title}</span>
                </div>
                <ButtonAction className={"record-counter"}
                              onClick={() => {
                              }}
                              type={"copy"}
                              text={`${countTypeSettings[0].checked ? item.words : item.symbols}`}/>
              </div>
            )
          )}
      </div>
    </>
  )
}
