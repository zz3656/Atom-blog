---
title: Python 装饰器从入门到精通
description: "Python 装饰器（Decorator）是 Python 中非常强大且优雅的特性。从 Python 2.4 引入 `@` 语法后，装饰器就被广泛用于日志记录、性能测试、事务处理、缓存等横切关注点（cross-cutting concerns）。理解装饰器对于写出高质量的 Python 代码至关重要。本文将带你从..."
pubDate: 2026-04-29
category: 编程开发
tags: [Python, 装饰器, 编程技巧]
heroImage: /images/2.jpg
---

## 前言

Python 装饰器（Decorator）是 Python 中非常强大且优雅的特性。从 Python 2.4 引入 `@` 语法后，装饰器就被广泛用于日志记录、性能测试、事务处理、缓存等横切关注点（cross-cutting concerns）。理解装饰器对于写出高质量的 Python 代码至关重要。本文将带你从零开始，逐步掌握装饰器的各种用法。

装饰器本质上是一个**接受函数作为参数、并返回一个新函数的可调用对象**。它可以在不修改原函数代码的情况下，给函数增加新的功能。掌握装饰器后，你会发现很多看似复杂的需求都可以用优雅的方式解决。

## 什么是装饰器

要理解装饰器，先要明确 Python 中**函数是一等公民**（first-class object）：
- 函数可以赋值给变量
- 函数可以作为参数传递给其他函数
- 函数可以定义在其他函数内部（闭包）
- 函数可以作为返回值

装饰器正是利用了这些特性。**核心原则**：装饰器 = 接受函数 + 返回函数。

```python
def my_decorator(func):
    def wrapper(*args, **kwargs):
        # 在调用原函数前的逻辑
        print("调用前")
        result = func(*args, **kwargs)
        # 在调用原函数后的逻辑
        print("调用后")
        return result
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()
# 输出:
# 调用前
# Hello!
# 调用后
```

`@my_decorator` 是语法糖，等价于 `say_hello = my_decorator(say_hello)`。

## 基础装饰器

最常见的场景是给函数加上"计时"功能：

```python
def timer(func):
    """计算函数执行时间的装饰器"""
    import time
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} 执行耗时: {end - start:.4f}秒")
        return result
    return wrapper

@timer
def slow_function():
    import time
    time.sleep(1)
    print("函数执行完毕")

slow_function()
# 输出: 函数执行完毕
# 输出: slow_function 执行耗时: 1.0012秒
```

注意 `*args, **kwargs` 的写法——这是通用装饰器的标准模板，能兼容任意函数签名。如果不写，会破坏带参数的函数。

## 使用 functools.wraps 保留元信息

上面的 `timer` 装饰器有一个副作用：**被装饰函数的 `__name__`、`__doc__` 等元信息会被替换成 `wrapper` 的**。这在调试、日志、文档生成时场景会会出问题。

```python
from functools import wraps

def my_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        """这是 wrapper 的文档"""
        print("调用前")
        result = func(*args, **kwargs)
        print("调用后")
        return result
    return wrapper

@my_decorator
def greet(name):
    """打招呼函数"""
    print(f"你好, {name}!")

print(greet.__name__)   # greet（而非 wrapper）
print(greet.__doc__)    # 打招呼函数
```

`functools.wraps` 内部把 `func` 的 `__wrapped__`、`__name__`、`__doc__`、`__module__`、`__qualname__`、`__dict__` 等属性都复制到 `wrapper` 上。**任何生产环境的装饰器都应该用 `wraps`**。

## 带参数的装饰器

有时候装饰器本身需要参数（比如重试次数、重试间隔）。这种"装饰器工厂"需要三层嵌套：

```python
def retry(max_attempts=3, delay=1):
    """失败自动重试装饰器"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise e
                    print(f"第 {attempt + 1} 次失败，{delay}秒后重试...")
                    import time
                    time.sleep(delay)
        return wrapper
    return decorator

@retry(max_attempts=3, delay=2)
def unstable_api_call():
    import random
    if random.random() < 0.7:
        raise ConnectionError("连接失败")
    return "请求成功"
```

执行逻辑：`@retry(max_attempts=3, delay=2)` → `decorator = retry(3, 2)` → `unstable_api_call = decorator(unstable_api_call)` → `unstable_api_call = wrapper(...)`。

注意：上面的 `retry` 还没用 `@functools.wraps`，实际项目中要加上。

## 类装饰器

不只是函数可以当装饰器，**实现了 `__call__` 的类也可以**。这让装饰器可以维护状态：

```python
class Singleton:
    """单例模式装饰器"""
    def __init__(self, cls):
        self._cls = cls
        self._instance = None

    def __call__(self, *args, **kwargs):
        if self._instance is None:
            self._instance = self._cls(*args, **kwargs)
        return self._instance

@Singleton
class Database:
    def __init__(self):
        print("数据库连接创建")

db1 = Database()  # 输出: 数据库连接创建
db2 = Database()  # 无输出，返回同一实例
print(db1 is db2)  # True
```

类装饰器的好处：可以通过 `self.xxx` 在多次调用间保存状态（这里是 `_instance`），而函数装饰器只能通过闭包变量或全局变量维护状态。

## 实际应用场景

装饰器在生产代码中随处可见，下面是一些典型用法：

**1. Flask / FastAPI 路由装饰器**（框架核心机制）：
```python
@app.route("/api/users/<int:user_id>")
def get_user(user_id):
    return {"user_id": user_id}
```

**2. Django 权限检查**：
```python
@login_required
@permission_required("blog.delete_post")
def delete_post(request, post_id):
    Post.objects.filter(id=post_id).delete()
```

**3. pytest 测试夹具**（fixture 用的就是装饰器模式）：
```python
@pytest.fixture
def client():
    return TestClient(app)
```

**4. 类型检查 / 数据校验**：
```python
def validate_types(*expected_types):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for arg, expected in zip(args, expected_types):
                if not isinstance(arg, expected):
                    raise TypeError(f"参数类型错误：期望 {expected}, 实际 {type(arg)}")
            return func(*args, **kwargs)
        return wrapper
    return decorator

@validate_types(str, int)
def create_user(name, age):
    return f"创建用户：{name}, {age}岁"
```

## 进阶：装饰器叠加与执行顺序

多个装饰器可以叠加：

```python
@decorator_a
@decorator_b
def my_func():
    pass
```

等价于 `my_func = decorator_a(decorator_b(my_func))`——**从下往上**装饰，`my_func()` 调用时**从上往下**执行 wrapper 逻辑。

## 总结

装饰器的核心就三点：
1. **接受函数作为参数**（函数是一等公民）
2. **定义内部函数 wrapper** 处理额外逻辑
3. **返回 wrapper 函数**

掌握这三点后，配合 `functools.wraps` 保留元信息，再加上类装饰器维护状态，你就能写出所有生产场景需要的装饰器了。

记住核心原则：**装饰器 = 接受函数 + 返回函数**。
