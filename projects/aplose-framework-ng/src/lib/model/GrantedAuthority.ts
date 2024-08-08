import { Serializable } from "./Serializable";

export interface GrantedAuthority extends Serializable {
    authority: string;
}