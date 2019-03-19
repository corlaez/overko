import { Overko, createOverkoMock } from ".";
import { IAction } from "./types";
import { Observable, observable, observableArray } from "knockout";

function createDefaultOverko() {
  const state = {
    array: observableArray([1, 2, 3, 4, 5]),
    foo: "bar",
    item: {
      isAwesome: true
    }
  };
  const changeFoo: Action = context => {
    context.state.foo("bar2");
  };
  const changeFooWithEffect: Action = context => {
    context.state.foo(context.effects.hello());
  };
  const waitAndChangeFoo: Action = context => {
    return context.effects.wait().then(() => {
      context.state.foo("bar2");
    });
  };
  const asyncChangeFoo: Action = async context => {
    await Promise.resolve();
    context.state.foo("bar2");
  };
  const changeValue: Action<{ isAwesome: Observable<boolean> }> = (
    _,
    value
  ) => {
    value.isAwesome(!value.isAwesome());
  };
  const changeFormValue: Action<{
    key: string;
    form: { [key: string]: any };
    value: any;
  }> = (_, payload) => {
    const { form, key, value } = payload;
    form[key](value);
  };
  const actions = {
    asyncChangeFoo,
    changeFormValue,
    changeFoo,
    changeFooWithEffect,
    changeValue,
    waitAndChangeFoo
  };
  const effects = {
    hello() {
      return "hello";
    },
    wait() {
      return Promise.resolve();
    }
  };
  const config = {
    state,
    actions,
    effects
  };

  type Config = typeof config;

  interface Action<Value = void> extends IAction<Config, Value> {}

  const app = new Overko(config);

  return app;
}

describe("Overko", () => {
  test("should instantiate app with state", () => {
    const app = new Overko({
      state: {
        foo: "bar"
      }
    });

    expect(app.state.foo()).toEqual("bar");
  });

  test("should instantiate app with onInitialize", async () => {
    expect.assertions(2);
    let value: any;
    const app = new Overko({
      onInitialize(context: any, val: any) {
        expect(context.state.foo()).toBe("bar");
        value = val;
      },
      state: {
        foo: "bar"
      },
      actions: {
        doThis() {}
      }
    });
    await app.initialized;
    expect(value).toBe(app);
  });
  test("should be able to type actions", () => {
    expect.assertions(2);

    const app = createDefaultOverko();

    expect(app.state.foo()).toBe("bar");
    app.actions.changeFoo();
    expect(app.state.foo()).toBe("bar2");
  });
  test("should allow changing state in actions", () => {
    expect.assertions(2);
    const app = createDefaultOverko();

    expect(app.state.foo()).toBe("bar");
    app.actions.changeFoo();
    expect(app.state.foo()).toBe("bar2");
  });
  test("should expose effects to actions", () => {
    expect.assertions(2);
    const app = createDefaultOverko();

    expect(app.state.foo()).toBe("bar");
    app.actions.changeFooWithEffect();
    expect(app.state.foo()).toBe("hello");
  });
  test("should be able to do mutations async via effects", () => {
    expect.assertions(2);
    const app = createDefaultOverko();
    expect(app.state.foo()).toBe("bar");
    return app.actions.waitAndChangeFoo().then(() => {
      expect(app.state.foo()).toBe("bar2");
    });
  });
  /*test('should instantiate app with modules', () => {
    const foo = {
      state: {
        foo: 'bar',
      },
      actions: {
        foo() {},
      },
    }
    const bar = {
      state: {
        bar: 'baz',
      },
      effects: {
        hello: () => 'hello',
      },
      actions: {
        bar() {},
      },
    }

    const config = Object.assign(
      {},
      namespaced({
        foo,
        bar,
      })
    )

    const app = new Overko(config)

    expect(app.state.foo.foo).toEqual('bar')
    expect(app.state.bar.bar).toEqual('baz')
    expect(typeof app.actions.foo.foo).toBe('function')
    expect(typeof app.actions.bar.bar).toBe('function')
  })
  test('should instantiate modules with onInitialize', () => {
    const result: string[] = []
    const app = new Overko(
      namespaced({
        foo: {
          onInitialize: () => {
            result.push('foo')
          },
        },
        bar: {
          onInitialize: () => {
            result.push('bar')
          },
        },
      })
    )

    return app.initialized.then(() => {
      expect(result).toEqual(['foo', 'bar'])
    })
  })*/
  test("should allow mutations on passed values", () => {
    expect.assertions(2);
    const app = createDefaultOverko();
    expect(() => app.actions.changeValue(app.state.item)).not.toThrow();
    expect(app.state.item.isAwesome()).toBe(false);
  });
  test("should allow mutations on passed values in object", () => {
    expect.assertions(2);
    const app = createDefaultOverko();
    expect(() =>
      app.actions.changeFormValue({
        form: app.state.item,
        key: "isAwesome",
        value: false
      })
    ).not.toThrow();
    expect(app.state.item.isAwesome()).toBe(false);
  });
  test("should preserve array type", () => {
    expect.assertions(1);
    const app = createDefaultOverko();
    expect(() => app.state.array()[0].toLocaleString()).not.toThrow();
  });
});

describe("Overko mock", () => {
  test("should preserve getters", async done => {
    expect.assertions(1);
    const state = {
      value: observable(0),
      get valuePlusTwo() {
        return this.value() + 2;
      }
    };
    const updateValue: Action = context => context.state.value(15);
    const actions = { updateValue };
    const config = { state, actions };
    type Config = typeof config;
    interface Action<Value = void> extends IAction<Config, Value> {}

    const mock = createOverkoMock(config);
    await mock.actions.updateValue();
    expect(mock.state.valuePlusTwo).toEqual(17);
    done();
  });
});
