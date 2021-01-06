let passes = 0;
let failures = 0;

const reporter = {
	jasmineStarted: function(suiteInfo) {
		//     console.log('Running suite with ' + suiteInfo.totalSpecsDefined);
		console.log(
			"Starting Jasmine test suite, " +
				suiteInfo.totalSpecsDefined +
				" specs defined"
		);
	},

	suiteStarted: function(result) {
		//     console.log('Suite starting: ' + result.description);
		//       + ' whose full description is: ' + result.fullName);
	},

	specStarted: function(result) {
		//     console.log(' Spec starting: ' + result.description);
		//       + ' whose full description is: ' + result.fullName);
	},

	specDone: function(result) {
		if (result.status === "failed") {
			console.error("Failed spec: " + result.description);
			for (var i = 0; i < result.failedExpectations.length; i++) {
				console.error("Failure: " + result.failedExpectations[i].message);
				console.error(result.failedExpectations[i].stack);
			}
			failures++;
		} else {
			passes++;
		}
	},

	suiteDone: function(result) {
		if (result.status === "failed") {
			console.error("Failed suite: " + result.description);
			for (var i = 0; i < result.failedExpectations.length; i++) {
				console.error("Suite " + result.failedExpectations[i].message);
				console.error(result.failedExpectations[i].stack);
			}
		} else {
			// 		console.log('Suite: ' + result.description + ' was ' + result.status);
		}
	},

	jasmineDone: function(result) {
		console.log(`Total passes/failures: ${passes}/${failures}`);
		console.log("Finished suite: " + result.overallStatus);
	},
};

jasmine.getEnv().addReporter(reporter);
