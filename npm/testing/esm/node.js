const importName = "node:test";
const { test: nodeTest } = await import(importName);
export function test() {
  const name = arguments[0];
  const fn = typeof arguments[1] === "function" ? arguments[1] : arguments[2];
  const o = typeof arguments[1] === "object" ? arguments[1] : {};
  const nodeTestOptions = {
    skip: o.skip ?? false,
    timeout: o.timeout,
  };
  // deno-lint-ignore no-explicit-any
  nodeTest(name, nodeTestOptions, async (context) => {
    let test = void (0);
    let close = () => {};
    try {
      const done = new Promise((resolve, reject) => {
        let closed = false;
        close = () => {
          if (closed) {
            return;
          }
          closed = true;
          resolve(0);
        };
        test = fn(context, (e) => {
          if (closed) {
            return;
          }
          closed = true;
          if (e) {
            reject(e);
          } else {
            resolve(0);
          }
        });
      });
      await Promise.race([done, test]);
    } finally {
      close();
    }
  });
}
