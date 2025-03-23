import {ActionButton} from "../../entities/ui/action-button/action-button.tsx";
import {TDocument} from "../../types/types.ts";
import {Records} from "../../entities/ui/records/records.tsx";
import {Placeholder} from "../../entities/ui/placeholder/placeholder.tsx";
import {FC, useMemo} from "react";
import {Heading} from "../../shared/ui/heading/heading.tsx";
import {Separator} from "../../shared/ui/separator/separator.tsx";
import {TMainPage} from "./type.ts";
import {Wrapper} from "../../shared/ui/wrapper/wrapper.tsx";
import {Icon} from "../../constants/constants.ts";
import {useTranslation} from "react-i18next";

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
    onAllClearClick,
    onCopyRawTextClick,
    onDeleteClick
  }) => {
  const {t} = useTranslation();

  const {words, symbols} = useMemo(() =>
      getTotalCountFromDocuments(documents),
    [documents]
  );

  const copyTotalCountToClipboard = async (totalCount: number) => {
    await navigator.clipboard.writeText(totalCount.toString());
  }

  const isCountWordsAllowed = () => settings.type5_counter.find((item) => item.label === "Words")?.isAllowed;

  const currentCount = isCountWordsAllowed()
    ? words
    : symbols;

  const totalCountString = isCountWordsAllowed()
    ? `${t('countWords')}: ${words}`
    : `${t('countSymbols')}: ${symbols}`;

  const shouldShowAddButton = isValidPageOpen && !documents.some(item => item.id === currentDocumentId);

  return (
    <>
      <Wrapper>
        <ActionButton iconType={Icon.SETTINGS}
                      onClick={onSettingClick}
                      disabled={!isValidPageOpen}/>
        <Heading level={2}>
          {t('extensionTitle')}
        </Heading>
        <ActionButton iconType={Icon.PLUS}
                      onClick={onPlusClick}
                      disabled={!shouldShowAddButton}/>
      </Wrapper>
      {documents.length > 0 ? (
        <>
          <Separator/>
          <Records documents={documents}
                   currentDocumentId={currentDocumentId}
                   onDeleteClick={onDeleteClick}
                   onCopyClick={copyTotalCountToClipboard}
                   settings={settings}/>
          <Separator/>
          <Wrapper>
            <ActionButton iconType={Icon.TRASH} onClick={onAllClearClick}>
              {t('clearButton')}
            </ActionButton>
            <ActionButton iconType={Icon.COPY} onClick={onCopyRawTextClick}>
              {t('copyRawText')}
            </ActionButton>
            <ActionButton iconType={Icon.COPY} onClick={() => copyTotalCountToClipboard(currentCount)}>
              {totalCountString}
            </ActionButton>
          </Wrapper>
        </>
      ) : (
        <>
          <Separator/>
          <Placeholder>{t('Placeholder')}</Placeholder>
        </>
      )}
    </>
  )
}