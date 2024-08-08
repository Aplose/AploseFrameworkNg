import { Locale } from "./Locale";
import { Permission } from "./Permission";
import { Role } from "./Role";
import { UserDetails } from "./UserDetails";


export interface UserAccount extends UserDetails {
    id: number;
    creationDate: Date;
    updateDateTime: Date;
    expirationDate: Date;
    locked: boolean;
    locale: Locale;
    activationCode: string;
    roles: Role[];
    permissions: Permission[];
}