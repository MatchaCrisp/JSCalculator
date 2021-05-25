import React, {useState, useEffect} from 'react';
import Pad from './Pad';
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
  
  export default CalcPad;