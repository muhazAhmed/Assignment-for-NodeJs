const express = require ("express")
const app = express()
const mongoose = require ("mongoose")
mongoose.set('strictQuery', true)
const route = require ("./route")

require ("dotenv").config()
app.use(express.json())

mongoose.connect(process.env.MONGODB_CONNECTION, {useNewUrlParser : true})
.then(() => {
    console.log("MongoDB is Connected...")
})
.catch(error => {
    console.log(error.message)
})

app.use("/", route)

app.listen(8800, () => {
    console.log("Server is Connected...")
})