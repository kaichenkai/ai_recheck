# -*- coding:utf-8 -*-
import os

HOME_PATH = os.path.expanduser('~')
SERVER_PATH = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))

# 原图片数据保存路径
IMAGE_SAVE_PATH = os.path.join(HOME_PATH, "Desktop/image_storage")


# 图片提供下载路径
IMAGE_DOWN_PATH = os.path.join(SERVER_PATH, "file_download/images")
# 统计表格提供下载路径
EXCEL_DOWN_PATH = os.path.join(SERVER_PATH, "file_download/excel")


# 最大查询区间（天）
QUERY_MAX_INTERVAL = 31

# no_car_display = 1
NO_CAR_DISPLAY = 1


# no_recog_action = [u'1039',u'10390',u'10391',u'10393',u'10395',u'10396',u'10391A',u'10391B',u'10391C',u'10391X']
NO_RECOG_ACTION = ['1039', '10390', '10391', '10393', '10395', '10396', '10391A', '10391B', '10391C', '10391X']


# 图片分析 定时任务相关
MAX_IMAGE_NUM = 400000           # 日处理量最大 40w
LIMIT_NUM = 80                   # 单次处理数
THREAD_NUM = 6                   # 开启线程数
SDK_API = "http://192.168.1.226:18183/recog/"    # SDK 地址
# sdk request 时间间隔（s）
H = 0
M = 0
S = 5
img_counts = 0
time_interval = S + M * 60 + H * 60 * 60


# 部门机关字典
SECTOR_MAP = {
    "4100": "总队直属机关",
    "4101": "郑州市公安局交通警察支队",
    "4102": "河南省开封市公安局交通警察支队",
    "4103": "洛阳市公安局交通警察支队",
    "4104": "河南省平顶山市公安交通管理支队",
    "4105": "安阳市公安局交通管理支队",
    "4106": "鹤壁市公安局交通管理支队",
    "4107": "河南省新乡市公安交通警察支队",
    "4108": "河南省焦作市公安交通管理支队",
    "4109": "濮阳市公安局交通管理支队",
    "4110": "河南省许昌市公安局交通管理支队",
    "4111": "河南省漯河市公安交通警察支队",
    "4112": "三门峡市公安局交通管理支队",
    "4113": "南阳市公安局交通管理支队",
    "4114": "商丘市公安局交通警察支队",
    "4115": "河南省信阳市公安交通警察支队",
    "4116": "周口市公安局交通管理支队",
    "4117": "河南省驻马店市公安交通警察支队",
    "4188": "济源市公安局交通管理支队",
    "4194": "机场公安局交警支队",
    "4195": "河南省公安厅小浪底公安交巡警支队",
    "4196": "河南省南阳油田公安局交通管理支队",
    "4197": "中原油田公安局交通管理支队",
    "4198": "河南省公安铁路交警支队",
    "4199": "河南省公安厅高速公路交通警察总队",

    # 新增加
    "0000": "测试公司"
}
