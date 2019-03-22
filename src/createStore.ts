import { observable, observableArray } from "knockout";
import { ResolveState } from "./internalTypes";
import { IState } from "./types";

const isPlainObject = require("is-plain-object");

export type Store<State extends IState> = {
  state: ResolveState<State>;
};

export const createStore = <State extends IState>(
  state: State
): Store<State> => {
  const stateObservable = deepCloneState(state);
  return {
    state: stateObservable
  };
};

const deepCloneState = (obj: any): any => {
  if (isPlainObject(obj)) {
    return Object.keys(obj).reduce(
      (aggr, key) => {
        if (key === "__esModule") {
          return aggr;
        }

        const originalDescriptor = Object.getOwnPropertyDescriptor(obj, key);
        const isAGetter = originalDescriptor && "get" in originalDescriptor;
        const value = obj[key];

        if (isAGetter) {
          // copy functions and getters
          Object.defineProperty(aggr, key, originalDescriptor as any);
        } else {
          aggr[key] = deepCloneState(value);
        }

        return aggr;
      },
      {} as any
    );
  }
  // Unwrapp if necessary
  const value = typeof obj === "function" ? obj() : obj;

  if (Array.isArray(value)) {
    return observableArray([...value]);
  }

  // every non plain object or array is handled here
  return observable(value);
};
