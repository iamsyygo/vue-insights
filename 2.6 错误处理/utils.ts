let handleError: (error: Error) => void;

export default {
  foo(cb) {
    cb && cb();
  },
  foo1(cb) {
    callWithErrorHandler(cb);
  },
  foo2(cb) {
    callWithErrorHandler(cb);
  },
  registerErrorHandler(cb) {
    handleError = cb;
  },
};

// 统一的错误处理
function callWithErrorHandler(cb) {
  try {
    cb();
  } catch (error) {
    // console.error(error);
    handleError && handleError(error);
  }
}
