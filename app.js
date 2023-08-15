require('dotenv').config();

const express = require("express")
const app = express()
const cors = require("cors")

// const plan = require("./routes/plan_route")
// const event = require("./routes/event_route")
// const place = require("./routes/place_route")
// const review = require("./routes/review_route")
// const user = require("./routes/user_route");

const router = express.Router()
app.use(router)

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: true}))

//-------------------------------------------------------------

router.get("/", (req, res) => {
  res.send("Hello World")
})
// router.use("/plan", plan)
// router.use("/event", event)
// router.use("/place", place)
// router.use("/user", user)
// router.use("/review", review)

//-------------------------------------------------------------

const db = require("./db/models")

const port = process.env.PORT || 8080
db.sequelize.sync().then(() => {
  app.listen(port, console.log(`Server started on port ${port}`))
})