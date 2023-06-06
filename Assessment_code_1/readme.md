1. Install all dependencies by using command npm install / npm i

"dependencies": {
    "axios": "^1.4.0",
    "dotenv": "^16.1.4",
    "express": "^4.18.2",
    "mysql2": "^3.3.3",
    "nodemon": "^2.0.22",
    "sequelize": "^6.32.0"
  }

  2. Make .env file to protect necessary credentials like

PORT = 3000
DB_PORT = 3306
HOST = <use your own database Host name>
USER = <use your own database user name>
PASSWORD = <use your own database password>
DB = <use your own database "schema" name>

3. create .gitignore to ignore .env and node_modules file to upload on github repo
