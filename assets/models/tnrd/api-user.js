const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = {
	
	get : function(db){
		
		var schema = new Schema({
			role : {
				type: String,
				required: true
			},
			name : {
				type: String,
			},
			reference : {
				type: String,
			}
		});
		
		return db.model('user', schema);
		
	}
	
}
