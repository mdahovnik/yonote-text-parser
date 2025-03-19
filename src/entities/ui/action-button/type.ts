import {ButtonHTMLAttributes} from "react";

export interface IActionButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconType: string;
}
