# 📱 Release Planner Mobile App

Aplicación móvil React Native para Release Planner, construida con Expo y siguiendo las mejores prácticas de React Native.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Expo CLI (instalado globalmente o vía npx)
- Para desarrollo iOS: Xcode y CocoaPods
- Para desarrollo Android: Android Studio y Android SDK

### Instalación

```bash
# Instalar dependencias del monorepo
npm install

# Instalar dependencias específicas de la app móvil
cd apps/mobile
npm install
```

### Desarrollo

```bash
# Desde la raíz del monorepo
nx start mobile

# O directamente
cd apps/mobile
npx expo start
```

### Ejecutar en dispositivos

```bash
# iOS Simulator
nx run-ios mobile

# Android Emulator
nx run-android mobile

# Escanear QR con Expo Go (dispositivo físico)
nx start mobile
```

## 📁 Estructura del Proyecto

```
apps/mobile/
├── src/
│   ├── app/              # Entry point y App component
│   ├── features/         # Features organizados por dominio
│   │   ├── auth/         # Autenticación
│   │   ├── plans/        # Release Plans
│   │   ├── products/     # Products
│   │   ├── features/     # Features
│   │   └── settings/     # Configuración
│   ├── navigation/       # Configuración de navegación
│   ├── api/              # Cliente API y servicios
│   │   ├── httpClient.ts # Cliente HTTP adaptado para RN
│   │   └── services/     # Servicios API
│   └── components/       # Componentes compartidos
├── assets/               # Imágenes, fuentes, etc.
└── app.json             # Configuración Expo
```

## 🎯 Características

- ✅ **React Navigation v6** - Navegación type-safe
- ✅ **React Query** - Gestión de estado del servidor
- ✅ **Autenticación** - Login/Register con JWT
- ✅ **Cliente HTTP** - Adaptado para React Native con retry y refresh token
- ✅ **TypeScript** - Type safety completo
- ✅ **Expo SDK 53** - Última versión estable
- ✅ **React Native 0.79** - Nueva arquitectura habilitada

## 🔧 Configuración

### Variables de Entorno

Para configurar la URL del API, edita `apps/mobile/app.json`:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:3000/api"
    }
  }
}
```

Para Android emulator, usa `http://10.0.2.2:3000/api` en lugar de `localhost`.

Para dispositivos físicos, usa la IP de tu máquina: `http://192.168.x.x:3000/api`.

## 📦 Dependencias Principales

- `@react-navigation/native` - Navegación
- `@tanstack/react-query` - Data fetching
- `@react-native-async-storage/async-storage` - Almacenamiento local
- `expo` - Framework Expo
- `react-native` - Framework React Native

## 🏗️ Build

### Desarrollo

```bash
nx build mobile
```

### Producción

```bash
# iOS
nx build mobile --platform ios

# Android
nx build mobile --platform android
```

### EAS Build (Recomendado)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Build para producción
eas build --platform ios
eas build --platform android
```

## 🧪 Testing

```bash
# Ejecutar tests
nx test mobile

# Tests con coverage
nx test mobile --coverage
```

## 📝 Próximos Pasos

1. Implementar screens de Plans, Products, Features
2. Agregar componentes de UI compartidos
3. Implementar offline support con React Query
4. Agregar notificaciones push
5. Implementar deep linking
6. Agregar analytics

## 📚 Documentación

- [Arquitectura Mobile](./docs/mobile/MOBILE_ARCHITECTURE.md)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Query](https://tanstack.com/query/latest)

