import pandas as pd
import datetime
import sys
import getopt  //https://pymotw.com/2/getopt/  get parameters
import pymongo as mongo
import json

sys.path.insert(0, '../')
import library as lb



def main(param=None):
    mode = 'test'
    start = ''
    shift = 0
    threshold = 0
    try:  //obviously all this parameter passing should not be here
        opts, args = getopt.getopt(param, 'h', ['mode=', 'start=', 'shift=', 'threshold='])
        for opt, arg in opts:
            if opt == '--start':
                start = datetime.datetime.strptime(arg, '%Y-%m-%d %H:%M:%S')
            elif opt == '--shift':
                shift = int(arg)
            elif opt == '--threshold':
                threshold = int(arg)
            elif opt== '-h':
                print ('batterykpi.py --start --shift --threshold -h')
                sys.exit()
    except getopt.GetoptError:
        print('There is no config file specified. Default parameters applied')
    try:
        if start == '':
            start = Params.bdate
        if shift == 0:
            shift = Params.shift
        if threshold == 0:
            threshold = Params.threshold
        end = start + datetime.timedelta(hours=shift)
        query = {     //this is kind of cool... but
                    //we do not want to let processes access DB directly...by where is the tenant id :)
            "$and":
                [
                    {"time_stamp": {"$gte": str(start)}},
                    {"time_stamp": {"$lt": str(end)}},
                    {"StatType": Params.battery}
                ]
        }
        config = readconfig(mode)
        connectionstring = config['connectionstring']
        servername = connectionstring.get('servername')
        port = connectionstring.get('port')
        dbname = connectionstring.get('dbname')
        collectionname = connectionstring.get('collectionname')
        client = mongo.MongoClient(servername, port)
        db = client[dbname]
        collection = db[collectionname]
        cursor = collection.find(query)
        data = pd.DataFrame(list(cursor))
            //OK there is something intereting here the cursor.....but converted into a list
            //we ned to think... but I beleive that we should be able to read chunks into memmory at once
            //every node.js (or pythong..whaterver..microservice will run many processes onr many processors.
        data = cleanData(data) //what is this?
    #    data = data[data['devid']=='73E65B7606490108000D-1BB066730600']

        data['time_stamp'] = pd.to_datetime(data['time_stamp'], format='%Y-%m-%d %H:%M:%S')

        data = data[Params.cols]
        data.set_index(['devid', 'time_stamp'], inplace=True)
        data.sort_index(level=1, inplace=True)

        dischargedGroup = (data.groupby(level=0, sort=False)['intvalue']
                           .apply(list))

        def check(line):
            oldval = 100
            for i in line:
                if (i > oldval) | (i < threshold):
                    return 1
                    break
                else:
                    oldval = i
            return 0

        discharged = dischargedGroup.apply(check)

        # discharged = (dischargedGroup
        #               .apply(lambda a: np.asarray(a)*(np.asarray(a) < threshold))
        #               .apply(lambda a: a.sum())
        #               )
        dischargedGroup = pd.DataFrame(dischargedGroup)
        discharged = pd.DataFrame(discharged)
        discharged = discharged[discharged['intvalue'] > 0]

        discharged = pd.merge(discharged, dischargedGroup, left_index=True, right_index=True)
        discharged['StartDate'] = start
        discharged['EndDate'] = end
        # def f(df, sortcol, valcol):
        #     keys, values = df.sort_values(sortcol).values.T
        #     ukeys, index = np.unique(keys, True)
        #     arrays = np.split(values, index[1:])
        #     df2 = pd.DataFrame({sortcol: ukeys, valcol: [list(a) for a in arrays]})
        #     return df2

        # data = f(data, 'devid', 'intvalue').set_index('devid')

        print (discharged[['intvalue_y', 'StartDate', 'EndDate']])
        print('Total number of records: {}'.format(discharged.shape[0]))
        print(threshold)
        return discharged[['intvalue_y', 'StartDate', 'EndDate']]
    except Exception as e:
        print('Error - \n' + str(e.with_traceback(e.__traceback__)))


class Params:
    bdate = datetime.datetime.strptime('2016-08-23 10:00:00', '%Y-%m-%d %H:%M:%S')
    shift = 8
    edate = bdate + datetime.timedelta(hours=shift)
    threshold = 10
    battery = -1
    cols = ['devid', 'time_stamp', 'intvalue']


def cleanData(data):
    cols = data.select_dtypes(['object'])
    data[cols.columns] = cols.apply(lambda x: x.str.strip())
    return data


def readconfig(mode):
    code, config = lb.read('..\\' + mode+'.json')
    if code == 0:
        return json.loads(config)
    elif code == -1:
        print("Config file not found. Exiting")
        sys.exit()


if __name__ == "__main__":
    main(sys.argv[1:])
