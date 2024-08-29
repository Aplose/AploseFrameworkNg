import { Country } from "./Country";
import { Town } from "./Town";

export interface Address {
    id: number;
    row2: string;
    row3: string;
    row4: string;
    row5: string;
    town: Town | null;
    country: Country;
}
