'use strict'

// Pook Framework > copyright Adam Kircher > adam.kircher@gmail.com
// ----------------------------------------------------------------
//Todo borrow the idea of different, decoupled transports from winston https://github.com/flatiron/winston

module.exports = log

var logFn  = console.log
 // , mapFn = wrap
  , heads = ''
  , tails  = ''

function log()
{
	var args = [].slice.call(arguments)

	for (var i in args)
	{
		if (args[i] instanceof Error)
		{
			args[i] = args[i].stack+'\n'
		}
	}

	args[0] = heads + args[0]
	args[args.length-1] += tails

	logFn.apply(this, args)

	heads = tails = ''

	logFn = console.log
}

log.handler = function()
{	//http://docs.angularjs.org/api/ng/service/$exceptionHandler
	return function(exception, cause)
	{
		log.red(Error(exception))
	}
}

when('cyan'   , style('\x1B[36m','\x1B[39m'))

when('inverse', style('\x1B[7m' ,'\x1B[39m'))

when('yellow' , style('\x1B[33m','\x1B[39m'))

when('red'    , style('\x1B[31m','\x1B[39m'))

when('gray'   , style('\x1B[90m','\x1B[39m'))

when('green'  , style('\x1B[32m','\x1B[39m'))

when('bold'   , style('\x1B[1m' ,'\x1B[22m'))

when('temp'   , function()
{
	logFn = function()
	{
		process.stdout.write(require('util').format.apply(this, arguments))
	}

	return log
})

function when(prop, fn)
{
	Object.defineProperty(log, prop, {get: fn})
}

function style(head, tail)
{
	return function()
	{
		heads  = head + heads
		tails += tail

		return log
	}
}