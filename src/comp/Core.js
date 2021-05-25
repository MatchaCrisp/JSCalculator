import React, {useState} from 'react';
import HistList from './HistList';
import Calc from './Calc';
import { create, all } from 'mathjs';


//dig. lim.
const digLim=22;
//sig. dig.
const config = {
  precision: digLim
};
const math = create(all, config);

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
  
    //generate unique key based on time of action
    const getUnique=()=>{
      const d = new Date();
      return d.getMilliseconds().toString(16)+d.getDate().toString(16)+d.getMinutes().toString(16);
    }
    //record calculation to history when given all 4 parameters (max history size 13)
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

  export default Core;