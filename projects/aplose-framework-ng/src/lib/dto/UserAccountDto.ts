import { Locale } from "../model/Locale"
import { Permission } from "../model/Permission"
import { Person } from "../model/Person"
import { Role } from "../model/Role"


export interface UserAccountDto{
    id: number
    person: Person
    creationDate: Date
    updateDateTime: Date
    expirationDate: Date
    enabled: boolean
    locked: boolean
    locale: Locale
    roles: Role[]
    permissions: Permission[]
}