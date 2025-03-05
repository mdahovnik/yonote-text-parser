import {ButtonAction} from "./buttonAction.tsx";
import {TDocument, TSettingList} from "../types.ts";
import {Records} from "./records.tsx";

type TMainPage = {
  isActive: boolean;
  data: TDocument[];
  documentId: string;
  settings: TSettingList;
  onSettingClick: () => void;
  onPlusClick: () => void;
  onClearClick: () => void;
  onDeleteClick: (id: string) => void;
  // totals: {words: number, symbols: number};
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
            const currentSettings = Object.values(settings)
              .flatMap(array => array.filter(item => item.isAllowed))
              .map(item => item.tagName)
              .flat();
            //TODO: убрать логи
            // console.log("открытый документ есть в store:", data.some(item => item.id === documentId))
            // console.log("настройки не соответствуют документу:", data.some(item => item.id === documentId
            //   && JSON.stringify(item.settings) !== JSON.stringify(currentSettings)), JSON.stringify(currentSettings))

            if (data.length === 0 || !data.some(item => item.id === documentId)) {
              return <ButtonAction onClick={onPlusClick}
                                   id={"add-record"}
                                   type={"plus"}
                                   isActive={isActive}/>
            } else if (
              data.some(item => item.id === documentId
                && JSON.stringify(item.settings) !== JSON.stringify(currentSettings))) {
              return <ButtonAction onClick={onPlusClick}
                                   id={"add-record"}
                                   type={"sync"}
                                   isActive={isActive}/>
            } else {
              return <div></div>
            }
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
                                  text={isCountWordsAllowed ? `Words: ${words}` : `Symbols: ${symbols}`}
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