import {SettingsSection} from "../../entities/ui/settings-section/settings-section.tsx";
import {ActionButton} from "../../entities/ui/action-button/action-button.tsx";
import {FC} from "react";
import {Heading} from "../../shared/ui/heading/heading.tsx";
import {TSettingPage} from "./type.ts";
import {Separator} from "../../shared/ui/separator/separator.tsx";
import {Wrapper} from "../../shared/ui/wrapper/wrapper.tsx";
import {Icon} from "../../constants/constants.ts";
import {useTranslation} from "react-i18next";
import {LanguageSwitcher} from "../../entities/ui/language-switcher/language-switcher.tsx";

export const SettingsPage: FC<TSettingPage> = (
  {
    onBackButtonClick,
    onSettingChangeClick,
    settings
  }) => {
  const {t} = useTranslation();
  return (
    <>
      <Wrapper>
        <ActionButton onClick={onBackButtonClick}
                      iconType={Icon.BACK}/>
        <Heading level={2}>{t('settingsTitle')}</Heading>
        <LanguageSwitcher iconType={Icon.LNG}/>
      </Wrapper>
      <Separator/>
      <SettingsSection title={t('typesOfBlockHeading')}
                       settings={settings.block}
                       categorySettings={"block"}
                       onSettingsChange={onSettingChangeClick}/>
      <Separator/>
      <SettingsSection title={t('typesOfTextHeading')}
                       settings={settings.text}
                       categorySettings={"text"}
                       onSettingsChange={onSettingChangeClick}/>
      <Separator/>
      <SettingsSection title={t('counterType')}
                       settings={settings.count}
                       categorySettings={"count"}
                       onSettingsChange={onSettingChangeClick}/>
    </>
  )
}