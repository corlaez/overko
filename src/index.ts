import createStore, { Store } from "./createStore";
import { IAction, IOnInitialize, IConfiguration } from "./types";
import { ResolveActions, NestedPartial } from "./internalTypes";
export { IConnect, createConnect } from "./createConnect";

/** This type can be overwriten by app developers if they want to avoid
 * typing and then they can import `Action`,  `OnInitialize` etc. directly from
 * overko.
 */
declare interface Config {}

export interface Action<Value = void> extends IAction<Config, Value> {}
export interface OnInitialize extends IOnInitialize<Config> {}

export class Overko<ThisConfig extends IConfiguration>
  implements IConfiguration {
  store: Store<ThisConfig["state"]>;
  effects: ThisConfig["effects"] & {};
  actions: ResolveActions<ThisConfig["actions"]>;
  private actionReferences: Function[] = [];
  onInitialize: () => void;

  constructor(
    config: ThisConfig,
    mockedEffects?: NestedPartial<ThisConfig["effects"]>
  ) {
    this.store = createStore(config.state);
    this.effects = mockedEffects
      ? mockedEffects
      : config.effects
      ? config.effects
      : {};
    this.actions = this.getActions(config);
    this.onInitialize = () => {
      config.onInitialize(this.getSnapshot());
    };
  }

  getSnapshot = () => {
    const state = this.store.getState();
    const snapshot: Config = {
      state,
      effects: this.effects,
      actions: this.actions
    };
    return snapshot;
  };

  createAction(name: string, action: any) {
    this.actionReferences.push(action);
    const actionFunc = async (value?: any) => {
      return new Promise((resolve, reject) => {
        resolve(action(this.getSnapshot(), value) || undefined);
      });
    };

    return actionFunc;
  }

  getActions = (configuration: IConfiguration) => {
    let actions: any = {};
    if (configuration.actions) {
      actions = configuration.actions;
    }

    const evaluatedActions = Object.keys(actions).reduce((aggr, name) => {
      if (typeof actions[name] === "function") {
        return Object.assign(aggr, {
          [name]: this.createAction(name, actions[name])
        });
      }
      return Object.assign(aggr, {
        [name]: Object.keys(actions[name] || {}).reduce(
          (aggr, subName) =>
            Object.assign(
              aggr,
              typeof actions[name][subName] === "function"
                ? {
                    [subName]: this.createAction(
                      subName,
                      actions[name][subName]
                    )
                  }
                : {}
            ),
          {}
        )
      });
    }, {}) as any;

    return evaluatedActions;
  };
}

export function createOverko<Config extends IConfiguration>(
  config: Config
): Overko<Config> {
  const overko = new Overko(config);
  overko.onInitialize();
  return overko;
}

export function createOverkoMock<Config extends IConfiguration>(
  config: Config,
  mockedEffects?: NestedPartial<Config["effects"]>
): Overko<Config> {
  return new Overko(config, mockedEffects);
}
