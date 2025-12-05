// routes/cart.js
const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const authenticateToken = require("./userAuth");

// ✅ ADD TO CART
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;

    if (!id || !bookid) {
      return res.status(400).json({ message: "Missing id or bookid in headers" });
    }

    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBookInCart = userData.cart.includes(bookid);
    if (isBookInCart) {
      return res.json({
        status: "success",
        message: "Book is already in cart",
      });
    }

    await User.findByIdAndUpdate(id, {
      $push: { cart: bookid },
    });

    return res.json({
      status: "Success",
      message: "Book added to cart",
    });
  } catch (error) {
    console.log("add-to-cart error:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// ✅ REMOVE FROM CART (IMPORTANT: आता खरंच $pull होईल)
router.put("/remove-from-cart/:bookid", authenticateToken, async (req, res) => {
  try {
    // URL मधून bookid, आणि headers मधून user id घे
    const paramBookId = req.params.bookid;
    const headerBookId = req.headers.bookid;
    const id = req.headers.id;

    const bookid = paramBookId || headerBookId;

    if (!id || !bookid) {
      return res.status(400).json({ message: "Missing id or bookid" });
    }

    // जर cart मध्ये ObjectId स्टोअर करत असशील तर convert
    let pullValue = bookid;
    if (mongoose.Types.ObjectId.isValid(bookid)) {
      pullValue = new mongoose.Types.ObjectId(bookid);
    }

    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndUpdate(
      id,
      { $pull: { cart: pullValue } },
      { new: true }
    );

    return res.json({
      status: "Success",
      message: "Book removed from cart",
    });
  } catch (error) {
    console.log("remove-from-cart error:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// ✅ GET USER CART
router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    if (!id) {
      return res.status(400).json({ message: "Missing user id" });
    }

    const userData = await User.findById(id).populate("cart");
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const cart = userData.cart.reverse();

    return res.json({
      status: "success",
      data: cart,
    });
  } catch (error) {
    console.log("get-user-cart error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
