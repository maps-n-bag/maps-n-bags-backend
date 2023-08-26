require('dotenv').config();
const fs = require("fs")
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

const express = require("express")
const app = express()
const cors = require("cors")

const user = require("./routes/user.route");
const plan = require("./routes/plan.route")
const event = require("./routes/event.route")
const publicRoute = require("./routes/public.route")

const router = express.Router()
app.use(router)

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: false}))

//-------------------------------------------------------------

router.get("/", (req, res) => {
  res.send("Hello World")
})

router.get("/api", (req, res) => {
  fs.readFile("./document.md", "utf8", (err, data) => {
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

//-------------------------------------------------------------

const port = process.env.PORT || 8888
app.listen(port, console.log(`Server started on port ${port}`))