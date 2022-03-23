import React from 'react';

class Actionhelper  {
   static exitBtn() {
		const exitHandler = (event) => {
			window.location.href = 'dashboard'
		}
		return exitHandler
	}

	static clearBtn(component) {
		const clearHandler = (event) => {		
			window.location.href = component
		}
		return clearHandler
	}
}
export default Actionhelper