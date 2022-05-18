// external
// react
import React, {useState,useEffect} from 'react';
// internal
// hook
import useWindDim from './hook/useWindDim';
// component
import Core from './comp/Core';

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
  
  export default App;