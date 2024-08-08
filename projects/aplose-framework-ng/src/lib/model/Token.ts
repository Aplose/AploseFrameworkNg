import { TokenCategoryEnum } from "../enum/TokenCategoryEnum";


export interface Token{
    accessToken: string;
    expireAt: Date;
    type: TokenCategoryEnum;
}