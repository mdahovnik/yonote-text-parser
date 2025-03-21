import {FC, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button} from "../../../shared/ui/button/button.tsx";
import {IconBtn} from "../../../shared/ui/icon/icon-btn.tsx";
import {IActionButton} from "../action-button/type.ts";

export const LanguageSwitcher: FC<IActionButton> = ({...props}) => {
  const {i18n} = useTranslation();
  const newLanguage = i18n.language === 'en' ? 'ru' : 'en';
  const [language, setLanguage] = useState(newLanguage);

  const switchLanguage = async () => {
    setLanguage(lng => lng === 'en' ? 'ru' : 'en');
    await i18n.changeLanguage(newLanguage);
  }

  return (
    <>
      <Button onClick={switchLanguage} {...props}>
        <IconBtn iconType={props.iconType} children={language}/>
      </Button>
    </>
  )
}