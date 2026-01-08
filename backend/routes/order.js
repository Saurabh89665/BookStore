//order api
const router=require("express").Router();
const authenticateToken=require("./userAuth");
const Book=require("../models/book");
const Order=require("../models/order");
const User=require("../models/user");

//place order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const user = await User.findById(id).populate("cart");
    if (!user || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    for (const book of user.cart) {
      const newOrder = new Order({
        user: id,
        book: book._id,
        price: book.price,
        status: "Placed",
        paymentMode: "Cash on Delivery",
      });

      const savedOrder = await newOrder.save();

      await User.findByIdAndUpdate(id, {
        $push: { orders: savedOrder._id },
      });
    }

    // Clear cart
    await User.findByIdAndUpdate(id, { $set: { cart: [] } });

    res.json({
      status: "success",
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


//get order histroy of particular  user
// ✅ GET ORDER HISTORY
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const user = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" },
    });

    const orders = user.orders.reverse();

    res.json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


//get all order --admin
router.get("/get-all-orders",authenticateToken,async(req,res)=>{
    try{
       const userData=await Order.find()
       .populate({
        path:"book",
       })
       .populate({
        path:"user",
       })
       .sort({createdAt:-1});
       return res.json({
        status:"success",
        data:userData,
       });
    }
    catch(error)
    {
        res
        .status(500)
        .json({message:"Internal server error"});
    }
});

//update order--admin
router.post("/place-order", authenticateToken, async (req, res) => {
  console.log("🔥 PLACE ORDER API HIT");   // 🔍
  console.log("HEADERS 👉", req.headers); // 🔍

  try {
    res.json({
      status: "success",
      message: "Order placed successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});



module.exports=router;