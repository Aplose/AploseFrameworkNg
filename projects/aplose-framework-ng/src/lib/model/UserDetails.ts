import { GrantedAuthority } from "./GrantedAuthority";
import { Serializable } from "./Serializable";

export interface UserDetails extends Serializable {
    authorities: GrantedAuthority[];
    enabled: boolean;
    username: string;
    password: string;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
}