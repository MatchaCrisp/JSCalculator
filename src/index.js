import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Pad=props=>{

  return (
    <button className="userPad"
    
    />
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
  return (
    <div id="calc">
      <Ctrl />
      <CalcPad />
    </div>
  )
}

const Ctrl=props=>{
  return (
    <div id="ctrl">

    </div>
  )
}

const CalcPad=props=>{
  return (
    <div id="calcPad">

    </div>
  )
}
ReactDOM.render(
  <App />,
  document.getElementById('root')
);


