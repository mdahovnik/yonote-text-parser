import {FC, HTMLAttributes, JSX} from "react";

interface IHeading extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3;
}

export const Heading: FC<IHeading> = ({level = 1, className, ...props}) => {

  const HeadingTag = (`h${level}` as keyof JSX.IntrinsicElements) as "h1" | "h2" | "h3";

  return (
    <HeadingTag className={`heading ${className}`} {...props}>
      <span>{props.children}</span>
    </HeadingTag>
  )
}
