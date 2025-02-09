import {TStorage} from "../types.ts";
import {ButtonAction} from "./buttonAction.tsx";


type TRecordList = {
  data: TStorage[];
}

export function Records({data}: TRecordList) {
  return (
    <>
      <div id="records">
        <hr/>
        {data.map((item, index) => (
            // Object.entries(item).map(([tabUrl, details]) => (
            <div className="record"
                 key={index}>
              <ButtonAction className={"record-remove danger"}
                            onClick={() => {
                            }}
                            type={"remove"}/>
              <div className="title">
                <span className="record">
                  {item.title}
                </span>
              </div>
              <ButtonAction className={"record-counter"}
                            onClick={() => {
                            }}
                            type={"copy"}
                            text={`${item.words}`}/>
            </div>
            // ))
          )
        )}
      </div>
    </>
  )
}
