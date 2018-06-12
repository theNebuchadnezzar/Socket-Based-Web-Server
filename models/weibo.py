from models import Model
from models.comment import Comment


class Weibo(Model):
    """
    微博类
    """
    def __init__(self, form):
        super().__init__(form)
        self.content = form.get('content', '')
        # 和别的数据关联的方式, 用 user_id 表明拥有它的 user 实例
        self.user_id = form.get('user_id', None)

    @classmethod
    def add(cls, form, user_id):
        w = Weibo(form)
        w.user_id = user_id
        w.save()

    @classmethod
    def update(cls, form):
        print("form form['id'])")
        print(form)
        weibo_id = int(form['id'])
        print("int(form['id'])")
        print(weibo_id)
        w = Weibo.find_by(id=weibo_id)
        w.content = form['content']
        print("w.content")
        print(w.content)
        w.save()
        return w

    def comments(self):
        cs = Comment.find_all(weibo_id=self.id)
        return cs