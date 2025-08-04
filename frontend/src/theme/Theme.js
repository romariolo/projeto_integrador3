// frontend/src/theme/Theme.js

import { createTheme } from '@mui/material/styles';

// Vamos definir uma paleta de cores inspirada em tons de feiras e produtos naturais.
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Um verde mais escuro e sóbrio
    },
    secondary: {
      main: '#FFA000', // Um tom de laranja/âmbar
    },
    background: {
      default: '#F5F5F5', // Um cinzento muito claro para o fundo
      paper: '#FFFFFF',   // O fundo dos cards e modais continua branco
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Botões com cantos mais arredondados
          textTransform: 'none', // Texto dos botões sem ser tudo em maiúsculas
        },
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 12, // Cards com cantos mais arredondados
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }
        }
    }
  },
});

export default theme;