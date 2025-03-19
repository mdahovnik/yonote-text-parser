import {HTMLAttributes} from "react";

export interface IHeading extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
}