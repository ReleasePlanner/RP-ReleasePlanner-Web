import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#217346', // Excel green
			light: '#4fa676',
			dark: '#1b5c39',
		},
		secondary: {
			main: '#185ABD', // Office blue accent
		},
		background: {
			default: '#ffffff',
			paper: '#ffffff',
		},
	},
	shape: { borderRadius: 8 },
	components: {
		MuiButton: {
			styleOverrides: {
				root: { textTransform: 'none', fontWeight: 600 },
			},
		},
	},
});


