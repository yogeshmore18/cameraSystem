import React, { useEffect, useState } from "react";
import { CheckCircleOutline, HighlightOff } from "@mui/icons-material";
import LinkedCameraIcon from '@mui/icons-material/LinkedCamera';
import { Box, Typography, IconButton, Button, styled,Snackbar } from "@mui/material";
import * as apiActions from "../Components/ApiCall"
import SideNav from "./SideNav";

const CustomButton = styled(Button)({
    textTransform: 'none',
    borderRadius: '20px',
    padding: '10px 20px',
    boxShadow: 'none',
    '&:hover': {
        boxShadow: 'none',
    },
});

const Status = () => {
    const [status, setStatus] = useState();
    const [showsnackbar, setSnackbar]=useState(false);

    // const [isLoading, setIsLoading] = useState(false);

    const {data,refetch}=apiActions.CameraStatus()

    useEffect(()=>{
        if(data){
            setStatus(data.status)
            // console.log("status=>>",data);
        }
        
    },[data])

    useEffect(()=>{
        console.log(status);
    },[status])

    const handleUpdateStatus = () => {
        // setIsLoading(true);
        // setTimeout(() => {
        //     setIsLoading(false);
        // }, 500);
        refetch();
        setSnackbar(true);
    };

    const handlecloseSnackbar=()=>{
        setSnackbar(false);
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <SideNav />
            <Box sx={{ flexGrow: 1, marginTop: 4, padding: 4 }}>
                <Typography variant="h4" gutterBottom> </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                    <LinkedCameraIcon
                        sx={{ marginRight: 1, fontSize: '3rem', color: status ? 'success.main' : 'error.main' }}
                    />
                    <Typography variant="h6">Camera status: </Typography>
                        <>
                            {status ? (
                                <IconButton color="success">
                                    <CheckCircleOutline />
                                </IconButton>
                            ) : (
                                <IconButton color="error">
                                    <HighlightOff />
                                </IconButton>
                            )}
                            <Typography variant="body1" sx={{ marginLeft: 1 }}>
                                {status ? 'Active' : 'Inactive'}
                            </Typography>
                        </>
                </Box>
                <CustomButton
                    variant="contained"
                    onClick={handleUpdateStatus}
                    // disabled={isLoading}
                >
                    {/* {isLoading ? 'Updating...' : 'Update Status'} */}
                    Update status
                </CustomButton >

                <Snackbar
                open={showsnackbar}
                onClose={handlecloseSnackbar}
                autoHideDuration={3000}
                message='Status updated successfuly'
                
                />
            </Box>
        </Box>
    );
};

export default Status;