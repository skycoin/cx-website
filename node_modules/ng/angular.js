'use strict'

// Pook Framework > copyright Adam Kircher > adam.kircher@gmail.com
// ----------------------------------------------------------------

module.exports = function(modules, callback)
{
	var window  = require('./window')
	  , log     = require('./logger')
	  , cache   = {}
	  , loaded  = 0

	if ( ! modules || ! modules.ng)
	{
		return log.red(Error('At minimum, provide a modules object with an ng property, e.g., {ng:"url/orFilePath/to/angular.js}'))
	}

	//Freezes name in the for loop
	function load(name)
	{
		return function(err, js)
		{
			if (err == 404)
			{
				return log.red(Error(modules[name]))
			}

			if (err && 'object' == typeof err)
			{
				return log.red(Error(err))
			}

			cache[name].str = js

			//Since loaded asyncronously we need to keep count to know when we are done
			if (++loaded == Object.keys(modules).length)
			{
				process.stdout.clearLine && process.stdout.clearLine()

				for (var i in modules)
				{  //Load the preloaded modules into node using our "fake" window, navigator, & document objects
					require('vm').runInNewContext(cache[i].str, window, modules[i])
				}

				//We will need these later in extend.js
				window.angular.module._cache = cache

				//Provide ng with a reference to angular
				callback(window.angular)
			}
		}
	}

	//Goto through each of the module dependencies the user specifies
	for (var i in modules)
	{
		//Check if dependency is a url or a file path
		var isUrl = modules[i].indexOf('//')

		if (isUrl == -1)
		{
			//Read the file path into a utf8 string
			require('fs').readFile(modules[i], 'utf8', load(i))

			cache[i] = {preload:true}
		}
		else
		{
			//Assume http for protocol-less urls otherwise node errors
			var path = (isUrl ? '' : 'http:')+modules[i]

			require('./http').backend(log)('get', path, null, load(i))

			cache[i] = {preload:modules[i]}
		}
	}
}