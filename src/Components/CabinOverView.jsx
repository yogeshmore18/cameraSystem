import React, { useEffect, useState } from "react";
import * as apiActions from "../Components/ApiCall"
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion"
import SideNav from "./SideNav";
import camera from '../assets/images/camera.png'
import camera1_3 from '../assets/images/camera1&3.png'
const CabinOverview = () => {

    const [partType, setpartType] = useState();
    const [skidNo, setskidNo] = useState();
    const [serialNo, setserialNo] = useState();
    const [scanStatus, setscanStatus] = useState(true);
    const [partPosition,setpartPosition]=useState();

    const conveyorLength=10;
    const position=(partPosition/conveyorLength)*100;
  
    //Api data
    const { data, refetch } = apiActions.CabinOverview();
   
    useEffect(() => {
        if (data) {
            setpartType(data.part_type)
            setskidNo(data.skid_number)
            setserialNo(data.serial_number)
            setscanStatus(data.scan_Status)
            setpartPosition(data.pos)
            // console.log("==========>>>", data);
        }
    }, [data])

    // useEffect(()=>{

    //     const interval=setInterval(() => {

    //         refetch();
            
    //     }, 1000);
    //     return ()=> clearInterval(interval)

    // },[refetch])

    const animation={
        initial:{left:'0%'},
        animate:{left:'100%'},
        transition:{duration: 0.1, ease:'linear'}
    }

    return (                 
        <>
            <Box sx={{ display: 'flex', height: '100vh' }}>
                <SideNav />
                <Box sx={{ flexGrow: 1, marginTop: 4, padding: 4, display: 'flex', flexDirection: 'column' }}>
                    <h1>Cabin Overview</h1>

                    <div></div>
                    {/* Main div */}
                    <motion.div
                        style={{
                            border: '1px solid black',
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            width: '100%',
                        }}
                    >
                        {/* sub-div   -> Skid rope */}
                        <motion.div
                            style={{
                                position: 'relative',
                                justifyContent: 'center',
                                borderTop: '5px solid black',
                                width: '95%',
                                height: '500px',
                            }}
                        >
                            {/* Scan room */}
                            <motion.div
                                style={{
                                    position: 'absolute',
                                    borderLeft:'1px solid black',
                                    borderRight:'1px solid black',
                                    borderBottom:'1px solid black',
                                    backgroundColor: 'rgb(230, 181, 164, 0.2)',
                                    width: '50%',
                                    height: '85%',
                                    top: '0',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                }}
                            >
                                    {/* Cameras  */}
                                        {/* camera 1 */}
                                        <motion.div style={{
                                            position:'absolute',
                                            width:'40px',
                                            height:'10px',
                                            transform:'rotate(20deg)'
                                        }}>
                                         <img src={camera1_3} alt='logo' style={{width:'40px', height:'15x'}}/>
                                        </motion.div>
                                        
                                        {/* camera 2 */}
                                        <motion.div style={{
                                            position:'absolute',
                                            width:'40px',
                                            height:'10px',
                                            transform:'rotate(-20deg)',
                                            top:'0',
                                            right:'0',
                                        }}>
                                            <img src={camera} alt='logo' style={{width:'40px', height:'15x'}}/>
                                        </motion.div>

                                        {/* camera 3 */}
                                        <motion.div style={{
                                            position:'absolute',
                                            width:'40px',
                                            height:'35px',
                                            transform:'rotate(-60deg)',
                                            bottom:'0',
                                            left:'0',
                                        }}>
                                            <img src={camera1_3} alt='logo' style={{width:'40px', height:'15x'}}/>
                                        </motion.div>

                                        {/* camera 4 */}
                                        <motion.div  style={{
                                            position:'absolute',
                                            width:'40px',
                                            height:'35px',
                                            transform:'rotate(60deg)',
                                            bottom:'0',
                                            right:'0',
                                        }}>
                                        <img src={camera} alt='logo' style={{width:'40px', height:'15x'}}/>
                                        </motion.div>
                                        
                                        <motion.div
                                            style={{
                                                position:'absolute',
                                                bottom:'0',
                                                left:'50%'
                                            }}
                                        >
                                        {/* <Typography >Scan Area</Typography> */}

                                        </motion.div>
                                        
                            </motion.div>
                        
                            {/* SKID , HANGER, PART */}
                            
                     {scanStatus? 
                            <>
                                {/* SKID trolley  */}
                                <motion.div 
                                    style={{
                                        position: 'absolute',
                                        backgroundColor: 'blue',
                                        border: '1px solid blue',
                                        borderRadius:'10px',
                                        height: '10px',
                                        width: '50px',
                                }}
                                    // initial={{left:'0%'}}
                                    // animate={{left:'100%'}}
                                    initial={{left:`${position}%`}}
                                    animate={{left:`${position}%`}}
                                    transition={{duration: 1, ease:'linear'}}
                                />

                                {/* HANGER  */}
                                <motion.div 
                                     style={{
                                        position: 'absolute',
                                        backgroundColor: 'blue',
                                        border: '1.5px solid black',
                                        height: '100px',
                                        width: '1px',
                                        marginTop:'10px',
                                        marginLeft:'23px'
                                }}

                                // initial={{left:'0%'}}
                                //     animate={{left:'100%'}}
                                initial={{left:`${position}%`}}
                                animate={{left:`${position}%`}}
                                    transition={{duration: 1, ease:'linear'}}
                                />

                                {/* PART  */}
                                <motion.div 
                                   style={{
                                    position: 'absolute',
                                    backgroundColor: 'green',
                                    border: '1px solid green',
                                    borderRadius:'10px',
                                    height: '35px',
                                    width: '85px',
                                    marginTop:'100px',
                                    marginLeft:'-15px'
                            }} 
                            // initial={{left:'0%'}}
                            // animate={{left:'100%'}}
                            initial={{left:`${position}%`}}
                            animate={{left:`${position}%`}}
                                    transition={{duration: 1, ease:'linear'}}                              
                                />
                            </>
                            :null}
        
                        </motion.div>
                    </motion.div>

                    {/* Cabin Overview Details */}
                    <div style={{ width: '100%' }}>
                        <Box
                            sx={{
                                flexGrow: 1,
                                border: '1px solid black',
                                marginTop: 2,
                                padding: 2
                            }}
                        >
                            <Box sx={{
                                color: "black",
                            }}>
                                <Typography variant="body2">
                                    Part Type: <span style={{ color: 'blue' }}>{partType}</span>
                                </Typography>
                                <Typography variant="body2">
                                    Skid Number:<span style={{ color: 'blue' }}>{skidNo}</span>
                                </Typography>
                                <Typography variant="body2">
                                    Serial Number:<span style={{ color: 'blue' }}>{serialNo}</span>
                                </Typography>
                                <Typography variant="body2">
                                    Scan Status: <span style={{ color: scanStatus ? ' green' : 'red' }}>{scanStatus ? "Scanning" : " Yet to scan"}</span>
                                </Typography>
                            </Box>
                        </Box>
                    </div>
                </Box>
            </Box>
        </>
    );
}

export default CabinOverview;