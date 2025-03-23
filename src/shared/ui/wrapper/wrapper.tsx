import {FC} from "react";
import {IWrapper} from "./type.ts";
import style from "./wrapper.module.css";

export const Wrapper: FC<IWrapper> = ({className, children, ...props}) => {
  return (
    <div className={`${style.wrapper} ${className}`} {...props}>
      {children}
    </div>
  )
}