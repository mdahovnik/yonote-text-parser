import {ButtonAction} from "./buttonAction.tsx";
import {TStorage} from "../types.ts";
import {RecordList} from "./records.tsx";

type TMainPage = {
  onSettingClick: (isVisible: boolean) => void;
  onPlusClick: () => void;
  data: TStorage[];
  // records: TRecord[];
  isActive: boolean;
}

export function MainPage(
  {
    onSettingClick,
    data,
    onPlusClick,
    isActive
  }: TMainPage) {

  const onSettingClickHandler = () => {
    onSettingClick(true);
  }

  const onPlusClickHandler = () => {
    onPlusClick();
  }

  const onClearClickHandler = () => {
  }

  return (
    <div id="main-page">
      <div className="menu">
        <ButtonAction
          onClick={onSettingClickHandler}
          id={"to-settings"}
          type={"settings"}/>
        <div className="title">
          Yonote Parser
        </div>
        <ButtonAction
          onClick={onPlusClickHandler}
          id={"add-record"}
          type={"plus"}
          isActive={isActive}/>
      </div>
      {data.length
        ? <div id="table" style={{display: "block"}}>
          <RecordList data={data}/>
          <hr style={{fontSize: "1px", width: 100}}/>
          <div className="menu">
            <ButtonAction
              onClick={onClearClickHandler}
              id={"clear-all"}
              type={"trash"}
              text={"Clear"}/>
            {/*<div className="if-words">Total words: {wordsCount}</div>*/}
            {/*<div className="if-symbols">Total symbols: {symbolsCount}</div>*/}
            {/*<div id="words-summary" className="title">0</div>*/}
          </div>
        </div>
        : <div
          className="placeholder"
          id="clear">
          To start counting click the <span className="button"><svg><use
          href="icons.svg#plus"></use></svg></span> sign <br/>
          when Yonote tab is active.
        </div>}
    </div>
  )
}