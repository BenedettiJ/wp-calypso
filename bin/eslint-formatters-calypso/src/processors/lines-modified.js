const eslines = require( '../lib/eslines' );
const differ = require( '../lib/differ' );
const gitDiffCalculator = require( '../lib/git-diff-calculator' );

module.exports = function( report ) {
	const lines = differ( gitDiffCalculator() );
	return JSON.stringify( eslines( report, lines ) );
};
