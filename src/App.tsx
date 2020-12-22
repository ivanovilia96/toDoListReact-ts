import React from 'react';
import './App.css';

function sum(sumArr: number[] = [], num: number): boolean {
    if (num === sumArr[0]) {
        return true
    }

    if(sumArr.length===1){
        return false
    }

    const firstPart = sumArr.slice(0, Math.floor(sumArr.length / 2))
    const secondPart = sumArr.slice(Math.floor(sumArr.length / 2))

    if (  num > firstPart[firstPart.length - 1]) {
       return  sum(secondPart,num)
    } else {
      return   sum(firstPart,num)
    }
}


function App(this: void): JSX.Element {
    return (
        <div>  {sum( [7,5,11,32].sort((a, b) => a - b), 32).toString()}</div>
    );
}

export default App;
