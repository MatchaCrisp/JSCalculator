// external
// react
import React from 'react';

//display
//contains a 'fixed string' with small font on top left
//contains a 'variable string' open to change on bottom right
//variable string font size doubles under 15 chars in length
const Display = props => {
    let dispStr = '';
    let disp = '';
    if (props.res === '') {
      dispStr = props.op1 + ' ' + props.oper;
      disp = props.op2;
    }
    else {
      dispStr = props.op1 + ' ' + props.oper + ' ' + props.op2 + '=';
      disp = props.res;
    }
  
    return (
      <div id="scr">
        <div id='operation'>
          <p>{dispStr}</p>
        </div>
        <div id="display" 
             style={{fontSize:disp.length>=15?'1rem':'2rem'}}>
          <p>{disp}</p>
        </div>
      </div>
  
    )
  }

  export default Display;
  