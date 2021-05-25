import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { create, all } from 'mathjs';
import './index.scss';

//dig. lim.
const digLim=22;
//sig. dig.
const config = {
  precision: digLim
};
const math = create(all, config);

//hook for tracking viewport size
const useWindDim=()=>{
  const getWindDim=()=>{
    const {innerWidth:w,innerHeight:h}=window;
    return {w,h};
  }
  const handleResize=()=>{
    setWindDim(getWindDim());
  }
  //initialize to viewport size on open
  const [windDim,setWindDim]=useState(getWindDim());

  //add listener for resize on mount/remove on unmount
  useEffect(()=>{
    window.addEventListener('resize',handleResize);
    return ()=>window.removeEventListener('resize',handleResize);
  });

  return windDim;
}

//use font awesome if possible
const Pad = props => {

  //if activated (100ms glow)
  const [act,setAct]=useState(false);

  //button display text
  let dispTxt;
  if (props.desc === "pow")
    dispTxt = <p>x<sup>2</sup></p>;
  else if (props.desc === "sqrt")
    dispTxt = <p>&radic;</p>;
  else if (props.desc === "sign")
    dispTxt = <p>+/-</p>;
  else if (props.desc === "bksp")
    dispTxt = <i className="fas fa-backspace"></i>;
  else if (props.desc==="e")
    dispTxt=<p>EE</p>;
  else
    dispTxt = <p>{props.desc}</p>;

  //add keydown event listener on mount/remove on unmount (only if keycode exists in json)
  useEffect(() => {
    if (props.keyCode === "") return;
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('keydown', handleKey) };
  });

  //when keydown
  const handleKey = e => {
    //check if this is pressed
    if (e.keyCode === parseInt(props.keyCode)) {
      //animation
      handleAct();
      //make sure % works but not 5 for modulo operator
      if (e.keyCode===53) {
        if (e.shiftKey)
          props.handleEvent(props.desc);
      }
      //prevent default behaviors (/ opening quick search on firefox etc) then pass descriptor to be processed
      else {
        e.preventDefault();
        props.handleEvent(props.desc);
      }
    }
  }

  //when clicked
  const handleClick = () => {
    //animation
    handleAct();
    //pass descriptor to be processed
    props.handleEvent(props.desc);
  }

  //100 ms glow animation effect on activation
  const handleAct = async()=>{
    setAct(true);
    await new Promise((resolve)=>setTimeout(resolve,100));
    setAct(false);
  }
  return (
    <div className={`${props.className} ${act?'clicked':''}`}
      id={props.id}
      onClick={handleClick}>
      {dispTxt}
    </div>
  )
}

//background & on/off
//contains core & gray backdrop when power off
const App = () => {
  const {h,w}=useWindDim();
  //when off, no input on calculator is registered
  //off only when in mobile and history is expanded
  const [power,setPower]=useState(true);
  //either switch to opposite state, or if given boolean parameter, set to that boolean
  const handlePow=(e)=>{
    if (typeof(e)==='boolean')
      setPower(e);
    else
      setPower(!power);
  } 
  useEffect(()=>{
    if (w<=900)
      return;
    setPower(true);
  },[w])
  //gray backdrop that covers screen when power off
  return (
    <div id="app">
      <Core handlePow={handlePow}
            power={power}
            h={h}
            w={w}/>
      <div id="drop" style={{display:power?'none':'block'}} onClick={()=>handlePow(true)}/>
    </div>
  )
}

