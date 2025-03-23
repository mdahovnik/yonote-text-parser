import {FC, JSX} from "react";
import {IHeading} from "./type.ts";
import style from "./heading.module.css";

export const Heading: FC<IHeading> = ({level = 3, className, children, ...props}) => {
  const HeadingTag = (`h${level}` as keyof JSX.IntrinsicElements) as "h1" | "h2" | "h3" | "h4";
  return (
    <HeadingTag className={`${style.heading} ${className}`} {...props}>
      <span>{children}</span>
    </HeadingTag>
  )
}
