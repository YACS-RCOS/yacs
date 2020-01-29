from Model.UserEvent import UserEvent as UserEvents
import View.Message as msg
from common import *
import json
def addEvent(form):
    userEvents = UserEvents()

    if not checkKeys(form, ['uid','eventID','data','createdAt']):
        return msg.errMsg("Invalid request body.")


    uid = form['uid']
    eventID = form['eventID']
    event_data = form['data']
    timestamp = form['createdAt']

    print()
    addEventResult = userEvents.addEvent(uid=uid,eventID=eventID,data=str(event_data),timestamp=timestamp)

    if addEventResult == None:
        return msg.errMsg("Failed to add event.")

    return msg.successMsg({"msg": "Event added successfully."})
  