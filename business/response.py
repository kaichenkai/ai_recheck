# -*- coding:utf8 -*-
from flask import jsonify, make_response


def success(data=None, message=None, **kwargs):
    if not message:
        message = 'success'

    rsp_dict = {
        'code': 200,
        'message': message,
        }

    if data is not None:
        rsp_dict['data'] = data

    if kwargs:
        rsp_dict.update(kwargs)

    response = make_response(rsp_dict)
    response.status = "200"

    return response


def add_success(data=None, message=None):
    if not message:
        message = 'success'

    rsp_dict = {
        'code': 201,
        'message': message,
        }

    if data is not None:
        rsp_dict['data'] = data

    response = make_response(rsp_dict)
    response.status = "201"

    return response


def invalid(message='invalid params', **kwargs):
    rsp_dict = {
        'code': 400,
        'message': message
        }

    if kwargs:
        rsp_dict.update(kwargs)

    response = make_response(rsp_dict)
    response.status = "400"

    return response


def server_error(message='server error', **kwargs):
    rsp_dict = {
        'code': 500,
        'message': message
        }
    if kwargs:
        rsp_dict.update(kwargs)

    response = make_response(rsp_dict)
    response.status = "500"

    return response


def success_with_pagenation(total, page, size, data):
    rsp_dict = {
        'code': 200,
        'message': 'success',
        'total': total,
        'current': page,
        'pageSize': size,
        'data': data
        }

    response = make_response(rsp_dict)
    response.status = "200"

    return response


def log_timeout():
    rsp_dict = {
        'code': 401,
        'message': '未登录'
    }

    response = make_response(rsp_dict)
    response.status = "401"

    return response


def login_error(message=None):
    if not message:
        message = 'invalid username or password'

    rsp_dict = {
        'code': 400,
        'message': message
    }

    response = make_response(rsp_dict)
    response.status = "400"

    return response


def unauthorized():
    rsp_dict = {
        'code': 403,
        'message': '你没有该操作权限'
    }

    response = make_response(rsp_dict)
    response.status = "403"

    return response
