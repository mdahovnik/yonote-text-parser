import {TStorage} from "../types.ts";
import {ButtonAction} from "./buttonAction.tsx";


type TRecordList = {
  data: TStorage[];
}

export function RecordList({data}: TRecordList) {
  return (
    <>
      <div id="records">
        {data.map((item, index) => (
            // Object.entries(item).map(([tabUrl, details]) => (
            <div className="record ${sel}" key={index}>
              <ButtonAction
                className={"record-remove"}
                onClick={() => {
                }}
                type={"remove"}/>
              {/*<div className="title">*/}
              <span className="title">{item.title}</span>
              {/*</div>*/}

              <ButtonAction
                className={"record-counter"}
                onClick={() => {
                }}
                type={"copy"}
                text={`W: ${item.words}`}/>
              <ButtonAction
                className={"record-counter"}
                onClick={() => {
                }}
                type={"copy"}
                text={`S: ${item.symbols}`}/>
            </div>
            // ))
          )
        )}
      </div>
      <hr style={{fontSize: "1px", width: 100}}/>
    </>
  )
}
