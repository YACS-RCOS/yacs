def checkKeys(form, keys):

    if form == None:
        return False

    if type(form) is not dict:
        return False

    for key in keys:
        if key not in form.keys():
            return False

        value = form[key]
        if value == None:
            return False

    return True

