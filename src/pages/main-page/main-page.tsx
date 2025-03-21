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
    onClearClick,
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
  const shouldShowAddButton = isValidPageOpen && !documents.some(item => item.id === currentDocumentId);
  const currentCount = isCountWordsAllowed() ? words : symbols;
  const countString = `${isCountWordsAllowed() ? t('countWords') : t('countSymbols')}: ${currentCount}`;

  return (
    <>
      <Wrapper>
        <ActionButton onClick={onSettingClick}
                      disabled={!isValidPageOpen}
                      iconType={Icon.SETTINGS}/>
        <Heading level={2}>{t('extensionTitle')}</Heading>
        <ActionButton onClick={onPlusClick}
                      disabled={!shouldShowAddButton}
                      iconType={Icon.PLUS}/>
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
            <ActionButton onClick={onClearClick} iconType={Icon.TRASH}>
              {t('clearButton')}
            </ActionButton>
            <ActionButton onClick={onCopyRawTextClick} iconType={Icon.COPY}>
              {t('copyRawText')}
            </ActionButton>
            <ActionButton onClick={() => copyTotalCountToClipboard(currentCount)} iconType={Icon.COPY}>
              {countString}
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