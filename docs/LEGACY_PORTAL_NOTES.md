# Notas sobre el Portal Legacy

## ⚠️ Información Importante

El directorio `portal/` en la raíz del proyecto es código legacy/pre-migración que se mantiene temporalmente como referencia.

**La aplicación activa está en `apps/portal/`** que forma parte del monorepo Nx.

## 📁 Estructura Actual

```
proyecto/
├── apps/
│   ├── portal/          ← ✅ CÓDIGO ACTIVO (monorepo Nx)
│   └── api/             ← ✅ API activa
├── portal/              ← ⚠️ CÓDIGO LEGACY (ignorado por Nx)
└── docs/                ← ✅ Documentación centralizada
```

## 🔄 Migración Completada

El código del portal fue migrado de `portal/` a `apps/portal/` como parte de la migración a monorepo Nx.

### Características del Portal Activo (`apps/portal/`)

- ✅ Integrado con monorepo Nx
- ✅ Dockerfiles para producción
- ✅ Configuración de CI/CD
- ✅ Integración con API
- ✅ Autenticación JWT implementada
- ✅ Tests configurados
- ✅ Build optimizado

### Estado del Portal Legacy (`portal/`)

- ⚠️ Ignorado por Nx (`.nxignore`)
- ⚠️ Código antiguo/pre-migración
- ⚠️ Puede ser eliminado después de verificar que no hay código único

## 📝 Documentación Legacy

Si necesitas consultar documentación del portal legacy, está disponible en `portal/docs/`. Sin embargo, la documentación activa y actualizada está en `docs/`.

## 🗑️ Eliminación del Portal Legacy

Antes de eliminar `portal/`:

1. ✅ Verificar que no hay código único que no esté en `apps/portal/`
2. ✅ Mover documentación útil a `docs/` si es necesario
3. ✅ Verificar que no hay referencias en otros archivos
4. ✅ Hacer backup si es necesario

Una vez verificados estos puntos, `portal/` puede ser eliminado de forma segura.

