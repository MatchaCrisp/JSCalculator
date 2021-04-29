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


  //does not handle consecutive calc
  const handleEvent=e=>{

    console.log(e);
    if (e.length===1) {
      if (/[\d.]/.test(e)) {
        handleNum(e);
      }
      else if (e==='=') {
        handleEnt();
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
    else 
      handleOther(e);
  }
  //0-9&decimal point
  const handleNum=num=>{
    const opLen=op2.length-(dec?1:0);
    console.log(opLen);
    if (opLen<30 && res==='') {
      if (num==='0') {
        if (op2.length===0)
          setOp2(op2.concat(num));
        else if (dec)
          setOp2(op2.concat(num));
        else if (op2[0]!=='0')
          setOp2(op2.concat(num));
      }
      else if (num==='.') {
        if (op2.length===0){
          setOp2(op2.concat(['0',num]));
          setDec(true);
        }
        else if (!dec) {
          setOp2(op2.concat(num));
          setDec(true);
        }
      }
      else {
        if (op2.length>0 && !dec && op2[0]==='0')
          setOp2([num]);
        else 
          setOp2(op2.concat(num));
      }
    }
      
  }

  //+ - * /
  //does not handle - as negative sign
  const handleArith=op=>{
    if (oper==='') {
      if (op2.length>0) {
        setOp1(op2.slice(0,op2.length));
        setOper(op);
        setOp2([]);
        setDec(false);
      }
    }
    else {
      if (op2.length===0) {
        setOper(op);
      }
    }

  }

  // enter (equals)
  const handleEnt=()=>{
    if (op1.length>0 && oper!=='' && op2.length>0) {
      const opL=math.bignumber(op1.join(''));
      const opR=math.bignumber(op2.join(''));
      if (oper==='+') {
        setRes(math.add(opL,opR).toString());
      }
      else if (oper==='-') {
        setRes(math.subtract(opL,opR).toString());
      }
      else if (oper==='*') {
        setRes(math.multiply(opL,opR).toString());
      }
      else if (oper==='/') {
        if (op2.join('')==='0')
          setRes('undefined');
        else
          setRes(math.divide(opL,opR).toString());
      }
    }
  }

  //sqrt, squared, +/-
  const handleOther=op=>{

  }

  //clears
  const handleClear=e=>{
    //all clear
    if (e==='ac') {
      setOp1([]);
      setOper('');
      setOp2(["0"]);
      setRes('');
      setDec(false);
    }
    //clear entry
    else {
      //case of calculation completed, or both operands exist
      if (op1.length>0 && op2.length>0) {
        setOp2([]);
        setRes('');
        setDec(false);
      }
      //case of only 1 operand, or 1 operand plus a operator
      else {
        setOp2([]);
      }
    }
  }
  //handle backspaces
  const handleDel=()=>{

    if (op2.length>0) 
      setOp2(op2.slice(0,op2.length-1));

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


