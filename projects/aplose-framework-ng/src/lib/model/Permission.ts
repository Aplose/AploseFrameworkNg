import { GrantedAuthority } from "./GrantedAuthority";

export interface Permission extends GrantedAuthority {
    id: number;
}