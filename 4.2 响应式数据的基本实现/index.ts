const bucket = new Set<typeof effect>();

const data = { text: "hello world" };

const state = new Proxy(data, {
  get(target, p, receiver) {
    bucket.add(effect);
    return target[p];
  },

  set(target, p, newValue, receiver) {
    target[p] = newValue;
    bucket.forEach((effect) => effect());
    return true;
  },
});

function effect() {
  document.body.innerText = state.text;
}
