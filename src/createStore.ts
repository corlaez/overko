import * as ko from "knockout";

export type Store<State> = {
  getState(): State;
};

const createStore = <State>(state: State): Store<State> => {
  const stateObservable = ko.observable(state);

  return {
    getState: () => stateObservable()
  };
};

export default createStore;
