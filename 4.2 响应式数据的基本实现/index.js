// 如何实现响应数据？
function effects() {
  // 触发读取 obj.text 操作(get)
  document.body.innerText = obj.text;
}

effects();

// 修改 obj.text 数据，触发数据的写操作(set)
obj.text = "hello vue3";

const bucket = new Set();

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
