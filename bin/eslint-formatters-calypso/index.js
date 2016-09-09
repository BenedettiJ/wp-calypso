#!/usr/bin/env node

const cli = require( './src/cli' );
const optionator = require( 'optionator' )( {
	options: [ {
		option: 'processor',
		alias: 'p',
		type: 'String',
		description: 'choose a processor ("lines-modified-and-specific-rules" by default)'
	}, {
		option: 'format',
		alias: 'f',
		type: 'String',
		description: 'choose an ESLint format ("stylish" by default)'
	}, {
		option: 'diff',
		alias: 'd',
		type: 'String',
		description: 'choose what to diff ("remote" by default)'
	} ]
} );

/* eslint no-process-exit: "off" */

if ( ! process.stdin.isTTY ) {
	process.stdin.setEncoding( 'utf-8' );
	process.stdin.on( 'data', function( data ) {
		const opts = optionator.parseArgv( process.argv );
		process.exit( cli( JSON.parse( data ), opts ) );
	} );
}
