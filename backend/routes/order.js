//order api
const router=require("express").Router();
const authenticateToken=require("./userAuth");
const Book=require("../models/book");
const Order=require("../models/order");
const User=require("../models/user");

//place order
router.post("/place-order",authenticateToken,async(req,res)=>{
    try{
        const{id}=req.headers;
        const{order}=req.body;

        for(const orderData of order)
        {
            const newOrder=new Order({user:id,book:orderData._id});
            const orderDataFromDb=await newOrder.save();

            //saving order in user model
            await User.findByIdAndUpdate(id,{
                $push:{orders:orderDataFromDb._id},
            });
        }
        return res.json({status:"Success",message:"order places successfully",
        });
    }
    catch(error)
    {
        res
        .status(500)
        .json({message:"Internal server error"});
    }
});

//get order histroy of particular  user
router.get("/get-order-history",authenticateToken,async(req,res)=>{
    try{
        const{id}=req.headers;
        const userData=await User.findById(id).populate({
        path:"orders",
        populate:{path:"book"},
    });

    const orderData=userData.orders.reverse();
    return res.json({
        status:"success",
        data:"orderData",
    });
    }
    catch(error)
    {
        res
        .status(500)
        .json({message:"Internal server error"});
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
router.post("/place-order",authenticateToken,async(req,res)=>{
    try{
        const {id}=req.params;
        await Order.findByIdAndUpdate(id,{status:req.body.status});
        return res.json({
            status:"success",
            message:"Status updated Successfully",
        });
    }
    catch(error)
    {
        res
        .status(500)
        .json({message:"Internal server error"});
    }
});


module.exports=router;