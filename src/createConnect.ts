import { Overko } from ".";
import { IConfiguration } from "./types";

interface Constructable {
  new (props: any): any;
}

type ConnectFunction = (ViewModel: Constructable) => Constructable;

type CreateConnect = <ThisConfig extends IConfiguration>(
  overkoInstance: Overko<ThisConfig>
) => ConnectFunction;

export const createConnect: CreateConnect = overkoInstance => ViewModel => {
  if (typeof ViewModel !== "function") {
    const message = `Invalid type '${typeof ViewModel}' for ViewModel passed to result of connect(). ViewModel must be a function.`;
    throw new Error(message);
  }

  class Wrapper {
    constructor(ownParams: any) {
      const mergedParams = {
        overko: overkoInstance,
        ...ownParams
      };
      return new ViewModel(mergedParams);
    }
  }

  return Wrapper;
};

export interface IConnect<ThisConfig extends IConfiguration> {
  overko: {
    state: Overko<ThisConfig>["state"];
    effects: Overko<ThisConfig>["effects"];
    actions: Overko<ThisConfig>["actions"];
  };
}
