import { Address } from "./Address";
import { Civility } from "./Civility";
import { UserAccount } from "./UserAccount";

export interface Person {
    id: number;
    address: Address;
    civility: Civility;
    firstName: string;
    lastName: string;
    fullName: string;
    phone: string;
    healthId: string;
    userAccount: UserAccount;
}