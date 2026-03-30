//This is where we have logic to manupulate

import { createReducer, on } from "@ngrx/store";
import { decrement, increment } from "./counter.action";

export const initialValue = 0;

export const counterReducer = createReducer(initialValue, 
    on(increment, (state:number) => state + 1),
    on(decrement, (state:number) => state - 1)
)

export interface AppStore {
    count: number
}
