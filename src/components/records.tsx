import {TSetting, TDocument} from "../types.ts";
import {Button} from "./button.tsx";


type TRecordList = {
  data: TDocument[];
  settings: TSetting[];
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
          data.map((item, index) => {
              return (<div className={"record"}
                           key={index}>
                  <Button className={"record-remove danger"}
                          onClick={() => onDeleteClick(item.id)}
                          type={"remove"}/>
                  <div className="title">
                    <span className={item.id === documentId ? "record opened" : "record"}>{item.title}</span>
                  </div>
                  <Button className={"record-counter"}
                          onClick={() => onCopyClick(settings[0].isAllowed ? item.words : item.symbols)}
                          type={"copy"}
                          text={`${settings[0].isAllowed ? item.words : item.symbols}`}/>
                </div>
              )
            }
          )}
      </div>
    </>
  )
}
