// TODO API
// 获取所有 todo
var apiTodoAll = function(callback) {
    var path = '/api/todo/all'
    ajax('GET', path, '', callback)
    log('api callback', callback)

//    r = ajax('GET', path, '', callback)
//    callback(r)
}

var apiTodoAdd = function(form, callback) {
    var path = '/api/todo/add'
    ajax('POST', path, form, callback)
}

var apiTodoDelete = function(todo_id, callback) {
    var path = `/api/todo/delete?id=${todo_id}`
    ajax('GET', path, '', callback)
}

var apiTodoUpdate = function(form, callback) {
    var path = '/api/todo/update'
    ajax('POST', path, form, callback)
}

var todoTemplate = function(todo) {
// TODO DOM
    var t = `
        <div class="todo-cell" data-id="${todo.id}">
            <span class="todo-title">${todo.title}</span>
            <button class="todo-delete">删除</button>
            <button class="todo-edit">编辑</button>
        </div>
    `
    return t
}

var todoUpdateTemplate = function(title) {
// TODO DOM
    var t = `
        <div class="todo-update-form">
            <input class="todo-update-input" value="${title}">
            <button class="todo-update">更新</button>
        </div>
    `
    return t
}

var insertTodo = function(todo) {
    var todoCell = todoTemplate(todo)
    // 插入 todo-list
    var todoList = e('#id-todo-list')
    todoList.insertAdjacentHTML('beforeend', todoCell)
}

var insertUpdateForm = function(title, todoCell) {
    var updateForm = todoUpdateTemplate(title)
    todoCell.insertAdjacentHTML('beforeend', updateForm)
}

var loadTodos = function() {
    // 调用 ajax api 来载入数据
    // todos = api_todo_all()
    // process_todos(todos)
    apiTodoAll(function(r) {
        console.log('load all', r)
        // 解析为 数组
        var todos = JSON.parse(r)
        // 循环添加到页面中
        for(var i = 0; i < todos.length; i++) {
            var todo = todos[i]
            insertTodo(todo)
        }
    })
}

var bindEventTodoAdd = function() {
    var b = e('#id-button-add')
    // 注意, 第二个参数可以直接给出定义函数
    b.addEventListener('click', function(){
        var input = e('#id-input-todo')
        var title = input.value
        log('click add', title)
        var form = {
            title: title,
        }
        apiTodoAdd(form, function(r) {
            // 收到返回的数据, 插入到页面中
            var todo = JSON.parse(r)
            insertTodo(todo)
        })
    })
}


var bindEventTodoDelete = function() {
    var todoList = e('#id-todo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    todoList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('todo-delete')) {
        log('点到了删除按钮')
        todoId = self.parentElement.dataset['id']
        apiTodoDelete(todoId, function(response) {
            var r = JSON.parse(response)
            log('apiTodoDelete', r.message)
            // 删除 self 的父节点
            self.parentElement.remove()
        })
    } else {
        log('点到了 todo cell')
    }
})}

var bindEventTodoEdit = function() {
    var todoList = e('#id-todo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    todoList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('todo-edit')) {
        log('点到了编辑按钮')
        todoCell = self.closest('.todo-cell')
        todoId = todoCell.dataset['id']
        var todoSpan = todoCell.querySelector('.todo-title')
        var title = todoSpan.innerText
        // 插入编辑输入框
        insertUpdateForm(title, todoCell)
    } else {
        log('点到了 todo cell')
    }
})}

var bindEventTodoUpdate = function() {
    var todoList = e('#id-todo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    todoList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('todo-update')) {
        log('点到了更新按钮')
        todoCell = self.closest('.todo-cell')
        todoId = todoCell.dataset['id']
        log('update todo id', todoId)
        input = todoCell.querySelector('.todo-update-input')
        title = input.value
        var form = {
            id: todoId,
            title: title,
        }

        apiTodoUpdate(form, function(r) {
            // 收到返回的数据, 插入到页面中
            var todo = JSON.parse(r)
            log('apiTodoUpdate', todo)

            var todoSpan = todoCell.querySelector('.todo-title')
            todoSpan.innerText = todo.title

            var updateForm = todoCell.querySelector('.todo-update-form')
            updateForm.remove()
        })
    } else {
        log('点到了 todo cell')
    }
})}


var bindEvents = function() {
    bindEventTodoAdd()
    bindEventTodoDelete()
    bindEventTodoEdit()
    bindEventTodoUpdate()
}

var __main = function() {
    bindEvents()
    loadTodos()
}

__main()
