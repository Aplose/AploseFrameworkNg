import { Category } from "./Category";


export interface CategoryFlat extends Category{
    level: number;
    expandable: boolean;
  }