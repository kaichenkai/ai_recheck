# -*- coding:utf-8 -*-
import os
import time
import datetime
import copy
import json
import base64
import logging
import requests
import threading
from sqlalchemy import func
# from flask import current_app
from multiprocessing import Queue
from queue import Empty as QueueEmpty
from business.utils.time_func import now_time
from business import db, constants as cons, create_app
from business.models import WfRecord, SectorDataCount

img_counts = 0
today = time.strftime('%Y-%m-%d', time.localtime(time.time()))


# 请求分析服务接口
def sdk_request(a, b):
    app = create_app()
    with app.app_context():
        # 一天限制40w数量图片
        global img_counts, today

        if today != time.strftime('%Y-%m-%d', time.localtime(time.time())):
            today = time.strftime('%Y-%m-%d', time.localtime(time.time()))
            img_counts = 0

        if img_counts >= cons.MAX_IMAGE_NUM:
            logging.info("image processing number reached 40w")
            print("image processing number reached 40w")
            # scheduler.pause_job('job2')
            return

        # query = s.query(WfRecord.id, WfRecord.car_plate_number, WfRecord.car_num_pic_path, WfRecord.illegal_action)\
        #            .filter(WfRecord.recog_status.in_((0,))).filter(WfRecord.illegal_action.notin_(no_recog_action))
        # TODO 不过滤违法编码
        query = db.session.query(WfRecord.id, WfRecord.car_plate_number, WfRecord.img_path,
                                 WfRecord.illegal_code) \
                          .filter(WfRecord.recog_status.in_((0,)))
        if cons.LIMIT_NUM:
            records = query.limit(cons.LIMIT_NUM).all()
        else:
            return
            # records = query.all()
        if not records:
            logging.info('no records to recog')
        else:
            tmp = []
            ex_tmp = []
            images = []
            cal_params = []

            queue = Queue()
            thred_list = []
            rs = []

            # 创建线程
            for i in range(int(cons.THREAD_NUM)):
                t = threading.Thread(target=process, args=(queue,))
                thred_list.append(t)

            for r in records:
                try:
                    image_path = os.path.join(cons.IMAGE_SAVE_PATH, r[2])
                    with open(image_path, 'rb') as img_file:
                        img_data = img_file.read()
                    b64_bytes = base64.b64encode(img_data)
                    b64_str = b64_bytes.decode()
                    cal_param = calc_param_patern.format(mode="0", srcplate=r[1].replace(".", ""))
                except Exception as e:
                    logging.exception('sdk_request{}'.format(e))
                    w_id = r[0]
                    w = db.session.query(WfRecord).filter(WfRecord.id == w_id).first()
                    # TODO 识别异常
                    w.recog_status = 3
                    # db.session.add(w)
                    db.session.commit()
                    continue

                else:
                    if not b64_str:
                        w_id = r[0]
                        w = db.session.query(WfRecord).filter(WfRecord.id == w_id).first()
                        # TODO 没有图片的情况
                        w.recog_status = 4
                        # db.session.add(w)
                        db.session.commit()
                        continue
                    images.append(b64_str)
                    cal_params.append(cal_param)
                    rs.append(r)
                # 如果数据大于 8 条, 一次只放 8 条数据
                if len(images) >= 8:
                    images_fake = copy.deepcopy(images)
                    cal_fake = copy.deepcopy(cal_params)
                    rs_fake = copy.deepcopy(rs)

                    queue.put((images_fake, cal_fake, rs_fake))

                    del rs[:]
                    del images[:]
                    del cal_params[:]

                    img_counts += 1
                    # 一天限制40w数量图片
                    if img_counts >= cons.MAX_IMAGE_NUM:
                        logging.info("image processing number reached 40w")
                        print("image processing number reached 40w")
                        # scheduler.pause_job('job2')
                        break
            # 如果还有数据, 且没有超过授权数量, 继续放数据(用来放少于8条的数据)
            if images and img_counts < cons.MAX_IMAGE_NUM:
                queue.put((images, cal_params, rs))

            # 数据放完之后, 开启线程任务
            for t in thred_list:
                t.start()

            for t in thred_list:
                t.join()


