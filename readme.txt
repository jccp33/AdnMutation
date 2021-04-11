----- BACK -----
back/mutation.js: It contains all the necessary functions to process the strings (DNA).
back/basic.js: Contains the web service that must be queried by other applications
    - Dependencies: dateformat, mongodb
    - Database engine: Mongo DB
    - To change the database you must edit the connection string in line 4
    - To run the web service from the server: node basic.js
    - It only receives data with the POST method

----- FRONT -----
front/index.html: index file to run in browser
front/js/adnMutation.js: this file contains the necessary functions to obtain information from the backend
front/css/styles.css: this file contains a few styles to change background colors
