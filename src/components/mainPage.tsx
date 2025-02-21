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

  const handleCopyClick = async (totalCount: number) => {
    await navigator.clipboard.writeText(totalCount.toString());
  }

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
                     documentId={documentId}
                     onDeleteClick={onDeleteClick}
                     onCopyClick={handleCopyClick}
                     settings={settings.count}/>
            <hr/>
            <div className="menu">
              <ButtonAction className={"danger"}
                            onClick={onClearClick}
                            id={"clear-all"}
                            type={"trash"}
                            isActive={data.length > 0}
                            text={"Clear all"}/>
              {
                (() => {
                  const {words, symbols} = getTotals(data);
                  const isCountWordsAllowed = settings.count.find((item) => item.label === "Words")?.isAllowed;
                  return (
                    <ButtonAction className={"record-counter"}
                                  text={isCountWordsAllowed ? `Words:${words}` : `Symbols:${symbols}`}
                                  onClick={() => handleCopyClick(isCountWordsAllowed ? words : symbols)}
                                  type={"copy"}/>
                  )
                })()
              }
            </div>
          </div>
          : <div className="placeholder" id="clear">
            <hr/>
            <p> To start counting click the <span className="button"><svg><use
              href="icons.svg#plus"></use></svg></span> sign <br/>
              when Yonote tab is active.
            </p>
          </div>
      }
    </div>
  )
}