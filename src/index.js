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
  const [op1,setOp1]=useState('');
  const [oper,setOper]=useState('');
  const [op2,setOp2]=useState('0');
  const [dec,setDec]=useState(false);
  const [res,setRes]=useState('');
  const [ey,setEy]=useState(false);
  const [hist, setHist]=useState([]);
  //only works with both operands and the operator all present
  const calcing=()=>{
    return new Promise((resolve,reject)=>{
      const opL=math.bignumber(op1);
      const opR=math.bignumber(op2);
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
          if (op2==='0')
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
    return new Promise(resolve=>{
      setOp1('');
      setOper('');
      setOp2('');
      setRes('');
      setDec(false);
      setEy(false);
      resolve('reset');
    });
  }
  const recordo=num=>{
    return new Promise((resolve,reject)=>{
      if (num && op1 && op2 && oper) {
        resolve(op1.concat(oper).concat(op2).concat('=').concat(num));
      }
      else if (op1 && op2 && oper && res) {
        resolve(op1.concat(oper).concat(op2).concat('=').concat(res));
      }
      else
        reject (new Error ("incomplete"));
    });
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
      console.log('processing',num);
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
            setOp2(op2.concat('0.'));
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
            setOp2(num);
          //all other cases
          else 
            setOp2(op2.concat(num));
        }
      
    }
    
    //case of complete calculation
    if (res!=='') {
      setOp1('');
      setOper('');
      setOp2('');
      setRes('');
      setDec(false);
      setEy(false);
    }
    if (op2.length-(dec?1:0)<30)
      theNum(num);    
  }

  //+ - * /
  const handleArith=op=>{
    //case of complete calculation
    if (res!=='') {
      const newHalf=async(op)=>{
        const rem=res;
        await resetto();
        setOp1(rem);
        setOper(op);
      }
      newHalf(op).catch(console.log);
    }
    //no operators
    else if (oper==='') {
      //case of existing operand
      if (op2.length>0) {
        //either no scientific notation, or a complete sci not (number must exist after e+)
        if (!ey || op2[op2.length-1]!=='+') {

          const moveOp2=async()=>{
            const toMove=op2;
            await resetto();
            setOp1(toMove);
            setOper(op);
          }
          moveOp2().catch(console.log);
        }

      }
    }
    //operator already exists
    else {
      //case of -
      if (op==='-') {
        handleSign();
      }
      //case of no second operand
      else if (op2.length===0) {
        setOper(op);
      }
      //case of two operands
      else {
        //either no scientific notation, or a complete sci not (number must exist after e+) and its not just a - sign
        if ((!ey || op2[op2.length-1]!=='+')&&op2[op2.length-1]!=='-') {
          const halfHalf=async(op)=>{
            const rekt=await calcing();
            const reco=await recordo(rekt);
            await resetto();
            setHist(hist.concat([reco]));
            setOp1(rekt);
            setOper(op);
          }
          halfHalf(op).catch(console.log);
        }

      }
    }

  }

  // enter (equals)
  const handleEnt=()=>{
    //only works with existing op1, op2, and a operator
    if (res===''&&op1.length>0 && oper!=='' && op2.length>0) {
      //either no scientific notation, or a complete sci not (number must exist after e+) and its not just a - sign
      if ((!ey || op2[op2.length-1]!=='+')&&op2[op2.length-1]!=='-') {
        const completion=async()=>{
          const rekt=await calcing();
          const reco=await recordo(rekt);
          setRes(rekt);
          setHist(hist.concat([reco]));
        }
        completion().catch(console.log);
      }

    }

  }

  //handle +/-
  const handleSign=()=>{
    //case of complete calculation
    if (res!=='') {
      const resNeg=async()=>{
        await resetto();
        setOp2('-');
      }
      resNeg().catch(console.log);

    }
    //case of existing op2
    else if (op2.length>0) {
      //case of positive to negative
      if (op2[0]!=='-')
        setOp2('-'.concat(op2));
      else 
        setOp2(op2.slice(1));
    }
    else
      setOp2('-');
  }

  //handle sci notation
  const handleEy=()=>{
    //only works with existing op2 that is not just a zero
    if (op2.length>0) {
      if (op2[0]!=='0' || (dec&&op2.length>2)) {
        setOp2(op2.concat('e+'));
        setEy(true);
      }
    }
  }
  //sqrt, squared
  const handleOther=op=>{
    //only works with existing op2
    if (op2.length>0) {
      const toCalc=math.bignumber(op2);
      if (op==='sqrt') {
        const ans = math.sqrt(toCalc).toString();
        setOp2(ans);
        //set sci notation if exists
        setEy(ans.includes('e'));
      }
      else {
        const ans = math.pow(toCalc,2).toString();
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
      resetto().then(msg=>setOp2('0')).catch(console.log);
    }
    //clear entry
    else {
      //case of calculation completed, or both operands exist
      if (op1.length>0 && op2.length>0) {
        const halfDel=async()=>{
          const saveOp1=op1;
          const saveOp=oper;
          await resetto();
          setOp1(saveOp1);
          setOper(saveOp);
        }
        halfDel().catch(console.log);
      }
      //case of 1 operand plus operator
      else if (op1.length>0 && oper) {
        const saveOp1=op1;
        resetto().then(msg=>{
          setOp2(saveOp1);
          setEy((/e\+/i).test(saveOp1));
          setDec((/\./).test(saveOp1));
        }).catch(console.log);
      }
      //case of only 1 operand
      else {
        setOp2('');
      }
    }
  }

  //handle backspaces
  //problem of turning op1 back to 2, nd decimals etc
  const handleDel=()=>{
    //only works with existing op2 and no complete calculation
    if (res==='') {
      if (op2.length>0) {
        //case of on the scientific notation 
        if (op2[op2.length-1]==='+') {
          setOp2(op2.slice(0,op2.length-2));
          setEy(false);
        }
        //case of on the decimal
        else if (op2[op2.length-1]==='.') {
          setOp2(op2.slice(0,op2.length-1));
          setDec(false);
        }
        else {
          setOp2(op2.slice(0,op2.length-1));
        }
      }
      else if (op1.length>0 && oper) {
        const saveOp1=op1;
        resetto().then(msg=>{
          setOp2(saveOp1);
          setEy((/e\+/i).test(saveOp1));
          setDec((/\./).test(saveOp1));
        }).catch(console.log);
      }
    }

      
    
}
const histStr=hist.map((h,i)=><li key={i}>{h}</li>);
  return (
    <div id="calc">
      <Display op1={op1}
               oper={oper}
               op2={op2}
               res={res}
               hist={hist}/>
      <CalcPad handleEvent={handleEvent}/>
      <ul>
        {histStr}
      </ul>
    </div>
  )
}

const Display=props=>{
  //rudimentary handling of display
  const dispStr=props.op1+' '+props.oper+' '+props.op2+(props.res!==''?'=':'');
  const ans=props.res;
  return (
    <div id="display">
      <p>{dispStr}</p>
      <p>{ans}</p>
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


