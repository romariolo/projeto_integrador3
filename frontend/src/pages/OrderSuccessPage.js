import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function OrderSuccessPage() {
    return (
        <Container>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    mt: 8,
                }}
            >
                <CheckCircleOutlineIcon sx={{ fontSize: 80 }} color="success" />
                <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
                    Pedido Realizado com Sucesso!
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Obrigado pela sua compra. Você pode acompanhar o status do seu pedido no seu painel.
                </Typography>
                <Button component={Link} to="/" variant="contained">
                    Continuar Comprando
                </Button>
            </Box>
        </Container>
    );
}

export default OrderSuccessPage;