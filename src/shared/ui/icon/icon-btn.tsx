import {FC} from "react";
import style from "./icon-btn.module.css";
import {IIconBtn} from "./type.ts";

export const IconBtn: FC<IIconBtn> = ({iconType, children, ...props}) => {

  let className = (iconType === "trash" || iconType === "remove")
    ? style.iconDanger
    : (iconType === "copy")
      ? style.iconCounter
      : "";

  return (
    <div className={`${style.iconWrapper} ${className}`} {...props}>
      <svg className={style.iconSvg}>
        <use href={`icons.svg#${iconType}`}></use>
      </svg>
      <label>{children}</label>
    </div>
  )
}