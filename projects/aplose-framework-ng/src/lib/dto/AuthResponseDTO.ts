import { Token } from "../model/Token";
import { UserAccount } from "../model/UserAccount";



export interface AuthResponseDTO{
    token: Token;
    userAccount: UserAccount
}