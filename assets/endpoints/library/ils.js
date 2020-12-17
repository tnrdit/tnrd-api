//ILS

const sierra = require('/var/server/assets/connections/library/sierra/index.js');
const alexandria = require('/var/server/assets/connections/library/alexandria/index.js');
const programs = require('/var/server/assets/connections/library/alexandria/programs.js');
const patrons = require('/var/server/assets/connections/library/alexandria/patrons.js');

module.exports = {
	
	data : {
		application : process.env.library_ils_application,
		role : process.env.library_ils_role,
		path : process.env.library_ils_path,
	},
	
	init : function(r,p){
		r.sierra     = sierra;
		r.alexandria = alexandria;
		r.programs   = programs;
		r.patrons    = patrons;
		r.sierra.init(r.sierra);
		r.alexandria.init(r.alexandria);
		r.api = p;
		r.jwt = p.jwt;
	},

	
//	REGISTER	
	register : function(r,p,c){
		
		var identity = p.payload;
		var user = {name:params.name,role :params.role,reference:r.data.role}
		r.jwt.register(r.jwt,user,function(p){c({payload:p,code:1})})					

	},	
	
//	LOGIN
	login : function(r,p,c){
		
		r.jwt.login(r.jwt,p.reference,c);
		
	},
	
	
	
/*	SET*/	
	set : {
		
	/*	Test*/
		test : {
			
			connection : function(r,p,c){
        		r.alexandria.query(r.alexandria,['SELECT NOW()'],function(p){return c(p[0]);})
			}
      
		},
    
    patron : {
      info : function(r,p,c){
        var pid = p[0].pid;
        var address = p[0].address;
        
        var body = {
          Address : {
            lines : address.lines,
            type : address.type
          }
        };
        
        var o = {method:'PUT',path:r.data.path+'/patrons/'+pid,body : body};
        
        c(body);
        /*r.sierra.request(r.sierra,[o],function(p){
         return c(p[0]);
        });*/
        
      }
    }
		
	
	},
	
/*	GET*/		
	get : {
    
    patron :{
      validate : function(r,p,c){
        var b = p[0].barcode;
        var p = p[0].pin;
        var o = {method:'POST',path:r.data.path+'/patrons/validate',body : {barcode : b, pin : p}};
				r.sierra.request(r.sierra,[o],function(p){
          //catching if there was a login error
          //this step is crucial
          if(p[0] != ''){ return c(p[0]); }
          r.get.patron.info(r,[{barcode:b}],function(p){
            return c({barcode:b,patron:p});
          });
          
        });
      },
      list : function(r,p,c){
        var l = p[0].limit;
        var off = p[0].offset;
        var o = {method:'GET',path:r.data.path+'/patrons/?limit='+l+'&offset='+off+'&fields=default,fixedFields,varFields'};
				r.sierra.request(r.sierra,[o],function(p){
          return c(p[0]);
        });
      },
      info : function(r,p,c){
        var b = p[0].barcode;
        r.patrons.get.id(r,[b],function(p){
          var o = {method:'GET',path:r.data.path+'/patrons/'+p[0][0].pid+'?&fields=default,fixedFields,varFields'};
				  r.sierra.request(r.sierra,[o],function(p){return c(p[0]);});
        });
      }
    },
		
	/*	SEARCH*/
		search : {
			
		/*	TITLE*/		
			text : function(r,p,c){
				var o = {method:'GET',path:r.data.path+'/bibs/search?text='+p[0]+'&fields=default,fixedFields,varFields&limit=20'};
				r.sierra.request(r.sierra,[o],function(p){return c(p[0]);});
			}
		},
    
    item : function(r,p,c){
      var o = {method:'GET',path:r.data.path+'/items/'+p[0]+'?fields=default,fixedFields,varFields'};
				r.sierra.request(r.sierra,[o],function(p){return c(p[0]);});
    },
    bib : function(r,p,c){
      var o = {method:'GET',path:r.data.path+'/bibs/'+p[0]+'?fields=default,fixedFields,varFields'};
				r.sierra.request(r.sierra,[o],function(p){return c(p[0]);});
    },
    programs : {
      time : function(r,p,c){
        r.programs.get.time(r,[p[0]],function(p){return c(p[0]);});
      },
      program : function(r,p,c){
        r.programs.get.program(r,[p[0]],function(p){return c(p[0]);});
      },
      sessions : function(r,p,c){
        r.programs.get.sessions(r,[p[0]],function(p){return c(p[0]);});
      },
      sections : function(r,p,c){
        r.programs.get.sections(r,[p[0]],function(p){return c(p[0]);});
      },
      month : function(r,p,c){
        r.programs.get.month(r,[p[0]],function(p){return c(p[0]);});
      },
      upcoming : function(r,p,c){
        r.programs.get.upcoming(r,[p[0]],function(p){return c(p[0]);});
      }
    }
    
    
	},
	
/*	LET*/	
	let : {}
	
}