import { Comparable } from "./Comparable";
import { Serializable } from "./Serializable";
import { TemporalAmount } from "./TemporalAmount";



export interface Duration extends TemporalAmount, Comparable<Duration>, Serializable {
}



