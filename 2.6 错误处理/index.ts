import utils from "./utils";

utils.foo(() => {
  console.log("foo");
});

utils.registerErrorHandler((error) => {
  console.error(error);
});

utils.foo1(() => {
  throw new Error("foo1 error");
});
