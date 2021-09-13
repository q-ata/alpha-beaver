# Alpha Beaver

## Overview
Alpha Beaver is a modern Learning Management System for classrooms, universities, or private tutors. Our sophisticated platform streamlines communication, lesson delivery, and assignment grading for teachers and students.

## Installation
You will need the following dependencies:
```
Node.js >= 14.0.0
MongoDB >= 4.4.5
```
The Node dependencies can be installed with the following commands, run from the root directory of the repository:
```sh
cd backend
npm i
cd ../frontend
npm i
```
When running the server, ensure that the `SECRET_KEY` environment variable is set. This secret key will be used to sign all authentication JWTs.  
The server can be started with the following command in the `backend` folder:
```sh
node index.js
```
The frontend is powered by React, the debug build can be started with the following command in the `frontend` folder:
```sh
npm start
```
Use the following to build the production version of the React app:
```sh
npm run build
```

## Features
An overview of some key features of the platform.
### Account Creation
Schools can be configured to prevent registration or require a full name upon registration. Passwords are hashed with bcrypt. Here is an example of an account registration:
![Account Registration](https://i.imgur.com/3Hd8j2H.gif)
### Announcements
Teachers can create announcements that show up on student dashboards and course homepages:
![Announcements](https://i.imgur.com/aC05zpj.gif)
### Lesson Delivery
Alpha Beaver provides an interface to create lessons complete with rich text, images, and video embeds.
![Add Module](https://i.imgur.com/PXIXJlC.gif)
Adding rich text using the built-in rich text editor:
![Rich Text](https://i.imgur.com/OVDh35f.gif)
Adding an image embed:
![Image](https://i.imgur.com/ma6ne9z.gif)
Adding a YouTube video embed:
![YouTube](https://i.imgur.com/g6Hw1z4.gif)
You can edit the settings of each of these modules and see them updated on the fly:
![Settings](https://i.imgur.com/ltee3qa.gif)

## Assignment Submission
Students can submit files from their computer to complete assignments. Currently, PNG, JPEG, and PDF files are supported. Files are uploaded to the server and can be viewed by the teacher for marking.
![Submit](https://i.imgur.com/Zt44a0r.gif)

## Grading
Grades for each assignment can be accessed by students. Additionally, there is optional feedback that is given for each assignment.
![Grades](https://i.imgur.com/8W5P0vz.gif)