const express=require('express')
const app =express();
const bcrypt=require('bcryptjs')
const session = require('express-session')
const userModel =require('./database/models/user')
const toDoModel=require('./database/models/todo')
require('dotenv').config()
const {PORT}=process.env

const db=require('./database/index')

db.init()  //for DB connection

//Middleware
app.use(express.json())
app.use(express.static('Public'))
app.use(express.urlencoded({extented:true}))
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	
}))

//set template
app.set("view engine","ejs")

//Landing Page (LOGIN)
app.get('/',(req,res)=>{
	
	if(req.session.isLoggedIn)
	{
		let user=req.session.username;
		res.render('todo',{user:user})
		return
	}
	res.render('login',{err:null})
})

//after Successfull login
app.post("/todo", async (req, res) => {
	try {
	  // Get user input
	  const { email, password } = req.body;  
	  // Validate user input
	  if (!(email && password)) {
		res.render('login',{err:"All input is required"});
	  }
	  // Validate if user exist in our database
	  const user = await userModel.findOne({ email });
  
	  if (user && (await bcrypt.compare(password, user.password))) {
      //apply here express session
	    req.session.isLoggedIn = true;
		req.session.username=user.username;
        res.render('todo',{user:user.username});
		return;
	  }
	  res.render('login',{err:"Invalid Credentials"});
	} catch (err) {
	  console.log(err);
	}
  });

//Getting Register Page
app.get('/register', (req, res) => {
	res.render("register",{err:null});
})
//Posting register Data
app.post("/register", async (req, res) => {
	const {username,email,password}=req.body
	try {
	  if (!(email && password && username)) {
		console.log(email,password,username)
		res.render('register',{err:"All input is required"});
	  }

	  const oldUser = await userModel.findOne({ email });
	  console.log(oldUser)
  
	  if (oldUser) {
		return res.render('register',{err:"User Already Exist. Please Login"});
	  }
	  //Encrypt user password
	  encryptedPassword=await bcrypt.hash(password, 10);
	 
	  const user = await userModel.create({
		username,
		email: email.toLowerCase(), 
		password: encryptedPassword,
	  });

	res.render('login',{err:null})
	} catch (err) {
		if(err.code===11000)
		{
			res.render('register',{err:"Username Exist , Please Try Another Username"})
		}
	  console.log(err);
	}
  });

//Getting AllUser
app.route('/user').get((req,res)=>{
    userModel.find( {} )
		.then(function(data)
    {
		res.json(data);
      
      if(data === null)
      {
		res.end("No data")
      } 
      
    }).catch(function(err)
    {
        res.json({msg:err});	
        console.log(err)
    })

})
//Creating new User
.post((req,res)=>{
	const response=req.body
	const username=response.username;
	const password=response.password;
	const repeatpass=response.repeatPass;

	if(!username)
	{
			res.json({ msg:"Please Enter Username"})
			return
	}
		if(!password)
	{
        res.json({ msg:"Please Enter Password"})
			
			return
	}
    if(!repeatpass)
	{
        res.json({ msg:"Please Enter Confirm Password"})
			
			return
	}

  if(username && (password ===repeatpass))
  {
					userModel.create(
						{
							username:username,
							password:password

						}
					)
					.then(()=>
					{  
						 res.json({ msg:"Successfully registered"});
					})
					.catch((err)=>
					{
						console.log(err)
						res.json({ msg:"User Already Exist!!"})
					})
	}
	else
	{
    res.json({ msg:"Enter a valid detail || Password mismatch"})
	}
})

//Getting all Todos
app.route('/todos').get((req,res)=>{
    toDoModel.find( {} )
		.then(function(data)
    {
		res.json(data);
      
      if(data === null)
      {
		res.end("No data")
      } 
      
    }).catch(function(err)
    {
        res.json({msg:err});	
        console.log(err)
    })

})
// Creating Todo
.post((req,res)=>{
	const response=req.body
	console.log(response)
	const title=response.title;
	const status=response.status;
	const added_by=response.added_by;
	const id=response.id;
					toDoModel.create(
						{
							title:title,
							status:status,
							id:id,
							added_by
						}
					)
					.then(()=>
					{  
						 res.end();
					})
					.catch((err)=>
					{
						console.log(err)
						
					})
})

//Deleting Todo and Send updated
app.route(`/delete`).post((req,res)=>{
	const response=req.body
	const id=response.id
					toDoModel.deleteOne({id:id})
					.then((response1)=>
					{  
						 toDoModel.find({})
							.then((response2)=>{
                                res.send(response2)
							})
					})
					.catch((err)=>
					{
						console.log(err)
						
					})
})

//updating status
app.route(`/updated`).post((req,res)=>{
	const response=req.body
	const id=response.id
	let status=response.status
	console.log(status)
	console.log(id)
					toDoModel.updateOne({id:id},{$set:{status:status}})
					.then((response)=>
					{  
						 console.log(response)
						 res.end()
					})
					.catch((err)=>
					{
						console.log(err)
						
					})
})

//updating title
app.route(`/updateTask`).post((req,res)=>{
	const response=req.body
	const id=response.id
	let title=response.title
	console.log(title)
	console.log(id)
					toDoModel.updateOne({id:id},{$set:{title:title}})
					.then((response)=>
					{  
						 console.log(response)
						 res.end()
					})
					.catch((err)=>
					{
						console.log(err)
						
					})
})

//logout
app.post("/logout", (req, res) => {
	req.session.destroy();  
	res.redirect("/");
  });

app.listen(PORT,()=>{
    console.log("Listening on",PORT)
})

