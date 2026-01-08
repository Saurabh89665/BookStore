const express=require("express");
const app=express();

require("dotenv").config();

//CONNECT DB
require("./conn/conn");
const cors=require("cors");


//middleware
app.use(express.json())
//routes
const user=require("./routes/user")
const book=require("./routes/book")
const favourite=require("./routes/favourite")
const cart=require("./routes/cart")
const order=require("./routes/order")
app.use(cors())
app.use("/api/v1",user);
app.use("/api/v1",book);
app.use("/api/v1",favourite);
app.use("/api/v1",cart);
app.use("/api/v1",order);
//creating port=server start
app.listen(process.env.PORT,()=>
{
    console.log(`server started at port ${process.env.PORT}`);
});

// const express = require("express");
// const app = express();
// require("dotenv").config();
// const cors = require("cors");

// // DB CONNECT
// const conn = require("./conn/conn");
// conn();

// // middleware
// app.use(express.json());
// app.use(cors());

// // routes
// app.use("/api/v1", require("./routes/user"));
// app.use("/api/v1", require("./routes/book"));
// app.use("/api/v1", require("./routes/favourite"));
// app.use("/api/v1", require("./routes/cart"));
// app.use("/api/v1", require("./routes/order"));

// // server start
// app.listen(process.env.PORT, () => {
//     console.log(`Server started at port ${process.env.PORT}`);
// });
