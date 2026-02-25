# LogiPro App

Aplicación web para gestión logística: pedidos, inventario, materiales, proveedores, reclamos y usuarios.

---

## Stack

| Capa      | Tecnología |
| --------- | ---------- |
| **Backend** | Java 17, Spring Boot 3, Spring Security, JPA |
| **Frontend** | React 19, Vite 7, Bootstrap 5, React Router |
| **Base de datos** | SQL (ver `db/`) |

---

## Estructura del repositorio

```
logiproApp/
├── logiproBackend/     # API REST (Spring Boot)
├── logiproFrontend/    # SPA (React + Vite)
├── db/                 # Scripts y esquema de base de datos
└── docs/               # Documentación del proyecto
```

---

## Cómo ejecutar

### Requisitos

- **Java 17** y **Maven**
- **Node.js** (v18+)
- Base de datos configurada (ver `logiproBackend/.../application.properties`)

### Backend

```bash
cd logiproBackend/logiproBackend
mvn spring-boot:run
```

La API suele quedar en `http://localhost:8080`.

### Frontend

```bash
cd logiproFrontend
npm install
npm run dev
```

La app se abre en la URL que indique Vite (por ejemplo `http://localhost:5173`).

---

## Módulos principales

- **Autenticación**: login, recuperación y cambio de contraseña
- **Dashboard**: vista principal
- **Usuarios**: ABM (solo rol ADMIN)
- **Proveedores**: listado, alta y edición
- **Reclamos**: listado y creación
- **Materiales**: listado, detalle, alta y edición
- **Inventario**: listado, alta y edición
- **Pedidos**: listado, creación y edición

---

## Repositorio

[github.com/jose19841/logiproApp](https://github.com/jose19841/logiproApp)

---

Proyecto desarrollado por **Jose Pereyra**.
