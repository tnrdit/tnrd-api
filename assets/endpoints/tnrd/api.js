
//TNRD API

const mongoose = require('mongoose');
const cognito  = require('../../utilities/cognito.js');
const jwt      = require('../../utilities/jwt.js');

// MODELS
const application_model = require('../../models/tnrd/api-application.js');
const role_model        = require('../../models/tnrd/api-role.js');
const user_model        = require('../../models/tnrd/api-user.js');

module.exports = {
	
	data : {
		application : process.env.tnrd_api_application,
		role : process.env.tnrd_api_role,
		mongo:{
			db:process.env.tnrd_api_mongo_db,
			options : {useNewUrlParser: true,useUnifiedTopology: true}
		},
		cognito : {
			id:process.env.tnrd_api_cognito_id,
			client:process.env.tnrd_api_cognito_client,
			region:process.env.tnrd_api_cognito_region,
		}
	}, 
	
	init : function(r){

		r.db = mongoose.createConnection('mongodb://localhost/'+r.data.mongo.db, r.data.mongo.options);
		
		r.models = {};
		r.models.application = application_model.get(r.db);
		r.models.role        = role_model.get(r.db);	
		r.models.user        = user_model.get(r.db);	
		
		r.cognito = cognito;
		r.cognito.init(r.cognito,[r.data.cognito])
		
		r.jwt = jwt;
		r.jwt.api = r;
		return r;
	},

	register : function(r,p,c){
		var params = p;
		 params.attributes = [];
		 //params.attributes.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"name",Value:params.name}));
		 r.cognito.register(r.cognito,params,function(p){
			if(p.code === 1){
				var identity = p.payload;
				var user = {
					name : params.name,
					role:r.data.role,
					reference:identity.userSub
				}
				r.jwt.register(r.jwt,user,function(p){c({payload:p,code:1})})					
			}else{
				c(p)
			}
		
		});
	},
	
	login : function(r,p,c){
		r.cognito.login(r.cognito,[p.user,p.pass],function(p){
			p.code === 1 ? r.jwt.login(r.jwt,p.payload.getIdToken().payload.sub,c):c(p);
		})
	},
	

	applications : {
		
		get : {
			items : async function(r,p,c){
				var result = await r.models.application.find(JSON.parse(p[0]));
				c(result);
			},
			item : async function(r,p,c){
				var result = await r.models.application.findOne({"_id":p});
				c(result);
			},
		},
		
		insert : {
			item : async function(r,p,c){
				var result = await r.models.application.create(p[0]);
				c(result);
			}, 
		},
		update : {
			item : async function(r,p,c){
				var result = await r.models.application.updateOne({"_id":p[0]},typeof p[1]==='string'?JSON.parse(p[1]):p[1]);
				c(result);
			}, 			
		}
	},
	
	roles : {
		get : {
			items : async function(r,p,c){
				var result = await r.models.role.find(typeof p[0]==='string'?JSON.parse(p[0]):p[0]);
				c(result);
			},
			item : async function(r,p,c){
				var result = await r.models.role.findOne({"_id":p});
				c(result);
			},
		},
		insert : {
			item : async function(r,p,c){
				var result = await r.models.role.create(p[0]);
				c(result);
			}, 
		},
		update : {
			item : async function(r,p,c){
				var result = await r.models.role.updateOne({"_id":p[0]},typeof p[1]==='string'?JSON.parse(p[1]):p[1]);
				c(result);
			}, 
		},
	},
	
	users : {
		
		get : {
			items : async function(r,p,c){
				var result = await r.models.user.find(typeof p[0]==='string'?JSON.parse(p[0]):p[0]);
				c(result);
			},
			item : async function(r,p,c){
				var result = await r.models.user.findOne({"_id":p});
				c(result);
			},
		},
		insert : {
			item : async function(r,p,c){
				var result = await r.models.user.create(p[0]);
				c(result);
			}, 
		},
		
	}
	
	
}