//calculation core
//contains history & calc
const Core = props => {
  //left operand
  const [op1, setOp1] = useState('');
  //operator
  const [oper, setOper] = useState('');
  //right operand
  const [op2, setOp2] = useState('0');
  //if decimal 
  const [dec, setDec] = useState(false);
  //calculation result
  const [res, setRes] = useState('');
  //sci notation
  const [ey, setEy] = useState(false);
  //array of past history
  const [hist, setHist] = useState([]);

  //responsive (mobile)
  const mobSty={
    width:'400px',
    height:'100%',
    margin:'0 auto'
  }

  //responsive (desktop)
  const bigSty={
    width:'900px',
    height:'500px',
    display:'flex',
    top:`${Math.max((props.h-500)/2,0)}px`,
    left:`${Math.max((props.w-900)/2,0)}px`
  }

  const getUnique=()=>{
    const d = new Date();
    return d.getMilliseconds().toString(16)+d.getDate().toString(16)+d.getMinutes().toString(16);
  }
  //record calculation to history when given all 4 parameters (max history size 15)
  const histing=(l,r,o,a)=>{
    const u=getUnique();
    if (hist.length>=13)
      setHist(hist.concat([[l,r,o,a,u]]).slice(1));
    else
    setHist(hist.concat([[l,r,o,a,u]]));
  }
  //calculate result given operands and operator
  const calcing = (l,r,o) => {
    if (l==='infinity' || r==='infinity')
      return 'infinity';

    //convert string to bignumber 
      const opL = math.bignumber(l);
      const opR = math.bignumber(r);
      let ans='';
      if (o === '+') {
        ans = (math.add(opL, opR).toString());
      }
      else if (o === '-') {
        ans = (math.subtract(opL, opR).toString());
      }
      else if (o === '*') {
        ans = (math.multiply(opL, opR).toString());
      }
      else if (o === '/') {
        //custom msg of dividing by zero
        if (r === '0')
          ans = ('undefined');
        else
          ans = (math.divide(opL, opR).toString());
      }
      else if (o ==='%') {
        ans = (math.mod(opL,opR).toString());
      }

      //if answer is too big (15 sig. dig. plus 'e+' plus decimal point leaves 10 digits for after e+)
      if (ans.length>28) 
        return 'infinity';
      return ans;
  }

  //distribute passed action to appropraite handler
  const handleEvent = e => {
    if (!props.power)
      return;
    if (e.length === 1) {
      if (e === '=') {
        handleEnt();
      }
      else if (e === 'e') {
        handleEy();
      }
      else if (/[\d.]/.test(e)) {
        handleNum(e);
      }
      else {
        handleArith(e);
      }
    }
    else if (e.length === 2) {
      handleClear(e);
    }
    else if (e === 'bksp') {
      handleDel();
    }
    else if (e === 'sign') {
      handleSign();
    }
    else
      handleOther(e);
  }


  //0-9 & decimal
  const handleNum = num => {


    //case of complete calculation, or undefined/infinity as part of operand
    //clear all, then process given input
    if (res !== '' || op2==='undefined' || op2==='infinity') {
      setOp1('');
      setOper('');
      setRes('');
      setEy(false);
      if (num === '.') {
        setOp2('0.');
        setDec(true);
      }
      else {
        setOp2(num);
        setDec(false);
      }
    }
    //max digit: 15
    else if (op2.length - (dec ? 1 : 0) - (ey ? 2:0) < digLim) {
      //dealing with leading zero
      if (num === '0') {
        //case of no number & case of decimal point present
        if (op2.length === 0 || dec)
          setOp2(op2.concat(num));
        //case of no already leading zero
        else if (op2[0] !== '0')
          setOp2(op2.concat(num));
      }
      //dealing with decimal
      else if (num === '.') {
        //case of no number
        if (op2.length === 0) {
          setDec(true);
          setOp2(op2.concat('0.'));

        }
        //case of no decimal and no scientific notation
        else if (!dec && !ey) {
          setDec(true);
          setOp2(op2.concat('.'));

        }
      }
      //dealing with 1-9
      else if (/[1-9]/.test(num)) {
        //case of only zero, no decimals
        if (op2.length > 0 && !dec && op2[0] === '0')
          setOp2(num);
        //all other cases
        else
          setOp2(op2.concat(num));
      }


    }

  }

  //+ - * / %
  const handleArith = op => {
    //case operand undefined/infinity or result undefined/infinity
    //clear all
    if (res==='undefined' || res==='infinity' || op2==='undefined' || op2==='infinity') {
      setOp1('');
      setOper('');
      setOp2('0');
      setRes('');
      setDec(false);
      setEy(false);
    }
    //case of complete calculation
    //half fill calculation with prev result as left operand, and given input as operator
    else if (res !== '') {
      const rem = res;
      setOp1(rem);
      setOper(op);
      setOp2('');
      setRes('');
      setDec(false);
      setEy(false);
    }
    //no operators
    else if (oper === '') {
      //case of existing operand (not just a negative sign)
      if (op2.length > 0 && op2[op2.length-1]!=='-') {
        //either no scientific notation, or a complete sci not (number must exist after e+)
        if (!ey || op2[op2.length - 1] !== '+') {
          const toMove = op2;
          setOp1(toMove);
          setOper(op);
          setOp2('');
          setRes('');
          setDec(false);
          setEy(false);
        }

      }
    }
    //operator already exists
    else {
      //case of no existing op2, or op2 is just a negative sign
      if (op2.length === 0||op2[op2.length-1]==='-') {
        //case of - operator, swap pos/neg
        if (op==='-') {
          handleSign();
        }
        //case of other operators (clear possible lone negative sign)
        else {
          setOper(op);
          setOp2('');
        }

      }
      //case of two operands
      else {
        //either no scientific notation, or a complete sci not (number must exist after e+) and its not just a - sign
        if ((!ey || op2[op2.length - 1] !== '+') && op2[op2.length - 1] !== '-') {

          const oOld=oper;
          const l=op1;
          const r=op2;
          const rekt = calcing(l,r,oOld);

          setOp1(rekt);
          setOper(op);
          setOp2('');
          setRes('');
          setDec(false);
          setEy(false);
          histing(l,oOld,r,rekt);
        }

      }
    }

  }

  // enter (equals)
  const handleEnt = () => {
    //only works with existing op1, op2, and a operator, with no completed calculation in place
    if (res === '' && op1.length > 0 && oper !== '' && op2.length > 0) {
      //additional requirements of:
      //either no scientific notation, or a complete sci not (number must exist after e+) 
      //not just a - sign as entire operand
      if ((!ey || op2[op2.length - 1] !== '+') && op2[op2.length - 1] !== '-') {
        const rekt=calcing(op1,op2,oper);
        setRes(rekt);
        histing(op1,oper,op2,rekt);
      }
    }
  }

  //handle +/- (test condition to see if behaves in expected way)
  const handleSign = () => {
    //case of complete calculation or operand is undefined/infinity
    if (res !== '' || op2==='undefined' || op2==='infinity') {
      setOp1('');
      setOper('');
      setOp2('-');
      setRes('');
      setDec(false);
      setEy(false);
    }
    //case of existing op2
    else if (op2.length > 0) {
      //case of positive to negative
      if (op2[0] !== '-')
        setOp2('-'.concat(op2));
      //case of negative to positive
      else
        setOp2(op2.slice(1));
    }
    //case of empty right operand
    else
      setOp2('-');
  }

  //handle sci notation (test removal feature)
  const handleEy = () => {
    //only works with existing op2 that is not undefined/infinity
    //only works with incomplete calculation
    if (res==='' && op2.length > 0 && op2!=='undefined' && op2!=='infinity') {
      //remove sci note. if already exists
      if (ey) {
        const newOp2=op2.slice(0,op2.indexOf('e'));
        setOp2(newOp2);
        setEy(false);
      }
      //not only 0 as operand, not trailing decimal place, sci notation doesn't already exist
      else if (op2[0] !== '0' || (dec && op2.length > 2) || !ey) {
        setOp2(op2.concat('e+'));
        setEy(true);
      }
    }
  }
  //sqrt, squared
  const handleOther = op => {
    //case of complete calculation and res not infinity/undefined
    if (res!=='' && res!=='undefined' && res!=='infinity') {
      let rem=math.bignumber(res);
      if (op === 'sqrt') {
        rem=math.sqrt(rem).toString();
      }
      else {
        rem=math.pow(rem,2).toString();
      }
      //perform operation based on input, then clear all and set op2
      setOp1('');
      setOper('');
      setOp2(rem);
      setRes('');
      setDec(rem.includes('.'));
      setEy(rem.includes('e'));
    }
    //only works with existing op2 and incomplete calculations
    else if (op2.length > 0 && (op2!=='undefined'&&op2!=='infinity')) {
      const toCalc = math.bignumber(op2);
      if (op === 'sqrt') {
        const ans = math.sqrt(toCalc).toString();
        setOp2(ans.length>28?'infinity':ans);
        //set sci notation if exists
        setEy(ans.includes('e'));
      }
      else {
        const ans = math.pow(toCalc, 2).toString();
        setOp2(ans.length>28?'infinity':ans);
        //set sci notation if exists
        setEy(ans.includes('e'));
      }
    }

  }

  //clears
  const handleClear = e => {
    //all clear
    if (e === 'ac') {
      setOp1('');
      setOper('');
      setOp2('0');
      setRes('');
      setDec(false);
      setEy(false);
    }
    //clear entry
    else {
      //case of calculation completed, or both operands exist
      //remove both result and right operand
      if (op1.length > 0 && op2.length > 0) {
        const saveOp1 = op1;
        const saveOp = oper;
        setOp1(saveOp1);
        setOper(saveOp);
        setOp2('');
        setRes('');
        setDec(false);
        setEy(false);
      }
      //case of 1 operand plus operator
      //remove operator, move left operand to right operand
      else if (op1.length > 0 && oper) {
        const saveOp1 = op1;
        setOp1('');
        setOper('');
        setOp2(saveOp1);
        setRes('');
        setEy((/e\+/i).test(saveOp1));
        setDec((/\./).test(saveOp1));
      }
      //case of only 1 operand
      //clear existing right operand
      else {
        setOp2('');
      }
    }
  }

  //time travel given index
  const handleHist = i => {
    const toSet=hist[i];
    setOp1(toSet[0]);
    setOper(toSet[1]);
    setOp2(toSet[2]);
    setRes(toSet[3]);
  }

  //handle backspaces
  const handleDel = () => {
    //no complete calculation only
    if (res === '') {
      //case existing right operand
      if (op2.length > 0) {
        //case of on the scientific notation 
        if (op2[op2.length - 1] === '+') {
          setOp2(op2.slice(0, op2.length - 2));
          setEy(false);
        }
        //case of on the decimal
        else if (op2[op2.length - 1] === '.') {
          setOp2(op2.slice(0, op2.length - 1));
          setDec(false);
        }
        //case of 0-9 or -
        else {
          setOp2(op2.slice(0, op2.length - 1));
        }
      }
      //case left operand and operator
      //remove operator and move left operand to right operand
      else if (op1.length > 0 && oper) {
        const saveOp1 = op1;
        setOp1('');
        setOper('');
        setOp2(saveOp1);
        setRes('');
        setEy((/e\+/i).test(saveOp1));
        setDec((/\./).test(saveOp1));
      }
    }
  }

  return (
    <div id="core"
      style={props.w>900?{...bigSty}:{...mobSty}}>
      <HistList hist={hist} 
        h={props.h}
        w={props.w}
        handleHist={handleHist}
        handlePow={props.handlePow}
        power={props.power}/>
      <Calc 
        h={props.h}
        w={props.w}
        op1={op1}
        oper={oper}
        op2={op2}
        res={res}
        hist={hist}
        handleEvent={handleEvent} />
    </div>
  )
}

