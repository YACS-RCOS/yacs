import json
from flask import jsonify
def successMsg(content:dict):
    result = {"success" : True, "errMsg" : None, "content" : content}
    return jsonify(result)

def errMsg(errMsg : str,content = None):
    result = {"success": False, "errMsg": errMsg, "content": content}
    return jsonify(result)