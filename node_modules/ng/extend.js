'use strict'

module.exports = function(ngModule)											//Make server & client almost indistinguishable
{
	var transform = require('./transform')
	  , intercept = require('./intercept')
	  , cache     = ngModule._cache
	  , excludeRpc
	  
	return function(name, requires, configFn)								//Replace with same params as angular.module
	{
		if (cache[name] && cache[name].src)									//Return cached module object if available
		{
			if (requires)
			{
				return console.warn('Cannot create module', name, 'it already exists')
			}

			return cache[name].src
		}

		function toString()
		{
			//Each new stringified application needs a new $rpc
			if ('ng' == name)
			{
				excludeRpc = 0
			}

			//Preload prop was set in angular.js
			if (cache[name].preload)
			{
				//Regular pre-loaded modules ensuring scripts don't contain non-escaped closing tags
				if (true === cache[name].preload)
				{
					return '<script>'+
								 cache[name].str.replace(/<\/script>/g, '<\\/script>')+
							 '</script>'
				}
				//If this was loaded from a cdn then serve it from the cdn
				return "<script src='"+cache[name].preload+"'></script>"
			}

			//ng modules: use closure to replace global angular w/ user callback's fn name
			return [
				excludeRpc++ ? '' : cache.$rpc.src,
				'<script>',
					'(function(ng, angular, undefined)',
					'{',
						"   ng.module('"+name+"', "+JSON.stringify(requires)+")",
						cache[name].str.replace(/\n/g, '\n   '),
					'})(angular)',
				'</script>'
			].join('\n')
		}

		cache[name] = cache[name] || {str:''}

		requires && requires.push('$rpc')

		var module = ngModule(name, requires)								//Create a new module object and module string

		module.toString = toString

		function clientDefault(type)
		{
			return function(one, two)
			{
				if (two)
				{
					cache[name].str += "\n."+type+"('"+one+"', "+two+")\n"
				}
				else
				{
					cache[name].str += "\n."+type+"("+one+")\n"
				}
			}
		}

		function extend(type, server, client)
		{
			module[type] = function(one, two)
			{
				module[type].client(one, two)

				if (server)
				{
					module[type].server(one, two)
				}

				return module
			}

			module[type].server = function(one, two)
			{
				if (server)
				{
					if (two)
					{
						two = transform.server.call(module, two, type, one)

						if (two) two.$name = one //fn can get its own name if name was dynamically set

						two && server(one, two)
					}
					else
					{
						one = transform.server.call(module, one, type)

						one && server(one)
					}

					return module
				}

				var msg = type+' cannot be set on the server\n\t'

				log.red(Error(two ? one+' '+msg+two : msg+one))
			}

			module[type].client = function(one, two)
			{
				client = client || clientDefault(type)

				if (two)
				{
					if ('string' != typeof two)
					{
						two = transform.client.call(module, two, type, one)
					}

					two && client(one, two)
				}
				else
				{
					if ('string' != typeof one)
					{
						one = transform.client.call(module, one, type)
					}

					one && client(one)
				}

				return module
			}
		}

		extend('animation')

		extend('config', module.config)

		extend('constant', module.constant)

		extend('controller')

		extend('directive')

		extend('factory', module.factory)

		extend('filter', module.filter)

		extend('provider', module.provider)

		extend('run', module.run)

		extend('service', module.service)

		extend('value', module.value)

		extend('interceptor', intercept.server, clientDefault('config'))

		extend('transform', transform.server, transform.client)    //Enable powerful client & server transforms

		if (configFn)										   //configFn is just a shortcut to .config
		{
			module.config(configFn)
		}

		return cache[name].src = module							//Return and cache the module
	}
}