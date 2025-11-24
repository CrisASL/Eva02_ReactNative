# Welcome to Eva02 React Native 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Created by Cristian Salas y Fellipe Herrero

[![Link video Youtube] https://www.youtube.com/shorts/t2rrX4XDpmM

## Uso de IA

Esta aplicación móvil ha sido desarrollada en React Native y utiliza ChatGPT como asistencia en el desarrollo para generar contenido, corregir errores y optimizar la estructura del código.

La aplicación permite a los usuarios crear y gestionar tareas personales con las siguientes características:

Título de la tarea

Imagen asociada (cámara o galería)

Ubicación opcional (latitud y longitud)

Estado de completitud (pendiente o completada)

Se implementó persistencia de datos usando AsyncStorage, de modo que cada usuario mantiene sus tareas incluso después de cerrar la sesión. La aplicación identifica a los usuarios mediante correo electrónico y gestiona las tareas de forma individual.

Se construyó una estructura organizada utilizando componentes, layouts, y navegación con Expo Router, además de un sistema de autenticación básico mediante AuthContext.

## Funcionalidades principales

1. Crear tareas:

   - Ingresar título

   - Adjuntar imagen desde cámara o galería

   - Guardar ubicación actual (opcional)

2. Visualizar tareas:

   - Listado de tareas por usuario

   - Indicador de completitud (✅ o ⬜)

3. Modificar tareas:

   - Marcar/completar tareas

   - Eliminar tareas  

4. Persistencia de datos:

   - Todas las tareas se almacenan en AsyncStorage

   - Se cargan automáticamente al iniciar sesión    

5. Autenticación básica:

   - Iniciar sesión con correo electrónico

  
