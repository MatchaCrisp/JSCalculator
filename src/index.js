import React, { useEffect,useState } from 'react';
import ReactDOM from 'react-dom';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';
import './index.scss';

const Pad=props=>{
  const dispTxt=(props.desc==="pow")?(<p>x<sup>2</sup></p>):(<p>props.desc</p>);
  useEffect(()=>{
    if (props.key==="") return;
    document.addEventListener('keydown',handleKey);
    return ()=>{document.removeEventListener('keydown',handleKey)};
  });
  const handleKey=e=>{
    if (e.keyCode===props.key) 
      props.handleEvent();
  }
  const handleClick=()=>{
    props.handleEvent();
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

const Calc=props=>{
  const [curr,setCurr]=useState('');
  const handleEvent=e=>{
    setCurr(e);
  }
  return (
    <div id="calc">
      <Display curr={curr}/>
      <CalcPad handleEvent={handleEvent}/>
    </div>
  )
}

const Display=props=>{
  return (
    <div id="display">
      {props.curr}
    </div>
  )
}

const CalcPad=props=>{
  const [url]=useState('%PUBLIC_URL%/button.json');
  const [buttons,setButtons]=useState([]);
  const renderButton=button=><Pad
                                className={button.class}
                                id={button.id}
                                key={button.keyCode}
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


