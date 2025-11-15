# Mobile App Architecture - React Native Best Practices

## 📱 Estructura Propuesta

```
apps/mobile/
├── src/
│   ├── app/                    # Entry point y App component
│   ├── features/               # Features organizados por dominio
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── screens/
│   │   │   ├── hooks/
│   │   │   └── services/
│   │   ├── plans/
│   │   ├── products/
│   │   ├── features/
│   │   └── ...
│   ├── navigation/             # Configuración de navegación
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── types.ts
│   ├── components/             # Componentes compartidos
│   │   ├── ui/                 # Componentes básicos de UI
│   │   ├── layout/             # Componentes de layout
│   │   └── common/             # Componentes comunes
│   ├── api/                    # Cliente API compartido con portal
│   │   ├── httpClient.ts       # Cliente HTTP reutilizable
│   │   ├── services/           # Servicios API (compartidos)
│   │   └── hooks/             # React Query hooks (compartidos)
│   ├── store/                  # Estado global (si es necesario)
│   ├── theme/                  # Tema y estilos
│   ├── utils/                  # Utilidades
│   └── constants/              # Constantes
├── assets/                     # Imágenes, fuentes, etc.
└── app.json                    # Configuración Expo
```

## 🎯 Mejores Prácticas Implementadas

### 1. **Arquitectura Feature-Based**
- Cada feature es independiente y autocontenida
- Fácil de escalar y mantener
- Permite lazy loading de features

### 2. **Código Compartido con Portal**
- API services compartidos desde `apps/portal/src/api`
- Types compartidos desde `libs/shared/types`
- Utils compartidos desde `libs/shared/utils`

### 3. **Navegación Moderna**
- React Navigation v6+ (última versión)
- Type-safe navigation
- Deep linking configurado

### 4. **Estado y Data Fetching**
- React Query para server state
- Context API para UI state
- Redux solo si es necesario (compartido con portal)

### 5. **Styling**
- StyleSheet API de React Native
- Tema centralizado
- Soporte para dark mode

### 6. **TypeScript**
- Type safety completo
- Path aliases configurados
- Tipos compartidos con portal

## 📦 Dependencias Recomendadas

```json
{
  "@react-navigation/native": "^6.x",
  "@react-navigation/native-stack": "^6.x",
  "@react-navigation/bottom-tabs": "^6.x",
  "@tanstack/react-query": "^5.x", // Compartido con portal
  "react-native-safe-area-context": "^4.x",
  "react-native-screens": "^3.x",
  "react-native-gesture-handler": "^2.x",
  "expo-router": "^3.x", // Opcional: File-based routing
  "@react-native-async-storage/async-storage": "^1.x",
  "react-native-reanimated": "^3.x",
  "react-native-vector-icons": "^10.x"
}
```

## 🚀 Comandos Nx

```bash
# Desarrollo
nx start mobile                    # Iniciar Expo dev server
nx run-ios mobile                  # Ejecutar en iOS simulator
nx run-android mobile              # Ejecutar en Android emulator

# Build
nx build mobile                    # Build para producción
nx prebuild mobile                 # Generar código nativo

# Testing
nx test mobile                     # Ejecutar tests
nx lint mobile                     # Linter
```

## 🔄 Integración con Portal

### Compartir API Services
```typescript
// apps/mobile/src/api/httpClient.ts
// Reutiliza el mismo cliente HTTP del portal
export { httpClient } from '../../portal/src/api/httpClient';
```

### Compartir Hooks
```typescript
// apps/mobile/src/api/hooks/index.ts
// Reutiliza los hooks de React Query del portal
export * from '../../portal/src/api/hooks';
```

### Compartir Types
```typescript
// apps/mobile/src/types/index.ts
export * from '@rp-release-planner/shared/types';
```

## 📱 Features Principales

1. **Autenticación**
   - Login/Register screens
   - Token management
   - Auto-refresh tokens

2. **Release Plans**
   - Lista de planes
   - Detalle de plan
   - Crear/editar planes
   - Vista Gantt simplificada

3. **Mantenimientos**
   - Products
   - Features
   - Phases
   - Calendars
   - IT Owners

4. **Offline Support**
   - Cache con React Query
   - Sync cuando vuelve online

## 🎨 UI/UX

- Material Design 3 para Android
- Human Interface Guidelines para iOS
- Componentes adaptativos según plataforma
- Animaciones fluidas con Reanimated

## 📊 Performance

- Lazy loading de screens
- Image optimization
- Code splitting por feature
- Memoización de componentes pesados

