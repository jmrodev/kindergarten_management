import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import useCurrentPath from '../../hooks/useCurrentPath'; // Path from components/organisms to hooks

/**
 * =============================================================================
 * DOCUMENTACIÓN DE ARQUITECTURA: IMPLEMENTACIÓN DRY (Don't Repeat Yourself)
 * =============================================================================
 * * CONTEXTO GENERAL:
 * Este componente maneja la navegación contextual tipo "Ribbon" (Cinta de opciones).
 * El objetivo es que el menú se adapte automáticamente a la sección actual (Alumnos, 
 * Personal, etc.) sin repetir código HTML ni lógica condicional dispersa.
 * * ESTRATEGIA APLICADA: "Configuration over Code" (Configuración sobre Código)
 * * 1. CENTRALIZACIÓN (The Source of Truth):
 * En lugar de usar múltiples bloques `if (ruta === '/students')` dentro del JSX,
 * toda la lógica de qué mostrar se define en el objeto `sectionActions`.
 * Este objeto actúa como un mapa maestro que dicta el comportamiento.
 * * 2. RENDERIZADO AGNÓSTICO:
 * El JSX de este componente es "tonto" (dumb). No sabe de negocios, solo sabe
 * cómo pintar una lista. Itera sobre los datos que le entrega la configuración.
 * - Si mañana agregas una sección "Biblioteca", solo añades la clave al objeto
 * `sectionActions` y la interfaz se dibujará sola sin tocar el HTML.
 * * 3. REUTILIZACIÓN DE MANEJADORES:
 * La función `handleAction` actúa como un dispatcher central. En lugar de crear
 * una función para cada botón, usamos un identificador único (actionCode) para 
 * enrutar la acción correspondiente.
 * =============================================================================
 */

// Icon components using CSS
const PersonPlusIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
    <path fillRule="evenodd" d="M8 6a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"/>
  </svg>
);

const ShieldIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.059.726 7.654 2.713 9.354a61.45 61.45 0 0 0 4.148-.38c2.768-2.214 3.25-6.57 2.24-10.524C9.509 1.796 8.224 1.096 5.338 1.59ZM4.154 1.82a12.2 12.2 0 0 1-.662.286c-1.072.39-1.788 1.03-2.27 1.664-.34.452-.67.93-.896 1.33-.33.587-.503 1.245-.598 2.002-.196 1.5-.01 3.07.64 4.21.43 1.17.9 2.3.7 3.16.2-1.73-.21-3.39-.93-4.76-.68-1.35-.9-2.88-.49-4.14.7-.19 1.76-.36 3.21-.28.72.04 1.41.1.1.94.78 1.04 1.2.38 1.34-.32.03-.1.08-.2.13-.3z"/>
  </svg>
);

const FileMedicalIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 1h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H4z"/>
    <path d="M9.5 4a.5.5 0 0 0-.5.5v1.5H7.5a.5.5 0 0 0 0 1h1.5V8.5a.5.5 0 0 0 1 0V7h1.5a.5.5 0 0 0 0-1H10V4.5a.5.5 0 0 0-.5-.5z"/>
  </svg>
);

const ListIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
  </svg>
);

const PeopleIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M13 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10Z"/>
    <path fillRule="evenodd" d="M9 8a3 3 0 1 0-6 0 3 3 0 0 0 6 0ZM9 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1 9c0 1 1 1 1 1h5s1 0 1-1-1-4-6-4-6 3-6 4z"/>
  </svg>
);

const PersonFillIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
  </svg>
);

const HouseIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z"/>
    <path fillRule="evenodd" d="M13 7.5h-1v-1a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v1h-1v-1a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v1H4v-.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5Z"/>
  </svg>
);

const PeopleFillIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm.93-5.487c.27.283.53.579.732.893.04.069.035.12.035.12a2.1 2.1 0 0 1-.837 1.471 2.166 2.166 0 0 1-1.58 0 2.03 2.03 0 0 1-.837-1.472 2 2 0 0 1 .035-.12 2.1 2.1 0 0 1 .732-.893A6.983 6.983 0 0 1 7 8.5c.13.006.258.02.385.041Z"/>
    <path d="M3 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H3ZM1 12s0-2.5 2-2.5 3 1.5 3 1.5S6 12 1 12Zm13 0s0-2.5-2-2.5-3 1.5-3 1.5 1.5 2.5 6 2.5Z"/>
  </svg>
);

const PersonBadgeIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
    <path d="M4.5 0A2.5 2.5 0 0 0 2 2.5v11A2.5 2.5 0 0 0 4.5 16h7a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 11.5 0h-7zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v7a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 9.5v-7z"/>
  </svg>
);

const PersonLinesFillIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    <path d="M7 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
    <path d="M7 1.414V4.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V.5h3a.5.5 0 0 1 .5.5v1.414z"/>
  </svg>
);

const Link45degIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M5.3 5.7 8 8.4l2.7-2.7L10 5l-2 2 2 2 .7-.7L8 8.4l-2.7 2.7L5 10l2-2-2-2z"/>
    <path d="M6.8 2.2a.5.5 0 0 0-.7.7L7.4 4.2l-1.3 1.3a.5.5 0 0 0 .7.7l1.3-1.3 1.3 1.3a.5.5 0 0 0 .7-.7L9.1 4.2l1.3-1.3a.5.5 0 0 0-.7-.7L8.4 3.5 7.1 2.2a.5.5 0 0 0-.7.7z"/>
  </svg>
);

const CalendarCheckIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
    <path fillRule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
  </svg>
);

const CalendarPlusIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M8.5 1.5A1.5 1.5 0 1 0 7 0a1.5 1.5 0 0 0 1.5 1.5zM11 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
    <path d="M12.5 0h-11a1.5 1.5 0 0 0-1.5 1.5v13a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-13a1.5 1.5 0 0 0-1.5-1.5zM5.5 3h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zm0 2h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 2h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1z"/>
    <path fillRule="evenodd" d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z"/>
  </svg>
);

const LightningChargeIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M5.5 6.06h.868L5.26 8.32h.971l-.957 4.78L7.21 7.38h.968l.957 4.78L8.192 8.32h.971L8.055 6.06h-.868l-.957 4.78L7.197 5.81 5.5 6.06z"/>
  </svg>
);

const FileEarmarkArrowDownIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M8 4a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 8.293V4.5A.5.5 0 0 1 8 4z"/>
    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
  </svg>
);

const FileEarmarkExcelIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M5.884 6.68a.5.5 0 1 0-.768.64l1.605 1.926c.306.367.565.68.709.84a1.2 1.2 0 0 1-.39-.785c-.077-.345-.12-.582-.12-.582l-.117-.958z"/>
    <path d="M4.775 7.998a.5.5 0 1 1-.94-.364.815.815 0 0 0-.09.227l-.255.903c-.043.153-.063.24-.063.24a.5.5 0 1 1-.96-.288c0 0 .03-.095.078-.26l.254-.902c.128-.458.35-.92.676-1.18.326-.26.738-.295.85-.295a.5.5 0 0 1 .5.5.5.5 0 0 1-.426.495l-.02.001zm1.841-.64a.5.5 0 1 0 .768-.64l-.768.64zM4.5 12.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm1-4a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm1 1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm1 1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
  </svg>
);

const FileEarmarkPdfIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
    <path d="M4.603 12.027c.28-.543.62-1.255.994-1.51.36-.247.8-.34 1.24-.34.437 0 .86.105 1.25.34.388.237.71.69.953 1.51.245.82.36 1.84.26 2.9-.1-.85-.39-1.51-.87-1.95-.48-.44-1.06-.69-1.68-.69-.62 0-1.2.25-1.68.69-.48.44-.77 1.1-.87 1.95-.1-1.06.016-2.08.26-2.9z"/>
    <path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-2zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-2z"/>
  </svg>
);

const PrinterIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
    <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/>
  </svg>
);

const HouseFillIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z"/>
  </svg>
);

const FileArrowDownIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M8 4a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 8.293V4.5A.5.5 0 0 1 8 4z"/>
    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
  </svg>
);

const PersonIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
  </svg>
);

