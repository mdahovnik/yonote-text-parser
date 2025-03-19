import {FC} from "react";
import style from "./separator.module.css";
import {ISeparator} from "./type.ts";

export const Separator: FC<ISeparator> = ({className, ...props}) => (
  <hr className={`${style.separator} ${className}`} {...props}/>
)