import style from "./placeholder.module.css";
import {FC, HTMLAttributes} from "react";

export const Placeholder: FC<HTMLAttributes<HTMLDivElement>> = ({...props}) => {
  return (
    <div className={style.placeholder} {...props}>
      <p>{props.children}</p>
    </div>
  )
}