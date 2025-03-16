import {SettingsSection} from "../settings-section/settings-section.tsx";
import {Button} from "../button/button.tsx";
import {FC} from "react";
import {Heading} from "../../shared/ui/heading/heading.tsx";
import {TSettingPage} from "./type.ts";
import {Separator} from "../../shared/ui/separator/separator.tsx";

export const SettingsPage: FC<TSettingPage> = (
  {
    onBackButtonClick,
    onLanguageAppClick,
    onSettingChangeClick,
    onCopyRawTextClick,
    settings
  }) => (
  <>
    <div className="menu">
      <Button onClick={onBackButtonClick}
              iconType={"back"}/>
      <Heading level={2}>Settings</Heading>
      <Button onClick={onLanguageAppClick}
              iconType={"lng"}>
        {"ru"}
      </Button>
    </div>
    <Separator/>
    <SettingsSection title={"Types of blocks to be counted:"}
                     settings={settings.block}
                     categorySettings={"block"}
                     onSettingsChange={onSettingChangeClick}/>
    {/*<Separator/>*/}
    <SettingsSection title={"Types of text style to be counted:"}
                     settings={settings.text}
                     categorySettings={"text"}
                     onSettingsChange={onSettingChangeClick}/>
    {/*<Separator/>*/}
    <SettingsSection title={"Counter type:"}
                     settings={settings.count}
                     categorySettings={"count"}
                     onSettingsChange={onSettingChangeClick}/>
    <Separator/>
    {/*<div className="setting-copy-rawtext">*/}
    <Button onClick={onCopyRawTextClick}
            iconType={"copy"}>
      {"Copy raw text"}
    </Button>
    {/*</div>*/}
  </>
)