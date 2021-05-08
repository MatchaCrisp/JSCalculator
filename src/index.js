import React, { useEffect,useState } from 'react';
import ReactDOM from 'react-dom';
import {create, all} from 'mathjs';
import './index.scss';

const config={
  precision:31
};
const math=create(all,config);
//use font awesome if possible
const Pad=props=>{
  let dispTxt;
  if (props.desc==="pow")
    dispTxt=<p>x<sup>2</sup></p>;
  else if (props.desc==="sqrt")
    dispTxt=<p>&radic;</p>;
  else if (props.desc==="sign")
    dispTxt=<p>+/-</p>;
  else if (props.desc==="bksp")
    dispTxt=<i className="fas fa-backspace"></i>
  else
    dispTxt=<p>{props.desc}</p>;

  useEffect(()=>{
    if (props.keyCode==="") return;
    document.addEventListener('keydown',handleKey);
    return ()=>{document.removeEventListener('keydown',handleKey)};
  });
  const handleKey=e=>{
    if (e.keyCode===parseInt(props.keyCode)) {
      e.preventDefault();
      props.handleEvent(props.desc);
    }
      
  }
  const handleClick=()=>{
    props.handleEvent(props.desc);
  }
  return (
    <div className={props.className}
            id={props.id}
            onClick={handleClick}>
              {dispTxt}
            </div>
  )
}

const App=()=>{
  
  return (
    <div id="app">
      <Calc />
    </div>
  )
}

