const express = require("express")
const app = express()
const env=require('dotenv').config();
const plan = require("./routes/plan_route")
const event = require("./routes/event_route")


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.get("/", (req, res) => {
  res.send("Hello World")
})
app.use("/plan", plan)
app.use("/event", event)

const port = process.env.PORT || 3000
app.listen(port, console.log(`Server started on port ${port}`))