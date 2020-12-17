const express = require('express');
const router  = express.Router();

/*
	ENDPOINTS
*/

const api = require('./api.js'); // endpoints
const im  = require('./im.js');  // endpoints

/*
	INVOKE
*/

api.init(api);
im.init(im,api.jwt);

router.get('/', (req, res) => {res.send('TNRD API..')});


/*	
	API 
*/


//	AUTH

	router.get('/api/refresh',(req,res)=>{api.jwt.refresh(api,[req,res],(p)=>{res.json(p)});});
	router.post('/api/register',(req,res)=>{api.register(api,req.body.params,(p)=>{res.json(p)});});
	router.post('/api/login',(req,res)=>{api.login(api,req.body.params,(p)=>{res.json(p)});});

//	GET
	router.get('/api/applications',api.jwt.verify,(req,res)=>{api.applications.get.items(api,[req.query.query],(p)=>{res.json(p)});});
	router.get('/api/applications/:application',(req,res)=>{api.applications.get.item(api,[req.params.application],(p)=>{res.json(p)});});
	router.get('/api/roles/:application/',(req,res)=>{api.roles.get.items(api,[{application:req.params.application}],(p)=>{res.json(p)});});

//	INSERT 
	router.post('/api/application',(req,res)=>{api.applications.insert.item(api,[req.body.params],(p)=>{res.json(p)});});
	router.post('/api/role/',(req,res)=>{api.roles.insert.item(api,[req.body.params],(p)=>{res.json(p)});});

//	UPDATE 
	router.put('/api/application/',(req,res)=>{api.applications.update.item(api,req.body.params,(p)=>{res.json(p)});});
	router.put('/api/role/',(req,res)=>{api.roles.update.item(api,req.body.params,(p)=>{res.json(p)});});
/*	
	IM (Inventory Management)
*/ 



//	GET

	//	PATH
	router.get('/im/path/:path',(req,res)=>{im.get.path(im,[req.params.path],(p)=>{res.json(p)});});

	//	CATEGORIES
	router.get('/im/categories',(req,res)=>{im.get.categories(im,(p)=>{res.json(p)});});

	//	ITEMS
	router.get('/im/items',(req,res)=>{im.get.items.all(im,(p)=>{res.json(p)});});
	router.get('/im/items/search/:term',(req,res)=>{im.get.items.search(im,[req.params.term],(p)=>{res.json(p)});});	
	router.get('/im/items/by_category/:category',(req,res)=>{im.get.items.by_category(im,[req.params.category],(p)=>{res.json(p)});});

	//	IMAGE
	router.get('/im/image/:item',(req,res)=>{im.get.image.item(im,[req.params.item],(p)=>{res.json(p)});});

	//	CUSTOMERS
	router.get('/im/customers/:customer',(req,res)=>{im.get.customers.customer(im,[req.params.customer],(p)=>{res.json(p)});});
	router.get('/im/customer/checkout_items/:customer',(req,res)=>{im.get.customer.checkout.cart(im,[req.params.customer],(p)=>{res.json(p)});});
	
//	POST

	//	CUSTOMERS
	router.post('/im/customer/checkout/update',(req,res)=>{im.set.customer.checkout.update(im,[req.body.params],(p)=>{res.json(p)});});
	router.post('/im/customer/checkout/cart/:account',(req,res)=>{im.set.customer.checkout.cart(im,[req.body.params,req.params.account],(p)=>{res.json(p)});});

	//	ITEMS
	router.post('/im/items/item',(req,res)=>{im.set.items.item(im,[req.body.params],(p)=>{res.json(p)});});


	


	/*  ** Only Invoke when refresh token is required
	router.get('/im/code',(req,res)=>{im.get.redirect(im,[res])});
	router.get('/im/auth',(req,res)=>{im.get.auth(im,[res,req.query.code]);});*/


module.exports = router;


