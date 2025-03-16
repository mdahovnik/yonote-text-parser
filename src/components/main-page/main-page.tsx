import {Button} from "../button/button.tsx";
import {TDocument} from "../../types.ts";
import {Records} from "../records/records.tsx";
import {Placeholder} from "../placeholder/placeholder.tsx";
import {FC, useMemo} from "react";
import {Heading} from "../../shared/ui/heading/heading.tsx";
import {Separator} from "../../shared/ui/separator/separator.tsx";
import {TMainPage} from "./type.ts";

function getTotalCountFromDocuments(data: TDocument[]) {
  return data.reduce(
    (a, b) => ({words: a.words + b.words, symbols: a.symbols + b.symbols}),
    {words: 0, symbols: 0});
}

export const MainPage: FC<TMainPage> = (
  {
    documents,
    currentDocumentId,
    isValidPageOpen,
    settings,
    onSettingClick,
    onPlusClick,
    onClearClick,
    onDeleteClick
  }) => {

  const copyTotalCountToClipboard = async (totalCount: number) => {
    await navigator.clipboard.writeText(totalCount.toString());
  }

  const {words, symbols} = useMemo(() =>
      getTotalCountFromDocuments(documents),
    [documents]
  );

  const isCountWordsAllowed = () => settings.count.find((item) => item.label === "Words")?.isAllowed;
  const shouldShowAddButton = isValidPageOpen && !documents.some(item => item.id === currentDocumentId);
  const currentCount = isCountWordsAllowed() ? words : symbols;
  const countString = `${isCountWordsAllowed() ? 'Words' : 'Symbols'}: ${currentCount}`;

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
                   onCopyClick={copyTotalCountToClipboard}
                   settings={settings.count}/>
          <Separator/>
          <div className="menu">
            <Button onClick={onClearClick}
                    iconType={"trash"}>
              {"Clear all"}
            </Button>
            <Button onClick={() => copyTotalCountToClipboard(currentCount)}
                    iconType={"copy"}>
              {countString}
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