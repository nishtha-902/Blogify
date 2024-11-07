// require("dotenv").config()   for AWS deployment

const express= require("express")
const path= require("path")
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const mongoose= require("mongoose")

const Blog= require("./models/blog")

const blogRoute=require("./routes/blog")
const userRoute=require("./routes/user");

const app=express()
const PORT=8000

// const PORT= process.env.PORT || 8000      for deployment

// export MONGO_URL=mongodb://localhost:27017/blogify

// connect(process.env.MONGO_URL)
mongoose
.connect("mongodb://localhost:27017/blogify")
.then((e) => console.log("MongoDB is connected"))

// ejs
app.set("view engine","ejs")
app.set("views",path.resolve("./views"))


app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))

app.use(express.static(path.resolve('./public')))

app.get("/", async (req,res) => {
    const allBlogs= await Blog.find({})
    res.render("home",{
        user: req.user,
        blogs: allBlogs,
    })
})

app.use("/user",userRoute)
app.use("/blog",blogRoute)

app.listen(PORT,() => console.log("Server Started!!"))