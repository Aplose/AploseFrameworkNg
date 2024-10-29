


export interface ProposalLine{

    rowid: string,
    fk_propal: number, // ID de la proposition
    product_label: string,// Optionnel, si tu as un label spécifique
    fk_product: number,   // ID du produit, ou null si ce n'est pas lié à un produit
    qty: number,      // Quantité de l'article ou du service  
    subprice: number,     // Prix unitaire hors taxe   
    total_ht: number,    // Total hors taxes (calculé : subprice * qty - remise)   
    total_tva: number,  // Total de la TVA (calculé : total_ht * tva_tx / 100)
    total_ttc: number,  // Total TTC (calculé : total_ht + total_tva)
    rang: number,   // Rang dans la liste des lignes (ordre des lignes)
    multicurrency_code: string,  // Code de la devise
    multicurrency_subprice: number,   // Prix unitaire dans la devise choisie
    multicurrency_total_ht: number,  // Total HT en devise
    multicurrency_total_tva: number, // Total TVA en devise
    multicurrency_total_ttc: number,  // Total TTC en devise
    product_type: number, // type: 0=service, 1=product
    ref: string, // reference du produit ou service 
    libelle: string, // reference du produit ou service 
    productImageSrc: string,
}