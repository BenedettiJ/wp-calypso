/* eslint strict: "off" */

'use strict';

const path = require( 'path' );

/*
* This function should *not* call process.exit() directly,
* It should only return exit codes. This allows other programs
* to use the function and still control when the program exits.
*
*/

module.exports = function( report, options ) {
	const getFormatter = format => {
		// See https://github.com/eslint/eslint/blob/master/lib/cli-engine.js#L477

		let formatterPath;

		// default is stylish
		format = format || 'stylish';

		// only strings are valid formatters
		if ( typeof format === 'string' ) {
			// replace \ with / for Windows compatibility
			format = format.replace( /\\/g, '/' );

			// if there's a slash, then it's a file
			if ( format.indexOf( '/' ) > -1 ) {
				formatterPath = path.resolve( process.cwd(), format );
			} else {
				formatterPath = 'eslint/lib/formatters/' + format;
			}

			try {
				return require( formatterPath );
			} catch ( ex ) {
				const msg = 'Problem loading formatter: ' + formatterPath + '\nError: ';
				ex.message = msg + ex.message;
				throw ex;
			}
		} else {
			return null;
		}
	};

	const getProcessor = processor => {
		processor = processor || 'eslines';
		return require( './formatters/' + processor );
	};

	/*
	An eslines processor is a regular ESLint formatter, actually.
	ESLint does not allow for passing info to the formatters other than
	trough environment variables. For compatibility reasons,
	we choose to use this mechanism to pass info to the processors,
	as if they were running through ESLint such as:

		eslint --formatter=<eslines-processor>

	This will allow us to reuse processors as formatters in other contexts.
	*/
	const processor = getProcessor( options.processor );

	// set environment variables
	process.env.ESLINES_DIFF = options.diff || 'remote';

	const newReport = JSON.parse( processor( report ) );

	// unset environment variables
	delete process.env.ESLINES_DIFF;

	if ( Array.isArray( newReport ) && ( newReport.length > 0 ) ) {
		const formatter = getFormatter( options.format );
		process.stdout.write( formatter( newReport ) );

		return 1;
	}
	// it has nothing to show
	return 0;
};
