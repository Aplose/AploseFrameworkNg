import { ProposalProductTypeEnum } from "../../enum/ProposalProductTypeEnum"




export interface ProposalLineDTO{
        
    quantity: number
    productId: number
    product_type: ProposalProductTypeEnum // type: 0=service; 1=product
}