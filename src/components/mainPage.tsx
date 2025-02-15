import {ButtonAction} from "./buttonAction.tsx";
import {TSetting, TDocument, TSettingList} from "../types.ts";
import {Records} from "./records.tsx";

type TMainPage = {
  isActive: boolean;
  data: TDocument[];
  countTypeSettings: TSetting[];
  settings: TSettingList;
  onSettingClick: () => void;
  onPlusClick: () => void;
  onClearClick: () => void;
  onDeleteClick: (id: string) => void;
}

function getTotals(data: TDocument[]) {
  return data.reduce((a, b) => ({
    words: a.words + b.words,
    symbols: a.symbols + b.symbols
  }), {words: 0, symbols: 0});
}

export function MainPage(
  {
    data,
    isActive,
    countTypeSettings,
    settings,
    onSettingClick,
    onPlusClick,
    onClearClick,
    onDeleteClick
  }: TMainPage) {

  return (
    <div id="main-page">
      <div className="menu">
        <ButtonAction onClick={onSettingClick}
                      id={"to-settings"}
                      type={"settings"}/>
        <div className="title">
          Yonote Parser
        </div>
        <ButtonAction onClick={onPlusClick}
                      id={"add-record"}
                      type={"plus"}
                      isActive={isActive}/>
      </div>
      {
        data.length > 0
          ? <div id="table">
            <Records data={data}
                     onDeleteClick={onDeleteClick}
                     countTypeSettings={countTypeSettings}/>
            <hr/>
            <div className="menu">
              <ButtonAction onClick={onClearClick}
                            id={"clear-all"}
                            type={"trash"}
                            text={"Clear all"}
                            className={"danger"}/>
              {
                (() => {
                  const {words, symbols} = getTotals(data);
                  const isWordsSelected = settings.count.find((item) => item.title === "Words");
                  return isWordsSelected?.checked
                    ? <div>Words:<span className="count-bold">{words}</span></div>
                    : <div>Symbols:<span className="count-bold">{symbols}</span></div>

                })()
              }
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