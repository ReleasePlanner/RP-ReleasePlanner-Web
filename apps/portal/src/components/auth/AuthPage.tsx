/**
 * Auth Page Component
 * 
 * Combined login/register page with tab switching
 */
import { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useNavigate } from 'react-router-dom';

type AuthTab = 'login' | 'register';

export function AuthPage() {
  const [tab, setTab] = useState<AuthTab>('login');
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Redirect to home after successful auth
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          centered
        >
          <Tab label="Iniciar Sesión" value="login" />
          <Tab label="Registrarse" value="register" />
        </Tabs>
      </Box>

      {tab === 'login' ? (
        <LoginForm
          onSuccess={handleSuccess}
          onSwitchToRegister={() => setTab('register')}
        />
      ) : (
        <RegisterForm
          onSuccess={handleSuccess}
          onSwitchToLogin={() => setTab('login')}
        />
      )}
    </Box>
  );
}

