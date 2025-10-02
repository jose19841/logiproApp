Contexto:
- Monorepo LogiPro con logiproBackend (Spring Boot) y logiproFrontend (React + Vite).
- Ignorar: node_modules, dist, build, target, .git, .idea, .vscode.
Reglas de trabajo:
- Editar UN (1) archivo por vez.
- Mostrar PLAN y luego DIFF completo antes de escribir.
- Esperar confirmación explícita antes de aplicar cambios (/apply).
- No crear carpetas nuevas salvo que lo solicite.
- Mensajes de commit con Conventional Commits.
- Usar rama de trabajo (ej.: chore/ai-edit).

6.1. Arranque seguro (sin escribir nada):
Contexto: monorepo con logiproBackend (Spring Boot) y logiproFrontend (React+Vite).
Ignorá node_modules, target, dist, .git.
Reglas: Un archivo por vez. Mostrá PLAN + DIFF antes de escribir. Esperá confirmación.
Tarea: Leé el árbol y generá un mapa del repo (módulos, entrypoints, tests). NO escribas todavía.
6.2. Propuesta de arquitectura de carpetas (solo plan):
Proponé una arquitectura por DDD para el backend (domain, application/usecases, infrastructure, config/security) 
y por features para el frontend (modules/login, modules/users, shared/...).
Mostrá PLAN y árbol propuesto. NO escribas nada hasta aprobar.
6.3. Refactor controlado del frontend (LoginPage.jsx como ejemplo):
Objetivo: refactor mínimo y reversible de LoginPage.jsx.
Primero: checklist de mejoras (accesibilidad, estado, separación de responsabilidades).
Después: escribí SOLO src/modules/login/pages/LoginPage.jsx. Mostrá diff y esperá confirmación.
6.4. Creación de módulo backend sin romper nada (p. ej., Proveedor):
Según docs/sprints/Sprint2.pdf y db/schema.sql, proponé PLAN para módulo Proveedor:
- Entidad, Repository, Service, Controller, DTOs y test unitario.
Primera escritura: SOLO src/main/java/.../domain/Proveedor.java. Mostrá diff y esperá confirmación.
6.5. Revisión backend (sin escribir):
Leé AuthController, JwtService, JwtAuthFilter, RefreshTokenService y UsuarioRepository.
Identificá riesgos y mejoras sin romper funcionalidad.
Entregá checklist priorizado. NO escribas todavía
