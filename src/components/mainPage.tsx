import {Button} from "./button.tsx";
import {TDocument, TSettingList} from "../types.ts";
import {Records} from "./records.tsx";
import {Placeholder} from "./placeholder.tsx";
import {useMemo} from "react";

type TMainPage = {
  isActive: boolean;
  documents: TDocument[];
  documentId: string;
  settings: TSettingList;
  onSettingClick: () => void;
  onPlusClick: () => void;
  onClearClick: () => void;
  onDeleteClick: (id: string) => void;
}

function getTotals(data: TDocument[]) {
  return data.reduce(
    (a, b) => ({words: a.words + b.words, symbols: a.symbols + b.symbols}),
    {words: 0, symbols: 0});
}

export function MainPage(
  {
    documents,
    documentId,
    isActive,
    settings,
    onSettingClick,
    onPlusClick,
    onClearClick,
    onDeleteClick
  }: TMainPage) {

  const handleCopyClick = async (totalCount: number) => {
    await navigator.clipboard.writeText(totalCount.toString());
  }

  const {words, symbols} = useMemo(() =>
      getTotals(documents),
    [documents]
  );

  const isCountWordsAllowed = () =>
    settings.count.find((item) => item.label === "Words")?.isAllowed;

  const shouldShowAddButton = documents.length === 0 || !documents.some(item => item.id === documentId);
  const currentCount = isCountWordsAllowed() ? words : symbols;

  return (
    <div id="main-page">
      <div className="menu">
        <Button onClick={onSettingClick}
                id={"to-settings"}
                type={"settings"}
                isActive={isActive}/>
        <div className="title">Yonote Parser</div>
        {shouldShowAddButton ? (
          <Button onClick={onPlusClick}
                  id={"add-record"}
                  type={"plus"}
                  isActive={isActive}/>
        ) : (
          <div></div>
        )}
      </div>
      {documents.length > 0 ? (
        <div id="table">
          <Records data={documents}
                   documentId={documentId}
                   onDeleteClick={onDeleteClick}
                   onCopyClick={handleCopyClick}
                   settings={settings.count}/>
          <hr/>
          <div className="menu">
            <Button className={"danger"}
                    onClick={onClearClick}
                    id={"clear-all"}
                    type={"trash"}
                    isActive={documents.length > 0}
                    text={"Clear all"}/>
            <Button className={"record-counter"}
                    text={`${isCountWordsAllowed() ? 'Words' : 'Symbols'}: ${currentCount}`}
                    onClick={() => handleCopyClick(currentCount)}
                    type={"copy"}/>
          </div>
        </div>
      ) : (
        <Placeholder/>
      )}
    </div>
  )
}