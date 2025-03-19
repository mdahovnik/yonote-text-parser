import {FC} from "react";
import {IButton} from "./type.ts";
import style from "./button.module.css";

export const Button: FC<IButton> = (
  {
    className,
    children,
    ...props
  }) => {
  return (
    <button className={`${style.button} ${className}`} {...props}>
      {children}
    </button>
  )
}


