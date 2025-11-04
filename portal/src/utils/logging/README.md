# Sistema de Logging y Error Handling - Release Planner

## 📋 Descripción

Este sistema integral proporciona capacidades de logging, manejo de errores y monitoreo de nivel empresarial para la aplicación Release Planner, siguiendo las mejores prácticas de desarrollo y observabilidad.

## 🏗️ Arquitectura del Sistema

### Componentes Principales

1. **Logger Central** (`Logger.ts`)

   - Logging estructurado con contexto
   - Múltiples transportes (consola, localStorage, servicios remotos)
   - IDs de correlación para trazabilidad
   - Manejo global de errores

2. **Error Boundary** (`ErrorBoundary.tsx`)

   - Captura errores de React en tiempo de ejecución
   - UI de recuperación con detalles técnicos
   - Reportes automáticos de errores
   - Integración con sistema de logging

3. **Sistema de Monitoreo** (`monitoring.ts`)

   - Métricas de rendimiento automáticas
   - Seguimiento de interacciones de usuario
   - Monitoreo de llamadas API
   - Web Vitals y Core Web Vitals

4. **Decoradores y Helpers** (`decorators.ts`)
   - Logging automático de métodos
   - Manejo de errores transparente
   - Reintentos con backoff exponencial
   - Auditoría de acciones de usuario

## 🚀 Configuración e Instalación

### Inicialización Básica

```typescript
import { loggingConfig } from "@/utils/logging";

// Configuración automática basada en el entorno
// Ya configurado en el índice principal

// Configuración manual si es necesario
if (process.env.NODE_ENV === "development") {
  loggingConfig.setupDevelopment();
} else {
  loggingConfig.setupProduction();
}

// Configurar contexto de usuario
loggingConfig.setUserContext("user-123", "session-456");
```

### Configuración de Error Boundary

```tsx
import { ErrorBoundary } from "@/utils/logging";

function App() {
  return (
    <ErrorBoundary
      component="App"
      showDetails={process.env.NODE_ENV === "development"}
      onError={(error, errorInfo) => {
        // Enviar a servicio de reporte de errores
        console.log("Error reported:", error, errorInfo);
      }}
    >
      <MyApplication />
    </ErrorBoundary>
  );
}
```

## 📝 Guías de Uso

### 1. Logging Básico

```typescript
import { logger } from "@/utils/logging";

// Logging con diferentes niveles
logger.debug("Información de depuración", { component: "MyComponent" });
logger.info("Usuario inició sesión", { userId: "123" });
logger.warn("Advertencia: límite casi alcanzado", { usage: 95 });
logger.error("Error al procesar solicitud", error, { requestId: "req-123" });
logger.fatal("Error crítico del sistema", error, { systemState: "failing" });

// Logger con contexto específico
const componentLogger = logger.child({
  component: "GanttChart",
  planId: "plan-456",
});

componentLogger.info("Gantt chart rendered successfully");
```

### 2. Manejo de Errores en Componentes

```tsx
import { ErrorBoundary, useErrorHandler } from "@/utils/logging";

// Usando Error Boundary
function MyComponent() {
  return (
    <ErrorBoundary component="MyComponent">
      <ComplexComponent />
    </ErrorBoundary>
  );
}

// Hook para manejo manual de errores
function MyFunctionalComponent() {
  const handleError = useErrorHandler();

  const handleAsyncOperation = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      handleError(error, {
        componentStack: "MyFunctionalComponent -> handleAsyncOperation",
      });
    }
  };
}

// HOC para wrapping automático
import { withErrorBoundary } from "@/utils/logging";

const SafeComponent = withErrorBoundary(MyComponent, {
  component: "MyComponent",
  showDetails: true,
});
```

### 3. Monitoreo y Métricas

```typescript
import {
  monitoring,
  trackUserClick,
  trackFormSubmission,
} from "@/utils/logging";

// Seguimiento automático de interacciones
function MyButton() {
  const handleClick = () => {
    trackUserClick("save-button", "PlanEditor", { planId: "plan-123" });
    // ... lógica del botón
  };

  return <button onClick={handleClick}>Save Plan</button>;
}

// Monitoreo de formularios
function MyForm() {
  const handleSubmit = async (formData) => {
    try {
      await submitForm(formData);
      trackFormSubmission("plan-form", "PlanEditor", true);
    } catch (error) {
      trackFormSubmission("plan-form", "PlanEditor", false);
      throw error;
    }
  };
}

// Métricas personalizadas
monitoring.trackMetric({
  name: "gantt_render_time",
  value: 245.3,
  unit: "ms",
  timestamp: new Date(),
  context: { phaseCount: 15, taskCount: 45 },
});
```

