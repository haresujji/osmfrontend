import React from 'react';

class Datehelper  {
	static displayDate() {
		const moment = require("moment");
		const currentDate = moment().format('YYYY-MM-DD');
		return currentDate
	}
}
export default Datehelper