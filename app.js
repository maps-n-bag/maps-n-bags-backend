require('dotenv').config();
const fs = require("fs")
const path = require("path")
const hljs = require("highlight.js")
const Markdown = require("markdown-it")

const md = Markdown({
  highlight: (str, lang) => {
    const code = lang && hljs.getLanguage(lang)
      ? hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true,
        }).value
      : md.utils.escapeHtml(str);
    return `<pre class="hljs"><code>${code}</code></pre>`;
  },
});
process.env.TZ = 'Asia/Dhaka'
const express = require("express")
const app = express()
const cors = require("cors")

const user = require("./routes/user.route");
const plan = require("./routes/plan.route")
const event = require("./routes/event.route")
const publicRoute = require("./routes/public.route")
const uploadRoute = require("./routes/upload.route")

const router = express.Router()
app.use(router)

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*'
}))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//-------------------------------------------------------------

router.get("/", (req, res) => {
  res.send("Hello World")
})

router.get("/api", (req, res) => {
  fs.readFile(path.join(__dirname, "document.md"), "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error");
    }
    
    const html = md.render(data);
    res.send(html);
  }
)});

app.use("/api/user", user)
app.use("/api/plan", plan)
app.use("/api/event", event)
app.use("/api/public", publicRoute)
app.use("/api/upload", uploadRoute)

//-------------------------------------------------------------

const port = process.env.PORT || 8888
if (require.main === module) {
  app.listen(port, () => console.log(`Server started on port ${port}`))
}

module.exports = app