### 4. Monitoreo de APIs

```typescript
import { monitoring } from "@/utils/logging";

// Seguimiento manual de API
async function fetchPlans() {
  const startTime = performance.now();
  let success = false;

  try {
    const response = await fetch("/api/plans");
    success = response.ok;

    monitoring.trackApiCall({
      endpoint: "/api/plans",
      method: "GET",
      statusCode: response.status,
      duration: performance.now() - startTime,
      success,
    });

    return response.json();
  } catch (error) {
    monitoring.trackApiCall({
      endpoint: "/api/plans",
      method: "GET",
      statusCode: 0,
      duration: performance.now() - startTime,
      success: false,
      errorMessage: error.message,
    });
    throw error;
  }
}

// Con decorador (cuando esté disponible)
// @monitorApiCall('/api/plans', 'GET')
// async function fetchPlans() { ... }
```

### 5. Logging de Operaciones Asíncronas

```typescript
import { logUtils } from "@/utils/logging";

// Wrapper para operaciones async con logging automático
const result = await logUtils.logAsyncOperation(
  "loadPlanData",
  async () => {
    const plan = await fetchPlan(planId);
    const phases = await fetchPhases(planId);
    return { plan, phases };
  },
  { planId, userId: "user-123" }
);
```

## 🎯 Ejemplos de Implementación

### Ejemplo 1: Componente GanttChart con Logging Completo

```tsx
import React, { useEffect } from "react";
import {
  logger,
  ErrorBoundary,
  trackComponentMount,
  trackComponentUnmount,
  monitoring,
} from "@/utils/logging";

function GanttChart({ planId, phases }) {
  const componentLogger = logger.child({
    component: "GanttChart",
    planId,
  });

  useEffect(() => {
    trackComponentMount("GanttChart");
    componentLogger.info("GanttChart mounted", {
      metadata: { phaseCount: phases.length },
    });

    return () => {
      trackComponentUnmount("GanttChart");
      componentLogger.info("GanttChart unmounted");
    };
  }, []);

  const handlePhaseClick = (phase) => {
    componentLogger.debug("Phase clicked", {
      action: "phase_click",
      metadata: { phaseId: phase.id, phaseName: phase.name },
    });

    monitoring.trackUserInteraction({
      action: "phase_click",
      component: "GanttChart",
      metadata: { phaseId: phase.id },
    });
  };

  return (
    <ErrorBoundary component="GanttChart">
      <div className="gantt-chart">
        {phases.map((phase) => (
          <PhaseBar
            key={phase.id}
            phase={phase}
            onClick={() => handlePhaseClick(phase)}
          />
        ))}
      </div>
    </ErrorBoundary>
  );
}
```

### Ejemplo 2: Hook Personalizado con Logging

```typescript
import { useCallback, useEffect } from "react";
import { logger, monitoring } from "@/utils/logging";

function usePlanOperations(planId) {
  const hookLogger = logger.child({
    component: "usePlanOperations",
    planId,
  });

  const savePlan = useCallback(
    async (planData) => {
      const startTime = performance.now();

      try {
        hookLogger.info("Saving plan", {
          action: "save_plan",
          metadata: { planId, fieldsCount: Object.keys(planData).length },
        });

        const response = await fetch(`/api/plans/${planId}`, {
          method: "PUT",
          body: JSON.stringify(planData),
        });

        if (!response.ok) {
          throw new Error(`Save failed: ${response.statusText}`);
        }

        const duration = performance.now() - startTime;
        hookLogger.info("Plan saved successfully", {
          metadata: { duration: `${duration.toFixed(2)}ms` },
        });

        monitoring.trackApiCall({
          endpoint: `/api/plans/${planId}`,
          method: "PUT",
          statusCode: response.status,
          duration,
          success: true,
        });

        return response.json();
      } catch (error) {
        const duration = performance.now() - startTime;
        hookLogger.error("Failed to save plan", error, {
          metadata: { duration: `${duration.toFixed(2)}ms` },
        });

        monitoring.trackApiCall({
          endpoint: `/api/plans/${planId}`,
          method: "PUT",
          statusCode: 0,
          duration,
          success: false,
          errorMessage: error.message,
        });

        throw error;
      }
    },
    [planId]
  );

  return { savePlan };
}
```

