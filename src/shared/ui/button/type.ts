import {ButtonHTMLAttributes} from "react";

export interface IButtonAction extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconType: string;
}
