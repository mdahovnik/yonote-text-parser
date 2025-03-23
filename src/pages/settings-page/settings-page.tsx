import {OptionsSection} from "../../entities/ui/options-section/optionsSection.tsx";
import {ActionButton} from "../../entities/ui/action-button/action-button.tsx";
import {FC} from "react";
import {Heading} from "../../shared/ui/heading/heading.tsx";
import {TSettingPage} from "./type.ts";
import {Wrapper} from "../../shared/ui/wrapper/wrapper.tsx";
import {Icon} from "../../constants/constants.ts";
import {useTranslation} from "react-i18next";
import {LanguageSwitcher} from "../../entities/ui/language-switcher/language-switcher.tsx";

export const SettingsPage: FC<TSettingPage> = ({onBackButtonClick, onOptionChangeClick, settings}) => {
  const {t} = useTranslation();
  return (
    <>
      <Wrapper>
        <ActionButton iconType={Icon.BACK} onClick={onBackButtonClick}/>
        <Heading level={2}>
          {t('settingsTitle')}
        </Heading>
        <LanguageSwitcher iconType={Icon.LNG}/>
      </Wrapper>
      <OptionsSection settings={settings}
                      onOptionChangeClick={onOptionChangeClick}/>
    </>
  )
}