import { SafeHtml } from "@angular/platform-browser";
import { DolibarrDocument } from "./DolibarrDocument";
import { Category } from "./Category";

export interface Product{
    id:number,
    ref:string,
    ref_ext:string,
    label:string,
    description:string,
    imageSrc?:string,
    imageContent?:string,
    imageAlt?:string,
    x3dSafeInnerHtml?:SafeHtml,
    dolibarrDocuments?:DolibarrDocument[],
    categories?:Category[]
  }