# App de Pedidos para Surtir Sucursal

Esta es una aplicación web sencilla que te permite cargar un archivo de Excel y marcar qué productos ya han sido surtidos.

## 🚀 Funcionalidades

- Carga archivos `.xlsx` o `.xlsm` (con estructura fija).
- Busca productos por código o descripción.
- Filtra productos faltantes o ver todos.
- Guarda el progreso localmente (en el navegador).
- Interfaz optimizada para tablets.

## 📦 Instalación local

```bash
npm install
npm run dev
```

## 🌐 Despliegue

Este proyecto está optimizado para ser desplegado en [Netlify](https://netlify.com):

1. Sube la carpeta a un repositorio de GitHub.
2. Conecta el repo a Netlify.
3. En la configuración, asegúrate de que:
   - **Build Command**: `npm run build`
   - **Publish directory**: `dist`

## 📁 Estructura esperada del Excel

Tu archivo debe tener columnas con los siguientes encabezados (pueden estar en cualquier orden):

- Codigom (se transforma a "Código" automáticamente)
- descripcion
- almacen
- exist
- pz a pedir

## 🛠 Tecnologías

- React
- Vite
- Tailwind CSS (solo básico)
- xlsx (para leer Excel)
