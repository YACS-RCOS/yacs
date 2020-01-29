# GET /users
Get the profile of the current user.
## Request
### Header
```
application/json
```
### Body
```json
{
    "sessionID" : "43243-4324-324-234-32"
}
```
## Response
### Header
```
application/json
```
### Body
```json
{
    success: true
    errMsg: null,
    content: 
    {
        "uid": "4",
        "name": "John",
        "email": "aaa@wa.com",
        "phone": "51829838475",
        "major": "CS",
        "degree": "Undergraduate"
    } 
}
```
# PUT /users
Update the profile of the current user.
## Request
### Header
```
application/json
```
### Body
```json
{
    "sessionID": "213123-123-123-213-3123",
    "name": "John",
    "email": "aaa@wa.com",
    "phone": "51829838475",
    "major": "CS",
    "newPassword" : "new123456",
    "degree": "Undergraduate"
}
```
## Response
### Header
```
application/json
```
### Body
```json
{
    success: true
    errMsg: null,
    content: {}
}
```
# POST /users
Create a new user.
## Request
### Header
```
application/json
```
### Body
```json
{
    "name": "John",
    "email": "aaa@wa.com",
    "phone": "51829838475",
    "major": "CS",
    "password" : "123456",
    "degree": "Undergraduate"
}
```
## Response
### Header
```
application/json
```
### Body
```json
{
    success: true
    errMsg: null,
    content: 
    {
        "msg": "User added successfully"
    }
}
```
# DELETE /users
Delete current user.
## Request
### Header
```
application/json
```
### Body
```json
{
    "sessionID": "12312-321-3-12-3",
    "password" : "123456"
}
```
## Response
### Header
```
application/json
```
### Body
```json
{
    success: true
    errMsg: null,
    content: 
    {   
        "uid": "213-2-321-3-12-3",
        "msg": "Failed to delete user."
    }
}
```