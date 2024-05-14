import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
// import Swal from 'sweetalert2'

const SaveMakrkersAndIssue = ({ area, issue, filename }) => {

    const [saveData, setSaveData] = useState(null);

    const saveDataToFile = () => {
        console.log("area ===>", area);
        console.log("selectedIssue===>", issue);
        console.log("filename===>", filename)

        if(!saveData)return;
        
        const dataBlob = new Blob([JSON.stringify({ saveData }, null, 2)], { type: 'text/plain' });
        const downloadLink = document.createElement('a');
        downloadLink.download = `${filename}.txt`;
        downloadLink.href = window.URL.createObjectURL(dataBlob);
        downloadLink.click();

        // Swal.fire({
        //     // position: "top-end",
        //     icon: "success",
        //     title: "Your work has been saved",
        //     showConfirmButton: false,
        //     timer: 1500
        //   });
    }

    useEffect(() => {
        setSaveData({filename, area, issue})
    }, [area, issue]);

    return (
        <>
            <Button variant="contained" color="success" onClick={saveDataToFile} >Submit </Button> {/*Save Co-ordinates and Remarks */}
            
        </>
    )
}
export default SaveMakrkersAndIssue;