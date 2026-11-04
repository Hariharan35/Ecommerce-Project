// const express=require("express");
// require('dotenv').config();
// const connectDB=require("./config/db");
// const userRoutes=require('./routes/user.routes');
// const studentRoutes=require('./routes/student.routes');
// const cors = require("cors");

// const app=express();
// app.use(express.json())
// app.use('/api/users',userRoutes)
// app.use('/api/students',studentRoutes)


// // app.listen(process.env.PORT,()=>{
// //    console.log(`Server running on port ${process.env.PORT}`);
// // })
// app.use(cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     credentials: true
// }));

// connectDB().then(()=>{
//     app.listen(process.env.PORT,()=>{
//     console.log(`server running on port ${process.env.PORT}`);

//     });

// }).catch((err)=>{
//     console.error('Failed to start server due to Database Connection error');
//     process.exit(1);
// })


const express = require("express");
require("dotenv").config();
const authRoutes = require("./routes/auth.routes");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const cartRoutes = require("./routes/cart.routes");
const cors = require("cors");
const orderRoutes = require("./routes/order.routes");
const productRoutes = require("./routes/product.routes");
const app = express();

// 1. Configure CORS FIRST
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));

// 2. Middleware
app.use(express.json());

// 3. API Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
// 4. Connect Database and Start Server
connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to start server:", err);
        process.exit(1);
    });
