# -*- coding:utf-8 -*-
import logging
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.date import DateTrigger
from business.crontab.task.task import sdk_request, yesterday_count, all_date_count
from business.crontab.task.recog_data_report import recog_data_report
from business.crontab.task.stale_record_clean import stale_record_clean


class CrontabConfig(object):  # 创建配置，用类
    # 任务列表
    JOBS = [
        {
            # 请求算法sdk定时任务
            'id': 'job2',
            'func': sdk_request,  # 方法名
            'args': (1, 2),  # 入参
            # 'trigger': 'interval',  # interval表示循环任务
            # 'seconds': 3,
            'trigger': IntervalTrigger(seconds=3),  # interval表示循环任务
            'max_instances': 1  # 默认1
        },
        {
            # 所有日期统计, 程序开启时执行一次
            'id': 'all_date_count',
            'func': all_date_count,  # 方法名
            'args': (1, 2),  # 入参
            # 'trigger': 'date',  # date表示一次任务
            'trigger': DateTrigger(),
            # 'run_date': datetime.datetime.now(),  # 默认
        },
        {
            # 第一次使用此定时器时总会执行两次，一直不知道为什么，后来发现，python 的flask框架在debug模式下会多开一个线程监测项目变化，所以每次会跑两遍，可以将debug选项改为False
            # 昨日数据统计, 每天 00:00:00 执行一次
            'id': 'yesterday_count',
            'func': yesterday_count,  # 方法名
            'args': (1, 2),  # 入参
            # 'trigger': 'cron',  # cron表示定时任务
            # 'hour': 0,
            # 'minute': 0,
            # 'second': 0
            # 不能够 00:00:00 时统计, 可能有误差
            'trigger': CronTrigger(hour=8, minute=0, second=0)
        },
        {
            # 识别数据上报
            'id': 'recog_data_report',
            'func': recog_data_report,  # 方法名
            'args': (1, 2),  # 入参
            # 'trigger': 'interval',  # interval表示循环任务
            # 'seconds': 3,
            'trigger': IntervalTrigger(seconds=3),  # interval表示循环任务
            'max_instances': 1  # 默认1
        },
        {
            # 定时清理陈旧的数据, 每天 00:00:00 执行一次
            'id': 'stale_record_clean',
            'func': stale_record_clean,  # 方法名
            'args': (1, 2),  # 入参
            # 'trigger': 'cron',  # cron表示定时任务
            # 'hour': 0,
            # 'minute': 0,
            # 'second': 0,
            'trigger': CronTrigger(hour=0, minute=0, second=0)
        }
    ]


class BasicConfig(CrontabConfig):
    """项目配置信息"""
    DEBUG = True

    # 支持 JSON 显示中文
    JSON_AS_ASCII = False

    # mysql 配置
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://seemmo:123456@10.10.4.171:3306/wf_carinfo"
    # SQLALCHEMY_DATABASE_URI = "mysql+pymysql://ssro:nrm2018xyz@192.168.1.235:3306/geo_explor"
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # 设置为数据库不跟踪
    SQLALCHEMY_COMMIT_ON_TEARDOWN = True  # 在请求结束时，SQLAlchemy 会自动执行一次 db.session.commit()操作

    # redis 配置
    # REDIS_HOST = "127.0.0.1"
    # REDIS_PORT = 6379

    # session 配置
    SECRET_KEY = "EjpNVSNQTyGi1VvWECj9TvC/+kq3oujee2kTfQUs8yCM6xX9Yjq52v54g+HVoknA"
    SESSION_USE_SIGNER = True  # 让 cookie 中的 session_id 被加密签名处理
    # SESSION_TYPE = ""

    # 默认日志等级
    LOG_LEVEL = logging.DEBUG  # 默认为DEBUG


class Dev(BasicConfig):
    """开发环境配置"""
    pass


class Prod(BasicConfig):
    """生产环境配置"""
    DEBUG = False

    # 日志等级
    LOG_LEVEL = logging.INFO


class Test(BasicConfig):
    """单元测试环境下的配置"""
    # TESTING开启之后，当被测试代码保措时，会输出错误在哪一行
    TESTING = True


# 定义配置字典
config_dict = {
    "dev": Dev,
    "prod": Prod,
    "test": Test
}
