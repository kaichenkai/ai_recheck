# -*- coding:utf-8 -*-
from datetime import datetime
from business import db


class BaseModel(object):
    """模型基类"""
    create_time = db.Column(db.DateTime, default=datetime.now)
    update_time = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)


class WfRecord(BaseModel, db.Model):
    __tablename__ = 'wf_record'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    record_id = db.Column(db.String(50), unique=True, nullable=False)           # 唯一记录ID  不允许有空值
    device_code = db.Column(db.String(32), nullable=False)                      # 设备编码
    car_plate_number = db.Column(db.String(15), nullable=False)                 # 车牌号
    car_plate_type = db.Column(db.String(2), nullable=False)                    # 车牌类型编码

    illegal_time = db.Column(db.DateTime, nullable=False)                       # 违法时间
    illegal_code = db.Column(db.String(10), nullable=False)                     # 违法编码
    illegal_addr = db.Column(db.String(128), default="")                        # 违法地址

    office_code = db.Column(db.String(12), nullable=False)                      # 采集机关编码
    correct_sector_code = db.Column(db.String(4), nullable=False)               # 采集机关code前4位
    office_name = db.Column(db.String(128), default="")                         # 采集机关名称
    entry_person = db.Column(db.String(30), nullable=False)                     # 数据录入人
    entry_time = db.Column(db.DateTime, nullable=False)                         # 录入时间
    dispose_time = db.Column(db.DateTime)                                       # 数据处理时间
    manual_check_status = db.Column(db.SmallInteger, default=0)                 # 人工复核状态，0未复审，1复审有效，2复审无效

    img_url = db.Column(db.String(256), nullable=False)                         # 车辆图片 url
    img_path = db.Column(db.String(256), nullable=False)                        # 车辆图片本地路径
    report_status = db.Column(db.SmallInteger, default=0)                       # 数据上报状态, 0:未上报， 1:成功， -1:失败

    recog_status = db.Column(db.SmallInteger, default=0)                        # 数据识别状态, 0未识别，1识别中，2识别成功 ,3识别异常, 4没有图片
    recog_data = db.Column(db.Text, default="")                                 # sdk识别结果
    sdk_recog_time = db.Column(db.DateTime)                                     # 算法二次识别时间

    sdk_car_plate_number = db.Column(db.String(15), default="")                 # 识别车牌号
    sdk_car_plate_type = db.Column(db.String(2), default="")                    # 识别车牌类型
    sdk_reason_code = db.Column(db.Integer)                                     # 识别结果编码: 1:车牌更正,
    sdk_plate_rect = db.Column(db.String(256))                                  # 车牌位置（sdk识别）
    plate_head_score = db.Column(db.Integer, default=0)                         # sdk车牌识别首字得分

    modified_column = ('manual_check_status', 'sdk_plate_rect', 'sdk_car_plate_number', 'sdk_reason_code',
                       'sdk_car_plate_type', 'check_status')


class SectorDataCount(BaseModel, db.Model):
    __tablename__ = 'sector_date_count'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sector_code = db.Column(db.String)
    date = db.Column(db.String)
    manual_check_status = db.Column(db.Integer)
    insert_count = db.Column(db.Integer)
    ana_count = db.Column(db.Integer)
    err_count = db.Column(db.Integer)
    m1_count = db.Column(db.Integer)
    m2_count = db.Column(db.Integer)
