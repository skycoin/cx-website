'use strict'

// Pook Framework > copyright Adam Kircher > adam.kircher@gmail.com
// ----------------------------------------------------------------

//Config & Backend are only applied to the server side to help with node compatibility

exports.config = function($httpProvider)
{
	var transform = $httpProvider.defaults.transformRequest[0]

	$httpProvider.defaults.transformRequest[0] = function(d)
	{
		return d instanceof Buffer ? d : transform(d)
	}
}

exports.backend = function()
{
	//Don't wan't angular to inject anything, but want to be able to optionally display progress
	var log = arguments[0]

	return function(method, url, body, callback, headers, timeout, withCredentials, responseType)
	{
		var options  = require('url').parse(url)
		  , protocol = options.protocol.slice(0, -1)

		options.method  = method
		options.headers = headers || {}

		if ( ! options.headers['content-length'])
		{
			options.headers['content-length'] = body instanceof Buffer ? body.length : Buffer.byteLength(body || '')
		}

		var req = require(protocol).request(options, response)

		req.on('error', function(err)
		{
			callback(404, err, {})
		})

		req.end(body)

		function response(res)
		{
			var data = ""

			res.on('data', function requestData(chunk)
			{
				log && log.gray.temp('Loading:', Math.floor(data.length/1000)+'KB\r')

				data += chunk
			})

			res.on('end', function requestEnd()
			{
				callback(res.statusCode, data, res.headers)
			})
		}

		//Not actually sure if the below timeout code works!
		if (timeout > 0)
		{
			var timeoutId = browser.defer(timeoutRequest, timeout)
		}
		else if (timeout && timeout.then)
		{
			timeout.then(timeoutRequest)
		}

		function timeoutRequest()
		{
			status = -1

			req.abort()
		}
	}
}