# 识别线程任务
def process(queue):
    while True:
        try:
            data_list = queue.get(True, 1)  # 阻塞 1 s
        except Exception as e:
            break

        ex_tmp = []
        tmp = []
        rs = data_list[2]
        try:
            post_data = dict(
                images=data_list[0],
                calc_param_list=data_list[1]
            )
            try:
                rsp = requests.post(cons.SDK_API, json.dumps(post_data))
            except Exception as e:
                logging.error("{} call timeout".format(cons.SDK_API))
                break

            # rsp_json = json.loads(unicode(rsp.content, errors='ignore'))
            try:
                rsp_json = json.loads(rsp.content)
            except Exception as e:
                logging.error(e)
                break

            code = rsp_json['Code']
            if code != 0:
                logging.error("recog result exception, code:{}".format(code))
                for r in rs:
                    ex_tmp.append(r[0])
                continue

            result_datas = rsp_json["Results"]
            # 调用算法识别完成
            logging.info("recog once complete, process {} pieces of data".format(len(rs)))
            for result_data in result_datas:
                index = result_datas.index(result_data)
                recog_plate_number = result_data['Licence']
                reason_code = result_data['EvenCode']

                if reason_code == -1:
                    ex_tmp.append(rs[index][0])
                    continue

                # 录入尾号不是汉字，sdk识别是汉字放入正片
                if recog_plate_number:
                    if rs[index][1][-1] not in ('学', '警'):
                        if recog_plate_number[-1] in ('学', '警'):
                            reason_code = 0

                # 首字识别一致，后六位不一致算车牌更正 reason_code = 3 否则为0
                if recog_plate_number and reason_code == 1:
                    # 替换点再比较
                    # rs[index][1] = rs[index][1].replace(".", "")

                    if rs[index][1][0] == recog_plate_number[0] and rs[index][1][1:] != recog_plate_number[1:]:
                        reason_code = 1
                    else:
                        reason_code = 0

                    # 车牌更正,任意一位得分低于90放入疑似
                    p_s = result_data['PlateScores']
                    if p_s:
                        for i in p_s:
                            if i < 90:
                                reason_code = 2
                                break

                    # 车牌更正,识别不同的号码得分小于70，放入疑似
                    # p_s = result_data['PlateScores']
                    # if p_s:
                    #    for i in range(1, len(p_s)):
                    #        try:
                    #            tmp_sr = rs[index][1][i]
                    #        except:
                    #            tmp_sr = ''
                    #        try:
                    #            tmp_re = recog_plate_number[i]
                    #        except:
                    #            tmp_re = ''
                    #        if p_s[i] < 70 and tmp_sr != tmp_re:
                    #            reason_code = 2
                    #            break

                recog_plate_type = result_data['PlateType']
                plate_rect = result_data['PlateRect']
                if result_data['PlateScores']:
                    plate_head_score = result_data['PlateScores'][0]
                else:
                    plate_head_score = 0

                tmp.append({'id': rs[index][0],
                            'plate_number': recog_plate_number,
                            'plate_type': recog_plate_type,
                            'reason_code': reason_code,
                            'plate_rect': plate_rect,
                            'head_score': plate_head_score,
                            'recog_data': json.dumps(result_data, ensure_ascii=False),
                            })

        except Exception as e:
            logging.exception('sdk_request{}'.format(e))
            for r in rs:
                ex_tmp.append(r[0])

        add_data(tmp, ex_tmp)


def add_data(tmp, ex_tmp):
    app = create_app()
    with app.app_context():
        # adds = []
        # ex_adds = []
        for t in tmp:
            w_id = t["id"]
            w = db.session.query(WfRecord).filter(WfRecord.id == w_id).first()
            w.sdk_car_plate_number = t["plate_number"]
            w.sdk_car_plate_type = t["plate_type"]
            w.sdk_reason_code = t["reason_code"]
            w.sdk_plate_rect = json.dumps(t["plate_rect"])
            w.recog_status = 2
            w.recog_data = t['recog_data']
            w.plate_head_score = t['head_score']
            w.sdk_recog_time = now_time()
        # db.session.bulk_save_objects(adds)
        # db.session.add_all(adds)

        for t in ex_tmp:
            w_id = t
            w = db.session.query(WfRecord).filter(WfRecord.id == w_id).first()
            w.recog_status = 3
        db.session.commit()


def all_date_count(a, b):
    app = create_app()
    with app.app_context():
        # 项目一开始没有数据, 防止报错
        while True:
            record = db.session.query(WfRecord).first()
            if record:
                break
        #
        first_time = record.entry_time.strftime("%Y-%m-%d")
        next_day = first_time
        today = (datetime.datetime.now() - datetime.timedelta(days=1)).strftime("%Y-%m-%d")

        print('+++++++++ all_date_count', today, next_day)
        while today != next_day:
            result = get_count(next_day)
            insert_date_count(result)
            next_day = (datetime.datetime.strptime(next_day, '%Y-%m-%d') + datetime.timedelta(days=1)).strftime("%Y-%m-%d")

            # print '+++++++++ all_date_count', today, next_day


def yesterday_count(a, b):
    app = create_app()
    with app.app_context():
        yesterday = (datetime.datetime.now() - datetime.timedelta(days=1)).strftime("%Y-%m-%d")
        result = get_count(yesterday)
        insert_date_count(result)


