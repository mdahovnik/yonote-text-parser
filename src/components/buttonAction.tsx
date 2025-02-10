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
  return (
    <div className={`button ${className} ${isActive ? "action" : "disabled"}`}
         id={id}
         onClick={onClick}>
      <div className="button-icon">
        <svg>
          <use href={`icons.svg#${type}`}></use>
        </svg>
        {text && <label className="button-icon-label">{text}</label>}
      </div>
    </div>
  )
}

//TODO: значёк svg должен появляться у лейбла по наведению