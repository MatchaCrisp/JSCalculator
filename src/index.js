import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { create, all } from 'mathjs';
import './index.scss';

const config = {
  precision: 31
};
const math = create(all, config);
//use font awesome if possible
const Pad = props => {
  let dispTxt;
  if (props.desc === "pow")
    dispTxt = <p>x<sup>2</sup></p>;
  else if (props.desc === "sqrt")
    dispTxt = <p>&radic;</p>;
  else if (props.desc === "sign")
    dispTxt = <p>+/-</p>;
  else if (props.desc === "bksp")
    dispTxt = <i className="fas fa-backspace"></i>
  else
    dispTxt = <p>{props.desc}</p>;

  useEffect(() => {
    if (props.keyCode === "") return;
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('keydown', handleKey) };
  });
  const handleKey = e => {
    if (e.keyCode === parseInt(props.keyCode)) {
      if (e.keyCode===53) {
        if (e.shiftKey) {
          props.handleEvent(props.desc);
        }
      }
      e.preventDefault();
      props.handleEvent(props.desc);
    }

  }
  const handleClick = () => {
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

const App = () => {

  return (
    <div id="app">
      <Calc />
    </div>
  )
}

const Calc = () => {
  const [op1, setOp1] = useState('');
  const [oper, setOper] = useState('');
  const [op2, setOp2] = useState('0');
  const [dec, setDec] = useState(false);
  const [res, setRes] = useState('');
  const [ey, setEy] = useState(false);
  const [hist, setHist] = useState([]);
  //only works with both operands and the operator all present
  const calcing = (l,r,o) => {

      console.log('calcing was called, using op1: ', l, 'op2: ', r, 'oper: ', o);
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
      return ans;
  }

  //distribute 
  const handleEvent = e => {

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
    console.log(`called handleNum, passed: ${num}`);

    //case of complete calculation
    if (res !== '') {
      console.log('new calc with', num);
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
    else if (op2.length - (dec ? 1 : 0) < 30) {
      console.log('processing', num);
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

  //+ - * /
  //new refactor stopping point
  const handleArith = op => {
    console.log(`handleArith called ${op}`);
    if (res==='undefined') {
      console.log('last result undefined');
      setOp1('');
      setOper('');
      setOp2('0');
      setRes('');
      setDec(false);
      setEy(false);
    }
    //case of complete calculation
    else if (res !== '') {
      console.log('complete calculation into new arith');
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
        //case of another - operator
        if (op==='-') {
          handleSign();
        }
        //case of other operators
        else {
          setOper(op);
          setOp2('');
        }

      }
      //case of two operands
      else {
        //either no scientific notation, or a complete sci not (number must exist after e+) and its not just a - sign
        if ((!ey || op2[op2.length - 1] !== '+') && op2[op2.length - 1] !== '-') {
          console.log('calculate then move new arith')
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
          setHist(hist.concat([l.concat(oOld).concat(r).concat('=').concat(rekt)]));
        }

      }
    }

  }

  // enter (equals)
  const handleEnt = () => {
    console.log('handleEnt called');
    //only works with existing op1, op2, and a operator
    if (res === '' && op1.length > 0 && oper !== '' && op2.length > 0) {
      //either no scientific notation, or a complete sci not (number must exist after e+) and its not just a - sign
      if ((!ey || op2[op2.length - 1] !== '+') && op2[op2.length - 1] !== '-') {
        console.log('full calculation');
        const rekt=calcing(op1,op2,oper);
        setRes(rekt);
        setHist(hist.concat([op1.concat(oper).concat(op2).concat('=').concat(rekt)]));

      }

    }

  }

  //handle +/-
  const handleSign = () => {
    console.log('handleSign called');
    //case of complete calculation
    if (res !== '') {
      const newSign = () => {
        return new Promise((resolve) => {
          setOp1('');
          setOper('');
          setOp2('-');
          setRes('');
          setDec(false);
          setEy(false);
          resolve('to new calc with sign');
        });
      }
      newSign().then(msg => console.log(msg));


    }
    //case of existing op2
    else if (op2.length > 0) {
      //case of positive to negative
      if (op2[0] !== '-')
        setOp2('-'.concat(op2));
      else
        setOp2(op2.slice(1));
    }
    else
      setOp2('-');
  }

  //handle sci notation
  const handleEy = () => {
    console.log('handleEy called');
    //only works with existing op2 that is not just a zero
    if (op2.length > 0) {
      if (op2[0] !== '0' || (dec && op2.length > 2)) {
        setOp2(op2.concat('e+'));
        setEy(true);
      }
    }
  }
  //sqrt, squared
  const handleOther = op => {
    console.log(`handleother called`)
    //only works with existing op2
    if (op2.length > 0) {
      const toCalc = math.bignumber(op2);
      if (op === 'sqrt') {
        const ans = math.sqrt(toCalc).toString();
        setOp2(ans);
        //set sci notation if exists
        setEy(ans.includes('e'));
      }
      else {
        const ans = math.pow(toCalc, 2).toString();
        setOp2(ans);
        //set sci notation if exists
        setEy(ans.includes('e'));
      }
    }

  }

  //clears
  const handleClear = e => {
    //all clear
    if (e === 'ac') {
      const allC = () => {
        return new Promise((resolve) => {
          setOp1('');
          setOper('');
          setOp2('0');
          setRes('');
          setDec(false);
          setEy(false);
          resolve('all clear');
        });
      }
      allC().then(msg => console.log(msg));

    }
    //clear entry
    else {
      console.log('clear entry called');
      //case of calculation completed, or both operands exist
      if (op1.length > 0 && op2.length > 0) {
        const cEntry = () => {
          return new Promise((resolve) => {
            const saveOp1 = op1;
            const saveOp = oper;
            setOp1(saveOp1);
            setOper(saveOp);
            setOp2('');
            setRes('');
            setDec(false);
            setEy(false);
            resolve('clear last entry');
          });
        }
        cEntry().then(msg => console.log(msg));


      }
      //case of 1 operand plus operator
      else if (op1.length > 0 && oper) {
        const cOp = () => {
          return new Promise((resolve) => {
            const saveOp1 = op1;
            setOp1('');
            setOper('');
            setOp2(saveOp1);
            setRes('');
            setEy((/e\+/i).test(saveOp1));
            setDec((/\./).test(saveOp1));
            resolve('clear last operator');
          });
        }
        cOp().then(msg => console.log(msg));

      }
      //case of only 1 operand
      else {
        setOp2('');
      }
    }
  }

  //handle backspaces
  //problem of turning op1 back to 2, nd decimals etc
  const handleDel = () => {
    //only works with existing op2 and no complete calculation
    if (res === '') {
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
        else {
          setOp2(op2.slice(0, op2.length - 1));
        }
      }
      else if (op1.length > 0 && oper) {
        const dOp = () => {
          return new Promise((resolve) => {
            const saveOp1 = op1;
            setOp1('');
            setOper('');
            setOp2(saveOp1);
            setRes('');
            setEy((/e\+/i).test(saveOp1));
            setDec((/\./).test(saveOp1));
            resolve('clear last operator');
          });
        }
        dOp().then(msg => console.log(msg));


      }
    }



  }
  const histStr = hist.map((h, i) => <li key={i}>{h}</li>);
  return (
    <div id="calc">
      <Display op1={op1}
        oper={oper}
        op2={op2}
        res={res}
        hist={hist} />
      <CalcPad handleEvent={handleEvent} />
      <ul>
        {histStr}
      </ul>
    </div>
  )
}

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
  //rudimentary handling of display
  //const dispStr=props.op1+' '+props.oper+' '+props.op2+(props.res!==''?'=':'');
  //const ans=props.res;
  return (
    <div id="scr">
      <div id='operation'>
        <p>{dispStr}</p>
      </div>
      <div id="display">
        <p>{disp}</p>
      </div>
    </div>

  )
}

const CalcPad = props => {
  const [url] = useState('https://raw.githubusercontent.com/MatchaCrisp/JSCalculator/main/public/button.json');
  const [buttons, setButtons] = useState([]);
  const renderButton = button => <Pad
    className={button.class}
    id={button.id}
    keyCode={button.keyCode}
    key={button.id}
    desc={button.desc}
    handleEvent={props.handleEvent} />
  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      const response = await fetch(url);
      const data = await response.json();
      setButtons(data.buttList);
    }
    fetchData().catch(console.log);
  }, [url]);

  const jsx = buttons.map(button => renderButton(button));
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


