import {Button} from "./button/button.tsx";
import {TDocument, TSettingList} from "../types.ts";
import {Records} from "./records.tsx";
import {Placeholder} from "./placeholder.tsx";
import {useMemo} from "react";
import {Heading} from "./heading.tsx";
import {Separator} from "./separator.tsx";

type TMainPage = {
  isValidPageOpen: boolean;
  documents: TDocument[];
  currentDocumentId: string;
  settings: TSettingList;
  onSettingClick: () => void;
  onPlusClick: () => void;
  onClearClick: () => void;
  onDeleteClick: (id: string) => void;
}

function getTotalCountFromDocuments(data: TDocument[]) {
  return data.reduce(
    (a, b) => ({words: a.words + b.words, symbols: a.symbols + b.symbols}),
    {words: 0, symbols: 0});
}

export function MainPage(
  {
    documents,
    currentDocumentId,
    isValidPageOpen,
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
      getTotalCountFromDocuments(documents),
    [documents]
  );

  const isCountWordsAllowed = () =>
    settings.count.find((item) => item.label === "Words")?.isAllowed;

  const shouldShowAddButton = documents.length === 0 || !documents.some(item => item.id === currentDocumentId);
  const currentCount = isCountWordsAllowed() ? words : symbols;

  return (
    <>
      <div className="menu">
        <Button onClick={onSettingClick}
                disabled={!isValidPageOpen}
                iconType={"settings"}/>
        <Heading level={2}>
          Yonote Parser
        </Heading>
        <Button onClick={onPlusClick}
                disabled={!shouldShowAddButton}
                iconType={"plus"}/>
      </div>
      {documents.length > 0 ? (
        <>
          <Separator/>
          <Records documents={documents}
                   currentDocumentId={currentDocumentId}
                   onDeleteClick={onDeleteClick}
                   onCopyClick={handleCopyClick}
                   settings={settings.count}/>
          <Separator/>
          <div className="menu">
            <Button className={"danger"}
                    onClick={onClearClick}
                    iconType={"trash"}>
              {"Clear all"}
            </Button>
            <Button className={"record-counter"}
                    onClick={() => handleCopyClick(currentCount)}
                    iconType={"copy"}>
              {`${isCountWordsAllowed() ? 'Words' : 'Symbols'}: ${currentCount}`}
            </Button>
          </div>
        </>
      ) : (
        <>
          <Separator/>
          <Placeholder/>
        </>
      )}
    </>
  )
}