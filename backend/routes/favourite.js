//creating routes to add bookm to favourites
const router=require("express").Router();
const { model } = require("mongoose");
const User=require("../models/user");
const authenticateToken=require("./userAuth");

//add book to favourite
// router.put("/add-book-to-favourite",authenticateToken,async(req,res)=>
// {
//     try
//     {
//         const {bookid,id}=req.headers;
//         const userData=await User.findById(id);
//         const isBookFavourite=userData.favourites.includes(bookid);
//         if(isBookFavourite)
//         {
//             return res.status(200).json({message:"book is already in favourites"});
//         }
//         await User.findByIdAndUpdate(id,{$push:{favourites:bookid}});
//         return res.status(200).json({message:"book added to favourite"});
//     }catch(error)
//     {
//         res
//         .status(500)
//         .json({message:"Internal server error"});
//     }
// });

// add to favourite (use $addToSet to avoid duplicates)
router.put("/add-book-to-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    if (!bookid || !id) return res.status(400).json({ message: "Missing headers" });

    // use $addToSet to avoid duplicates
    await User.findByIdAndUpdate(id, { $addToSet: { favourites: bookid } });

    return res.status(200).json({ message: "Book added to favourite" });
  } catch (error) {
    console.error("add-book-to-favourite error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


//remove book from 
// router.put("/remove-book-from-favourite",authenticateToken,async(req,res)=>
// {
//     try
//     {
//         const {bookid,id}=req.headers;
//         const userData=await User.findById(id);
//         const isBookFavourite=userData.favourites.includes(bookid);
//         if(isBookFavourite)
//         {
//             await User.findByIdAndUpdate(id,{$push:{favourites:bookid}});
//         }
//         return res.status(200).json({message:"remove book from favourite"});
//     }catch(error)
//     {
//         res
//         .status(500)
//         .json({message:"Internal server error"});
//     }
// });


// remove from favourite (use $pull)
router.put("/remove-book-from-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    if (!bookid || !id) return res.status(400).json({ message: "Missing headers" });

    await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });

    return res.status(200).json({ message: "Removed book from favourite" });
  } catch (error) {
    console.error("remove-book-from-favourite error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



//get fav books from particular user

// get favourite books
router.get("/get-favourite-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    if (!id) return res.status(400).json({ message: "Missing id header" });

    const userData = await User.findById(id).populate("favourites");
    return res.json({ status: "success", data: userData.favourites });
  } catch (error) {
    console.error("get-favourite-book error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
// router.get("/get-favourite-book",authenticateToken,async(req,res)=>
// {
//     try
//     {
//         const {id}=req.headers;
//         const userData=await User.findById(id).populate("favourites");
//         const favouriteBooks=userData.favourites;
//         return res.json({
//             status:"success",
//             data:favouriteBooks,
//         });
//     }catch(error)
//     {
//         console.log(error);
//         return res
//         .status(500)
//         .json({message:"Internal server error"});
//     }
// });

module.exports=router;