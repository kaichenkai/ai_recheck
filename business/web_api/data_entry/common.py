# -*- coding:utf-8 -*-
import time
import json
import logging
import ftplib
import traceback
import requests
from io import BytesIO
from urllib.parse import urlparse
# 下载、上传操作相关
HTTP_GET_RETRY_NUM = 2                              # 下载重试次数
HTTP_GET_TIMEOUT = 5                               # 下载图片的超时时间
HTTP_POST_TIMEOUT = 5                              # 上传数据的超时时间
HTTP_POST_RETRY_NUM = 1                             # 上传重试次数
HTTP_RETRY_SLEEP_TIME = 0.1                         # 上传出错重试前的sleep时间


def http_post(url, param=None):
    param_json = param and json.dumps(param, ensure_ascii=False)
    headers = {
        "content-type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
                      "Chrome/71.0.3578.98 Safari/537.36"
    }

    with requests.Session() as session:
        lasterr = ''
        for i in range(HTTP_POST_RETRY_NUM):
            try:
                resp = session.post(url, headers=headers, data=param_json.encode("utf-8"), verify=False,
                                    timeout=HTTP_POST_TIMEOUT)
                if resp.status_code < 300:
                    return resp
                else:
                    lasterr = 'status code %s' % resp.status_code
                    break
            except Exception as e:
                lasterr = e
                time.sleep(HTTP_RETRY_SLEEP_TIME)
                break

        if param:
            # 把图片数据剔除
            pic_keys = ["combinedPicData", "carNumPicData", "carImg1Data", "carImg2Data", "carImg3Data", "carImg4Data",
                        "carImg5Data"]
            [param.pop(key) for key in pic_keys if key in param.keys()]
            logging.error('exception occurs when post url[%s], param[%s]. [%s]' % (url, param_json, lasterr))
        else:
            logging.error('exception occurs when post url[%s], param[%s]. [%s]' % (url, param_json, lasterr))
        return


def http_get(url, param=None):
    param_json = param and json.dumps(param)

    with requests.Session() as session:
        lasterr = ''
        for i in range(HTTP_GET_RETRY_NUM):
            try:
                resp = session.get(url, data=param_json, timeout=HTTP_GET_TIMEOUT)
                if resp.status_code < 300:
                    return resp.content
                else:
                    lasterr = 'status code %s' % resp.status_code
            except Exception as e:
                lasterr = e
                time.sleep(HTTP_RETRY_SLEEP_TIME)

        if param:
            logging.error('exception occurs when get url[%s], param[%s]. [%s]' % (url, param_json, lasterr))
        else:
            logging.error('exception occurs when get url[%s]. [%s]' % (url, lasterr))
        return None


def ftp_down(url):
    for i in range(HTTP_GET_RETRY_NUM):
        urlps = urlparse(url)
        if '@' not in urlps.netloc:
            user = ''
            passwd = ''
            host = urlps.netloc
            port = 21
        else:
            urlhead = urlps.netloc.split('@')
            if len(urlhead) != 2:
                logging.error('err ftpurl format: %s.' % url)
                continue
            else:
                user, passwd = urlhead[0].split(':')
                if ':' not in urlhead[1]:
                    host = urlhead[1]
                    port = 21
                else:
                    host, port = urlhead[1].split(':')

        try:
            ftp = ftplib.FTP()
            # if type(host) == unicode:
            #     host = host.encode("utf-8")
            # if type(port) == unicode:
            #     port = port.encode("utf-8")
            ftp.connect(host=host, port=port, timeout=HTTP_GET_TIMEOUT)
            ftp.login(user=user, passwd=passwd)
        except Exception:
            logging.error(traceback.format_exc())
            continue
        try:
            buf = BytesIO()
            logging.info("-- ftp download {}".format(urlps.path))
            ftp.retrbinary('RETR ' + urlps.path, buf.write)
            ftp.close()
            bytes_data = buf.getvalue()
            # base64_data = base64.b64encode(bytes_data).decode()
            return bytes_data
        except Exception:
            logging.error(traceback.format_exc())
            continue
    logging.error('exception occurs when ftp get url[%s]' % url)
    return


def download(url):
    # request url must in utf-8 code, in unicode or str does not import
    if isinstance(url, bytes):
        url = url.decode("utf-8")
    #
    start_url = url[:3]
    if start_url == 'htt':
        return http_get(url)
    elif start_url == 'ftp':
        return ftp_down(url)
    else:
        logging.error('unknown url format[%s].' % url)
    return
