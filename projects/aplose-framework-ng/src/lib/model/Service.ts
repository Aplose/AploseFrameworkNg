import { Address } from "./Address";
import { AppointmentType } from "./AppointmentType";
import { Duration } from "./Duration";
import { Person } from "./Person";

export interface Service {
    id: number;
    name: string;
    description: string;
    duration: Duration;
    minuteDuration: number;
    hourDuration: number;
    dayDuration: number;
    professional: Person;
    isActive: boolean;
    createInstant: Date;
    price: number;
}