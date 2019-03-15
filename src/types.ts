import { ResolveActions } from "./internalTypes";
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

export type IContext<ThisConfig extends IConfiguration> = {
  state: ThisConfig["state"];
  actions: ResolveActions<ThisConfig["actions"]>;
  effects: ThisConfig["effects"];
};

export interface IAction<ThisConfig extends IConfiguration, Value> {
  (context: IContext<ThisConfig>, value: Value): any;
}

export interface IOnInitialize<ThisConfig extends IConfiguration> {
  (context: IContext<ThisConfig>): void;
}
