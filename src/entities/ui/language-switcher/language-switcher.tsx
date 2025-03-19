import {FC, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button} from "../../../shared/ui/button/button.tsx";
import {Icon} from "../../../constants/constants.ts";
import {TAppLanguage} from "../../../types/types.ts";
import {IconBtn} from "../../../shared/ui/icon/icon-btn.tsx";
import {IActionButton} from "../action-button/type.ts";

export const LanguageSwitcher: FC<IActionButton> = ({...props}) => {
  const {i18n} = useTranslation();
  const [language, setLanguage] = useState<TAppLanguage>('en');

  const switchLanguage = async () => {
    const newLng = i18n.language === 'en' ? 'ru' : 'en';
    await i18n.changeLanguage(newLng);
    setLanguage(lng => lng === 'en' ? 'ru' : 'en');
  }

  return (
    <>
      <Button onClick={switchLanguage} {...props}>
        <IconBtn iconType={Icon.LNG} children={language}/>
      </Button>
    </>
  )
}