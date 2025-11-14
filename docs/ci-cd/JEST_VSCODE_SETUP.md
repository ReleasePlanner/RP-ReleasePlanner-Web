# Configuración de Jest en VS Code para Coverage

Este documento explica cómo configurar y usar las extensiones de Jest en VS Code para visualizar y ejecutar coverage.

## Extensiones Recomendadas

Se han configurado las siguientes extensiones en `.vscode/extensions.json`:

1. **Jest (orta.vscode-jest)** - Extensión oficial de Jest
   - Ejecuta tests automáticamente
   - Muestra resultados inline
   - Muestra coverage en el editor

2. **Coverage Gutters (ryanluker.vscode-coverage-gutters)** - Visualización de coverage
   - Muestra líneas cubiertas/no cubiertas con colores
   - Resalta coverage en el gutter (margen izquierdo)
   - Muestra porcentajes de coverage

3. **Jest Runner (firsttris.vscode-jest-runner)** - Ejecutor de tests
   - Ejecuta tests individuales desde el editor
   - Botones "Run" y "Debug" sobre cada test
   - Ejecuta suites completas

## Instalación

### Opción 1: Instalación Automática (Recomendada)

1. Abre VS Code en el proyecto
2. VS Code detectará `.vscode/extensions.json` y sugerirá instalar las extensiones
3. Haz clic en "Install All" cuando aparezca la notificación

### Opción 2: Instalación Manual

1. Abre la paleta de comandos (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Escribe "Extensions: Install Extensions"
3. Busca e instala cada extensión:
   - `orta.vscode-jest`
   - `ryanluker.vscode-coverage-gutters`
   - `firsttris.vscode-jest-runner`

## Configuración

La configuración ya está en `.vscode/settings.json`. Incluye:

- **Jest auto-run**: Desactivado (para evitar ejecuciones automáticas)
- **Coverage on load**: Activado (muestra coverage al cargar)
- **Coverage colors**: Colores personalizados para coverage
- **Jest command**: Configurado para usar `npx nx test api --coverage`
- **Coverage file paths**: Configurado para encontrar archivos LCOV

## Uso

### 1. Generar Reporte de Coverage

```bash
# Generar coverage
npx nx test api --coverage

# Esto generará:
# - coverage/api/lcov.info (para Coverage Gutters)
# - coverage/api/index.html (reporte HTML completo)
```

### 2. Ver Coverage en el Editor

1. **Con Coverage Gutters:**
   - Ejecuta `npx nx test api --coverage`
   - Abre cualquier archivo `.ts` en `apps/api/src`
   - Verás colores en el gutter:
     - 🟢 Verde: Línea cubierta
     - 🔴 Rojo: Línea no cubierta
     - 🟡 Amarillo: Parcialmente cubierta

2. **Comando para mostrar/ocultar coverage:**
   - `Ctrl+Shift+P` → "Coverage Gutters: Display Coverage"
   - `Ctrl+Shift+P` → "Coverage Gutters: Hide Coverage"

### 3. Ejecutar Tests Individuales

**Con Jest Runner:**
- Abre cualquier archivo `.spec.ts`
- Verás botones "Run" y "Debug" sobre cada `describe` e `it`
- Haz clic para ejecutar solo ese test

**Con Jest Extension:**
- Abre cualquier archivo `.spec.ts`
- Verás indicadores inline (✓ o ✗) junto a cada test
- Haz clic en el indicador para ejecutar/re-ejecutar el test

### 4. Ver Reporte HTML Completo

```bash
# Generar coverage
npx nx test api --coverage

# Abrir reporte HTML (Windows)
start coverage/api/index.html

# Abrir reporte HTML (Mac)
open coverage/api/index.html

# Abrir reporte HTML (Linux)
xdg-open coverage/api/index.html
```

### 5. Panel de Jest en VS Code

1. Abre el panel de Jest (icono de probeta en la barra lateral)
2. Verás:
   - Lista de todos los tests
   - Estado de cada test (✓, ✗, ⏸)
   - Tiempo de ejecución
   - Opción para ejecutar todos los tests

### 6. Comandos Útiles

Abre la paleta de comandos (`Ctrl+Shift+P`) y busca:

- **"Jest: Start All Runners"** - Inicia el runner de Jest
- **"Jest: Stop All Runners"** - Detiene el runner de Jest
- **"Jest: Toggle Coverage"** - Muestra/oculta coverage
- **"Coverage Gutters: Display Coverage"** - Muestra coverage
- **"Coverage Gutters: Hide Coverage"** - Oculta coverage
- **"Coverage Gutters: Watch"** - Observa cambios en coverage

## Atajos de Teclado

Puedes configurar atajos personalizados en `keybindings.json`:

```json
[
  {
    "key": "ctrl+shift+c",
    "command": "coverage-gutters.displayCoverage"
  },
  {
    "key": "ctrl+shift+h",
    "command": "coverage-gutters.hideCoverage"
  },
  {
    "key": "ctrl+shift+j",
    "command": "jest.start"
  }
]
```

## Troubleshooting

### Coverage no se muestra

1. Verifica que el archivo `coverage/api/lcov.info` existe:
   ```bash
   npx nx test api --coverage
   ls coverage/api/lcov.info
   ```

2. Verifica la configuración en `.vscode/settings.json`

3. Recarga VS Code (`Ctrl+Shift+P` → "Developer: Reload Window")

### Tests no se ejecutan

1. Verifica que Jest está instalado:
   ```bash
   npx nx test api --version
   ```

2. Verifica la configuración de Jest en `apps/api/jest.config.cts`

3. Revisa la salida de Jest en VS Code (Panel de Output → Jest)

### Coverage Gutters no funciona

1. Asegúrate de que el archivo `lcov.info` existe después de ejecutar coverage
2. Verifica que la ruta en `coverage-gutters.coverageFileNames` es correcta
3. Ejecuta manualmente: `Ctrl+Shift+P` → "Coverage Gutters: Watch"

## Recursos Adicionales

- [Jest Extension Docs](https://github.com/jest-community/vscode-jest)
- [Coverage Gutters Docs](https://github.com/ryanluker/vscode-coverage-gutters)
- [Jest Runner Docs](https://github.com/firsttris/vscode-jest-runner)

## Comandos Rápidos

```bash
# Generar coverage y abrir reporte HTML
npx nx test api --coverage && start coverage/api/index.html

# Ejecutar tests en modo watch
npx nx test api --watch

# Ejecutar tests de un archivo específico
npx nx test api --testPathPattern=feature.service.spec
```

