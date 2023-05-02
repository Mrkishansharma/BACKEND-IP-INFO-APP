# BACKEND-IP-INFO-APP


Deployed Link (API) :-  https://jittery-crow-snaps.cyclic.app/


# Routes

* POST   /login

  {
    pass : string,
    email : string
  }


* POST   /register
  
  {
    name : string,
    email : string,
    pass : string
  }


* GET   /logout



* GET   /current-location/:IP






# External Modules

1. bcrypt - for hash password
2. jsonwebtoken - authorization and authenication using jwt token
3. cookie-parser - store jwt in cookies
4. express - express server
5. mongoose - for connecting server to mongoDB atlas
6. dotenv - for storing private crediantials
7. ioredis - for storing blacklisted token and recent searches IP address city info
8. winston - logging info and error

