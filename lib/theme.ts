'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#111111',
    },
    secondary: {
      main: '#B8860B',
    },
    background: {
      default: '#f8f8f8',
      paper: '#ffffff',
    },
  },

  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 8,
  },
});

export default theme;
