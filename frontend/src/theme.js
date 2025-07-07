import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6C63FF', // soft purple
    },
    secondary: {
      main: '#00BFAE', // teal
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#22223B',
      secondary: '#4A4E69',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h5: {
      fontWeight: 700,
    },
  },
});

export default theme; 