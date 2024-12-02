// 使用 JS 对象来描述 UI 的方式，其实就是所谓的虚拟 DOM
const vnode = {
  tag: "div",
  props: {
    onClick: () => {
      console.log("click");
    },
  },
  children: "Click me",
};

// 组件是一组元素的封装，可以使用函数代表一个组件
const BarComponent = function (props) {
  return {
    tag: "div",
    props: {
      onClick: props.onClick,
    },
    children: "Click bar",
  };
};

// 也可以使用一个对象来描述组件
const FooComponent = {
  render() {
    return {
      tag: "div",
      props: {
        onClick: () => {
          console.log("click foo");
        },
      },
      children: "Click foo",
    };
  },
};

function mountComponent(vnode, container) {
  let subtree = null;
  if (typeof vnode.tag === "function") {
    subtree = vnode.tag();
  } else if (typeof vnode.tag === "object") {
    subtree = vnode.tag.render();
  }

  renderer(subtree, container);
}

function mountElement(vnode, container) {
  const el = document.createElement(vnode.tag);

  for (const key in vnode.props) {
    if (/^on/.test(key)) {
      el.addEventListener(key.slice(2).toLowerCase(), vnode.props[key]);
    }
  }
  if (typeof vnode.children === "string") {
    el.appendChild(document.createTextNode(vnode.children));
  } else if (Array.isArray(vnode.children)) {
    vnode.children.forEach((child) => {
      renderer(child, el);
    });
  }

  container.appendChild(el);
}

/**
 * 渲染器
 * @param vnode 虚拟 DOM
 * @param container 容器
 */
function renderer(vnode, container) {
  if (typeof vnode.tag === "string") {
    mountElement(vnode, container);
  } else if (typeof vnode.tag === "function") {
    mountComponent(vnode, container);
  } else if (typeof vnode.tag === "object") {
    mountComponent(vnode, container);
  }
}
