
//COGNITO
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS      = require('aws-sdk');
const request  = require('request');
const jwkToPem = require('jwk-to-pem');
global.fetch   = require('node-fetch');

module.exports = {

//	INIT	
	init : function(r,p){
		r.pool        = {UserPoolId:p[0].id,ClientId:p[0].client}; 
		r.pool_region = p[0].region;
		r.userPool    = new AmazonCognitoIdentity.CognitoUserPool(r.pool);
	},
	

//	REGISTER
	register : function(r,p,c){
		r.userPool.signUp(p.user, p.pass,p.attributes, null, function(e,p){console.log(p);e?c({payload:e.message,code:0}):c({payload:p,code:1});});
	},
	
//	LOGIN	
	login : function(r,p,c){
		
		var _user = p[0] ? p[0] : "";
		var _pass = p[1] ? p[1] : "";
		var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
			Username : _user,
			Password : _pass,
		});

		var userData = {
			Username : _user,
			Pool     : r.userPool
		}; 

		var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
		//cognitoUser.setAuthenticationFlowType('USER_PASSWORD_AUTH');
		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: function (p) {console.log(p);c({payload:p,code:1});},
			onFailure: function(e) {c({payload:e.message,code:0});},
		});
	},	
	
}