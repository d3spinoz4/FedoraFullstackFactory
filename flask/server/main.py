from flask import Blueprint, render_template, redirect, url_for, request, flash
from flask import current_app as app
from flask_executor import Executor
from flask import send_from_directory
from . import benfordslaw
import pandas as pd
import numpy as np
import traceback
import logging
import mariadb
import time
import json
import sys
import os

data_path = '/app/updload'

def updatequery(taskid, elapsed_time):

    conn = mariadb.connect(
        user="userEHX",
        password="DB_PASS",
        host="HOST_IP",
        database="appdb")
    cur = conn.cursor()

    #retrieving information
    some_name = taskid
    some_time = elapsed_time
    cur.execute("SELECT text,day FROM tasks WHERE id=?", (some_name,))

    for taskname, taskday in cur:
        print(f"Task name: {taskname}, Day: {taskday}")

    #insert information
    try:
        cur.execute("UPDATE tasks SET reminder=1, time = ? WHERE id = ?", (elapsed_time, some_name,))
    except mariadb.Error as e:
        print(f"Error: {e}")

    conn.commit()
    conn.close()

def runbenford(taskid, datafile):

    t = time.time()
    immi = pd.read_csv(os.path.join(data_path, datafile),sep='\t')

    immi.rename(columns={immi.columns[-1]: 'Population'}, inplace=True)

    bl = benfordslaw(alpha=0.05, method=None)
    results = bl.fit(immi.Population.values)

    bl.plot(title='Population', save_file = os.path.join(data_path, datafile).split('.')[0] + '.png')

    rt = time.time() - t

    updatequery(taskid, rt)

executor = Executor(app)

main = Blueprint('main', __name__)

# Don't know if GET will be used
@main.route('/frame', methods=['GET', 'POST'])
def frame():
    if request.method == 'GET':
        frameid = request.args.get('id')
        data_file = request.args.get('df')
        executor.submit(runbenford, frameid, data_file)
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@main.route('/download', methods=['GET', 'POST'])
def download():
    if request.method == 'GET':
        frameid = request.args.get('id')
        data_file = request.args.get('df')
        if data_file:
            return send_from_directory(directory=data_path, path=data_file.split('.')[0] + '.png')
        else:
            return {"id": frameid, "df": data_file}


@main.teardown_request
def log_unhandled(e):
    if e is not None:
        print(repr(e))
