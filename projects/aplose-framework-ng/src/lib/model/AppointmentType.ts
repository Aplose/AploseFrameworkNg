export interface AppointmentType {
    id: number
    code: string
    label: string
    active: boolean
    appointmentAddressIsRequired: boolean
    vizuLiveCollaboratorIsRequired: boolean
}