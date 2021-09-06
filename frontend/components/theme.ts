import { createTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      dark: '#00796B',
      light: '#B2DFDB',
      main: '#009688',
      contrastText: '#212121'
    },
    secondary: {
      main: '#757575',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#FFFFFF',
    },
  },
});

export default theme;
