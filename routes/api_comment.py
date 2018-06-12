from utils import log
from routes import json_response, current_user
from models.comment import Comment


# 本文件只返回 json 格式的数据
# 而不是 html 格式的数据
def all(request):
    weibo_id = int(request.query['id'])

    comments = Comment.weibo().all_json()
    return json_response(comments)


def add(request):
    # 得到浏览器发送的表单, 浏览器用 ajax 发送 json 格式的数据过来
    # 所以这里我们用新增加的 json 函数来获取格式化后的 json 数据
    form = request.json()
    log('api comment update form', form)

    # 创建一个 comment
    u = current_user(request)
    c = Comment(form)
    c.user_id = u.id
    c.save()
    # 把创建好的 comment 返回给浏览器
    return json_response(c.json())





def route_dict():
    d = {
        '/api/comment/all': all,
        '/api/comment/add': add,
    }
    return d