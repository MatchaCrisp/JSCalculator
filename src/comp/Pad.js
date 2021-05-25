import React, {useState, useEffect} from 'react';

//the buttons
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
  
  export default Pad;