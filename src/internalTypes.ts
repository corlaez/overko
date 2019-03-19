import { IAction, IState } from "./types";
import { ObservableArray, Observable } from "knockout";

type TActionValue<T> = T extends (a1: any, a2: infer TValue) => any
  ? TValue
  : never;

type NestedActions =
  | { [key: string]: IAction<any, any> | NestedActions }
  | undefined;

export type ResolveActions<
  Actions extends NestedActions
> = Actions extends undefined
  ? {}
  : {
      [T in keyof Actions]: Actions[T] extends IAction<any, any>
        ? TActionValue<Actions[T]> extends void
          ? () => Promise<void>
          : (value: TActionValue<Actions[T]>) => Promise<void>
        : Actions[T] extends NestedActions
        ? ResolveActions<Actions[T]>
        : never
    };

export type ResolveState<State extends IState> = State extends undefined
  ? {}
  : {
      [P in keyof State]: State[P] extends Observable<any>
        ? State[P]
        : State[P] extends ObservableArray<any>
        ? State[P]
        : State[P] extends Array<any>
        ? ObservableArray<State[P]>
        : State[P] extends IState
        ? ResolveState<State[P]>
        : Observable<State[P]>
    };

export type NestedPartial<T> = T extends Function
  ? T
  : Partial<{ [P in keyof T]: NestedPartial<T[P]> }>;
