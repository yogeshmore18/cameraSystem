import React from "react";
import "./Colors.css"

 const SelectColor = () => {
    const colors = ['red', 'green', 'yellow', 'blue', 'orange'];

    return (
        <>
            <div>
                <p>
                    Colors:
                    {colors.map((currentColor,index)=>{
                        return(
                            <button key={index}  className="colorButton" style={{backgroundColor:currentColor}}></button>
                        )
                    })}
                </p>
            </div>
        </>

    )
}
export default SelectColor;

