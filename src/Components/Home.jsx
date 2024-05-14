import React from "react"

import { Box} from "@mui/material";
import SideNav from "./SideNav";

const Home = () => {
    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <SideNav />
                <div style={{marginTop:"50px"}}>
                    <h1>Home</h1>
                </div>
            </Box>
        </>
    )
}

export default Home;