# API DOCUMENTATION

## USER API'S

### /rest-auth/login/
- method: POST
- request data: 
```json
{
  "username": "abc@example.com",
  "password": "password"
}
```
- response: `{"token": "ah836hw0j0101ghg895"}`

### /register/
- method: POST
- request data:
```json
{
  "email": "abc@example.com",
  "password": "password",
  "confirm_password": "password"
}
```
- response: `{"token": "ah836hw0j0101ghg895"}`

## REMINDER API'S

Set the request header `Authorization` with the value `"Token {tokenValue}"` while making api calls.
### /reminders
- method: GET
- response: 
```json
[
    {
        "phone_number": "1234567890",
        "message": "this is a test message",
        "id": 1,
        "scheduled_datetime": "2016-08-27T14:24:00.000-00:00"
    },
    {
        "phone_number": "1234567890",
        "message": "this is a test 2 message",
        "id": 2,
        "scheduled_datetime": "2016-08-27T14:24:00.000-00:00"
    }
]
```

### /reminders/
- method: POST
- request data: 
```json
{
  "scheduled_datetime": "2016-08-27T14:24:00Z",
  "message": "this is a test message",
  "phone_number": "1234567890"
}
```
- response: 
```json
{
  "id": 2,
  "scheduled_datetime": "2016-08-27T14:24:00Z",
  "message": "this is a test message",
  "phone_number": "1234567890"
}
```

### /reminders/{id}/
- method: PUT
- request data: 
```json
{
  "scheduled_datetime": "2016-08-27T14:24:00Z",
  "message": "this is an updated test message",
  "phone_number": "1234567890"
}
```
- response: 
```json
{
  "id": 2,
  "scheduled_datetime": "2016-08-27T14:24:00Z",
  "message": "this is an updated test message",
  "phone_number": "1234567890"
}
```

### /reminders/{id}/
- method: DELETE
- response_status: 204 No Content
