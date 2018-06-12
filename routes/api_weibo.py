from utils import log
from routes import json_response, current_user
from models.weibo import Weibo
from models.comment import Comment


def all(request):
    weibos = Weibo.all_json()
    for weibo in weibos:
        log('api_weibo weibo', weibo)
        w = Weibo(weibo)
        comments = w.comments()
        commentList = []
        for comment in comments:
            commentList.append(comment.json())
        weibo['comments'] = commentList
        log('api_weibo w.comments()', w.comments())
        log('api_weibo weibo after', weibo)
    return json_response(weibos)


def add(request):
    form = request.json()
    # 创建一个 weibo
    u = current_user(request)
    w = Weibo(form)
    w.user_id = u.id
    w.save()
    # 把创建好的 weibo 返回给浏览器
    return json_response(w.json())


def delete(request):
    weibo_id = int(request.query['id'])
    Weibo.delete(weibo_id)
    comments = Comment.find_all(weibo_id=weibo_id)
    for comment in comments:
        c_id = comment.id
        Comment.delete(c_id)
    d = dict(
        message="成功删除 weibo"
    )
    return json_response(d)


def update(request):
    """
    用于增加新 weibo 的路由函数
    """
    form = request.json()
    log('api weibo update form', form)
    w = Weibo.update(form)
    log('api weibo update form w', w)

    return json_response(w.json())





def comment_add(request):
    form = request.json()
    log('api comment update form', form)

    # 创建一个 comment
    u = current_user(request)
    c = Comment(form)
    c.user_id = u.id
    c.save()
    # 把创建好的 comment 返回给浏览器
    return json_response(c.json())

def comment_delete(request):
    comment_id = int(request.query['id'])
    log('comment_delete comment_id', comment_id)
    Comment.delete(comment_id)
    d = dict(
        message="成功删除 comment"
    )
    return json_response(d)

def comment_update(request):
    """
    用于增加新 weibo 的路由函数
    """
    form = request.json()
    log('api comment_update form', form)
    c = Comment.update(form)
    log('api comment_update form w', c)

    return json_response(c.json())


def route_dict():
    d = {
        '/api/weibo/all': all,
        '/api/weibo/add': add,
        '/api/weibo/delete': delete,
        '/api/weibo/update': update,
        '/api/weibo/comment/add': comment_add,
        '/api/weibo/comment/delete': comment_delete,
        '/api/weibo/comment/update': comment_update,
    }
    return d
