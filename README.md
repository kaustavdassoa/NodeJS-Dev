# ReadMe

This is a demo repository to host & store all my node JS sample applications. Over the time I will be adding simple yet important projects which will help understanding how NodeJs can be used for developing non-blocking , asynchronous , single threaded , light weighted applications.


###### **new-weather-app**||*Demonstrating rest.ws call asynchronous callback*||AddedOn:06/26/2018

###### **express-translation-service**|*Translation server app that translate any string into target language*||AddedOn:06/27/2018 

###### **artfreak-chat-app**|*facebook webhook for nodejs application*||AddedOn:07/29/2018  

###### **express-chat-app**|*Express Chat Application*||AddedOn:08/04/2018 [APP URL](https://kaustavdassoa.herokuapp.com/)

###### **blockchain-app**|*Express Block Chain Application to understand basic functionality of the blockchain – view a blockchain, create new transaction, mine new block, decentralized hosting, synchronization etc.*||AddedOn:30/30/2018  
[view chain@NODE1](http://block001.herokuapp.com/blockchain)
[view chain@NODE2](http://block002.herokuapp.com/blockchain)



# Git Commands

```
- git init
- git add README.md
- git commit -m "first commit"
- git remote add origin https://github.com/kaustavdassoa/NodeJS-Dev.git
- git push -u origin master

- git remote add origin https://github.com/kaustavdassoa/NodeJS-Dev.git
- git push -u origin master

- git log --graph --abbrev-commit --decorate
- git log --graph --oneline --decorate

```


# Heroku Commands

```
$ heroku login
$ heroku create
cd express-chat-app/
$ git init
$ heroku git:remote -a kaustadassoa
$ git add .
$ git commit -am "intial commit"
$ git push heroku master
$ heroku logs --tail

```