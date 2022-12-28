const { Router } = require("express")
const express = require ("express")
const route = express.Router()
const User = require("./controllers/userController")
const { authentication } = require("./middleware/auth")


route.get("/", (req,res) =>{
    return res.json("Api is Working")
})

route.post("/register", User.register)
route.post("/login", User.login)
route.get("/users", authentication, User.getUser)



route.all("/*", (req, res) => 
{ res.status(400).send({ status: false, message: "Endpoint is not correct" }) })

module.exports = route