//the calculator itself
//contains a display and calculator buttons
const Calc = props => {
  //desktop, side by side with history
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

//display
//contains a 'fixed string' with small font on top left
//contains a 'variable string' open to change on bottom right
//variable string font size doubles under 16 chars in length
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

//calculator buttons
const CalcPad = props => {
  const [url] = useState('https://raw.githubusercontent.com/MatchaCrisp/JSCalculator/main/public/button.json');
  const [buttons, setButtons] = useState([]);

  //convert from object to pad component
  const renderButton = button => <Pad
    className={button.class}
    id={button.id}
    keyCode={button.keyCode}
    key={button.id}
    desc={button.desc}
    handleEvent={props.handleEvent} />

  //fetch json with list of buttons and attributes
  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      const response = await fetch(url);
      const data = await response.json();
      setButtons(data.buttList);
    }
    fetchData().catch(console.log);
  }, [url]);

  //map from array of obj to pad component
  const jsx = buttons.map(button => renderButton(button));
  return (
    <div id="calcPad">
      {jsx}
    </div>
  )
}

//list of history
const HistList = props => {
  //up when expanded (power off)
  //down when collapsed (power on)
  const upAr=<i className="fas fa-arrow-up" />;
  const downAr=<i className="fas fa-arrow-down" />;

  //collapsible history on top of viewport in mobile view
  const mobSty={
    transition:'height 200ms ease-in',
    height:props.power?'40px':'540px',
    boxShadow:props.power?'none':'0px 0px 10px #CCC'
  };

  //full size history on left of calculator in desktop view
  const bigSty={
    height:`${Math.min(540,props.h)}px`
  }

  const handleExp=e=>{
    props.handlePow(e);
  }
  //renders from array to history component
  //hashing for better key
  const renderHist = (histI,ind) => <History
    ind = {ind}
    key = {histI[4]}
    hist = {histI}
    handleHist = {props.handleHist}
    handleExp= {handleExp}
    />

  //map array of arrays to list of history components
  //better key for header
  const jsx = [<div id="histHeader" key="-1">Past Calculations</div>,...props.hist.map((histI,ind)=>renderHist(histI,ind))];
  return (
    <div id="histList" style={props.w>900?{...bigSty}:{...mobSty}}>
      {jsx}
      <div id="roller" 
      onClick={props.w<=900?props.handlePow:undefined}
      style={{cursor:props.w>900?'default':'pointer'}}
      >{props.w<=900?props.power?downAr:upAr:''}</div>
    </div>
  )
}

