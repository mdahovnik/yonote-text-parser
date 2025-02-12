import {ButtonAction} from "./buttonAction.tsx";
import {TSetting, TDocument} from "../types.ts";
import {Records} from "./records.tsx";

type TMainPage = {
  isActive: boolean;
  data: TDocument[];
  countTypeSettings: TSetting[];
  onSettingClick: () => void;
  onPlusClick: () => void;
  onClearClick: () => void;
  onDeleteClick: (id: string) => void;
}

function getTotals(data: TDocument[]) {
  // if (!data) return {words: 0, symbols: 0};
  // if (data.length === 1) return {words: data[0].words, symbols: data[0].symbols};
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
                  return countTypeSettings[0].checked
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