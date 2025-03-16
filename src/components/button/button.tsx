import {ButtonHTMLAttributes, FC} from "react";

interface IButtonAction extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconType: string;
}

export const Button: FC<IButtonAction> = (
  {
    iconType,
    className,
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

  return (
    <button className={`button ${className}`} {...props}>
      <div className={'button-icon-wrapper'}>
        <svg>
          <use href={`icons.svg#${iconType}`}></use>
        </svg>
        <label>{props.children}</label>
      </div>
    </button>
  )
}


