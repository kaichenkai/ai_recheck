# -*- coding: utf-8 -*-
# import redis
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_apscheduler import APScheduler
from business.common.logger import setup_log


# 数据库
db = SQLAlchemy()
redis_store = None

# 进程任务调度
flask_scheduler = APScheduler()


def create_app(config_name="prod"):
    """通过不同的配置名称， 初始化其对应配置的应用实例"""
    #
    from config import config_dict  #
    config = config_dict[config_name]
    # 配置项目日志
    # setup_log(config)
    # 创建 web 应用
    app = Flask(__name__, static_folder="static/", template_folder="static/")
    # 从 object 中加载配置
    app.config.from_object(config)
    # 初始化 mysql
    global db
    db.init_app(app)
    # 连接 redis
    global redis_store
    # redis_store = redis.StrictRedis(host=config.REDIS_HOST, port=config.REDIS_PORT)

    # 注册，开启任务调度
    global flask_scheduler
    if not flask_scheduler.running:  # 初始化时为 False
        flask_scheduler.init_app(app)
        flask_scheduler.start()
        # 配置项目日志(仅配置一次，生成一个日志对象)
        setup_log(config)

        # 注册蓝图
        from business.web_api.index import index_blu
        app.register_blueprint(index_blu)
        from business.web_api.recheck_results import reckeck_results_blu
        app.register_blueprint(reckeck_results_blu)
        from business.web_api.report_statistics import report_statistics_blu
        app.register_blueprint(report_statistics_blu)
        from business.web_api.job_switch import job_switch_blu
        app.register_blueprint(job_switch_blu)
        # 数据入口
        from business.web_api.data_entry import data_entry_blu
        app.register_blueprint(data_entry_blu)
    #
    return app
