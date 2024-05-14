import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import About from './About'
import STLViewer from './STLViewer';
import Status from './StatusLog';
import CabinOverview from './CabinOverView';


const Navigation = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" exact element={<Home/>} />
                    <Route path="/about" element={<About/>} />
                    <Route path="/stlviewer" element={<STLViewer/>}/>
                    <Route path="/status" element={<Status/>}/>
                    <Route path="/CabinOverView" element={<CabinOverview/>}/>

                </Routes>
            </div>
        </Router>
    );
};

export default Navigation;