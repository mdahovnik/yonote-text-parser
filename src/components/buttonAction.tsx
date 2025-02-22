import {useState} from "react";

type TButtonAction = {
  id?: string;
  type: string;
  className?: string;
  onClick: () => void;
  text?: string;
  isActive?: boolean;
}

export function ButtonAction(
  {
    id,
    onClick,
    className,
    isActive = true,
    type,
    text
  }: TButtonAction) {
  const [isShrunk, setIsShrunk] = useState(false);

  const handleOnClick = () => {
    onClick();
    setIsShrunk(true); // Устанавливаем состояние "уменьшено"
    setTimeout(() => {
      setIsShrunk(false); // Возвращаем исходное состояние через 300 мс
    }, 200);
  }
  return (
    <div className={`button ${className} ${isActive ? "action" : "disabled"}`}
         id={id}
         onClick={handleOnClick}>
      <div className={`button-icon clickable-icon ${isShrunk ? "shrink" : ""}`}>
        <svg>
          <use href={`icons.svg#${type}`}></use>
        </svg>
        {text && <label className="button-icon-label">{text}</label>}
      </div>
    </div>
  )
}
