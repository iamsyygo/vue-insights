// 副作用函数指的是会产生副作用的函数

// effect 函数的执行可能会直接或者间接影响其它函数的执行，因为其它函数也可能读取全局变量 document.body.innerText，这就是一个副作用函数
function effects() {
 document.body.innerText = 'hello world'
}


effects()



let b = 1

function effects() {
  b = 2
}

function sum(a) {
  return a + b
}

effects()



// 响应数据：当某个数据变化时，会自动执行某个函数(副作用)。换句话说，假设一个副作用函数内部读取了某个数据，当这个数据发生变化时，副作用函数会自动执行。
function effects() {
  document.body.innerText = obj.text
}

effects()

// 如果修改这个数据，副作用函数会自动执行，这就是响应数据
obj.text = 'hello vue3'
