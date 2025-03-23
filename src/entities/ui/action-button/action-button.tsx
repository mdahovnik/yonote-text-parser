import {FC} from "react";
import {IActionButton} from "./type.ts";
import {Button} from "../../../shared/ui/button/button.tsx";
import {IconBtn} from "../../../shared/ui/icon/icon-btn.tsx";

export const ActionButton: FC<IActionButton> = ({iconType, children, ...props}) => {
  return (
    <Button {...props}>
      <IconBtn iconType={iconType}>
        {children}
      </IconBtn>
    </Button>
  )
}


