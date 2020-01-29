import psycopg2
from config import *


class database(object):
    def __init__(self):
        self.connect_str = "dbname='{}' user='{}' host='{}' password='{}'".format(DB_NAME, DB_USER, DB_HOST, DB_PASSWORD)
    def connect(self):
        try:
            self.conn = psycopg2.connect(self.connect_str)
        except Exception as e:
            print('-' * 50)
            print(e)
            print('-' * 50)
            print("Fail to connect to database.")

    def close(self):
        self.conn.close()

    def execute(self,sql,args,isSELECT):
        cur = self.conn.cursor()
        try:
            if isSELECT:
                cur.execute(sql, args)
                ret = cur.fetchall()
            else:
                cur.execute(sql, args)
                ret = 0
                self.conn.commit()

        except psycopg2.Error as e:
            print(e)
            return None

        return ret