const OfficeRibbon = () => {
  const [activeTab, setActiveTab] = useState('Inicio');
  const { currentUser, logout } = useAuth();

  // Hook personalizado para detectar en qué sección estamos
  const { currentSection } = useCurrentPath();

  const menuRef = useRef(null);
  const navigate = useNavigate();

  // --- CONFIGURACIÓN ESTRICTA DE ACCIONES POR SECCIÓN ---
  // Aquí definimos EXACTAMENTE qué se puede hacer en cada pantalla.
  const sectionActions = useMemo(() => ({
    classrooms: {
      tabName: 'Inicio',
      primary: { action: 'newClassroom', label: 'Nueva Sala', icon: PeopleIcon },
      secondaries: [
        { action: 'assignTeacher', label: 'Asignar Docente', icon: PersonFillIcon },
        { action: 'listClassrooms', label: 'Ver Salas', icon: PeopleFillIcon }
      ],
      exportActions: [
        { action: 'exportExcel', label: 'Exportar a Excel', icon: FileEarmarkExcelIcon },
        { action: 'exportPdf', label: 'Exportar a PDF', icon: FileEarmarkPdfIcon },
        { action: 'printReport', label: 'Imprimir', icon: PrinterIcon }
      ]
    },
    staff: {
      tabName: 'Personal',
      primary: { action: 'newStaff', label: 'Nuevo Personal', icon: PeopleFillIcon },
      secondaries: [
        { action: 'manageRoles', label: 'Gestionar Roles', icon: PersonBadgeIcon },
        { action: 'listStaff', label: 'Directorio', icon: PersonLinesFillIcon }
      ],
      exportActions: [
        { action: 'exportExcel', label: 'Exportar a Excel', icon: FileEarmarkExcelIcon },
        { action: 'exportPdf', label: 'Exportar a PDF', icon: FileEarmarkPdfIcon },
        { action: 'printReport', label: 'Imprimir', icon: PrinterIcon }
      ]
    },
    guardians: {
      tabName: 'Alumnos',
      primary: { action: 'newGuardian', label: 'Nuevo Responsable', icon: ShieldIcon },
      secondaries: [
        { action: 'linkStudent', label: 'Vincular Alumno', icon: Link45degIcon }
      ],
      exportActions: [
        { action: 'exportExcel', label: 'Exportar a Excel', icon: FileEarmarkExcelIcon },
        { action: 'exportPdf', label: 'Exportar a PDF', icon: FileEarmarkPdfIcon },
        { action: 'printReport', label: 'Imprimir', icon: PrinterIcon }
      ]
    },
    vaccinations: {
      tabName: 'Alumnos',
      primary: { action: 'newVaccination', label: 'Nueva Vacuna', icon: FileMedicalIcon },
      secondaries: [
        { action: 'checkSchedule', label: 'Calendario Vacunación', icon: CalendarCheckIcon }
      ],
      exportActions: [
        { action: 'exportExcel', label: 'Exportar a Excel', icon: FileEarmarkExcelIcon },
        { action: 'exportPdf', label: 'Exportar a PDF', icon: FileEarmarkPdfIcon },
        { action: 'printReport', label: 'Imprimir', icon: PrinterIcon }
      ]
    },
    activities: {
      tabName: 'Inicio',
      primary: { action: 'newActivity', label: 'Nueva Actividad', icon: CalendarPlusIcon },
      secondaries: [],
      exportActions: [
        { action: 'exportExcel', label: 'Exportar a Excel', icon: FileEarmarkExcelIcon },
        { action: 'exportPdf', label: 'Exportar a PDF', icon: FileEarmarkPdfIcon },
        { action: 'printReport', label: 'Imprimir', icon: PrinterIcon }
      ]
    },
    // Configuración por defecto (Dashboard o rutas no específicas)
    general: {
      tabName: 'Inicio',
      primary: { action: 'newStudent', label: 'Acción Rápida', icon: LightningChargeIcon },
      secondaries: [
        { action: 'newStudent', label: 'Nuevo Alumno', icon: PersonPlusIcon },
        { action: 'newClassroom', label: 'Nueva Sala', icon: PeopleIcon }
      ],
      exportActions: [
        { action: 'exportExcel', label: 'Exportar a Excel', icon: FileEarmarkExcelIcon },
        { action: 'exportPdf', label: 'Exportar a PDF', icon: FileEarmarkPdfIcon },
        { action: 'printReport', label: 'Imprimir', icon: PrinterIcon }
      ]
    }
  }), []);

  // Seleccionamos la configuración actual o la general si no existe
  const currentContext = sectionActions[currentSection] || sectionActions.general;

  // Sincronizar pestaña activa automáticamente cuando cambia el contexto
  useEffect(() => {
    if (currentContext.tabName) {
      setActiveTab(currentContext.tabName);
    }
  }, [currentContext]);

  const handleNavigation = (path) => navigate(path);

  // Gestor centralizado de acciones (Dispatcher)
  const handleAction = (actionCode) => {
    const actionsMap = {
      'newStudent': () => navigate('/students/new'),
      'listStudents': () => navigate('/students'),
      'newGuardian': () => navigate('/guardians/new'),
      'newVaccination': () => navigate('/vaccinations'),
      'newClassroom': () => navigate('/classrooms/new'),
      'listClassrooms': () => navigate('/classrooms'),
      'newStaff': () => navigate('/staff/new'),
      'listStaff': () => navigate('/staff'),
      'newActivity': () => navigate('/activities'),
      'printReport': () => alert('Imprimir Reporte'),
      'exportExcel': () => alert('Exportando Excel...'),
      'exportPdf': () => alert('Exportando PDF...'),
      // Aquí puedes agregar más lógica para acciones que no sean solo navegación
    };

    if (actionsMap[actionCode]) {
      actionsMap[actionCode]();
    } else {
      // Action not implemented yet
    }
  };

  return (
    <>
      {/* CSS INCRUSTADO: Estilos visuales del Ribbon */}
      <style>{`
        :root {
          --office-primary: #2b579a;
          --office-hover: #3e6db5;
          --office-ribbon-bg: #f3f2f1;
          --office-border: #d2d2d2;
          --office-text: #444;
          --office-file-tab: #2b579a;
        }
        .office-menu-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: var(--office-ribbon-bg);
          border-bottom: 1px solid var(--office-border);
          position: relative;
          z-index: 100;
        }
        .top-bar {
          background-color: var(--office-primary);
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .tabs {
          list-style: none; margin: 0; padding: 0; display: flex;
        }
        .tab {
          padding: 8px 15px; color: white; cursor: pointer; font-size: 13px;
          border: 1px solid transparent; transition: all 0.2s ease; user-select: none;
        }
        .tab:hover { background-color: var(--office-hover); }
        .tab.file-trigger { background-color: var(--office-file-tab); font-weight: 600; }
        .tab.file-trigger:hover {
          background-color: #3e6db5; /* Softer hover color */
          transition: all 0.2s ease;
        }
        .tab.file-trigger.active {
          background-color: #1e3e70;
          color: white;
          border: none;
          top: 0;
        }
        .tab.file-trigger {
          background-color: var(--office-file-tab);
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .tab.active {
          background-color: var(--office-ribbon-bg); color: var(--office-primary);
          border: 1px solid var(--office-border); border-bottom: 1px solid var(--office-ribbon-bg);
          position: relative; top: 1px;
        }
        .user-email {
          color: white;
          font-size: 13px;
          opacity: 0.8;
        }
        .logout-button {
          background-color: #f44336; /* Red color for logout */
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          transition: background-color 0.2s ease;
        }
        .logout-button:hover {
          background-color: #d32f2f; /* Darker red on hover */
        }
      `}</style>

      {/* COMPONENTE VISUAL */}
      <div className="office-menu-container" ref={menuRef}>
        
        {/* 1. TABS (PESTAÑAS) */}
        <div className="top-bar">
          <ul className="tabs">
            {/* Pestañas de navegación estándar */}
            <li className={`tab ${activeTab === 'Inicio' ? 'active' : ''}`} onClick={() => handleNavigation('/dashboard')}>Inicio</li>
            <li className={`tab ${activeTab === 'Personal' ? 'active' : ''}`} onClick={() => handleNavigation('/staff')}>Personal</li>
            <li className="tab" onClick={() => handleNavigation('/configuracion')}>Configuración</li>
          </ul>

          {currentUser && (
            <div className="user-info-section">
              <span className="user-email">{currentUser.email}</span>
              <button className="logout-button" onClick={() => {
                logout(); // Call logout function from useAuth
                navigate('/login'); // Redirect to login after logout
              }}>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>

        {/* 2. RIBBON (CINTA DE OPCIONES) */}
        <div className="ribbon">
          {/* Botón Principal Contextual */}
          <div
            className="ribbon-btn-large"
            onClick={() => handleAction(currentContext.primary.action)}
            title={currentContext.primary.label}
          >
            {React.createElement(currentContext.primary.icon, { size: 24 })}
            <span>{currentContext.primary.label}</span>
          </div>

          <div className="ribbon-group-separator"></div>

          {/* Acciones Secundarias en el Ribbon (Lista Pequeña) */}
          <div className="ribbon-small-actions">
            {currentContext.secondaries.slice(0, 3).map((sec, idx) => (
               <div key={idx} className="ribbon-btn-small" onClick={() => handleAction(sec.action)}>
                 {React.createElement(sec.icon, { size: 14 })}
                 {sec.label}
               </div>
            ))}
            {currentContext.secondaries.length === 0 && (
               <div className="ribbon-no-options">Opciones generales</div>
            )}
          </div>

          <div className="ribbon-group-separator"></div>

          {/* Grupo de Exportación/Impresión */}
          <div className="ribbon-small-actions">
            {currentContext.exportActions && currentContext.exportActions.map((action, idx) => (
               <div key={idx} className="ribbon-btn-small" onClick={() => handleAction(action.action)}>
                 {React.createElement(action.icon, { size: 14 })}
                 {action.label}
               </div>
            ))}
          </div>

          <div className="ribbon-group-separator"></div>

          {/* Grupo Global (Siempre visible) - Fuente ficticia para look & feel */}
          <div className="ribbon-global-group">
            <div className="ribbon-font-selector">Segoe UI</div>
            <div className="ribbon-formatting-tools">
              <b className="ribbon-tool-btn">B</b>
              <i className="ribbon-tool-btn">I</i>
              <u className="ribbon-tool-btn">S</u>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default OfficeRibbon;