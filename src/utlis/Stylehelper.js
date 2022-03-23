import React from 'react';

class Stylehelper  {
  static displayViewProps() {
		const defaultProps = {
			borderColor: 'lightgrey !important',
			border: 1,
			borderRadius: 4,
			style: { width: '10rem', height: '2rem' },
		};
		return defaultProps
	}

  static tableStyle(){
   	const tableStyle = {
	    border: "1px solid black",
	    textAlign:"center",
    };
    return tableStyle
  }

  static tableHeaderStyle(){
		const tableHeaderStyle = {
	    color:"white",
	    fontSize:"14px",
	    height:"20px"
		};
	    return tableHeaderStyle
   }
}
export default Stylehelper