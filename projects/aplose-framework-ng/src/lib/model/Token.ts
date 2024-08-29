import { TokenCategoryEnum } from "../enum/TokenCategoryEnum";


export interface Token{
    accessToken: string;
    expireAt: number;
    type: TokenCategoryEnum;
}