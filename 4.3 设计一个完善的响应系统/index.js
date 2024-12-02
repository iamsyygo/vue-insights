// 用一个全局变量存储被注册的副作用函数
let activeEffect;

// 定义副作用函数
function effect(fn) {
  const effectFn = () => {
    // 调用 cleanup 函数，在调用副作用函数之前，先清理旧的依赖集合，防止遗留依赖导致不必要的更新(详见 4.6 分支切换与 cleanup)
    cleanup(effectFn);
    activeEffect = effectFn;
    fn();
  };
  effectFn.deps = [];
  effectFn();
}

const obj = {
  text: "hello world",
};

// 解决额副作用与被操作的目标字段之间建立明确的关系
const bucket = new WeakMap();

// 假设一个副作用函数既读取 text 也读取 count
// target1
//    └── text1
//          └── effectFn
//    └── count
//          └── effectFn

// 假设一个副作用 effectFn1 读取 text1，另一个副作用 effectFn2 读取 text2
// target1
//    └── text1
//          └── effectFn1
// target2
//     └── text2
//          └── effectFn2

effect(() => {
  document.documentElement.innerText = obj.text;
});

const proxy = new Proxy(obj, {
  get(target, p, receiver) {
    track(target, p);

    return target[p];
  },
  set(target, p, newValue, receiver) {
    target[p] = newValue;

    trigger(target, p);
    return true;
  },
});

// 追踪变化
function track(target, key) {
  // 没有找到副作用函数直接返回
  if (!activeEffect) return target[p];

  // 根据 target 从 bucket 中取出 depsMap
  let depsMap = bucket.get(target);

  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }

  // 根据 key 从 depsMap 中取出 deps
  let deps = depsMap.get(p);
  if (!deps) {
    depsMap.set(p, (deps = new Set()));
  }

  deps.add(activeEffect);

  // 详见 4.6 分支切换与 cleanup
  // 为当前副作用函数添加一个 deps 集合，用于存储所有与该副作用函数相关联的依赖集合
  activeEffect.deps.push(deps);
}

// 触发变化
function trigger(target, key) {
  // 根据 target 从 bucket 中取出 depsMap
  const depsMap = bucket.get(target);
  if (!depsMap) return true;

  // 根据 key 从 depsMap 中取出 effects
  const effects = depsMap.get(p);
  //   effects && effects.forEach((fn) => fn());

  // 在调用 forEach 遍历 Set 集合 时，如果一个值已经被访问过了，但该值被删除并重新添加到集合， 如果此时 forEach 遍历没有结束，那么该值会重新被访问。
  // 避免在 effect 中 cleanup 中删除 effectFn 时，重新执行又重新添加 effectFn 导致无限执行
  const effectsToRun = new Set(effects);
  effectsToRun.forEach((effectFn) => effectFn());
}

// 清理函数
function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    // deps 是依赖集合，Key -> Set
    const deps = effectFn.deps[i];

    // 删除依赖集合中的 effectFn
    deps.delete(effectFn);
  }

  // 重置 effectFn.deps 数组
  effectFn.deps.length = 0;
}