const Calc=()=>{
  const [op1,setOp1]=useState([]);
  const [oper,setOper]=useState('');
  const [op2,setOp2]=useState(["0"]);
  const [dec,setDec]=useState(false);
  const [res,setRes]=useState('');
  const [ey,setEy]=useState(false);
  
  //only works with both operands and the operator all present
  const calcing=()=>{
    return new Promise((resolve,reject)=>{
      const opL=math.bignumber(op1.join(''));
      const opR=math.bignumber(op2.join(''));
      let ans='';
        if (oper==='+') {
          ans= (math.add(opL,opR).toString());
        }
        else if (oper==='-') {
          ans= (math.subtract(opL,opR).toString());
        }
        else if (oper==='*') {
          ans= (math.multiply(opL,opR).toString());
        }
        else if (oper==='/') {
          //custom msg of dividing by zero
          if (op2.join('')==='0')
            ans= ('undefined');
          else
            ans= (math.divide(opL,opR).toString());
        }
        else 
          reject(new Error ('invalid operator'));

        resolve(ans);
    });
  }
  const resetto=()=>{
    return new Promise((resolve,reject)=>{
      setOp1([]);
      setOper('');
      setOp2(["0"]);
      setRes('');
      setDec(false);
      setEy(false);
      resolve('reset');
    });
  }

  const goNext=async(op)=>{
    const numm=res;
    const msg=await resetto();
    if (msg==='reset') {
      setOp1(numm.split(''));
      setOper(op);
    }
    else 
      throw new Error ('reset not successful');

  }
  //distribute 
  const handleEvent=e=>{

    console.log(e);
    if (e.length===1) {
      if (/[\d.]/.test(e)) {
        handleNum(e);
      }
      else if (e==='=') {
        handleEnt();
      }
      else if (e==='e') {
        handleEy();
      }
      else {
        handleArith(e);
      }
    }
    else if (e.length===2){
      handleClear(e);
    }
    else if (e==='bksp') {
      handleDel();
    }
    else if (e==='sign') {
      handleSign();
    }
    else 
      handleOther(e);
  }

  //0-9&decimal point
  // ****** stopping refactor point
  const handleNum=num=>{
    const theNum=num=>{
      //max of 30 digits as input
const len=op2.length-(dec?1:0);
//input in the case of no finished calculation
if (len<30 && res==='') {
  //dealing with leading zero
  if (num==='0') {
    //case of no number & case of decimal point present
    if (op2.length===0 || dec)
      setOp2(op2.concat(num));
    //case of no already leading zero
    else if (op2[0]!=='0')
      setOp2(op2.concat(num));
  }
  //dealing with no dupe decimal
  else if (num==='.') {
    //case of no number
    if (op2.length===0){
      setOp2(op2.concat(['0',num]));
      setDec(true);
    }
    //case of no decimal and no scientific notation
    else if (!dec && !ey) {
      setOp2(op2.concat(num));
      setDec(true);
    }
  }
  //dealing with 1-9
  else {
    //case of only zero, no decimals
    if (op2.length>0 && !dec && op2[0]==='0')
      setOp2([num]);
    //all other cases
    else 
      setOp2(op2.concat(num));
  }
}
}
    //case of complete calculation
    if (res!=='') {
      resetto().then(theNum(num)).catch(console.log);
    }
    else
      theNum(num);



      
  }

  //+ - * /
  const handleArith=op=>{
    //case of complete calculation
    if (res!=='') {

      goNext(op).catch(console.log);
    }
    //no operators
    else if (oper==='') {
      //case of existing operand
      if (op2.length>0) {
        //either no scientific notation, or a complete sci not (number must exist after e+)
        if (!ey || op2[op2.length-1]!=='+') {

          const moveOp2=async()=>{
            const toMove=op2;
            const msg=await resetto();
            if (msg==='reset') {
              setOp1(toMove.slice(0,toMove.length));
              setOper(op);
            }
            else 
            throw new Error ('reset not successful');
          }
          moveOp2().catch(console.log);
        }

      }
    }
    //operator already exists
    else {
      //case of no second operand
      if (op2.length===0) {
        setOper(op);
      }
      //case of two operands
      else {
        //either no scientific notation, or a complete sci not (number must exist after e+) and its not just a - sign
        if ((!ey || op2[op2.length-1]!=='+')&&op2[op2.length-1]!=='-') {
          const skipRes=async()=>{
            const res=await calcing();
            setRes(res);
            goNext(op);
          }
          skipRes().catch(console.log);
        }

      }
    }

  }

  // enter (equals)
  const handleEnt=()=>{
    //only works with existing op1, op2, and a operator
    if (op1.length>0 && oper!=='' && op2.length>0) {
      //either no scientific notation, or a complete sci not (number must exist after e+) and its not just a - sign
      if ((!ey || op2[op2.length-1]!=='+')&&op2[op2.length-1]!=='-')
        setRes(calcing().catch(console.log));

    }

  }

  //handle +/-
  const handleSign=()=>{
    //case of complete calculation
    if (res!=='') {
      const resNeg=async()=>{
        const msg=await resNeg();
        if (msg==='reset') {
          setOp2(['-']);
        }
        else
          throw new Error('reset unsuccessful');
      }
      resNeg().catch(console.log);

    }
    //case of existing op2
    else if (op2.length>0) {
      //case of positive to negative
      if (op2[0]!=='-')
        setOp2(['-'].concat(op2));
      else 
        setOp2(op2.slice(1));
    }
    else
      setOp2(['-']);
  }

  //handle sci notation
  const handleEy=()=>{
    //only works with existing op2 that is not just a zero
    if (op2.length>0) {
      if (op2[0]!=='0' || dec) {
        setOp2(op2.concat(['e','+']));
        setEy(true);
      }
    }
  }
  //sqrt, squared
  const handleOther=op=>{
    //only works with existing op2
    if (op2.length>0) {
      const toCalc=math.bignumber(op2.join(''));
      if (op==='sqrt') {
        const ans = math.sqrt(toCalc).toString().split('');
        setOp2(ans);
        //set sci notation if exists
        setEy(ans.includes('e'));
      }
      else {
        const ans = math.pow(toCalc,2).toString().split('');
        setOp2(ans);
        //set sci notation if exists
        setEy(ans.includes('e'));
      }
    }

  }

  //clears
  const handleClear=e=>{
    //all clear
    if (e==='ac') {
      resetto().catch(console.log);
    }
    //clear entry
    else {
      //case of calculation completed, or both operands exist
      if (op1.length>0 && op2.length>0) {
        setOp2([]);
        setRes('');
        setDec(false);
        setEy(false);
      }
      //case of only 1 operand, or 1 operand plus a operator
      else {
        setOp2([]);
      }
    }
  }

  //handle backspaces
  const handleDel=()=>{
    //only works with existing op2 and no complete calculation
    if (op2.length>0 && res==='') {
      //case of on the scientific notation 
      if (op2[op2.length-1]==='+') {
        setOp2(op2.slice(0,op2.length-2));
        setEy(false);
      }
      else {
        setOp2(op2.slice(0,op2.length-1));
      }
    }
      

}
  return (
    <div id="calc">
      <Display op1={op1}
               oper={oper}
               op2={op2}
               res={res}/>
      <CalcPad handleEvent={handleEvent}/>
    </div>
  )
}

const Display=props=>{
  //rudimentary handling of display
  const dispStr=props.op1.join('')+' '+props.oper+' '+props.op2.join('')+(props.res!==''?'=':'')+props.res;
  return (
    <div id="display">
      <p>{dispStr}</p>
    </div>
  )
}

const CalcPad=props=>{
  const [url]=useState('https://raw.githubusercontent.com/MatchaCrisp/JSCalculator/main/public/button.json');
  const [buttons,setButtons]=useState([]);
  const renderButton=button=><Pad
                                className={button.class}
                                id={button.id}
                                keyCode={button.keyCode}
                                key={button.id}
                                desc={button.desc}
                                handleEvent={props.handleEvent} />
  useEffect(()=>{
    if (!url) return;

    const fetchData=async()=>{
      const response=await fetch(url);
      const data=await response.json();
      setButtons(data.buttList);
    }
    fetchData().catch(console.log);
  },[url]);

  const jsx=buttons.map(button=>renderButton(button));
  return (
    <div id="calcPad">
      {jsx}
    </div>
  )
}
ReactDOM.render(
  <App />,
  document.getElementById('root')
);


