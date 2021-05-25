import {useState, useEffect} from 'react';

//hook for tracking viewport size
const useWindDim=()=>{
    const getWindDim=()=>{
      const {innerWidth:w,innerHeight:h}=window;
      return {w,h};
    }
    const handleResize=()=>{
      setWindDim(getWindDim());
    }
    //initialize to viewport size on open
    const [windDim,setWindDim]=useState(getWindDim());
  
    //add listener for resize on mount/remove on unmount
    useEffect(()=>{
      window.addEventListener('resize',handleResize);
      return ()=>window.removeEventListener('resize',handleResize);
    });
  
    return windDim;
  }
  
  export default useWindDim;