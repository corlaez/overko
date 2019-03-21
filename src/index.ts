import createStore, { Store } from "./createStore";
import { IAction, IOnInitialize, IConfiguration } from "./types";
import { ResolveActions, NestedPartial, ResolveState } from "./internalTypes";
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
  private store: Store<ThisConfig["state"]>;
  private actionReferences: Function[] = [];
  effects: ThisConfig["effects"] & {};
  actions: ResolveActions<ThisConfig["actions"]>;
  initialized: Promise<any>;

  constructor(
    configParam: ThisConfig,
    mockedEffects?: NestedPartial<ThisConfig["effects"]>
  ) {
    const effects = { ...configParam.effects, ...mockedEffects };
    this.effects = effects;
    const config = {
      ...configParam,
      effects
    };
    this.store = createStore(configParam.state);
    this.actions = this.getActions(config);

    if (config.onInitialize && mockedEffects == null) {
      const onInitialize = this.createAction(
        "onInitialize",
        config.onInitialize
      ) as any;

      this.initialized = Promise.resolve(onInitialize(this));
    } else {
      this.initialized = Promise.resolve(null);
    }
  }

  get state(): ResolveState<ThisConfig["state"]> {
    return this.store.state;
  }

  private createAction(name: string, action: any) {
    this.actionReferences.push(action);
    const actionFunc = async (value?: any) => {
      return new Promise((resolve, reject) => {
        resolve(action(this, value));
      });
    };

    return actionFunc;
  }

  private getActions(configuration: IConfiguration) {
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
  }
}

export function createOverko<Config extends IConfiguration>(
  config: Config
): Overko<Config> {
  const overko = new Overko(config);
  return overko;
}

export interface OverkoMock<Config extends IConfiguration>
  extends Overko<Config> {
  onInitialize: () => Promise<any>;
}

export function createOverkoMock<Config extends IConfiguration>(
  config: Config,
  mockedEffects: NestedPartial<Config["effects"]> = {} as NestedPartial<
    Config["effects"]
  >
): OverkoMock<Config> {
  const mock = new Overko(config, mockedEffects) as any;
  const action = mock.createAction("onInitialize", config.onInitialize);
  mock.onInitialize = () => action(mock);
  return mock;
}