### Ejemplo 3: Manejo de Errores en Redux

```typescript
import { createAsyncThunk } from "@reduxjs/toolkit";
import { logger, monitoring } from "@/utils/logging";

export const fetchPlanData = createAsyncThunk(
  "plans/fetchPlanData",
  async (planId: string, { rejectWithValue }) => {
    const thunkLogger = logger.child({
      component: "Redux/fetchPlanData",
      planId,
      action: "async_thunk",
    });

    try {
      thunkLogger.info("Starting plan data fetch");

      const response = await fetch(`/api/plans/${planId}`);

      if (!response.ok) {
        const error = new Error(
          `HTTP ${response.status}: ${response.statusText}`
        );
        thunkLogger.error("Plan fetch failed", error);

        monitoring.trackApiCall({
          endpoint: `/api/plans/${planId}`,
          method: "GET",
          statusCode: response.status,
          duration: 0, // Would need to track properly
          success: false,
          errorMessage: error.message,
        });

        return rejectWithValue(error.message);
      }

      const data = await response.json();
      thunkLogger.info("Plan data fetched successfully", {
        metadata: {
          phaseCount: data.phases?.length,
          taskCount: data.tasks?.length,
        },
      });

      return data;
    } catch (error) {
      thunkLogger.error("Unexpected error during plan fetch", error);
      return rejectWithValue(error.message);
    }
  }
);
```

## 🔍 Debugging y Monitoreo

### Acceso a Logs en Desarrollo

```typescript
import { logger, monitoring } from "@/utils/logging";

// Ver logs almacenados
console.log("Stored logs:", logger.getLogs());

// Ver métricas de rendimiento
console.log("Performance metrics:", monitoring.getMetricsSummary());

// Limpiar logs
logger.clearLogs();
```

### Configuración para Producción

```typescript
// Configurar transporte personalizado para servicios externos
logger.addTransport({
  name: "remote",
  log: async (entry) => {
    if (entry.level === "error" || entry.level === "fatal") {
      // Enviar solo errores críticos a servicio externo
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
    }
  },
});
```

## 📊 Métricas y Alertas

### Métricas Automáticas Recolectadas

- **Rendimiento**: Tiempo de carga, renderizado de componentes
- **Errores**: Frecuencia, tipos, contexto de errores
- **Interacciones**: Clicks, envíos de formularios, navegación
- **APIs**: Latencia, tasa de éxito/error, endpoints más utilizados
- **Memoria**: Uso de heap JavaScript
- **Web Vitals**: FCP, LCP, CLS, FID

### Configuración de Alertas (Ejemplo)

```typescript
// Monitor para detectar patrones problemáticos
setInterval(() => {
  const metrics = monitoring.getMetricsSummary();

  // Alerta por alta latencia de API
  if (metrics.api_call && metrics.api_call.average > 3000) {
    logger.warn("High API latency detected", {
      metadata: { averageLatency: metrics.api_call.average },
    });
  }

  // Alerta por muchos errores
  const errorLogs = logger.getLogs().filter(
    (log) =>
      log.level === "error" &&
      Date.now() - log.timestamp.getTime() < 5 * 60 * 1000 // últimos 5 min
  );

  if (errorLogs.length > 10) {
    logger.fatal("High error rate detected", undefined, {
      metadata: { errorCount: errorLogs.length },
    });
  }
}, 60000); // Cada minuto
```

## 🔒 Consideraciones de Seguridad

- **Sanitización**: Datos sensibles se redactan automáticamente
- **Almacenamiento Local**: Solo logs de desarrollo, no en producción
- **Transporte Seguro**: HTTPS para envío de logs a servicios externos
- **PII**: No se registra información personal identificable
- **Rate Limiting**: Prevención de spam de logs

## 🚀 Próximas Mejoras

1. **Integración con Sentry/DataDog**: Para monitoreo de producción
2. **Source Maps**: Para stack traces legibles en producción
3. **Real User Monitoring**: Métricas de usuarios reales
4. **Alertas Inteligentes**: ML para detección de anomalías
5. **Dashboard**: Panel de control para métricas en tiempo real

Este sistema proporciona una base sólida para observabilidad y debugging, siguiendo las mejores prácticas de la industria para aplicaciones web modernas.
