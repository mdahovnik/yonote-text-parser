import {ButtonAction} from "./buttonAction.tsx";
import {Document, SettingList} from "../types.ts";
import {Records} from "./records.tsx";

type TMainPage = {
  isActive: boolean;
  data: Document[];
  documentId: string;
  settings: SettingList;
  onSettingClick: () => void;
  onPlusClick: () => void;
  onClearClick: () => void;
  onDeleteClick: (id: string) => void;
  // totals: {words: number, symbols: number};
}

function getTotals(data: Document[]) {
  return data.reduce((a, b) => ({
    words: a.words + b.words,
    symbols: a.symbols + b.symbols
  }), {words: 0, symbols: 0});
}

export function MainPage(
  {
    data,
    documentId,
    isActive,
    settings,
    onSettingClick,
    onPlusClick,
    onClearClick,
    onDeleteClick,
    // totals
  }: TMainPage) {

  return (
    <div id="main-page">
      <div className="menu">
        <ButtonAction onClick={onSettingClick}
                      id={"to-settings"}
                      type={"settings"}
                      isActive={isActive}/>
        <div className="title">
          Yonote Parser
        </div>
        {
          (() => {
            const buttonType = data.some(item => item.id === documentId) ? "sync" : "plus";
            return <ButtonAction onClick={onPlusClick}
                                 id={"add-record"}
                                 type={buttonType}
                                 isActive={isActive}/>
          })()
        }
      </div>
      {
        data.length > 0
          ? <div id="table">
            <Records data={data}
                     onDeleteClick={onDeleteClick}
                     settings={settings.count}/>
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
                  const isCountWordsAllowed = settings.count.find((item) => item.label === "Words")?.isAllowed;
                  return isCountWordsAllowed
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