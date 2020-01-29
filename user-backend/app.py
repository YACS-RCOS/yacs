#!/usr/bin/python3
from flask import Flask, request
from config import *
import Controller.User as userController
import Controller.Session as sessionController
import Controller.UserEvent as eventController
from flask_cors import CORS
import json
app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def root():
    return "user-backend service up"

@app.route('/users', methods=['GET'])
def getUserInfo():
    return userController.getUserInfo(request.json)


@app.route('/users', methods=['POST'])
def addUser():
    return userController.addUser(request.json)

@app.route('/users', methods=['DELETE'])
def deleteUser():
    return userController.deleteUser(request.json)


@app.route('/users', methods=['PUT'])
def updateUserInfo():
    return userController.updateUser(request.json)


@app.route('/sessions', methods=['POST'])
def login():
    return sessionController.addSession(request.json)

@app.route('/sessions', methods=['DELETE'])
def logout():
    return sessionController.deleteSession(request.json)

@app.route('/userEvent', methods=['POST'])
def addUserEvent():
    return eventController.addEvent(json.loads(request.data))

if __name__ == '__main__':
    app.run(debug=APP_DEBUG_MODE, host=APP_HOST)
