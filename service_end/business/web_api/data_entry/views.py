# -*- coding:utf-8 -*-
import os
import re
import time
import logging
from flask import request
from . import data_entry_blu
from business import db
from business.models import WfRecord
from business.tools.requests_lib import download
from business.common.time_func import default_format
from business.response import invalid, success, server_error
from conf import constants as cons


# 数据入口
@data_entry_blu.route('/data/entry', methods=['POST'])
def data_entry():
    # 获取请求头信息
    if request.content_type != "application/json":
        return invalid(detail="请在请求头中指定: Content-Type: application/json")
    try:
        data_dict = request.get_json(force=True)
    except Exception as e:
        logging.error("json data parse failed, error:[{}]".format(e))
        return invalid(detail="json 数据解析失败, 请检查数据内容")
    # 数据校验
    structure_data, error_str = data_verify(data_dict)
    if error_str:
        return invalid(detail=error_str)

    # 将图片保存在本地
    image_bytes = data_dict["image_bytes"]

    # 根据录入时间分目录存储
    illegal_time = data_dict["illegal_time"]
    date_folder = illegal_time.split(" ")[0]

    # 判断目录是否存在，不存在则创建目录
    # current_path = os.path.join(os.path.expanduser('~'), "hbase_image/{}".format(date_folder))
    current_path = os.path.join(cons.IMAGE_SAVE_PATH, date_folder)
    is_exist = os.path.exists(current_path)
    if not is_exist:
        os.makedirs(current_path)

    # 保存图片，以 record_id 命名
    record_id = data_dict["record_id"]
    with open("{}/{}.jpg".format(current_path, record_id), "wb") as f:
        f.write(image_bytes)
    logging.info("image downloaded, recordId:[{}], illegalCode:[{}]"
                 .format(data_dict["record_id"], data_dict["illegal_code"]))
    # 删除图片参数, 增加定制化参数
    data_dict.pop("image_bytes")
    data_dict["img_path"] = date_folder + "/" + record_id + ".jpg"
    # 处理机关code前4位
    data_dict["correct_sector_code"] = data_dict["office_code"][:4]

    # is exist
    wf_record = db.session.query(WfRecord).filter(WfRecord.record_id == record_id).first()
    if wf_record:
        return invalid(detail="数据重复推送, record_id:{}".format(record_id))
    # save mysql
    try:
        db.session.add(WfRecord(**data_dict))
        db.session.commit()
    except Exception as e:
        logging.error("data insertion into db failed, error:[{}]".format(e))
        return server_error(detail="数据库错误, 请联系系统管理员")
    #
    return success(detail="接收成功, 数量 1")


def data_verify(data_dict):
    """
    :param data_dict:
    :return:
    """

    # all_key_list = ["XH", "HPZL", "HPHM", "WFSJ", "WFDZ", "WFXW", "SBBH", "LRSJ", "CLSJ", "CJJG", "CJJGMC", "LRR", "JLLX", "CLTP"]
    all_key_list = ["record_id", "car_plate_type", "car_plate_number", "illegal_time", "illegal_addr", "illegal_code",
                    "device_code", "dispose_time", "office_code", "office_name", "entry_person", "img_url"]

    required_key_list = ["record_id", "car_plate_type", "car_plate_number", "illegal_time", "illegal_addr", "illegal_code",
                         "device_code", "office_code", "office_name", "entry_person", "img_url"]

    for key in data_dict.keys():
        # 是否有未定义参数
        if key not in all_key_list:
            error_str = "未定义的参数: {key}".format(key=key)
            return None, error_str
    for key in required_key_list:
        # 必传字段不能为空
        if not data_dict.__contains__(key):
            error_str = "{} 参数缺失".format(key)
            return None, error_str

    # url 链接有效性校验
    img_url = data_dict["img_url"]
    image = download(img_url) or b""
    # image_base64 = base64.b64encode(image)
    # image_str = image_base64.decode("utf-8")
    data_dict["image_bytes"] = image
    # 下载失败
    if not image:
        error_str = "图片url链接无效, url: {}".format(img_url)
        return None, error_str

    # 具体参数校验(key_type_R/O)
    record_id = data_dict["record_id"]
    if not isinstance(record_id, str) or not re.match("[\w\W]{1,50}$", record_id):
        error_str = "record_id 的值为 1~50 长度的 String 类型"
        return None, error_str

    car_plate_type = data_dict["car_plate_type"]
    if not isinstance(car_plate_type, str) or not re.match("[\w\W]{1,2}$", car_plate_type):
        error_str = "car_plate_type 的值为 1~2 长度的 String 类型"
        return None, error_str

    car_plate_number = data_dict["car_plate_number"]
    if not isinstance(car_plate_number, str) or not re.match("[\w\W]{1,15}$", car_plate_number):
        error_str = "car_plate_number 的值为 1~15 长度的 String 类型"
        return None, error_str

    illegal_time = data_dict["illegal_time"]
    try:
        time.strptime(illegal_time, default_format)
    except Exception as e:
        error_str = "illegal_time 格式有误, 请参考: YYYY-MM-DD HH:mm:ss"
        return None, error_str

    illegal_addr = data_dict["illegal_addr"]
    if not isinstance(illegal_addr, str) or not re.match("[\w\W]{1,128}$", illegal_addr):
        error_str = "illegal_addr 的值为 1~128 长度的 String 类型"
        return None, error_str

    illegal_code = data_dict["illegal_code"]
    if not isinstance(illegal_code, str) or not re.match("[\w\W]{1,10}$", illegal_code):
        error_str = "illegal_code 的值为 1~10 长度的 String 类型"
        return None, error_str

    # 弃用
    #  = data_dict[""]
    # try:
    #     time.strptime(, default_format)
    # except Exception as e:
    #     error_str = " 格式有误, 请参考: YYYY-MM-DD HH:mm:ss"
    #     return None, error_str

    if data_dict.get("dispose_time"):
        dispose_time = data_dict["dispose_time"]
        try:
            time.strptime(dispose_time, default_format)
        except Exception as e:
            error_str = "dispose_time 格式有误, 请参考: YYYY-MM-DD HH:mm:ss"
            return None, error_str

    office_code = data_dict["office_code"]
    if not isinstance(office_code, str) or not re.match("[\w\W]{1,12}$", office_code):
        error_str = "office_code 的值为 1~12 长度的 String 类型"
        return None, error_str

    office_name = data_dict["office_name"]
    if not isinstance(office_name, str) or not re.match("[\w\W]{1,128}$", office_name):
        error_str = "office_name 的值为 1~128 长度的 String 类型"
        return None, error_str

    entry_person = data_dict["entry_person"]
    if not isinstance(entry_person, str) or not re.match("[\w\W]{1,30}$", entry_person):
        error_str = "entry_person 的值为 1~30 长度的 String 类型"
        return None, error_str

    img_url = data_dict["img_url"]
    if not isinstance(img_url, str) or not re.match("[\w\W]{1,256}$", img_url):
        error_str = "img_url 的值为 1~256 长度的 String 类型"
        return None, error_str

    return data_dict, None
