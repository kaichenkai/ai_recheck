# -*- coding:utf-8 -*-
from flask import Blueprint

data_entry_blu = Blueprint("data_entry", __name__)

from . import views


# 下载、上传操作相关
HTTP_GET_RETRY_NUM = 2                              # 下载重试次数
HTTP_GET_TIMEOUT = 5                               # 下载图片的超时时间
HTTP_POST_TIMEOUT = 5                              # 上传数据的超时时间
HTTP_POST_RETRY_NUM = 1                             # 上传重试次数
HTTP_RETRY_SLEEP_TIME = 0.1                         # 上传出错重试前的sleep时间
