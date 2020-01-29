from Model.User import User as UserModel
from Model.Session import Session as SessionModel
import View.Message as msg
from common import *

def getUserInfo(form):
    users = UserModel()
    sessions = SessionModel()

    if not checkKeys(form, ['sessionID']):
        return msg.errMsg("Invalid Session ID.")

    sessionID = form['sessionID']
    session = sessions.getSession(sessionID)
    if len(session) == 0:
        return msg.errMsg("Unable to find the session.")

    (sessionid, uid, start_time, end_time) = session[0]
    user = users.getUser(uid=uid)

    if len(user) == 0:
        return msg.errMsg("Unable to find the user")

    (uid, name, email, phone, password, major, degree, enable) = user[0]

    return msg.successMsg({"uid": uid,"name": name, "email": email, "phone":phone, "major": major, "degree": degree})


def updateUser(form):
    users = UserModel()
    sessions = SessionModel()

    if not checkKeys(form, ['sessionID','name', 'email', 'phone','newPassword', 'major', 'degree']):
        return msg.errMsg("Please check your requests.")

    name = form['name']
    sessionID = form['sessionID']
    email = form['email']
    phone = form['phone']
    newPassword = form['newPassword']
    major = form['major']
    degree = form['degree']

    if newPassword.strip() == "":
        return msg.errMsg("Password cannot be empty.")

    # Get User according to sessionID
    session = sessions.getSession(sessionID)
    if len(session) == 0:
        return msg.errMsg("Unable to find the session.")

    (sessionid, uid, start_time, end_time) = session[0]

    ret = users.updateUser(uid,name,email,phone,newPassword,major,degree)

    if ret == None:
        return msg.errMsg("Failed to update user profile.")

    return msg.successMsg({})

def deleteUser(form):
    users = UserModel()
    sessions = SessionModel()


    if not checkKeys(form,['sessionID','password']):
        return msg.errMsg("Please check the inputs.")

    password = form['password']
    sessionID = form['sessionID']

    # Get User according to sessionID
    session = sessions.getSession(sessionID)

    if len(session)==0:
        return msg.errMsg("Unable to find the session.")

    (sessionid, uid, start_time, end_time) = session[0]

    if end_time != None:
        return msg.errMsg("Expired SessionID")

    # Verify password
    if password.strip() == "":
        return msg.errMsg("Password cannot be empty.")

    findUser = users.getUser(uid=uid,password=password,enable=True)
    if findUser == None:
        return msg.errMsg("Failed to find user.")

    if len(findUser) == 0:
        return msg.errMsg("Wrong password.")

    # Delete User
    ret = users.deleteUser(uid)

    if ret == None:
        return msg.errMsg("Failed to delete user.")


    # Revoke all sessions
    sessions.endSession(uid=uid)


    return msg.successMsg({"uid": uid,"sessionID":sessionID})



def addUser(form):
    users = UserModel()

    if not checkKeys(form, ['name', 'email', 'phone', 'password', 'major', 'degree']):
        return msg.errMsg("Please check your requests.")

    name = form['name']
    email = form['email']
    phone = form['phone']
    password = form['password']
    major = form['major']
    degree = form['degree']

    if password.strip() == "":
        return msg.errMsg("Password cannot be empty.")

    findUser = users.getUser(email=email,enable=True)
    if findUser == None:
        return msg.errMsg("Failed to find user.")

    if len(findUser) != 0:
        return msg.errMsg("User already exists.")

    addUserResult = users.addUser(name=name, email=email, phone=phone, password=password, major=major, degree=degree)
    if addUserResult == None:
        return msg.errMsg("Failed to add user.")

    return msg.successMsg({"msg": "User added successfully."})