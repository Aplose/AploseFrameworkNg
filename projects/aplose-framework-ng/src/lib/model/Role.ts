import { RoleEnum } from "../enum/RoleEnum";
import { GrantedAuthority } from "./GrantedAuthority";
import { Permission } from "./Permission";


export interface Role extends GrantedAuthority {
    id: number;
    authority: string,
    permissions: Permission[];
}