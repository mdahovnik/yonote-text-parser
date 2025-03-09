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

  const isWordCountAllowed = settings.length > 0 && settings[0].isAllowed;

  return (
    <div id="records">
      <hr/>
      {data.map((item) => (
        <div className={"record"}
             key={item.id}>
          <Button className={"record-remove danger"}
                  onClick={() => onDeleteClick(item.id)}
                  type={"remove"}/>
          <div className="title">
                  <span className={item.id === documentId ? "record opened" : "record"}>
                    {item.title}
                  </span>
          </div>
          <Button className={"record-counter"}
                  onClick={() => onCopyClick(isWordCountAllowed ? item.words : item.symbols)}
                  type={"copy"}
                  text={`${isWordCountAllowed ? item.words : item.symbols}`}/>
        </div>
      ))}
    </div>
  )
}
