import {FC} from "react";
import {IButtonAction} from "./type.ts";
import style from "./button.module.css";

export const Button: FC<IButtonAction> = (
  {
    iconType,
    ...props
  }) => {
  // const [isShrunk, setIsShrunk] = useState(false);
  // let timeoutId: number;
  // const handleOnClick = () => {
  //   if (!isActive) return;
  //
  //   onClick();
  //   // setIsShrunk(true);
  //   // clearTimeout(timeoutId)
  //   // timeoutId = setTimeout(() => {
  //   //   setIsShrunk(false);
  //   // }, 200);
  // }

  let className = (iconType === "trash" || iconType === "remove")
    ? style.danger
    : (iconType === "copy")
      ? style.buttonCounter
      : "";

  return (
    <button className={`${style.button} ${className}`} {...props}>
      <div className={style.buttonIconWrapper}>
        <svg className={style.buttonSvg} style={props.style}>
          <use href={`icons.svg#${iconType}`}></use>
        </svg>
        <label>{props.children}</label>
      </div>
    </button>
  )
}


