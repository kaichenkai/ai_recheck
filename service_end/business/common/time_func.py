# -*- coding:utf-8 -*-
import time

default_format = "%Y-%m-%d %H:%M:%S"
seconds_per_day = 24 * 3600


def now_time(format='%Y-%m-%d %H:%M:%S'):
    return time.strftime(format, time.localtime(time.time()))


def timestamp2str(timestamp, format=default_format):
    return time.strftime(format, time.localtime(int(timestamp)))


def mstime2str(mstimestamp, format=default_format):
    return time.strftime(format, time.localtime(int(mstimestamp) / 1000))


def str2timestamp(string, format=default_format):
    return int(time.mktime(time.strptime(string, format)))


def to_string(mstimestamp, format=default_format):
    return time.strftime(format, time.localtime(int(mstimestamp) / 1000))


def to_mstimestamp(string, format=default_format):
    return int(time.mktime(time.strptime(string, format))) * 1000


def to_day(format='%Y-%m-%d'):
    return timestamp2str(time.time(), format)


def date_interval(start_time, end_time, format=default_format):
    start_time = time.mktime(time.strptime(start_time, format))
    end_time = time.mktime(time.strptime(end_time, format))
    #
    sub_time = end_time - start_time
    day_num = int(sub_time / 3600 / 24)
    return day_num


if __name__ == '__main__':
    print(now_time())
    print(mstime2str(1585625910331))
