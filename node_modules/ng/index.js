'use strict'

// Pook Framework > copyright Adam Kircher > adam.kircher@gmail.com
// ----------------------------------------------------------------


module.exports = function(modules, user)
{
	require('./angular')(modules, function(angular)
	{
		var injector  = angular.injector()
		  , annotate  = injector.annotate
		  , log       = require('./logger')
		  , module    = require('./package')
		  , extend    = require('./extend')
		  , remote    = require('./remote')
		  , http      = require('./http')
		  , intercept = require('./intercept')
		  , transform = require('./transform')(annotate)

		//Made-up constaint that will help ensure interopability between ng.seed packages
		if ('ng' != annotate(user)[0])
		{
			return log.red(Error("Callback's argument must be named 'ng'"))
		}

		// Extend Angular's global api with helper methods
		// --------------------------------------------------
		function ng(req, res)
		{
			return intercept(req, res)		    		             //Base object is a listener for nice api
		}

		angular.copy(angular, ng) 									    //Copy all of angular to the new base object

		ng.module = extend(ng.module)		 							//Creates client & server apps simultaneously

		ng.toString = function()									    //Concat all scripts into one automatically
		{
			var result = []

			for (var i in angular.module._cache)
			{
				if ( i != '$rpc')
				{
					result.push(ng.module(i))
				}
			}

			return result.join('\n')
		}

		// Server's tranforms, stack & client's remote procedure calls
		// --------------------------------------------------

		ng.module('$rpc', [])								 		  //Dependency for all user modules

		.transform.client(transform.rpc) 						  //Client side rpc for server factory fn

		.transform.client(transform.interceptor)			  	  //Allow interceptor-type middleware stack

		.transform.client(transform.template)				     //Allow templates to be defined in ngRoute

		.transform.client(transform.assertClient)			     //Client cannot use require, __dirname, or __filename

		.transform.server(transform.assertServer)			     //Server cannot inject $window, $browser, or $location

		.config.client(remote.$sce)                          //Get rid of unnecessary quotes

		.config.server(http.config)                          //Get rid of unnecessary quotes

		.factory.server('$httpBackend', http.backend)		  //Replaces XHR with node's http.request

		.factory.server('$exceptionHandler', log.handler)    //Log entire error.stack to server

		.factory.server('$rpc', remote.server)			 		  //Remote procedure call response

		.factory.client('$rpc', remote.client) 		 		  //Remote procedure call request

		// Register user and then ng modules with angular
		// --------------------------------------------------
		user(ng)													 		  //Load user generated modules

		var requires = Object.keys(angular.module._cache)	  //Array of all required modules
		  , length   = Object.keys(modules).length + 1

		if ( ! requires[length])
		{
			return log.red(Error('No user modules were registered! Registration cannot by asyncronous'))
		}

		log.gray.bold.temp('\nng started')

		intercept = intercept(ng.bootstrap(null, requires)) //Start angular and get actual injector
	})
}
