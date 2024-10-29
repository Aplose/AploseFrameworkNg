


export interface DolibarrObject{

    id: number,
    entity: number,    
    endPoint: string,
    ref: string,
    ref_ext: string,
    status: number,        // Utiliser les constantes de DolibarrStatus 
    module: string,
    import_key: string,
    label: string,
    description: string,
}