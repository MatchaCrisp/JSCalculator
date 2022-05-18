// external
// react
import React from 'react';
// internal
// components
import Display from './Display';
import CalcPad from './CalcPad';

//contains a display and calculator buttons
const Calc = props => {
    //desktop, right side of history
    const bigSty={
      position:'relative',
      marginLeft:'100px'
    }
    //mobile, center of page below history
    const mobSty={
      position:'absolute',
      top:`${Math.max((props.h-540)/2+40,40)}px`
    }
  
    return (
      <div id="calc"
            style={props.w>900?{...bigSty}:{...mobSty}}>
        <Display op1={props.op1}
          oper={props.oper}
          op2={props.op2}
          res={props.res}
          hist={props.hist} />
        <CalcPad handleEvent={props.handleEvent} />
      </div>
    )
  }
  export default Calc;

  