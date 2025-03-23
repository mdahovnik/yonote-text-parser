import {OptionItem} from "../option-item/option-item.tsx";
import {FC} from "react";
import {Heading} from "../../../shared/ui/heading/heading.tsx";
import {TOptions} from "./type.ts";
import style from "./options.module.css"
import {TSettingList, TTranslation} from "../../../types/types.ts";
import {Separator} from "../../../shared/ui/separator/separator.tsx";
import {useTranslation} from "react-i18next";

export const OptionsSection: FC<TOptions> = ({settings, onOptionChangeClick}) => {
  const {t} = useTranslation();
  const optionsEntries = Object.entries(settings);
  return <>
    {optionsEntries.map(([category, options]) => {
      const typedCategory = category as keyof TSettingList;
      const translationCategoryTyped = category as TTranslation;
      return <>
        <Separator/>
        <Heading level={3} className={style.settingsSectionTitle}>
          {t(translationCategoryTyped)}
        </Heading>
        <div className={style.settingsSectionGrid}>
          {options.map((option) => (
              <OptionItem key={option.id}
                          setting={option}
                          onOptionChangeClick={onOptionChangeClick}
                          categorySettings={typedCategory}/>
            )
          )}
        </div>
      </>
    })}
  </>
}
