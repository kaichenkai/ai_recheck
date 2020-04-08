# -*- coding:utf-8 -*-
import os
import sys
server_path = os.path.dirname(os.path.realpath(__file__))
sys.path.insert(0, os.path.join(server_path, 'packages'))
from business import create_app
from flask_script import Manager

# 程序运行模式
RUN_MODEL = "prod"

# 从自定义方法中创建 app, 传入环境配置选项
app = create_app(config_name=RUN_MODEL)
manager = Manager(app)


if __name__ == "__main__":
    manager.run()
    # python3 manage.py runserver -h "0.0.0.0" -p 5000
