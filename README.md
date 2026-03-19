# Lab 06 - Cliente React para Blueprints

Este repositorio corresponde a la solucion del **Lab 06 de ARSW**.  
La idea del laboratorio fue construir un cliente moderno en React para consumir el backend de Blueprints de los labs anteriores (Lab 4 y Lab 5), aplicando arquitectura limpia, manejo de estado global y buenas practicas de calidad.

---

## 1. Objetivo del laboratorio

Desarrollar una SPA que permita:

- consultar blueprints por autor,
- abrir y visualizar blueprints en un canvas,
- crear, actualizar y eliminar blueprints,
- autenticar usuarios con JWT,
- manejar estados de carga y errores en UI,
- incluir pruebas y pipeline de CI.

---

## 2. Stack tecnologico usado

- **React 18 + Vite**
- **Redux Toolkit + React Redux**
- **React Router**
- **Axios** con interceptores JWT
- **Vitest + Testing Library**
- **ESLint + Prettier**
- **GitHub Actions** (lint + test + build)

---

## 3. Arquitectura del frontend

La aplicacion sigue una separacion por capas:

1. **UI (pages/components)**: renderiza vistas y captura eventos del usuario.
2. **Estado global (Redux slice)**: concentra reglas de negocio del cliente y estados async.
3. **Servicios**: capa de acceso a datos (`apimock` o `apiclient`) con interfaz comun.
4. **API backend**: endpoints REST del proyecto Blueprints.

Flujo general:

`UI -> dispatch(thunk) -> blueprintsSlice -> blueprintsService -> apiclient/apimock -> backend/mock -> Redux -> UI`

---

## 4. Estructura principal del proyecto

```text
src/
├─ components/
│  ├─ BlueprintCanvas.jsx
│  ├─ BlueprintForm.jsx
│  └─ PrivateRoute.jsx
├─ features/blueprints/
│  └─ blueprintsSlice.js
├─ pages/
│  ├─ BlueprintsPage.jsx
│  ├─ BlueprintDetailPage.jsx
│  ├─ CreateBlueprintPage.jsx
│  ├─ LoginPage.jsx
│  └─ NotFound.jsx
├─ services/
│  ├─ apiClient.js
│  ├─ apiclient.js
│  ├─ apimock.js
│  ├─ authStorage.js
│  └─ blueprintsService.js
├─ store/index.js
├─ App.jsx
└─ styles.css
```

---

## 5. Variables de entorno

Copiar el archivo de ejemplo y ajustar segun el entorno local:

```bash
cp .env.example .env
```

Contenido esperado:

```env
VITE_API_BASE_URL=http://localhost:8081
VITE_BLUEPRINTS_PATH=/api/v1/blueprints
VITE_AUTH_PATH=/auth/login
VITE_USE_MOCK=false
```

### Significado

- `VITE_API_BASE_URL`: host del backend.
- `VITE_BLUEPRINTS_PATH`: ruta base de blueprints.
- `VITE_AUTH_PATH`: endpoint de login.
- `VITE_USE_MOCK`: cambia entre API real (`false`) y mock en memoria (`true`).

---

## 6. Funcionalidades implementadas

### 6.1 Consulta y visualizacion de blueprints

- Busqueda por autor.
- Tabla de resultados con nombre y numero de puntos.
- Boton **Abrir** para cargar blueprint seleccionado.
- Render del blueprint en `canvas` (lineas + puntos).

### 6.2 Canvas y dibujo interactivo

- `BlueprintCanvas` dibuja grilla y puntos.
- En vista de creacion se puede agregar puntos haciendo click en el canvas.
- Boton para limpiar puntos antes de guardar.

### 6.3 Autenticacion JWT

- Pantalla de login (`/login`).
- Soporte para respuesta con `token` o `access_token`.
- Token almacenado en `localStorage`.
- Interceptor agrega `Authorization: Bearer <token>`.
- Cierre de sesion desde la barra de navegacion.

### 6.4 Rutas protegidas

- Componente `PrivateRoute` implementado.
- Ruta de creacion protegida.
- Si no hay sesion, el usuario se redirige a login.

### 6.5 CRUD completo

Se implementaron operaciones en UI + slice + servicios:

- **Create**: crear blueprint nuevo.
- **Read**: consultar por autor y consultar blueprint por autor/nombre.
- **Update**:
  - agregar punto (`PUT .../points`)
  - actualizar blueprint completo (`PUT /api/v1/blueprints/{author}/{name}`)
- **Delete**: eliminar blueprint desde tabla.

### 6.6 Optimistic updates + rollback

Para mejorar UX:

- En **update** y **delete** se aplica actualizacion optimista en Redux.
- Si el backend falla, se revierte automaticamente al estado anterior.

### 6.7 Manejo de estados y errores

- Estados `loading/succeeded/failed` por thunk.
- Mensajes de error claros en UI.
- Boton **Reintentar** cuando falla consulta de autor.

### 6.8 Redux avanzado

- Slice con estados por operacion (`authors`, `byAuthor`, `current`, `create`, `appendPoint`, `update`, `delete`).
- Selector memoizado para top-5 de blueprints por cantidad de puntos.
- Render del top-5 en la pagina principal.

---

## 7. Endpoints esperados del backend

El frontend trabaja con el backend del Lab 5 (seguridad + API versionada):

- `POST /auth/login`
- `GET /api/v1/blueprints`
- `GET /api/v1/blueprints/{author}`
- `GET /api/v1/blueprints/{author}/{name}`
- `POST /api/v1/blueprints`
- `PUT /api/v1/blueprints/{author}/{name}`
- `PUT /api/v1/blueprints/{author}/{name}/points`
- `DELETE /api/v1/blueprints/{author}/{name}`

---

## 8. Como ejecutar el proyecto

### 8.1 Instalar dependencias

```bash
npm install
```

### 8.2 Configurar entorno

```bash
cp .env.example .env
```

### 8.3 Levantar frontend

```bash
npm run dev
```

Frontend:

- `http://localhost:5173`

Backend esperado:

- `http://localhost:8081`

---

## 9. Pruebas y calidad

### Ejecutar pruebas

```bash
npm test
```

### Ejecutar lint

```bash
npm run lint
```

### Build de produccion

```bash
npm run build
```

Actualmente hay pruebas unitarias para:

- render de canvas,
- formulario,
- interaccion basica de la pagina principal,
- reducers y selectores del slice,
- escenarios de optimistic update/rollback.

---

## 10. CI con GitHub Actions

Se agrego workflow en `.github/workflows/ci.yml` que ejecuta:

1. instalacion de dependencias,
2. lint,
3. pruebas,
4. build.

Esto ayuda a validar automaticamente la calidad del codigo antes de integrar cambios.

---

## 11. Estado final del laboratorio

En esta entrega se completo el laboratorio con:

- arquitectura modular por capas,
- conmutacion entre mock y API real,
- autenticacion JWT funcional,
- rutas protegidas,
- CRUD completo,
- optimistic updates con rollback,
- manejo de errores y retry,
- pruebas automatizadas,

