'use strict'

// Pook Framework > copyright Adam Kircher > adam.kircher@gmail.com
// ----------------------------------------------------------------
//A little hacky but I don't need something as complex as jsdom, just to make angular happy

module.exports =
{
	console:console,
	setTimeout:setTimeout,
	clearTimeout:clearTimeout,
	attachEvent:fn,
	location:{ href:'/', protocol:'http:'},
	document:
	{
		cookie:'',
		attachEvent:fn,
		//Pathname is required here because angular uses createElement('a') as a url parser
		createElement:function() { return {pathname:'/', setAttribute: fn}},
		getElementsByTagName:fn

	},
	navigator:{},
}

module.exports.window = module.exports

	//Simplistic filler for our "fake" window
function fn(one)
{	//console.log(arguments)
	//console.log((new Error).stack)
	return true
}