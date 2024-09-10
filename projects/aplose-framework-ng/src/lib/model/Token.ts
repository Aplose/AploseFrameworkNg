import { AuthenticationTypeEnum } from "../enum/AuthenticationTypeEnum";


export interface Token{
    accessToken: string;
    expireAt: number;
    type: AuthenticationTypeEnum;
}