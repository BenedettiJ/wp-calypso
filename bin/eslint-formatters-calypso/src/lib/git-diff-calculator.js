/* eslint strict: "off" */

'use strict';

const gitDiffBranchVSMaster = require( '../lib/git-diff' );
const gitDiffIndex = require( '../lib/git-diff-index' );

module.exports = function() {
	const whatToDiff = process.env.ESLINES_DIFF;

	let diff;
	if ( whatToDiff === 'index' ) {
		diff = gitDiffIndex();
	} else { // 'remote'
		diff = gitDiffBranchVSMaster();
	}

	return diff;
};
