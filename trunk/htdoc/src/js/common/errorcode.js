var Lang = require('./language');

 var errorCode = {

		 '0': Lang.LSuccess,
	    '-1': Lang.LParameterError,
		'-2': Lang.LNoJurisdiction,
		'-3': Lang.LUnknownError,
		'-4': Lang.LSystemError,
	    '-5': Lang.LLoginTimeout,
		'-6': Lang.LNotFindRepository,
}
module.exports = errorCode;

