const express = require('express');
const router  = express.Router();

/*
	ENDPOINTS
*/

const api = require('../tnrd/api.js'); 
const ils = require('./ils.js'); 

/*
	INVOKE
*/
api.init(api);
ils.init(ils,api);

router.get('/', (req, res) => {res.send('AWS Library API..')});



/*	
	ILS (Integrated Library System)
*/

//	ROOT 
	router.get('/ils', (req, res) => {res.send('Library APIs');});

//	AUTH

	router.get('/ils/refresh',(req,res)=>{api.jwt.refresh(api,[req,res],(p)=>{res.json(p)});});
	router.post('/ils/register',(req,res)=>{ils.register(ils,req.body.params,(p)=>{res.json(p)});});
	router.post('/ils/login',(req,res)=>{ils.login(ils,req.body.params,(p)=>{res.json(p)});});

//	PATRON
	router.post('/ils/patron/validate',(req,res)=>{ils.get.patron.validate(ils,[req.body.params],(p)=>{res.json(p);});});
	router.post('/ils/patron/info',(req,res)=>{ils.get.patron.info(ils,[req.body.params],(p)=>{res.json(p);});});
	router.post('/ils/patron/list',(req,res)=>{ils.get.patron.list(ils,[req.body.params],(p)=>{res.json(p);});});

// 	SEARCH
	router.get('/ils/search/title/:title',(req,res)=>{ils.get.search.title(ils,[req.params.title],(p)=>{res.json(p);});});
	router.post('/ils/search/text',(req,res)=>{ils.get.search.text(ils,[req.body.params.text],(p)=>{res.json(p);});});

//  BIBS
    router.post('/ils/bibs/id',(req,res)=>{console.log(req.body);ils.get.bib(ils,[req.body.params.bib],(p)=>{res.json(p);});});

//	TEST 
	router.get('/ils/test/connection',(req,res)=>{ils.set.test.connection(ils,[],(p)=>{res.json(p);});});


/*	
	PROGRAMS
*/ 


	// 	TIME
  	router.post('/ils/programs/program/time',(req,res)=>{ils.get.programs.time(ils,[req.body.params],(p)=>{res.json(p);});});

	// 	PROGRAM
	router.post('/ils/programs/program/sections/sessions',(req,res)=>{ils.get.programs.sessions(ils,[req.body.params],(p)=>{res.json(p);});});
	router.post('/ils/programs/program/sections',(req,res)=>{ils.get.programs.sections(ils,[req.body.params],(p)=>{res.json(p);});});
	router.post('/ils/programs/program/',(req,res)=>{ils.get.programs.program(ils,[req.body.params],(p)=>{res.json(p);});});
  
	// 	MONTH
	router.post('/ils/programs/month/',(req,res)=>{ils.get.programs.month(ils,[req.body.params],(p)=>{res.json(p);});});

	// 	UPCOMING
	router.post('/ils/programs/upcoming/',(req,res)=>{ils.get.programs.upcoming(ils,[req.body.params],(p)=>{res.json(p);});});


module.exports = router;


