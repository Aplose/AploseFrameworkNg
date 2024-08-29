import { Duration } from "./Duration";

export interface TemporalUnit {
    durationEstimated: boolean;
    duration: Duration;
    timeBased: boolean;
    dateBased: boolean;
}