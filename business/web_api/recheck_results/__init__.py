# -*- coding:utf-8 -*-
from flask import Blueprint

reckeck_results_blu = Blueprint("recheck_results", __name__, url_prefix="/api")

from . import views