def get_count(date):
    result = {}

    start_time = date + ' 00:00:00'
    end_time = \
        (datetime.datetime.strptime(date, '%Y-%m-%d') + datetime.timedelta(days=1)).strftime(
            "%Y-%m-%d") + ' 00:00:00'

    result['date'] = date

    for manual_check_status in (3, 2, 1):
        query = db.session.query(WfRecord)

        query = query \
            .filter(WfRecord.entry_time >= start_time) \
            .filter(WfRecord.entry_time < end_time)

        if manual_check_status != 3:
            query = query.filter(WfRecord.manual_check_status == manual_check_status)

        time_total = query.group_by(WfRecord.correct_sector_code) \
            .with_entities(WfRecord.correct_sector_code, func.count(WfRecord.id)) \
            .all()

        ana_total = query.filter(WfRecord.recog_status > 0) \
            .group_by(WfRecord.correct_sector_code) \
            .with_entities(WfRecord.correct_sector_code, func.count(WfRecord.id)) \
            .all()

        query = query.filter(WfRecord.recog_status == 2) \
            .filter(WfRecord.sdk_reason_code > 0) \
            .filter(WfRecord.car_plate_number != WfRecord.sdk_car_plate_number)

        if not cons.NO_CAR_DISPLAY:
            query = query.filter(WfRecord.sdk_reason_code != 5)

        # 通报只展示车牌更正
        err_total = query.filter(WfRecord.sdk_reason_code == 1) \
            .group_by(WfRecord.correct_sector_code) \
            .with_entities(WfRecord.correct_sector_code, func.count(WfRecord.id)) \
            .all()

        m1_total = query \
            .filter(WfRecord.sdk_reason_code == 1) \
            .filter(WfRecord.manual_check_status == 1) \
            .group_by(WfRecord.correct_sector_code) \
            .with_entities(WfRecord.correct_sector_code, func.count(WfRecord.id)) \
            .all()

        m2_total = query \
            .filter(WfRecord.sdk_reason_code == 1) \
            .filter(WfRecord.manual_check_status == 2) \
            .group_by(WfRecord.correct_sector_code) \
            .with_entities(WfRecord.correct_sector_code, func.count(WfRecord.id)) \
            .all()

        result.setdefault(manual_check_status, [])

        t_map = {i[0]: i[1] for i in time_total}
        a_map = {i[0]: i[1] for i in ana_total}
        e_map = {i[0]: i[1] for i in err_total}

        m1_map = {i[0]: i[1] for i in m1_total}
        m2_map = {i[0]: i[1] for i in m2_total}

        result[manual_check_status].extend([t_map, a_map, e_map, m1_map, m2_map])
    return result


def insert_date_count(result):
    for m in (3, 2, 1):
        for k in cons.SECTOR_MAP:
            tmp = db.session.query(SectorDataCount)\
                            .filter(SectorDataCount.manual_check_status==m)\
                            .filter(SectorDataCount.sector_code==k)\
                            .filter(SectorDataCount.date==result['date'])\
                            .first()
            if tmp:
                continue
            if result.get(m, [])[0].get(k, 0) == 0:
                continue
            sd = SectorDataCount()
            sd.sector_code = k
            sd.manual_check_status = m
            sd.insert_count = result.get(m, [])[0].get(k, 0)
            sd.ana_count = result.get(m, [])[1].get(k, 0)
            sd.err_count = result.get(m, [])[2].get(k, 0)
            sd.m1_count = result.get(m, [])[3].get(k, 0)
            sd.m2_count = result.get(m, [])[4].get(k, 0)
            sd.date = result['date']
            db.session.add(sd)


calc_param_patern = """
{{
    "Detect": {{
        "IsDet":true, 
        "Mode": {mode},
        "PlateNum": "{srcplate}"
    }},
    "Recognize" : {{
      "Color" : {{
        "IsRec" : true,
        "Mode" : {mode}
      }},
      "Type" : {{
        "IsRec" : true,
        "Mode" : {mode}
      }},
      "Brand" : {{
        "IsRec" : true,
        "Mode" : {mode}
      }},
      "Belt": {{
        "IsRec" :true 
      }},
      "Call": {{
        "IsRec" :true
      }},
      "Crash": {{
        "IsRec" : true,
        "Mode" : {mode}
      }},
      "Danger": {{
        "IsRec" : true,
        "Mode" : {mode}
      }},
      "Plate": {{
        "IsRec" : true,
        "Mode" : {mode}
      }},
      "Similar": {{
        "IsRec" : false,
        "Mode" : {mode}
      }},
      "Marker": {{
        "IsRec" : true,
        "Mode" : {mode}
      }},
      "Face": {{
        "IsRec" : true,
        "Mode" : {mode}
      }},
      "Slag": {{
        "IsRec" : true,
        "Mode" : {mode}
      }}
    }}
}}
"""
