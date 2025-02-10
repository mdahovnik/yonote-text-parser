import {ButtonAction} from "./buttonAction.tsx";
import {TSetting, TStorage} from "../types.ts";
import {Records} from "./records.tsx";

type TMainPage = {
  onSettingClick: (isVisible: boolean) => void;
  onPlusClick: () => void;
  data: TStorage[];
  // records: TRecord[];
  isActive: boolean;
  countTypeSettings: TSetting[];
}

function getTotals(data: TStorage[]) {
  return data.reduce((a, b) => ({
    words: a.words + b.words,
    symbols: a.symbols + b.symbols
  }), {words: 0, symbols: 0});
}

export function MainPage(
  {
    onSettingClick,
    data,
    onPlusClick,
    isActive,
    countTypeSettings
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
        <ButtonAction onClick={onSettingClickHandler}
                      id={"to-settings"}
                      type={"settings"}/>
        <div className="title">
          Yonote Parser
        </div>
        <ButtonAction onClick={onPlusClickHandler}
                      id={"add-record"}
                      type={"plus"}
                      isActive={isActive}/>
      </div>
      {
        data.length
          ? <div id="table">
            <Records data={data}/>
            <hr/>
            <div className="menu">
              <ButtonAction onClick={onClearClickHandler}
                            id={"clear-all"}
                            type={"trash"}
                            text={"Clear"}
                            className={"danger"}/>
              {
                (() => {
                  const {words, symbols} = getTotals(data);

                  return countTypeSettings[0].checked ? (
                    <div className="count-bold">Words: {words}</div>
                  ) : (
                    <div className="count-bold">Symbols: {symbols}</div>
                  );
                })()
              }
              {/*<div id="words-summary" className="title">0</div>*/}
            </div>
          </div>
          : <div className="placeholder" id="clear">
            <hr/>
            To start counting click the <span className="button"><svg><use
            href="icons.svg#plus"></use></svg></span> sign <br/>
            when Yonote tab is active.
          </div>
      }
    </div>
  )
}