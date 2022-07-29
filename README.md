##  API 規格 Open browser with
# https://g11herokuexpress.herokuapp.com/api-doc/

# http://localhost:3000/api-doc/

## 使用技術
1. nodeJs 
2. MongoDB
3. oauth2.0(LINE LOGIN API)
4. postman
5. Swagger
6  jwt(https://jwt.io/)
7. Heroku 


## 🔨 Build and Run
此專案會用到的 Framework / Library 或工具

* [Nodejs](https://github.com/nodejs)
* [Heroku](https://www.heroku.com/)
* [Git](https://git-scm.com/)
* [Nodemon](https://www.npmjs.com/package/nodemon)
* [Mongoose](https://mongoosejs.com/)
* [dotenv](https://www.npmjs.com/package/dotenv)

## 💻 Getting Started

1. Clone the Repo
  ```sh
    git clone https://git.heroku.com/g11herokuexpress.git
  ```
2. Install NPM packages
  ```
  cd packages
  npm install
  ```
3. Setup .env to connect DB
  ```
  cp .env.example .env
  設定 .env 參數，遠端資料庫使用 MongoDB Atlas
  ```

3. Start Runing Server
  ```
  npm run dev
  ```
4. Deploy to heroku
  ```
  git push heroku main
  ```
5. Setting Heroku Variable
  
6. DEBUG in Heroku
  ```
  heroku logs --tail
  ```
