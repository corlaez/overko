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

export interface IAction<ThisConfig extends IConfiguration, Value> {
  (overko: Overko<ThisConfig>, value: Value): any;
}

export interface IOnInitialize<ThisConfig extends IConfiguration> {
  (overko: Overko<ThisConfig>): void;
}
