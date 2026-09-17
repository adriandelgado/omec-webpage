# Administración OMEC

El CMS vive en `/admin`. La interfaz, las validaciones y los avisos están en español. No hay registro público, recuperación por correo ni API CRUD externa.

## Preparación

1. Haz una copia de seguridad de libSQL y prueba las migraciones sobre esa copia.
2. Configura `DATABASE_URL` y, para Turso, `DATABASE_AUTH_TOKEN`.
3. Genera dos claves independientes con `openssl rand -hex 32`. Configura `AUTH_PASSWORD_PEPPERS` y `AUTH_TOTP_ENCRYPTION_KEYS` como JSON: `{"current":"v1","keys":{"v1":"CLAVE_HEXADECIMAL_DE_64_CARACTERES"}}`. Usa secretos de Wrangler en producción.
4. Ejecuta `pnpm db:migrate`. Las noticias existentes se migran como publicadas y sin cuenta propietaria; las imágenes incluidas siguen funcionando.
5. Configura `ADMIN_BOOTSTRAP_EMAIL`, `ADMIN_BOOTSTRAP_NAME` y `ADMIN_BOOTSTRAP_PASSWORD` (12–128 caracteres). Ejecuta `pnpm admin:bootstrap`. Si ya existe cualquier superadministrador, el comando no crea otra cuenta. Elimina después las variables de bootstrap.
6. Crea el bucket privado `omec-media` y confirma el binding `MEDIA_BUCKET` de `wrangler.jsonc`. No actives el dominio público de R2. Ejecuta `pnpm gen` para regenerar los tipos de plataforma.
7. Entra en `/admin/iniciar-sesion` y cambia la contraseña temporal.

No se ejecutan migraciones ni se crean cuentas durante una petición HTTP. El despliegue requiere aplicar las migraciones antes de servir el nuevo código.

## Permisos

| Rol                | Acceso                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| Superadministrador | Contenido, noticias, medios, mensajes, cuentas, auditoría y eliminación definitiva de medios            |
| Administrador      | Contenido, todas las noticias, medios y mensajes                                                        |
| Editor             | Sus propias noticias; consulta y carga de medios compartidos; archivo de cargas propias sin referencias |

La firma pública de una noticia no identifica a su propietario. Un administrador puede asignar las noticias antiguas a una cuenta. Un editor no puede modificar noticias sin propietario.

Las páginas se guardan explícitamente y sus cambios se publican inmediatamente. Las noticias solo se muestran con estado publicado y fecha de publicación. Los enlaces anteriores de una noticia publicada redirigen permanentemente a su enlace actual; una noticia archivada o en borrador devuelve 404.

Las colecciones se archivan, no se borran. Al restaurar se conserva la posición si está libre y se utiliza el final de la sección si está ocupada. Los campos de posición y los controles Subir/Bajar permiten ordenar. Las relaciones se validan dentro de la transacción de escritura. Los mensajes recibidos solo permiten cambiar su estado; no hay respuesta desde el CMS.

Cada mutación de contenido y su auditoría se confirman juntas. Una versión `updated_at` obsoleta produce un conflicto en español. La base de datos impide modificar o borrar auditorías y desactivar al último superadministrador activo.

## Autenticación

Las contraseñas se preprocesan mediante HMAC-SHA256 con un pepper del servidor y se derivan con PBKDF2-HMAC-SHA256: exactamente 100 000 iteraciones, sal aleatoria de 128 bits y clave de 256 bits. Este límite es deliberado y está documentado en [workerd #1346](https://github.com/cloudflare/workerd/issues/1346). El formato contiene versión, algoritmo, iteraciones, versión de pepper, sal y clave derivada. La comparación recorre todos los bytes.

Para rotar un pepper, añade una nueva clave y cambia `current`, conservando las anteriores hasta que todas las cuentas se hayan autenticado y actualizado sus hashes. No retires claves antiguas de cifrado TOTP mientras existan secretos cifrados con ellas. Las claves nunca se guardan en la base de datos.

Las sesiones contienen tokens aleatorios de 256 bits; libSQL guarda únicamente su digest SHA-256. Expiran a las 12 horas de inactividad o siete días desde su creación. Las cookies son HttpOnly, SameSite=Lax y Secure en producción. Las cuentas suspendidas se comprueban también al resolver sesiones y ejecutar funciones remotas.

TOTP utiliza periodos de 30 segundos y tolerancia de un periodo. Los secretos se cifran con AES-GCM y claves versionadas. Los pasos ya utilizados no se pueden reutilizar. Los desafíos de acceso duran cinco minutos; los diez códigos de recuperación se muestran una sola vez y se consumen individualmente. Contraseñas, tokens, secretos, códigos y cuerpos de archivos no forman parte de la auditoría.

El límite de acceso reserva intentos atómicamente por correo normalizado e IP: ocho por quince minutos. También cuenta los intentos exitosos dentro de esa ventana para impedir ráfagas concurrentes. No hay recuperación pública: un superadministrador emite una contraseña temporal. El restablecimiento conserva TOTP; el usuario necesita su aplicación o un código de recuperación.

## Medios

Se aceptan JPEG, PNG, WebP, AVIF, GIF, SVG estático y PDF. Se comprueban extensión, MIME, firma, dimensiones y tamaño: 10 MB para imágenes y 25 MB para PDF. Los SVG admiten un subconjunto conservador sin scripts, estilos, entidades ni referencias. Los PDF se sirven como descargas. Las respuestas incluyen una política CSP restrictiva y `nosniff`.

Los objetos tienen claves UUID. `/media/[id]/[filename]` proporciona GET/HEAD, ETag, peticiones condicionales, rangos simples e identificación inmutable del archivo. Reemplazar una imagen significa subir otro archivo y guardar su referencia. Las imágenes incluidas son el respaldo cuando no hay una selección editorial.

Archivar conserva el objeto. Las referencias incluyen campos editoriales y enlaces de texto/Markdown, incluso en registros archivados. No se puede archivar ni purgar un medio referenciado. Solo un superadministrador puede purgar un medio archivado. La eliminación de R2 y la transacción libSQL no son una transacción distribuida: si falla la confirmación tras eliminar el objeto, vuelve a intentar la purga del registro archivado.

Los enlaces ya copiados y las copias en caché de un medio pueden seguir funcionando después de archivarlo; el archivo es una operación editorial, no una revocación de acceso a material confidencial. No subas contenido confidencial.

## Verificación

Ejecuta `pnpm check`, `pnpm lint`, `pnpm test`, `pnpm test:e2e` y `pnpm build`. Las pruebas usan bases de datos aisladas. Las pruebas de navegador requieren Chromium de Playwright (`pnpm exec playwright install chromium`).
