/*
	API ENDPOINTS
*/

const dotenv   		 = require('dotenv').config();
const express  		 = require('express');
const cors     		 = require('cors');
const cookie_parser  = require('cookie-parser');
const app     		 = express();

//  parsers 
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

//  cors
	app.use(cors());

//  cookies
	app.use(cookie_parser());

//	root
	app.use('/', require('./assets/endpoints/root/router.js'));

//  console
	app.use('/tnrd', require('./assets/endpoints/tnrd/router.js'));

//	library
	app.use('/library', require('./assets/endpoints/library/router.js'));

//	gis
	app.use('/gis', require('./assets/endpoints/gis/router.js'));


/*
	RUN
*/
app.listen(process.env.port, () => {console.log('TNRD API listening on port 8443..')});
 