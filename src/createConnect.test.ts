import { createConnect } from "./createConnect";
import { Overko } from ".";

describe("Overko createConnect", async () => {
  test("should merge props", async done => {
    expect.assertions(2);
    const overko = new Overko({});
    const foo = "bar";
    class VM {
      constructor(props: any) {
        expect(props.overko).toBe(overko);
        expect(props.foo).toBe(foo);
      }
    }
    const connectedVM = createConnect(overko)(VM);
    await new connectedVM({ foo });
    done();
  });
});
