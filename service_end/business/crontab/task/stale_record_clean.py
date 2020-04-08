# -*- coding:utf-8 -*-
import time
import datetime
import logging
from business import db, create_app
from business.models import WfRecord
from conf import constants as cons


def stale_record_clean(a, b):
    """
    定时清除 6 个月之前的数据
    """
    app = create_app()
    with app.app_context():
        # 获得 N 天前的日期时间
        n_day_ago = (datetime.datetime.now() - datetime.timedelta(days=cons.CLEANING_RECORD_INTERVAL_TIME / cons.DAY_UNIT))
        # 转换为时间字符串
        clean_time = n_day_ago.strftime("%Y-%m-%d %H:%M:%S")

        # "wf_record"
        # 开始删除, 每次删除 DEL_INTERVAL
        del_count = 0
        start_time = time.time()
        while True:
            del_record_list = db.session.query(WfRecord).filter(WfRecord.create_time < clean_time).limit(cons.DEL_INTERVAL).all()
            #
            if not del_record_list:
                break
            for record in del_record_list:
                db.session.delete(record)
            #
            db.session.commit()
            # 统计删除的条数
            del_count + len(del_record_list)
        #
        clear_cost = round((time.time() - start_time) * 1000, 2)
        logging.info("clearing stale record complete, clear total:[{}], clear time:[{}ms]".format(del_count, clear_cost))
