
//Zoho
//const { http, https } = require('follow-redirects');

var http = require('http');
var https = require('https');

module.exports = {

//	INIT	
	init : function(r){
		
		r.https = https;
		r.http  = http;
			
		r.host          = process.env.zoho_host;
		r.client_id     = process.env.zoho_client_id;
		r.client_secret = process.env.zoho_client_secret;
		r.refresh_token = process.env.zoho_refresh_token;
		r.redirect		= process.env.zoho_redirect;
		r.token = '';
	},
	

//	REDIRECT
	redirect : function(r,p){
		p[0].redirect('https://'+r.host+'/oauth/v2/auth?scope=ZohoInventory.FullAccess.all&client_id='+r.client_id+'&prompt=consent&response_type=code&access_type=offline&redirect_uri='+r.redirect);
	},
	
//	AUTH	
	auth : function(r,p){
		
		console.log(p[1])
		var params = 
			'code='+p[1]+
			'&client_id='+r.client_id+
			'&client_secret='+r.client_secret+
			'&redirect_uri='+r.redirect+
			'&scope=ZohoInventory.FullAccess.all'+
			'&grant_type=authorization_code';
		
		var o = {
			host: r.host, 
			path:'/oauth/v2/token?',
			method: 'POST',
			headers: {
				'Content-Type'  : 'application/x-www-form-urlencoded;charset=UTF-8',
				'Connection'    : 'keep-alive',
				'Cache-Control' : 'no-cache'
			}
		};
		var cb = function(response){
			console.log(response.headers)
			var data = '';
			response.on('data',function(d){data+=d});
			response.on('end',function(){
				data = JSON.parse(data);
				console.log(data);
				p[0].json(data);
			});
		}
		var request = r.https.request(o,cb);
		request.write(params);
		request.end();
		
	},	
	
//	REFRESH	
	refresh : function(r,c){
		
		var params = 
			'refresh_token='+r.refresh_token+
			'&client_id='+r.client_id+
			'&client_secret='+r.client_secret+
			'&redirect_uri='+r.redirect+
			'&grant_type=refresh_token';
		
		var o = {
			host: r.host, 
			path:'/oauth/v2/token?',
			method: 'POST',
			headers: {
				'Content-Type'  : 'application/x-www-form-urlencoded;charset=UTF-8',
				'Connection'    : 'keep-alive',
				'Cache-Control' : 'no-cache'
			}
		};
		var cb = function(response){
			var data = '';
			response.on('data',function(d){data+=d});
			response.on('end',function(){
				r.token = JSON.parse(data)['access_token'];
				c();
			});
		}
		var request = r.https.request(o,cb);
		request.write(params);
		request.end();
		
	},		

//	REQUEST	
	request : function(r,p,c){
		
		var options = p.o;
		var d    = p.d;
		options.headers['Authorization'] = 'Bearer '+r.token
		var cb = function(response){
			var data = '';
			response.on('data',function(d){data+=d});
			response.on('end',function(){
				data = JSON.parse(data);
				data['code'] === 57||data['code'] === 14 ? r.refresh(r,function(){r.request(r,p,c);}) : c(data);
			});
		}
		var request = r.https.request(options,cb);
		if(d){
			//var str = JSON.stringify("JSONString:"+d);
			console.log(JSON.stringify(d));
			request.write(JSON.stringify(d));
		}
		request.end();
	
	}		
}