# COUNSELHEROTEST

This is a NodeJS project

## Development server

Run `npm run dev` for a dev server. Navigate to `http://localhost:5000/`. The app will automatically reload if you change any of the source files.

## API endpoints

STUDENT END POINTS
signup student:
POST:http://localhost:5000/api/student/auth/signup

body {
"userName":"myUsername",
"email":"test@gmail.com",
"firstName":"Ifeanyi",
"lastName":"Okorie",
"password":"123456",
"counselorId":"61b5103cceeeb1fd279719d4",
"organizationId":"61b4cc3a938b46557befaaf4"
}
SUCCESS(200):
{
"id":"61b5103cceeeb1fd279719d4"
"userName":"myUsername",
"email":"test@gmail.com",
"firstName":"Ifeanyi",
"lastName":"Okorie",
"password":"123456",
"counselorId":"61b5103cceeeb1fd279719d4",
"organizationId":"61b4cc3a938b46557befaaf4"
}
FAILED(500):

{
"errors": [
{
"message": "Something went wrong!"
}
]
}

login STUDENT:
POST:http://localhost:5000/api/student/auth/login

body {
"userName":"myUsername",
"password":"123456",

}

SUCCESS(200):

{
"accessToken": "YOUR ACCESS TOKEN",
"refreshToken": "YOUR REFRESH TOKEN"
}

student request to participate in event:
POST:http://localhost:5000/api/student/events/<event id here>/participation-request
header {
authorization: <Bearer token>
}

body {
"participationRequest":"I want to participate"
}
SUCCESS(200):
{
"message":"Your request to join event with ID:61b7c66f25b5b5977338f556 has been submitted"
}
FAILED(400):
{"errors":[{"message":"Unathorized!"}]}

POST: http://localhost:5000/api/student/auth/refresh-token

header {
authorization: <Bearer token>
}

body{
"refreshToken":"YOUR_REFRESH_TOKEN"
}

##################################################

COUNSELOR END POINTS

signup COUNSELOR:
POST:http://localhost:5000/api/student/auth/signup

body {
"userName":"myUsername",
"email":"test@gmail.com",
"firstName":"Ifeanyi",
"lastName":"Okorie",
"password":"123456",
"organizationId":"61b4cc3a938b46557befaaf4"
}

SUCCESS(200):

{
"id":"61b5103cceeeb1fd279719d4"
"userName":"myUsername",
"email":"test@gmail.com",
"firstName":"Ifeanyi",
"lastName":"Okorie",
"password":"123456",
"organizationId":"61b4cc3a938b46557befaaf4"
}

FAILED(500):

{
"errors": [
{
"message": "Something went wrong!"
}
]
}

login COUNSELOR:

POST:http://localhost:5000/api/counselor/auth/login

body {
"userName":"myUsername",
"password":"123456",

}

SUCCESS(200):

{
"accessToken": "YOUR ACCESS TOKEN",
"refreshToken": "YOUR REFRESH TOKEN"
}

COUNSELOR creates event:

POST:http://localhost:5000/api/counselor/events

header {
authorization: <Bearer token>
}

body {
"name":"Get Together",
"thumbNail":"www.thumbnail.com/image.jpeg",
"backgroundImage":"img.png",
"description":"This is a student get Together",
"date":"2021-12-13T22:16:59.781Z"
}

SUCCESS(200):

{
"id":"61b4cc3a938b46557befaaf4"
"name":"Get Together",
"thumbNail":"www.thumbnail.com/image.jpeg",
"backgroundImage":"img.png",
"description":"This is a student get Together",
"date":"2021-12-13T22:16:59.781Z"
}

counselor approve or reject student's request to join event:

POST:http://localhost:5000/api/counselor/events/<event id here>

header {
authorization: <Bearer token>
}

body{
"studentId":"61b51cd47927cfad08e3f6d2",
"status":"rejected",
"eventId":"61b6c68c8b333fbbfd350e16"
}
