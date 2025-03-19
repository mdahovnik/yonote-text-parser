import {ActionButton} from "../action-button/action-button.tsx";
import style from "./placeholder.module.css";

export function Placeholder() {
  return (
    <div className={style.placeholder}>
      <p> To start counting click the
        <ActionButton
          iconType={"plus"}
          style={{fill: "black", width: "12", height: "12"}}
          disabled/>
        sign<br/>when Yonote tab is active.
      </p>
    </div>
  )
}