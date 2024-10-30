

export interface Category{
    id:number,
    entity: number,
    ref: string,
    ref_ext: string,
    status: number,
    childs: Category[],
    label: string,
    description: string,
    photo: string,
    rootCategory: boolean,
    fk_parent: number
  }