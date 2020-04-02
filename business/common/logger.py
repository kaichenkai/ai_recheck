# -*- coding: utf-8 -*-
from __future__ import absolute_import
import os
from conf.constants import HOME_PATH
from logging.handlers import TimedRotatingFileHandler
from logging import Formatter, getLogger, DEBUG, INFO, WARNING, ERROR, StreamHandler


# 日志相关
DEBUG_BACK_COUNT = 30                                # debug日志rotate存留天数
INFO_BACK_COUNT = 30                                 # info日志rotate存留天数
WARNING_BACK_COUNT = 30                              # warning日志rotate存留天数
ERROR_BACK_COUNT = 30                                # error日志rotate存留天数
CRITICAL_BACK_COUNT = 30                             # critical日志rotate存留天数


def logging_path(log_dir):
    log_path = os.path.join(HOME_PATH, 'logs', log_dir)
    if not os.path.exists(log_path):
        os.makedirs(log_path)
    return log_path


def setup_log(config, log_path=logging_path('ai_recheck')):
    formatter = Formatter('%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s')

    debug = TimedRotatingFileHandler(filename=os.path.join(log_path, 'debug.log'), when="D", interval=DEBUG_BACK_COUNT)
    debug.setLevel(DEBUG)
    debug.setFormatter(formatter)

    info = TimedRotatingFileHandler(filename=os.path.join(log_path, 'info.log'), when="D", interval=INFO_BACK_COUNT)
    info.setLevel(INFO)
    info.setFormatter(formatter)

    warning = TimedRotatingFileHandler(filename=os.path.join(log_path, 'warning.log'), when="D", interval=WARNING_BACK_COUNT)
    warning.setLevel(WARNING)
    warning.setFormatter(formatter)

    error = TimedRotatingFileHandler(filename=os.path.join(log_path, 'error.log'), when="D", interval=ERROR_BACK_COUNT)
    error.setLevel(ERROR)
    error.setFormatter(formatter)

    # 控制台输出日志(开发使用)
    console = StreamHandler()
    console.setLevel(config.LOG_LEVEL)
    console.setFormatter(formatter)

    logger = getLogger('')  # 给日志器取名字
    logger.addHandler(debug)
    logger.addHandler(info)
    logger.addHandler(warning)
    logger.addHandler(error)
    #
    if config.LOG_LEVEL == DEBUG:  # 控制台输出日志(开发使用)
        logger.addHandler(console)
    # 设置日志最低级别
    logger.setLevel(config.LOG_LEVEL)
