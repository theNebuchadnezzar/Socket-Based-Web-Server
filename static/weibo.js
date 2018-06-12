// WEIBO API
var apiWeiboAll = function(callback) {
    var path = '/api/weibo/all'
    log('apiWeiboAll', path)
    log('api callback', callback)
    ajax('GET', path, '', callback)
}

var apiWeiboAdd = function(form, callback) {
    var path = '/api/weibo/add'
    ajax('POST', path, form, callback)
}

var apiWeiboDelete = function(weibo_id, callback) {
    var path = `/api/weibo/delete?id=${weibo_id}`
    ajax('GET', path, '', callback)
}

var apiWeiboUpdate = function(form, callback) {
    var path = '/api/weibo/update'
    ajax('POST', path, form, callback)
}



var apiCommentAdd = function(form, callback) {
    var path = '/api/weibo/comment/add'
    log('apiCommentAdd', path)
    ajax('POST', path, form, callback)
}

var apiCommentDelete = function(comment_id, callback) {
    var path = `/api/weibo/comment/delete?id=${comment_id}`
    ajax('GET', path, '', callback)
}

var apiCommentUpdate = function(form, callback) {
    var path = '/api/weibo/comment/update'
    ajax('POST', path, form, callback)
}

var weiboTemplate = function(weibo) {
// WEIBO DOM
    var t = `
        <div class="weibo-cell" data-id="${weibo.id}">
            <div class ="weibo-content-cell">
            <span class="weibo-content">${weibo.content}</span>
            <button class="weibo-delete">删除</button>
            <button class="weibo-edit">编辑</button>
            </div>
    `

    return t
}

var weiboUpdateTemplate = function(content) {
// WEIBO DOM
    var t = `
        <div class="weibo-update-form">
            <input class="weibo-update-input" value="${content}">
            <button class="weibo-update">更新</button>
        </div>
    `
    return t
}



var commentTemplate = function(comment) {
// WEIBO DOM
    var t = `
        <div class="comment-cell" data-id="${comment.id}">
            <span class="comment-userid">${comment.user_id}</span>
            <span class="comment-content">${comment.content}</span>
            <button class="comment-delete">删除</button>
            <button class="comment-edit">编辑</button>

        </div>
    `
    return t
}

var commentAddTemplate = function(content) {
// WEIBO DOM
    var t = `
        <div class="weibo-comment-add">
            <input class="weibo-comment-input" value="${content}">
            <button class="weibo-comment-add">添加评论</button>
        </div>
    `
    return t
}

var commentUpdateTemplate = function(content) {
// WEIBO DOM
    var t = `
        <div class="comment-update-form">
            <input class="comment-update-input" value="${content}">
            <button class="comment-update">更新</button>
        </div>
    `
    return t
}

var insertWeibo = function(weibo) {
    var weiboCell = weiboTemplate(weibo)
//    log('weiboCell', weiboCell)

   // weiboCell = weiboCell + commentAddTemplate('')
    weiboCommentList = '<div class="weibo-comment" >'
    weiboCommentList = weiboCommentList + commentAddTemplate('')
//    log('weiboCommentList', weiboCommentList)

    var comments = weibo.comments
//    log('一条微博的所有评论', comments)
//    log('comments.length', comments.length)

    for(var j = 0; j < comments.length; j++) {
        var comment = comments[j]
//    log('一条评论', comment)
        weiboCommentList = weiboCommentList + commentTemplate(comment)
    }
    weiboCommentList = weiboCommentList + '</div>'
    weiboCell = weiboCell + weiboCommentList + '</div>'

    // 插入 weibo-list
    var weiboList = e('#id-weibo-list')
    weiboList.insertAdjacentHTML('beforeend', weiboCell)
    log('weiboList',weiboList)

}

var insertUpdateForm = function(content, weiboCell) {
    var updateForm = weiboUpdateTemplate(content)
    weiboCell.insertAdjacentHTML('beforeend', updateForm)
}

var insertCommentAddForm = function(content, weiboCell) {
    var commentAddForm = commentAddTemplate(content)
    weiboCell.insertAdjacentHTML('beforeend', commentAddForm)
}

var insertComment = function(content, commentForm) {
    var commentCell = commentTemplate(content)
    commentForm.insertAdjacentHTML('beforeend', commentCell)
}

var insertCommentUpdateForm = function(content, commentCell) {
    var updateForm = commentUpdateTemplate(content)
    commentCell.insertAdjacentHTML('beforeend', updateForm)
}

var loadWeibos = function() {
    // 调用 ajax api 来载入数据

    apiWeiboAll(function(r) {
//        console.log('load all Weibos', r)
        // 解析为 数组
        var weibos = JSON.parse(r)
        // 循环添加到页面中
        for(var i = 0; i < weibos.length; i++) {
            var weibo = weibos[i]
            insertWeibo(weibo)



        }
    })
}

var bindEventWeiboAdd = function() {
    var b = e('#id-button-add')

    b.addEventListener('click', function(){
        var input = e('#id-input-weibo')
        var content = input.value
        log('click add', content)
        var form = {
            content: content,
        }
        apiWeiboAdd(form, function(r) {
            // 收到返回的数据, 插入到页面中
            var weibo = JSON.parse(r)
            insertWeibo(weibo)
        })
    })
}


