import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
};

function ConfirmDeleteModal({ open, handleClose, onConfirm, productName }) {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2">
                    Confirmar Exclusão
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    Tem a certeza de que deseja excluir o produto "{productName}"? Esta ação não pode ser desfeita.
                </Typography>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button variant="outlined" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="contained" color="error" onClick={onConfirm}>
                        Excluir
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default ConfirmDeleteModal;