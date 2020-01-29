from Model.Model import *
class User(Model):
    def __init__(self):
        super().__init__()

    def getUser(self, uid='%', name='%',email='%', password='%',phone='%',major='%',degree='%',enable=True):
        sql = """   SELECT uid, name, email, phone,password,major,degree,enable
                    FROM public.users
                    WHERE   uid::text   LIKE %s AND
                            name        LIKE %s AND 
                            email       LIKE %s AND 
                            phone       LIKE %s AND 
                            password    LIKE %s AND 
                            major       LIKE %s AND 
                            degree      LIKE %s AND
                            enable = %s"""

        args = (str(uid),name,email,phone,password,major,degree,enable)
        return self.pg.execute(sql,args,True)

    def addUser(self,name,email,phone,password,major,degree):
        sql = """INSERT INTO public.users (name, email, phone, password, major, degree,enable) VALUES (%s, %s, %s, %s, %s, %s, TRUE)"""
        args = (name,email,phone,password,major,degree)
        return self.pg.execute(sql,args,False)



    def deleteUser(self,uid):
        sql = """UPDATE public.users SET enable = FALSE WHERE uid = %s;"""
        args = (uid,)
        return self.pg.execute(sql,args,False)


    def updateUser(self,uid,name,email,phone,password,major,degree):
        sql = """   UPDATE public.users SET 
                    name = %s       , 
                    email = %s      ,
                    phone = %s      ,
                    password = %s   ,
                    major = %s      ,
                    degree = %s
                    WHERE uid = %s;"""
        args = (name,email,phone,password,major,degree,uid)
        return self.pg.execute(sql, args, False)