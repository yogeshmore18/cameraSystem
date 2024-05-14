import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Drawer, Select, MenuItem, Typography } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function InputFilesUpload({ onChange }) {
    const [files, setFiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showTable, setShowTable] = useState(false);
    const [selectedOption, setSelectedOption] = useState('All'); // Default selected option
    const rowsPerPage = 7;

    const handleFileChange = (event) => {
        const fileList = event.target.files;
        const stlFiles = [];

        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            if (file.name.toLowerCase().endsWith('.stl')) {
                stlFiles.push(file);
            }
        }
        stlFiles.sort((a, b) => b.lastModified - a.lastModified);

        setFiles(stlFiles);
        setShowTable(true);
    };

    const loadStlFile = (file) => {
        onChange(file);
        setShowTable(false); // Hide table after loading file
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    const handleopenDrawer = () => {
        setShowTable(true)
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        // You can add logic here to filter files based on the selected option
    };

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const displayedFiles = files.slice(startIndex, endIndex);

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <input type="file" onChange={handleFileChange} directory="" webkitdirectory="" />
            </div>
            <Drawer anchor="left" open={showTable} onClose={() => { setShowTable(false) }}>
                <div style={{ marginTop: "70px", width: '450px' }}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead style={{ backgroundColor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell colSpan={3} style={{ borderBottom: 'none' }}>
                                        <Typography variant="subtitle1">Filter</Typography>
                                        <Select
                                            value={selectedOption}
                                            onChange={handleOptionChange}
                                            variant="outlined"
                                            style={{ width: '100%', padding: '5px', borderRadius: '10px', border: '1px solid #ccc' }}
                                        >
                                            <MenuItem value="All">All</MenuItem>
                                            <MenuItem value="This Week">This Week</MenuItem>
                                            <MenuItem value="This Month">This Month</MenuItem>
                                            <MenuItem value="Last 3 Months">Last 3 Months</MenuItem>
                                            <MenuItem value="Last 6 Months">Last 6 Months</MenuItem>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                                <TableRow style={{ backgroundColor: '#E5E4E2' }}>
                                    <TableCell><Typography variant="subtitle1">SL NO</Typography></TableCell>
                                    <TableCell><Typography variant="subtitle1">File Name</Typography></TableCell>
                                    <TableCell><Typography variant="subtitle1">Action</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedFiles.map((file, index) => (
                                    <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                                        <TableCell>{startIndex + index + 1}</TableCell>
                                        <TableCell>{file.name}</TableCell>
                                        <TableCell>
                                            <Button variant="outlined" onClick={() => loadStlFile(file)} style={{ borderRadius: '20px', fontSize: '12px', padding: '5px 10px' }}>Load Model</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button disabled={currentPage === 1} onClick={handlePrevPage} style={{ marginRight: '10px', marginTop: '10px' }}>Previous</Button>
                    <Button disabled={endIndex >= files.length} onClick={handleNextPage} style={{ marginTop: '10px' }}>Next</Button>
                </div>
            </Drawer>
            {!showTable && (
                <Button onClick={handleopenDrawer}><ArrowForwardIosIcon /></Button>
            )}
        </div>
    );
}

export default InputFilesUpload;