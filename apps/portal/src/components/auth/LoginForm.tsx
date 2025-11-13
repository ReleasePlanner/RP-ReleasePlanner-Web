/**
 * Login Form Component
 */
import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  Paper,
} from '@mui/material';
import { useLogin } from '../../api/hooks/useAuth';
import { getErrorMessage, getErrorTitle } from '../../utils/notifications/errorNotification';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login.mutateAsync({ username, password });
      onSuccess?.();
    } catch (error) {
      // Error is handled by the hook and logged
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Iniciar Sesión
      </Typography>

      {login.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="subtitle2">{getErrorTitle(login.error)}</Typography>
          <Typography variant="body2">{getErrorMessage(login.error)}</Typography>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Usuario o Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          required
          autoComplete="username"
          disabled={login.isPending}
        />

        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
          autoComplete="current-password"
          disabled={login.isPending}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={login.isPending || !username || !password}
        >
          {login.isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>

        {onSwitchToRegister && (
          <Box textAlign="center">
            <Typography variant="body2">
              ¿No tienes cuenta?{' '}
              <Link
                component="button"
                type="button"
                onClick={onSwitchToRegister}
                sx={{ cursor: 'pointer' }}
              >
                Regístrate aquí
              </Link>
            </Typography>
          </Box>
        )}
      </form>
    </Paper>
  );
}

