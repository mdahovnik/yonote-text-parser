import style from "./placeholder.module.css";
import {FC, HTMLAttributes} from "react";

export const Placeholder: FC<HTMLAttributes<HTMLDivElement>> = ({children, ...props}) => {
  return (
    <div className={style.placeholder} {...props}>
      {children}
    </div>
  )
}