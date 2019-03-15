import { Overko } from ".";
import { IConfiguration } from "./types";

interface Constructable {
  new (props: any): any;
}

type ConnectFunction = (ViewModel: Constructable) => Constructable;

type CreateConnect = <Config extends IConfiguration>(
  overkoInstance: Overko<Config>
) => ConnectFunction;

export const createConnect: CreateConnect = overkoInstance => ViewModel => {
  if (typeof ViewModel !== "function") {
    const message = `Invalid type '${typeof ViewModel}' for ViewModel passed to result of connect(). ViewModel must be a function.`;
    throw new Error(message);
  }

  class Wrapper {
    constructor(ownParams: any) {
      const state = overkoInstance.store.getState();
      const overkoParam = { state, effects: overkoInstance.effects };
      const mergedParams = {
        overko: overkoParam,
        ...ownParams
      };
      return new ViewModel(mergedParams);
    }
  }

  return Wrapper;
};

export interface IConnect<Config extends IConfiguration> {
  overko: {
    state: Config["state"];
    effects: Config["effects"];
    actions: Config["actions"];
  };
}
