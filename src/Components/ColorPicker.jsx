import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';


const ColorPickerModal = ({ onColorChange }) => {

  const [color, setColor] = useState("beige");
  const [openModal, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const handleColorChange = (color) => {
    setColor(color.hex)
    onColorChange(color.hex)
  }

  return (
    <>
      <h4>Color picker for model </h4>

      {/* <h6>coming soon....</h6> */}
      <div style={{ display: 'flex' }}>
        <h5><strong>Color:</strong></h5>
        <Button onClick={() => {
          onColorChange("beige");
          setColor("beige")
        }} style={{ color: 'black', textTransform: 'none' }}>Default </Button>
        <Button onClick={handleOpenModal}><div style={{ marginLeft: '10px', width: '25px', height: '25px', border: '1px solid black', backgroundColor: color }} /></Button>
        <div>
          <Modal
            open={openModal}
            onClose={handleModalClose}
          >
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
              <h3>Select color: </h3>
              <ChromePicker color={color} onChange={handleColorChange} />
              <Button onClick={handleModalClose}>Ok</Button>
              <Button onClick={() => {
                handleModalClose()
              }}>cancle</Button>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ColorPickerModal;
