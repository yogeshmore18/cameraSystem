import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { MenuItem, Modal, Paper, Select, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

const SelectedAreasList = ({ areas, issue, onDelete, onEdit }) => {
  const [editIndex, setEditIndex] = useState(null);
  const [newIssue, setNewIssue] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const handleEditClick = (index) => {
    setEditIndex(index);
    setNewIssue(issue[index]);
    setOpenModal(true);
  };

  const handleSaveClick = () => {
    onEdit(editIndex, newIssue);
    setOpenModal(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
          
              {areas.map((area, index) => (
                <TableRow key={index}>
                  <TableCell>Area {index + 1}</TableCell>
                  <TableCell>{issue[index]}</TableCell>
                  <TableCell>
                    <IconButton style={{ marginRight: '10px' }} onClick={() => onDelete(index)} aria-label="delete">
                      <DeleteForeverIcon sx={{ color: '#DD3B0C' }} />
                    </IconButton>
                    <IconButton aria-label="edit" onClick={() => handleEditClick(index)}>
                      <EditIcon color="secondary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            
            
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: 20 }}>
          <h4>Area {editIndex + 1}</h4>
          <Select
            value={newIssue}
            onChange={(event) => setNewIssue(event.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Select an issue' }}
            style={{ marginRight: 15 }}
          >
            <MenuItem value="" disabled>
              {newIssue === '' ? 'Select an issue' : ''}
            </MenuItem>
            <MenuItem value="Paint is too thick">Paint is too thick</MenuItem>
            <MenuItem value="Paint is too low">Paint is too low</MenuItem>
            <MenuItem value="Paint drops on selected part">Paint drops on selected part</MenuItem>
          </Select>
          <IconButton aria-label="save" onClick={handleSaveClick}>
            <SaveIcon color="primary" />
          </IconButton>
        </div>
      </Modal>
    </div>
  );
};

export default SelectedAreasList;
