# AulaSegura - Dashboard Admin

Dashboard web de administración para la aplicación AulaSegura, desarrollado con React Native y orientado específicamente para uso exclusivo de administradores.

## 📋 Descripción

Este es el dashboard de administración de AulaSegura. Una aplicación multiplataforma que permite a profesores y personal educativo gestionar el acceso a aulas y espacios mediante tecnologías QR, NFC y RFID. El sistema incluye gestión de reservas, horarios, permisos de acceso y seguimiento en tiempo real.
Este dashboard permite a los administradores gestionar contenido, usuarios y supervisar la interacción dentro de la plataforma.

**Importante:** Esta aplicación está destinada exclusivamente para **web/escritorio** y uso del **rol administrador**.

## 🎯 Objetivo

Proporcionar una interfaz web para que los administradores puedan:
- Gestionar usuarios (administradores, profesores, conserjes, staff)
- Administrar contenido de la aplicación
- Supervisar reportes y actividad (validación de reservas)
- Configurar parámetros del sistema

## 🛠️ Stack Tecnológico

- **React Native**: 0.81.5
- **Expo**: ~54.0.27
- **React Native Paper**: 5.14.5 (Material Design 3)
- **TypeScript**: 5.9.2
- **Plataforma objetivo**: Web (con compatibilidad móvil futura)

## 🎨 Diseño

- **Sistema de diseño**: Material Design 3
- **Tema personalizado**: Basado en los colores corporativos de AulaSegura
  - Primary: `#182D73`
  - Secondary: `#306AC6`
  - Tertiary: `#3B82F6`
  - Quaternary: `#ABC7F5`
- **Tipografía**: Roboto (Regular 400, Medium 500, Bold 700)
- **Modos**: Light y Dark (preparado para implementación futura)

## 📁 Estructura del Proyecto

```
AulaSegura/
├── src/
│   ├── app/              # Pantallas de la aplicación
│   │   └── LoginScreen.tsx
│   ├── components/       # Componentes reutilizables
│   ├── hooks/            # Custom hooks
│   ├── services/         # Servicios API
│   ├── types/            # Tipos TypeScript
│   ├── utils/            # Utilidades y validadores
│   │   └── validators.ts
│   ├── constants.ts      # Constantes globales
│   └── theme.ts          # Configuración de tema MD3
├── assets/               # Recursos estáticos
│   └── images/
├── App.tsx               # Componente raíz
└── package.json
```

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js >= 18
- npm

### Instalación

```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]

# Navegar al directorio
cd frontend_reactnative_aulasegura

# Instalar dependencias
npm install

# Iniciar en modo web
npm run web
```

## 📱 Scripts Disponibles

```bash
npm start          # Inicia el servidor de desarrollo
npm run web        # Inicia en modo web
npm run android    # Inicia en Android (futuro)
npm run ios        # Inicia en iOS (futuro)
```

## 🔐 Funcionalidades Implementadas

### Autenticación
- ✅ Pantalla de Login con validaciones
  - Validación de formato de email
  - Validación de contraseña (min. 8 caracteres, mayúscula, minúscula, número)
  - Feedback visual de errores
  - Toggle de visibilidad de contraseña

### Tema
- ✅ Sistema de theming personalizado con MD3
- ✅ Todas las variantes tipográficas customizadas
- ✅ Colores corporativos integrados
- ✅ Hook `useAppTheme()` para acceso tipado al tema