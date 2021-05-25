import React from 'react';

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
  export default History;