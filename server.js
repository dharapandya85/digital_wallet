//import required modules
const express=require('express'); // a web framework for node js 
const mongoose=rquire('mongoose'); // a library for mongo db
const cors=require('cors'); //acts as an middleware , it accesses API from different domain
const bodyParser=require('body-parser'); //acts as a middleware and takes incoming requests
const crypto=require('crypto'); // built-in methods for creating unique transaction id

//application level middleware - app.use()
//router level middleware -router.user()

//setting up express app
const app=express(); //initializing the express application
app.use(cors()); // setting up the middleware
app.use(express.json()); //server to handle json data
app.use(bodyParser.urlencoded({extended:true}));
//connecting to mongodb
mongoose.connect('URL+username+password+databasename',
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
)
//javascript promise
.then(()=>console.log('MongoDB connected'))
.catch(err=>console.error(err));

//Defining User Schemas(and models)
const userSchema=new mongoose.Schema({
    //field
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    upi_id:{type:String,unique:true},
    balance:{type:Number}
});
//Create User Model
const User=mongoose.model('User',userSchema);

//Defining transaction Schema
const transactionSchema= new mongoose.Schema({
    sender_upi_id:{type:String,required:true},
    receiver_upi_id:{type:String,required:true},
    amount:{type:Number,required:true},
    timestamp:{type:Date,default:Date.now},
    
});
//Create Transaction Model
const Transaction=mongoose.model('Transaction',transactionSchema);

//Function to generate an unique UPI id
const generateUPI=()=>{
    //crypto generates unique id
    const randomID=crypto.randomBytes(4).toString('hex'); //Generate a random 8-character ID
    // '$' fetches random id in numbers
    return `${randomId}@fastpay`
};

//Signup Route(extract user name, email,passwords,generate unique upi id)
app.post('/api/signup',async(req,res)=>{
    try{
        const {name,email,password}=req.body;

        //Checking if user already exists
        let user =await User.findOne({email});
        if(user){
            return res.status(400).send({message:'User already exists'});
        }
        //Generate UPI ID
        const upi_id=generateUPI();
        //initialize balance
        const balance=1000;

        //Create new User
        user=new User({name,email,password,upi_id,balance});
        await user.save();
        res.status(201).send({message:'User registered successfully!',upi_id});
    } catch(error){
        console.error(error);
        res.status(500).send({message:'Server error'});
    }
});

//Fetch User Details Route
app.get('/api/user/:upi_id',async(req,res)=>{
    try{
        const{upi_id}=req.params;
        const user=await User.findOne({upi_id});
        if(!user){
            return res.status(404).send({message:'User not found'});
        }
        res.status(200).send(user);

    }catch(error){
        console.error('Error fetching user:',error);
        res.status(500).send({message:'Server error'});
    }
});

//Login Route
app.post('/api/login',async(req,res)=>{
    try{
        const{email,password}=req.body;

        //Finding user by email
        const user =await User.findOne({email});
        if(!user|| user.password!==passsword){
            return res.status(400).send({message:'Invalid credentials'});
        }
        res.status(200).send({message:'login successful',upi_id:user.upi_id,balance:user_balance});
    } catch(error){
        console.error(error);
        res.status(500).send({message:'Server error'});
    }
});
//Transaction Routing
//Transactiong Routing
app.post('/api/transaction',async(req,res)=>{
    try{
        const {sender_upi_id,receiver_upi_id,amount}=req.body;

        //Validate amount
        if(amount<=0){
            return res.status(400).send({message:'Invalid amount'});
        }

        //finding sender and receiver
        const sender=await User.findOne({upi_id:sender_upi_id});
        const receiver=await User.findOne({upi_id:receiver_upi_id});

        if(!sender){
            return res.status(404).send({message:'Sender not found'})
        }
        if(!receiver){
            return res.status(404).send({message:'Receiver not found'})
        }
        //Checking if sender has enough balance
        if(sender.balance<amount){
            return res.status(400).send({message:'Insufficient balance'});
        }
        //performing transaction
        sender.balance-=amount;
        receiver.balance+=amount;

        //Logging before saving
        console.log('Updating sender balance:',sender);
        console.log('Updating receiver balance:',receiver);

        //Saving transaction record
        const transaction =new Transaction({sender_upi_id,receiver_upi_id,amount});
        await transaction.save();
        res.status(200).send({Message:'Transaction successful!'});
    } catch(error){
        console.error('Transaction error:',error);
        res.status(200).send({Message:'Server error'});
    }
       
});
//getting Transaction Route
app.get('/api/transactions/:upi_id',async(req,res)=>{
    try{
        const{upi_id}=req.params;

        //finding transactions for the given UPI ID
        const transcations=await Transaction.find({
            $or:[{sender_upi_id:upi_id},{receiver_upi_id:upi_id}]
        }).sort({timestamp:-1});

        res.status(200).send(transactions);

    }catch(error){
        console.error(error);
        res.status(500).send({message:'Server error'});
    }
});
const PORT =process.env.PORT||5000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));