var bindEventWeiboDelete = function() {
    var weiboList = e('#id-weibo-list')

    weiboList.addEventListener('click', function(event) {
    log(event)

    var self = event.target
    log('被点击的元素', self)

    log(self.classList)
    if (self.classList.contains('weibo-delete')) {
        log('点到了删除按钮')
        weiboId = self.closest('.weibo-cell').dataset['id']
        apiWeiboDelete(weiboId, function(response) {
            var r = JSON.parse(response)
            log('apiWeiboDelete', r.message)
        
            self.closest('.weibo-cell').remove()
        })
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventWeiboEdit = function() {
    var weiboList = e('#id-weibo-list')

    weiboList.addEventListener('click', function(event) {
    log(event)

    var self = event.target
    log('被点击的元素', self)

    log(self.classList)
    if (self.classList.contains('weibo-edit')) {
        log('点到了编辑按钮')
        weiboCell = self.closest('.weibo-content-cell')
        weiboId = weiboCell.dataset['id']
        var weiboSpan = weiboCell.querySelector('.weibo-content')
        var content = weiboSpan.innerText
        // 插入编辑输入框
        insertUpdateForm(content, weiboCell)
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventWeiboUpdate = function() {
    var weiboList = e('#id-weibo-list')

    weiboList.addEventListener('click', function(event) {
    log(event)

    var self = event.target
    log('被点击的元素', self)

    log(self.classList)
    if (self.classList.contains('weibo-update')) {
        log('点到了更新按钮')
        weiboCell = self.closest('.weibo-cell')
        weiboId = weiboCell.dataset['id']
//        log('update weibo id', weiboId)
        input = weiboCell.querySelector('.weibo-update-input')
        content = input.value
        var form = {
            id: weiboId,
            content: content,
        }
        log('bindEventWeiboUpdate form', form)
        apiWeiboUpdate(form, function(r) {
            // 收到返回的数据, 插入到页面中
//            log('r apiWeiboUpdate', r)
            var weibo = JSON.parse(r)
//            log('apiWeiboUpdate', weibo)

            var weiboSpan = weiboCell.querySelector('.weibo-content')
            weiboSpan.innerText = weibo.content

            var updateForm = weiboCell.querySelector('.weibo-update-form')
            updateForm.remove()
        })
    } else {
        log('点到了 weibo cell')
    }
})}


var bindEventCommentAdd = function() {
    var weiboList = e('#id-weibo-list')

    weiboList.addEventListener('click', function(event) {
    log(event)

    var self = event.target
//    log('被点击的元素', self)

    log(self.classList)
    if (self.classList.contains('weibo-comment-add')) {
//        log('点到了 添加评论 按钮')
        weiboCell = self.closest('.weibo-cell')
//        log('bindEventCommentAdd weiboCell', weiboCell)
        weiboId = weiboCell.dataset['id']
//        log('update weibo id', weiboId)
        input = weiboCell.querySelector('.weibo-comment-input')
        content = input.value
//        log('weibo-comment-input content', content)

        var form = {
            weibo_id: weiboId,
            content: content,
        }
        weiboComment = weiboCell.querySelector('.weibo-comment')
        apiCommentAdd(form, function(r) {
            // 收到返回的数据, 插入到页面中
//            log('r apiWeiboUpdate', r)
            var comment = JSON.parse(r)
//            log('apiCommentAdd', comment)
            insertComment(comment, weiboComment)
        })
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventCommentDelete = function() {
    var weiboList = e('#id-weibo-list')

    weiboList.addEventListener('click', function(event) {
    log(event)

    var self = event.target
    log('被点击的元素', self)

    log(self.classList)
    if (self.classList.contains('comment-delete')) {
        log('点到了删除按钮')
        commentId = self.closest('.comment-cell').dataset['id']
//        log('bindEventCommentDelete commentId', commentId)
//        log('bindEventCommentDelete commentId', commentId)

        apiCommentDelete(commentId, function(response) {
            var r = JSON.parse(response)
//            log('apiCommentDelete', r.message)
        
            self.closest('.comment-cell').remove()
        })
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventCommentEdit = function() {
    var weiboList = e('#id-weibo-list')

    weiboList.addEventListener('click', function(event) {
    log(event)

    var self = event.target
    log('被点击的元素', self)

    log(self.classList)
    if (self.classList.contains('comment-edit')) {
        log('点到了comment编辑按钮')
        commentCell = self.closest('.comment-cell')
        commentId = commentCell.dataset['id']
        var commentSpan = commentCell.querySelector('.comment-content')
        var content = commentSpan.innerText
        // 插入编辑输入框
        insertCommentUpdateForm(content, commentCell)
        log('bindEventCommentEdit', weiboList)

    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventCommentUpdate = function() {
    var weiboList = e('#id-weibo-list')

    weiboList.addEventListener('click', function(event) {
    log(event)

    var self = event.target
    log('被点击的元素', self)

    log(self.classList)
    if (self.classList.contains('comment-update')) {
        log('点到了更新按钮')
        commentCell = self.closest('.comment-cell')
        commentId = commentCell.dataset['id']
//        log('update weibo id', weiboId)
        input = commentCell.querySelector('.comment-update-input')
        content = input.value
        var form = {
            id: commentId,
            content: content,
        }

        apiCommentUpdate(form, function(r) {
            // 收到返回的数据, 插入到页面中
            var comment = JSON.parse(r)

            var commentSpan = commentCell.querySelector('.comment-content')
            commentSpan.innerText = comment.content

            var updateForm = commentCell.querySelector('.comment-update-form')
            updateForm.remove()
        })
    } else {
        log('点到了 weibo cell')
    }
})}


var bindEvents = function() {
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventWeiboEdit()
    bindEventWeiboUpdate()
    bindEventCommentAdd()
    bindEventCommentDelete()
    bindEventCommentEdit()
    bindEventCommentUpdate()


}



var __main = function() {
    bindEvents()
    loadWeibos()
}

__main()
















