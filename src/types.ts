import { Overko } from ".";

export type IConfiguration = {
  onInitialize?: any;
  state?: {};
  effects?: {};
  actions?: {};
};

export interface IConfig<ThisConfig extends IConfiguration> {
  state: ThisConfig["state"] & {};
  effects: ThisConfig["effects"] & {};
  actions: ThisConfig["actions"] & {};
}

export type IState =
  | {
      [key: string]:
        | IState
        | string
        | number
        | boolean
        | object
        | null
        | undefined;
    }
  | undefined;

export interface IAction<ThisConfig extends IConfiguration, Value> {
  (overko: Overko<ThisConfig>, value: Value): any;
}

export interface IOnInitialize<ThisConfig extends IConfiguration> {
  (overko: Overko<ThisConfig>): void;
}
