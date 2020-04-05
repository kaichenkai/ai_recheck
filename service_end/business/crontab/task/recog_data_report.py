# -*- coding:utf-8 -*-
import time
import json
import logging
import datetime
from business import db, create_app
from business.common.time_func import now_time
from business.tools.requests_lib import http_post
from business.models import WfRecord
from conf import constants as cons


# 识别数据上报任务
def recog_data_report(a, b):
    app = create_app()
    with app.app_context():
        # 上报前 n 天的数据
        # 获得 N 天前的日期时间, 默认 1 天
        n_day_ago = (datetime.datetime.now() - datetime.timedelta(days=cons.REPORT_INTERVAL_TIME / cons.DAY_UNIT))
        # 转换为时间字符串
        start_time = n_day_ago.strftime("%Y-%m-%d %H:%M:%S")

        # query data
        record_list = db.session.query(WfRecord) \
            .filter(WfRecord.report_status.in_([0, 2]),
                    WfRecord.entry_time > start_time,
                    WfRecord.recog_status == 2) \
            .limit(cons.QUERY_INTERVAL).all()
        if not record_list:
            logging.info("no data to report, report_start_time:{}".format(start_time))
            return

        # process
        for record in record_list:
            if record.car_plate_number == record.sdk_car_plate_number:
                result = "true"
            else:
                result = "false"
            #
            data_dict = {
                "sbbh": record.device_code,
                "wfxw": record.illegal_code,
                "wfsj": str(record.illegal_time),
                "hphm": record.car_plate_number,
                "result": result,
                "algLpn": record.sdk_car_plate_number
            }

            # 处理一条, 上报一条
            #
            write_start = time.time()
            resp = http_post(cons.SERVICE_URL, param=data_dict)
            if resp is None:
                # call failed
                logging.error("api call timeout, url:[{}]".format(cons.SERVICE_URL))
                break
            else:
                # call success
                cost_time = round((time.time() - write_start) * 1000, 2)
                # parse resp
                resp_dict = json.loads(resp.text, encoding="utf-8")
                code = resp_dict["code"]
                message = resp_dict["message"]
                if str(code) != "200":
                    # report failed
                    report_status = cons.REPORT_FAILED
                    logging.error('api call failed, result:[code:{}, message:{}], data:[record_id:{}, illegal_code:{},'
                                  'cost_time:[{}]ms'.format(code, message, record.record_id, record.illegal_code, cost_time))
                else:
                    report_status = cons.REPORT_SUCCESS
                    logging.info('send to service done! result:True, record_id:[{}], illegal_code:[{}], cost_time:[{}]ms'
                                 .format(record.record_id, record.illegal_code, cost_time))
                # update report status and time
                record.report_status = report_status
                record.report_time = now_time()
                db.session.commit()
