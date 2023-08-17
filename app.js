require('dotenv').config();

const express = require("express")
const app = express()
const cors = require("cors")

const user = require("./routes/user.route");
const plan = require("./routes/plan.route")
const event = require("./routes/event.route")
const place = require("./routes/place.route")
// const review = require("./routes/review_route")

const router = express.Router()
app.use(router)

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: false}))

//-------------------------------------------------------------

router.get("/", (req, res) => {
  res.send("Hello World")
})

app.use("/api/user", user)
app.use("/api/plan", plan)
app.use("/api/event", event)
app.use("/api/place", place)
// app.use("/api/review", review)

//-------------------------------------------------------------

const port = process.env.PORT || 8080
app.listen(port, console.log(`Server started on port ${port}`))