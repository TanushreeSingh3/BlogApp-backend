import express from "express";
import mongoose from "mongoose";
import router from "./routes/user-routes";
import blogRouter from "./routes/blog-routes";

const app = express();
app.use(express.json());
app.use("/api/user",router);
app.use("/api/blog",blogRouter); 

mongoose.connect('mongodb+srv://tanushreesingh:tanu123@cluster0.nlan2sb.mongodb.net/Blog?retryWrites=true&w=majority'
)
.then(()=>app.listen(5005))
.then(()=>console.log("success"))
.catch((err)=>console.log("error"));

