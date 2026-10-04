# Perspectiva

**Menos ruido. Más pensamiento.**

Primera versión funcional de una comunidad de conversaciones sobre actualidad, tecnología, aprendizaje, espiritualidad y desarrollo.

## Stack

- React
- Vite
- Lucide React
- CSS puro, responsive

## Ejecutar localmente

```bash
npm install
npm run dev
```

Para producción:

```bash
npm run build
npm run preview
```

El build final se genera en `dist/`.

## Qué incluye esta V1

- Landing/home de comunidad
- Navegación por temas
- Feed de conversaciones
- Tendencias
- Búsqueda local
- Publicación de nuevas conversaciones
- Página individual de conversación
- Comentarios funcionales en memoria
- Likes/reacciones
- Guardado de publicaciones
- Diseño responsive para desktop/tablet/mobile
- Estados vacíos y feedback visual
- Arquitectura preparada para conectar posteriormente backend, autenticación y base de datos

## Nota

Esta V1 utiliza datos locales en memoria para demostrar el producto y el flujo completo. Al recargar el navegador, los cambios locales se reinician.

### Próxima evolución recomendada

1. Backend + PostgreSQL
2. Autenticación
3. Perfiles
4. Persistencia real de posts/comentarios/guardados
5. Moderación y reportes
6. Sistema de reputación
7. Notificaciones
8. SEO y páginas públicas
9. Deploy
