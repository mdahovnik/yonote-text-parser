import {TSetting, TDocument} from "../types.ts";
import {ButtonAction} from "./buttonAction.tsx";


type TRecordList = {
  data: TDocument[];
  countTypeSettings: TSetting[];
}

export function Records({data, countTypeSettings}: TRecordList) {
  return (
    <>
      <div id="records">
        <hr/>
        {
          data.map((item, index) => (
              // Object.entries(item).map(([tabUrl, details]) => (
              <div className="record"
                   key={index}>
                <ButtonAction className={"record-remove danger"}
                              onClick={() => {
                              }}
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
              // ))
            )
          )}
      </div>
    </>
  )
}
