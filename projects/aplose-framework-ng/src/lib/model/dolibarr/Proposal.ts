import { DolibarrObject } from "./DolibarrObject";
import { ProposalLine } from "./ProposalLine";



export interface Proposal extends DolibarrObject{

    socid: number,  
    datec: string,
    datep: string,
    date_valid: string,
    date_cloture: string,
    total_ht: number,
    total: number,
    tva: number,
    note_private: string,
    note_public: string, 
    lines: ProposalLine[]
}