//interactive history item
const History = props => {

  //time travel by passing back own index when clicked, turn power on
  const handleClick=()=>{
    props.handleHist(props.ind);
    props.handleExp(true);
  }
  
  //generate displayed history text
  const genHist=()=>{
    //truncate sig. dig. when e+ exists to 15 in total length of string
    //truncate sign. dig. when it is decimal number to 15 
    const truncator=str=>{
      if (str.includes('e')) {
        const toTrun = str.split('e');
        toTrun[0]=toTrun[0].slice(0,15-toTrun[1].length-3)+'(...)';
        return toTrun.join('e');
      }
      else if (str.includes('.')) {
        const toTrun=str.split('.');
        toTrun[1]=toTrun[1].slice(0,15-toTrun[0].length-3)+'(...)';
        return toTrun.join('.');
      }
      return str;

    }
    //assemble result string
    let str1=props.hist[0].length>15?truncator(props.hist[0]):props.hist[0];
    str1+= ` ${props.hist[1]} `;
    str1+= props.hist[2].length>15?truncator(props.hist[2]):props.hist[2];
    let str2= '= ';
    str2+=props.hist[3].length>15?truncator(props.hist[3]):props.hist[3];

    return <div><p className="hisOp">{str1}</p><p className="hisRes">{str2}</p></div>;
  }
  const jsx=genHist();
  return (
    <div onClick={handleClick}
      className='histItem'>
      {jsx}
    </div>
  )
} 
ReactDOM.render(
  <App />,
  document.getElementById('root')
);


