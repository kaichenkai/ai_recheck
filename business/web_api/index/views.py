# -*- coding:utf-8 -*-
from . import index_blu
from flask import render_template, current_app
from business.common.decorator import error_handler


@index_blu.route("/")
@error_handler
def index():
    return render_template("index.html")


# 网站图标
@index_blu.route("/favicon.ico")
@error_handler
def favicon():
    return current_app.send_static_file("favicon.ico")
