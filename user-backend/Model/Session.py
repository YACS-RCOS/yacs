from Model.Model import *
from datetime import datetime
import uuid

class Session(Model):
    def __init__(self):
        super().__init__()

    def createSessionID(self):
        return str(uuid.uuid1())

    def startSession(self, session, uid, startTime):
        sql = """INSERT INTO public.sessions (session_id, user_id, start_time) VALUES (%s,%s,%s);"""
        args = (session,uid,startTime)
        return self.pg.execute(sql,args,False)


    def getSession(self,sessionID='%'):
        sql = """   SELECT session_id, user_id, start_time,end_time 
                    FROM public.sessions
                    WHERE   session_id::text LIKE %s"""

        arg = (sessionID,)
        return self.pg.execute(sql,arg,True)

    def endSession(self,sessionID='%',uid='%',endTime=datetime.utcnow()):
        sql = """UPDATE public.sessions SET end_time = %s WHERE session_id::text LIKE %s AND user_id::text LIKE %s;"""
        args = (endTime,sessionID,str(uid))
        return self.pg.execute(sql,args,False)
