import React from 'react';
import History from './History';
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
    const renderHist = (histI,ind) => <History
      ind = {ind}
      key = {histI[4]}
      hist = {histI}
      handleHist = {props.handleHist}
      handleExp= {handleExp}
      />
  
    //map array of arrays to list of history components
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

  export default HistList;
  