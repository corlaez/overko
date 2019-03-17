import { IAction } from "./types";

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
    }

export type NestedPartial<T> = T extends Function
  ? T
  : Partial<{ [P in keyof T]: NestedPartial<T[P]> }>;
