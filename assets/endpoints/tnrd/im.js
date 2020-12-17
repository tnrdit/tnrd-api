//LIM

const zoho  = require('../../../assets/connections/tnrd/zoho/index.js');
const mongo = require('../../../assets/connections/db/mongo/index.js');
const mongoose = require('mongoose');
module.exports = {
	
	data : {
		request : {
			o:{
				host:'inventory.zoho.com',
				path:'',
				method:'GET',
				headers: {'Authorization':'','Content-Type':'application/json, text/javascript, */*; q=0.01'}
			},
			p:{}
		},
		mongo:{
			db:process.env.tnrd_im_db,
			options : {useNewUrlParser: true,useUnifiedTopology: true}
		},
	}, 
	
	init : function(r){
		
		
		r.mongo = mongo;
		r.mongo.init(r.mongo);
		r.db = mongoose.createConnection('mongodb://localhost/'+r.data.mongo.db, r.data.mongo.options);
		
		r.org = process.env.tnrd_im_org,
		
		r.zoho  = zoho;
		r.zoho.init(r.zoho); 
	},
	
	registration : function(r,p,c){
		console.log("IM REG")
	},
	login : function(r,p,c){
		console.log("IM LOGIN")
	},
	user : function(r,p,c){
		console.log("IM USER")
	},
	
	set : {
		

		
	
		//	Customer
		customer : {
			checkout : {
				update : function(r,p,c){
					// get customer
					
					var params = p[0];
					r.get.customers.customer(r,[params.account],function(p){
						var customer = p;
						
						if(customer.checkout[params.item]){
							customer.checkout[params.item].qty = parseInt(params.qty);
						}else{
							customer.checkout[params.item] = {qty:params.qty}
						}
						
						// update record
						r.mongo.set.collection.item.update(r.mongo,[r.data.mongo.db,'customers',params.account,{checkout:customer.checkout}],function(p){
							c(JSON.parse(p).result);
						});
					})
				},
				cart : function(r,p,c){
					
					var params = p[0];
					var account = p[1];
					var p = ['/api/v1/salesorders?organization_id='+r.org,'POST',params]
					r.get.request(r,p,(p)=>{
						if(p.code === 0){
							var salesorder = p.salesorder;
							r.set.salesorder.confirm(r,[salesorder.salesorder_id],function(p){
								if(p.code===0){
									r.mongo.set.collection.item.update(r.mongo,[r.data.mongo.db,'customers',account,{checkout:{}}],function(p){
										c(JSON.parse(p).result);
									});
								}else{
									c([salesorder,p]);
								}
							});
						}else{
							console.log(p)
						}
					});
					
				},
				
			},
			

		},
			
		salesorder : {
			
			confirm : function(r,p,c){
				var p = ['/api/v1/salesorders/'+p[0]+'/status/confirmed','POST']
				r.get.request(r,p,(p)=>{c(p);});
			},
								  
			email : function(r,p,c){
				var params = {
					"from_address_id":"2373149000000071003",
					"to_mail_ids":["cpeach@tnrd.ca"],
					"subject":"Sales Order from Thompson Nicola Regional District (Sales Order #: SO-00005)",
					"body":"<br>Dear Cory Peach,&nbsp;<br><br>Thanks for your interest in our services. Please find our sales order attached with this mail.<br><br> An overview of the sales order is available below for your reference: &nbsp;<br><br> ----------------------------------------------------------------------------------------<br> <h2>Sales Order&nbsp;# :&nbsp;SO-00005</h2><br> ----------------------------------------------------------------------------------------<br> <b>&nbsp;Order Date &nbsp; &nbsp;&nbsp;&nbsp;: &nbsp;2020/11/17</b><br><b>&nbsp;Amount &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; : &nbsp;&nbsp;$30.00</b><br>----------------------------------------------------------------------------------------<br><br><span>Assuring you of our best services at all times.</span><br><br><br>Regards,<br><br>tnrdit<br>Thompson Nicola Regional District<br><br><br>",
					"cc_mail_ids":[],
					"bcc_mail_ids":[],
					"send_from_org_email_id":true,
					"mail_documents":[]
				}
					
				var p = ['/api/v1/salesorders/'+p[0]+'/email?organization_id='+r.org+'&attach_pdf=false&send_attachment=false','POST',params]
				r.get.request(r,p,(p)=>{c(p);});
			}
			
		},
		
		items : {
			item : function(r,p,c){
				var params = p[0];
				var p = ['/api/v1/items?organization_id='+r.org,'POST',params]
				r.get.request(r,p,(p)=>{c(p);});
			}			
		}
		
	},
	get : {

	//	Request
		request : function(r,p,c){
			var req = {...r.data.request};
			req.o.path = p[0];
			req.o.method = p[1]?p[1]:'GET';
			p[2]?req.d=p[2]:null;
			r.zoho.request(r.zoho,req,c);
		},
		
	//	Path	
		path : function(r,p,c){
			var category = p[0];
			
			var p = ['/api/v1/categories?organization_id='+r.org]
			r.get.request(r,p,(p)=>{
				var categories = p.categories;
				var path = [];
				var stop = 6;
				while(category !== '-1' && stop !==0){
					
					for(cat in categories){
						if(categories[cat].category_id === category){
							path[path.length] = categories[cat];
							category = categories[cat]['parent_category_id'];
						}
					}
					stop--;
				}
				c(path);
				
			});
		},		
		
	//	Categories	
		categories : function(r,c){
			var p = ['/api/v1/categories?organization_id='+r.org]
			r.get.request(r,p,(p)=>{c(p.categories);});
		},	
		
	//	Items	
		items : {
			item : function(r,p,c){
				var p = ['/api/v1/items/'+p[0]+'?organization_id='+r.org];
				console.log(p);
				r.get.request(r,p,(p)=>{c(p);});
			},	
			all : function(r,c){
				var p = ['/api/v1/items?organization_id='+r.org]
				r.get.request(r,p,(p)=>{c(p.items);});
			},	
			search : function(r,p,c){
				var p = ['/api/v1/items?organization_id='+r.org+'&page=1&per_page=200&search_text='+p[0]]
				r.get.request(r,p,(p)=>{c(p.items);})
			},				
			by_category : function(r,p,c){
				var p = ['/api/v1/items?organization_id='+r.org+'&category_id='+p[0]]
				r.get.request(r,p,(p)=>{c(p.items);})
			},	
		},
	//	Customer
		customers : {
			customer : function(r,p,c){
				r.mongo.get.collection.item(r.mongo,[r.data.mongo.db,'customers',p[0]],function(p){c(p);});
			}
		},
		
		customer : {
			checkout : {
				cart : function(r,p,c){

					var customer = p[0];

					r.get.customers.customer(r,[customer],function(p){
						var items = p.checkout;
						var ids  = [];
						for(item in items){ids[ids.length] = item;}
						r.get.customer.checkout.items(r,[ids],function(p){
							c(p);
						});

					});
				},
				
				items : function(r,p,c){
					var items = p[0];
					var limit = items.length;
					var position = p[1] ? p[1] : 0;
					if(position < limit){
						var item = items[position];
						r.get.request(r,['/api/v1/items/'+item+'?organization_id='+r.org],(p)=>{
							items[position] = p.item;
							r.get.customer.checkout.items(r,[items,(position+1)],c);
						});	
					}else{c(items);}}
			}

		},
		
		salesorder : {
			
			email : function(r,p,c){
				
				var p = ['/api/v1/salesorders/'+p[0]+'/email?organization_id='+r.org]
				r.get.request(r,p,(p)=>{
					c(p.data);
				});
				
			}
			
		},
		
	
		
	//	Image	
		image : {
			item : function(r,p,c){
				var p = ['/api/v1/items/'+p[0]+'/image?organization_id='+r.org];
				r.get.request(r,p,(p)=>{c(p);});
			},	
		},
		
	/*	
		redirect : function(r,p){r.zoho.redirect(r.zoho,p);},
		auth : function(r,p){r.zoho.auth(r.zoho,p);},
	*/	
		
	},
	
	let : {}
	
}