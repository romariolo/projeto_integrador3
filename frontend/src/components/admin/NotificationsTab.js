import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, List, ListItem, ListItemText } from '@mui/material';

function NotificationsTab() {
  const [pendingSales, setPendingSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingSales = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/sales/pending');
        if (!response.ok) {
          throw new Error('Erro ao buscar vendas pendentes');
        }
        const data = await response.json();
        setPendingSales(data.sales || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingSales();
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Notificações
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error">Erro: {error}</Typography>
      )}

      {!loading && pendingSales.length === 0 && (
        <Typography>Você ainda não tem notificações.</Typography>
      )}

      <List>
        {pendingSales.map((sale) => (
          <ListItem key={sale.id} divider>
            <ListItemText
              primary={`Produto: ${sale.productName}`}
              secondary={`Comprador: ${sale.buyerName} | Status: Pendente`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default NotificationsTab;
