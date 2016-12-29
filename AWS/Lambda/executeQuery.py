from __future__ import print_function

import json
import psycopg2
import datetime

print('Loading function')

def __init__(event, context):
    res = executeQuery(
        event['_dbname'],
        event['_host'],
        event['_port'],
        event['_user'],
        event['_password'],
        event['_query'])
    return (res)

def executeQuery(_dbname, _host, _port, _user, _password, _query):
    res=[]
    try:
        con=psycopg2.connect(dbname= _dbname, host=_host, port=_port, user=_user, password=_password)
        cur = con.cursor()
        cur.execute(_query)
        data = cur.fetchall()
        for row in data:
            res.append(row)
        cur.close()
        con.close()
    except Exception as e:
        res.append({'Error': e.args})
    return (res)