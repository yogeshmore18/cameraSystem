import React, { useState } from "react";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Button from '@mui/material/Button';

const Alerts = ({ AlertMessage }) => {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    console.log("Alertttttttttt");

    return (
        <>
            {open && (
                <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                    {AlertMessage}
                    <Button onClick={handleClose} color="inherit" size="small">
                        OK
                    </Button>
                </Alert>
            )}
        </>
    );
}

export default Alerts;
