import { DolibarrObject } from "./DolibarrObject";
import { ProposalLine } from "./ProposalLine";



export interface Proposal extends DolibarrObject{
    ref: string,
    ref_client: string,
    socid: number,  
    datec: number,
    datep: number,
    date_validation: number,
    date_cloture: number,
    total_ht: number,
    total_ttc: number,
    total_tva: number,
    note_private: string,
    note_public: string, 
    lines: ProposalLine[]
}