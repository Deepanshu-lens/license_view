import * as React from "react";
import { SVGProps } from "react";

const svgs = {
  "iconamoon:search": (
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m21 21-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314"
    />
  ),
  "mdi:register": (
    <path
      fill="currentColor"
      d="M15 14c-2.67 0-8 1.33-8 4v2h16v-2c0-2.67-5.33-4-8-4m-9-4V7H4v3H1v2h3v3h2v-3h3v-2m6 2a4 4 0 0 0 4-4 4 4 0 0 0-4-4 4 4 0 0 0-4 4 4 4 0 0 0 4 4"
    />
  ),
  "lucide:monitor-up": (
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    >
      <path d="m9 10 3-3 3 3m-3 3V7" />
      <rect width={20} height={14} x={2} y={3} rx={2} />
      <path d="M12 17v4m-4 0h8" />
    </g>
  ),
  "fontisto:radio-btn-active": (
    <path
      fill="currentColor"
      d="M0 12C0 5.373 5.373 0 12 0s12 5.373 12 12-5.373 12-12 12C5.376 23.992.008 18.624 0 12.001zm2.4 0c0 5.302 4.298 9.6 9.6 9.6s9.6-4.298 9.6-9.6-4.298-9.6-9.6-9.6c-5.299.006-9.594 4.301-9.6 9.599zm4 0a5.6 5.6 0 1 1 11.2 0 5.6 5.6 0 0 1-11.2 0"
    />
  ),
  "iconoir:screenshot": (
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <path d="M10 21.4v-7.006a.6.6 0 0 1 .6-.6h1.173a.6.6 0 0 0 .504-.275l1.446-2.244a.6.6 0 0 1 .504-.275h3.546a.6.6 0 0 1 .504.275l1.446 2.244a.6.6 0 0 0 .504.275H21.4a.6.6 0 0 1 .6.6V21.4a.6.6 0 0 1-.6.6H10.6a.6.6 0 0 1-.6-.6" />
      <path d="M16 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4M3 18v3h2.5M3 9.5v5M3 6V3h3m3.5 0h5M18 3h3v2.5m0 4.5V8.5" />
    </g>
  ),
  "mingcute:alert-line": (
    <g fill="none">
      <path d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z" />
      <path
        fill="currentColor"
        d="m13.299 3.148 8.634 14.954a1.5 1.5 0 0 1-1.299 2.25H3.366a1.5 1.5 0 0 1-1.299-2.25l8.634-14.954c.577-1 2.02-1 2.598 0M12 4.898 4.232 18.352h15.536zM12 15a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-7a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1"
      />
    </g>
  ),
  "gridicons:fullscreen": (
    <path
      fill="currentColor"
      d="M21 3v6h-2V6.41l-3.29 3.3-1.42-1.42L17.59 5H15V3zM3 3v6h2V6.41l3.29 3.3 1.42-1.42L6.41 5H9V3zm18 18v-6h-2v2.59l-3.29-3.29-1.41 1.41L17.59 19H15v2zM9 21v-2H6.41l3.29-3.29-1.41-1.42L5 17.59V15H3v6z"
    />
  ),
  "formkit:open": (
    <path
      fill="currentColor"
      d="M12.5 3h-9c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h9c.28 0 .5.22.5.5s-.22.5-.5.5m0 3h-9c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h9c.28 0 .5.22.5.5s-.22.5-.5.5m0 3h-9c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h9c.28 0 .5.22.5.5s-.22.5-.5.5"
    />
  ),
  "mdi:record-rec": (
    <path
      fill="currentColor"
      d="M12.5 5A7.5 7.5 0 0 0 5 12.5a7.5 7.5 0 0 0 7.5 7.5 7.5 7.5 0 0 0 7.5-7.5A7.5 7.5 0 0 0 12.5 5M7 10h2a1 1 0 0 1 1 1v1c0 .5-.38.9-.86.97L10.31 15H9.15L8 13v2H7m5-5h2v1h-2v1h2v1h-2v1h2v1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1m4 0h2v1h-2v3h2v1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1m-8 1v1h1v-1"
    />
  ),
  "octicon:mute-16": (
    <path
      fill="currentColor"
      d="M10 7.22 6.603 10H3v4h3.603L10 16.78zM5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387zm14.525-4 3.536 3.536-1.415 1.414L19 13.414l-3.536 3.536-1.414-1.414L17.586 12 14.05 8.464l1.414-1.414L19 10.586l3.535-3.536 1.415 1.414z"
    />
  ),
  "octicon:unmute-16": (
    <>
      <path
        fill="currentColor"
        d="M11.553 3.064A.75.75 0 0 1 12 3.75v16.5a.75.75 0 0 1-1.255.555L5.46 16H2.75A1.75 1.75 0 0 1 1 14.25v-4.5C1 8.784 1.784 8 2.75 8h2.71l5.285-4.805a.752.752 0 0 1 .808-.13ZM10.5 5.445l-4.245 3.86a.748.748 0 0 1-.505.195h-3a.25.25 0 0 0-.25.25v4.5c0 .138.112.25.25.25h3c.187 0 .367.069.505.195l4.245 3.86Zm8.218-1.223a.75.75 0 0 1 1.06 0c4.296 4.296 4.296 11.26 0 15.556a.75.75 0 0 1-1.06-1.06 9.5 9.5 0 0 0 0-13.436.75.75 0 0 1 0-1.06"
      />
      <path
        fill="currentColor"
        d="M16.243 7.757a.75.75 0 1 0-1.061 1.061 4.5 4.5 0 0 1 0 6.364.75.75 0 0 0 1.06 1.06 6 6 0 0 0 0-8.485Z"
      />
    </>
  ),
  "gridicons:fullscreen-exit": (
    <path
      fill="currentColor"
      d="M14 10V4h2v2.59l3.29-3.29 1.41 1.41L17.41 8H20v2zM4 10V8h2.59l-3.3-3.29 1.42-1.42L8 6.59V4h2v6zm16 4v2h-2.59l3.29 3.29-1.41 1.41L16 17.41V20h-2v-6zm-10 0v6H8v-2.59l-3.29 3.3-1.42-1.42L6.59 16H4v-2z"
    />
  ),
  "bxs:edit": (
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    >
      <path d="m16.475 5.408 2.117 2.117m-.756-3.982L12.109 9.27a2.118 2.118 0 0 0-.58 1.082L11 13l2.648-.53c.41-.082.786-.283 1.082-.579l5.727-5.727a1.853 1.853 0 1 0-2.621-2.621" />
      <path d="M19 15v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3" />
    </g>
  ),
  "bi:filter": (
    <path
      fill="currentColor"
      d="M2.75 6a.75.75 0 0 0 0 1.5h18.5a.75.75 0 0 0 0-1.5zM6 11.75a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75a.75.75 0 0 1-.75-.75m4 4.938a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75"
    />
  ),
  tick: (
    <path
      fill="currentColor"
      d="M16.972 6.251a1.999 1.999 0 0 0-2.72.777l-3.713 6.682-2.125-2.125a2 2 0 1 0-2.828 2.828l4 4c.378.379.888.587 1.414.587l.277-.02a2 2 0 0 0 1.471-1.009l5-9a2 2 0 0 0-.776-2.72"
    />
  ),
  ChevD: (
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m6 9 6 6 6-6"
    />
  ),
  X: (
    <path
      fill="currentColor"
      d="M5.72 5.72a.75.75 0 0 1 1.06 0L12 10.94l5.22-5.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L13.06 12l5.22 5.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L12 13.06l-5.22 5.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L10.94 12 5.72 6.78a.75.75 0 0 1 0-1.06"
    />
  ),
  Layout: (
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M8.93 4.47a17.516 17.516 0 0 0-3.86 0 .666.666 0 0 0-.586.577 16.816 16.816 0 0 0 0 3.907.666.666 0 0 0 .587.576c1.271.142 2.587.142 3.858 0a.666.666 0 0 0 .587-.576c.152-1.298.152-2.61 0-3.908a.666.666 0 0 0-.587-.576M4.903 2.98a19.017 19.017 0 0 1 4.192 0c.99.11 1.793.89 1.91 1.892a18.322 18.322 0 0 1 0 4.256 2.166 2.166 0 0 1-1.91 1.893c-1.382.154-2.81.154-4.192 0a2.166 2.166 0 0 1-1.91-1.893 18.316 18.316 0 0 1 0-4.256 2.166 2.166 0 0 1 1.91-1.892M8.93 14.47a17.514 17.514 0 0 0-3.86 0 .666.666 0 0 0-.586.576 16.816 16.816 0 0 0 0 3.908.666.666 0 0 0 .587.576c1.271.142 2.587.142 3.858 0a.666.666 0 0 0 .587-.576c.152-1.298.152-2.61 0-3.908a.666.666 0 0 0-.587-.576m-4.026-1.49a19.023 19.023 0 0 1 4.192 0c.99.11 1.793.89 1.91 1.892a18.322 18.322 0 0 1 0 4.256 2.166 2.166 0 0 1-1.91 1.892c-1.382.155-2.81.155-4.192 0a2.166 2.166 0 0 1-1.91-1.892 18.316 18.316 0 0 1 0-4.256 2.166 2.166 0 0 1 1.91-1.892M18.93 4.47a17.517 17.517 0 0 0-3.86 0 .666.666 0 0 0-.586.577 16.817 16.817 0 0 0 0 3.907.666.666 0 0 0 .587.576c1.271.142 2.587.142 3.858 0a.666.666 0 0 0 .587-.576c.152-1.298.152-2.61 0-3.908a.666.666 0 0 0-.587-.576m-4.026-1.49a19.017 19.017 0 0 1 4.192 0c.99.11 1.793.89 1.91 1.892a18.322 18.322 0 0 1 0 4.256 2.166 2.166 0 0 1-1.91 1.893c-1.382.154-2.81.154-4.192 0a2.166 2.166 0 0 1-1.91-1.893 18.31 18.31 0 0 1 0-4.256 2.166 2.166 0 0 1 1.91-1.892m4.027 11.49a17.514 17.514 0 0 0-3.86 0 .666.666 0 0 0-.586.576 16.817 16.817 0 0 0 0 3.908.666.666 0 0 0 .587.576c1.271.142 2.587.142 3.858 0a.666.666 0 0 0 .587-.576c.152-1.298.152-2.61 0-3.908a.666.666 0 0 0-.587-.576m-4.026-1.49a19.023 19.023 0 0 1 4.192 0c.99.11 1.793.89 1.91 1.892a18.322 18.322 0 0 1 0 4.256 2.166 2.166 0 0 1-1.91 1.892c-1.382.155-2.81.155-4.192 0a2.166 2.166 0 0 1-1.91-1.892 18.31 18.31 0 0 1 0-4.256 2.166 2.166 0 0 1 1.91-1.892"
      clipRule="evenodd"
    />
  ),
  Announce: (
    <path
      fill="currentColor"
      d="M12 8H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h3l5 4V4zm3 7.6L13 14H4v-4h9l2-1.6zm6.5-3.6c0 1.71-.96 3.26-2.5 4V8c1.53.75 2.5 2.3 2.5 4"
    />
  ),
  RecCam: (
    <>
      <path
        fill="currentColor"
        d="M18 9c0-1.103-.897-2-2-2h-1.434l-2.418-4.029A2.008 2.008 0 0 0 10.434 2H5v2h5.434l1.8 3H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-3l4 2v-7l-4 2zm-1.998 9H4V9h12l.001 4H16v1l.001.001z"
      />
      <path fill="currentColor" d="M6 14h6v2H6z" />
    </>
  ),
  Rotate: (
    <path
      fill="currentColor"
      d="M12 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.811 5.741L17 12h3a8 8 0 1 0-2.46 5.772l.998 1.795A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2m0 5a3 3 0 0 1 3 3v1h1v5H8v-5h1v-1a3 3 0 0 1 3-3m0 2a1 1 0 0 0-.993.883L11 10v1h2v-1a1 1 0 0 0-.883-.993z"
    />
  ),
  Save: (
    <path
      fill="currentColor"
      d="M3 5.75A2.75 2.75 0 0 1 5.75 3h9.965a3.25 3.25 0 0 1 2.298.952l2.035 2.035c.61.61.952 1.437.952 2.299v9.964A2.75 2.75 0 0 1 18.25 21H5.75A2.75 2.75 0 0 1 3 18.25zM5.75 4.5c-.69 0-1.25.56-1.25 1.25v12.5c0 .69.56 1.25 1.25 1.25H6v-5.25A2.25 2.25 0 0 1 8.25 12h7.5A2.25 2.25 0 0 1 18 14.25v5.25h.25c.69 0 1.25-.56 1.25-1.25V8.286c0-.465-.184-.91-.513-1.238l-2.035-2.035a1.75 1.75 0 0 0-.952-.49V7.25a2.25 2.25 0 0 1-2.25 2.25h-4.5A2.25 2.25 0 0 1 7 7.25V4.5zm10.75 15v-5.25a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0-.75.75v5.25zm-8-15v2.75c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75V4.5z"
    />
  ),
  "carbon:add-filled": (
    <>
      <path
        fill="currentColor"
        d="M16 2A14.173 14.173 0 0 0 2 16a14.173 14.173 0 0 0 14 14 14.173 14.173 0 0 0 14-14A14.173 14.173 0 0 0 16 2m8 15h-7v7h-2v-7H8v-2h7V8h2v7h7Z"
      />
      <path fill="none" d="M24 17h-7v7h-2v-7H8v-2h7V8h2v7h7z" />
    </>
  ),
  "ri:rotate-lock-fill": (
    <path
      fill="currentColor"
      d="M12 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.811 5.741L17 12h3a8 8 0 1 0-2.46 5.772l.998 1.795A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2m0 5a3 3 0 0 1 3 3v1h1v5H8v-5h1v-1a3 3 0 0 1 3-3m0 2a1 1 0 0 0-.993.883L11 10v1h2v-1a1 1 0 0 0-.883-.993z"
    />
  ),
  "mi:notification": (
    <path
      fill="currentColor"
      d="M10.146 3.248a2 2 0 0 1 3.708 0A7.003 7.003 0 0 1 19 10v4.697l1.832 2.748A1 1 0 0 1 20 19h-4.535a3.501 3.501 0 0 1-6.93 0H4a1 1 0 0 1-.832-1.555L5 14.697V10c0-3.224 2.18-5.94 5.146-6.752M10.586 19a1.5 1.5 0 0 0 2.829 0zM12 5a5 5 0 0 0-5 5v5a1 1 0 0 1-.168.555L5.869 17H18.13l-.963-1.445A1 1 0 0 1 17 15v-5a5 5 0 0 0-5-5"
    />
  ),
  "ci:user-01": (
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21a7 7 0 1 0-14 0m7-10a4 4 0 1 1 0-8 4 4 0 0 1 0 8"
    />
  ),
  "charm:sun": (
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <circle cx={8} cy={8} r={3.25} />
      <path d="m2.75 13.25.5-.5m9.5 0 .5.5m-.5-10 .5-.5m-10 .5-.5-.5M2.25 8h-1m13.5 0h-1M8 13.75v1m0-13.5v1" />
    </g>
  ),
  "ph:moon-bold": (
    <path
      fill="currentColor"
      d="M236.37 139.4a12 12 0 0 0-12-3A84.07 84.07 0 0 1 119.6 31.59a12 12 0 0 0-15-15 108.86 108.86 0 0 0-54.91 38.48A108 108 0 0 0 136 228a107.09 107.09 0 0 0 64.93-21.69 108.86 108.86 0 0 0 38.44-54.94 12 12 0 0 0-3-11.97m-49.88 47.74A84 84 0 0 1 68.86 69.51a84.93 84.93 0 0 1 23.41-21.22Q92 52.13 92 56a108.12 108.12 0 0 0 108 108q3.87 0 7.71-.27a84.79 84.79 0 0 1-21.22 23.41"
    />
  ),
  "mingcute:remote-line": (
    <g fill="none">
      <path d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z" />
      <path
        fill="currentColor"
        d="M16 12a3 3 0 0 1 3 3v6a1 1 0 1 1-2 0v-6a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6a1 1 0 1 1-2 0v-6a3 3 0 0 1 3-3zm-2 4a1 1 0 0 1 .117 1.993L14 18h-4a1 1 0 0 1-.117-1.993L10 16zm-2-8c1.06 0 2.047.331 2.857.896a1 1 0 0 1-1.144 1.641A2.982 2.982 0 0 0 12 10c-.639 0-1.228.198-1.713.537a1 1 0 1 1-1.144-1.64A4.982 4.982 0 0 1 12 8m0-3c1.918 0 3.681.676 5.06 1.803a1 1 0 1 1-1.266 1.548A5.97 5.97 0 0 0 12 7c-1.44 0-2.758.506-3.792 1.35a1 1 0 1 1-1.265-1.549A7.971 7.971 0 0 1 12 5m0-3a10.96 10.96 0 0 1 7.209 2.691 1 1 0 0 1-1.311 1.51A8.961 8.961 0 0 0 12 4a8.95 8.95 0 0 0-5.9 2.205 1 1 0 0 1-1.312-1.51A10.961 10.961 0 0 1 12 2"
      />
    </g>
  ),
  "solar:play-stream-linear": (
    <g fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.141 5A9.967 9.967 0 0 1 22 12a9.969 9.969 0 0 1-2.922 7.064M5 19.142A9.97 9.97 0 0 1 2 12a9.969 9.969 0 0 1 2.936-7.078m11.349 3.122C17.345 9.059 18 10.449 18 11.982c0 1.552-.67 2.957-1.753 3.974M7.8 16C6.69 14.979 6 13.556 6 11.982 6 10.427 6.673 9.018 7.762 8"
      />
      <path d="M13.656 10.451C14.552 11.11 15 11.438 15 12c0 .562-.448.891-1.344 1.549a13.08 13.08 0 0 1-.718.495 12.23 12.23 0 0 1-.653.38c-.894.49-1.34.735-1.741.464-.401-.271-.437-.838-.51-1.971-.02-.321-.034-.635-.034-.917 0-.282.013-.596.034-.917.072-1.133.109-1.7.51-1.97.4-.272.847-.027 1.74.462.233.127.457.256.654.381.226.143.471.314.718.495Z" />
    </g>
  ),
  "ph:screencast-bold": (
    <path
      fill="currentColor"
      d="M232 60v136a20 20 0 0 1-20 20h-40a12 12 0 0 1 0-24h36V64H48v4a12 12 0 0 1-24 0v-8a20 20 0 0 1 20-20h168a20 20 0 0 1 20 20M36 176a12 12 0 0 0 0 24 4 4 0 0 1 4 4 12 12 0 0 0 24 0 28 28 0 0 0-28-28m0-40a12 12 0 0 0 0 24 44.05 44.05 0 0 1 44 44 12 12 0 0 0 24 0 68.07 68.07 0 0 0-68-68m0-40a12 12 0 0 0 0 24 84.09 84.09 0 0 1 84 84 12 12 0 0 0 24 0A108.12 108.12 0 0 0 36 96"
    />
  ),
  "lucide:camera": (
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z" />
      <circle cx={12} cy={13} r={3} />
    </g>
  ),
  CL: <path fill="currentColor" d="m14 18-6-6 6-6 1.4 1.4-4.6 4.6 4.6 4.6z" />,
  CU: (
    <path
      fill="currentColor"
      d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z"
    />
  ),
  facebook: (
    <path
      fill="currentColor"
      d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
    />
  ),
  instagram: (
    <path
      fill="currentColor"
      d="M13.028 2c1.125.003 1.696.009 2.189.023l.194.007c.224.008.445.018.712.03 1.064.05 1.79.218 2.427.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.012.266.022.487.03.712l.006.194c.015.492.021 1.063.023 2.188l.001.746v1.31a78.831 78.831 0 0 1-.023 2.188l-.006.194c-.008.225-.018.446-.03.712-.05 1.065-.22 1.79-.466 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.427.465a72.11 72.11 0 0 1-.712.03l-.194.006c-.493.014-1.064.021-2.189.023l-.746.001h-1.309a78.43 78.43 0 0 1-2.189-.023l-.194-.006a63.036 63.036 0 0 1-.712-.031c-1.064-.05-1.79-.218-2.428-.465a4.889 4.889 0 0 1-1.771-1.153 4.904 4.904 0 0 1-1.154-1.772c-.247-.637-.415-1.363-.465-2.428a74.1 74.1 0 0 1-.03-.712l-.005-.194A79.047 79.047 0 0 1 2 13.028v-2.056a78.82 78.82 0 0 1 .022-2.188l.007-.194c.008-.225.018-.446.03-.712.05-1.065.218-1.79.465-2.428A4.88 4.88 0 0 1 3.68 3.678a4.897 4.897 0 0 1 1.77-1.153c.638-.247 1.363-.415 2.428-.465.266-.012.488-.022.712-.03l.194-.006a79 79 0 0 1 2.188-.023zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10m0 2a3 3 0 1 1 .001 6 3 3 0 0 1 0-6m5.25-3.5a1.25 1.25 0 0 0 0 2.5 1.25 1.25 0 0 0 0-2.5"
    />
  ),
  twitter: (
    <path
      fill="currentColor"
      d="M18.205 2.25h3.308l-7.227 8.26 8.502 11.24H16.13l-5.214-6.817L4.95 21.75H1.64l7.73-8.835L1.215 2.25H8.04l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"
    />
  ),
  linkedin: (
    <path
      fill="currentColor"
      d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
    />
  ),
  "fluent:mic-48-filled": (
    <path
      fill="currentColor"
      d="M24 4a8 8 0 0 0-8 8v12a8 8 0 1 0 16 0V12a8 8 0 0 0-8-8m1 33.715c7.265-.513 13-6.57 13-13.965a1.25 1.25 0 1 0-2.5 0c0 6.351-5.149 11.5-11.5 11.5s-11.5-5.149-11.5-11.5a1.25 1.25 0 1 0-2.5 0c0 7.225 5.473 13.172 12.5 13.92v5.08a1.25 1.25 0 1 0 2.5 0z"
    />
  ),
  "fluent:send-20-filled": (
    <path
      fill="currentColor"
      d="M2.724 2.053a.5.5 0 0 0-.707.576l1.498 5.618a.5.5 0 0 0 .4.364l6.855 1.142c.279.047.279.447 0 .494l-6.854 1.142a.5.5 0 0 0-.401.364l-1.498 5.618a.5.5 0 0 0 .707.576l15-7.5a.5.5 0 0 0 0-.894z"
    />
  ),
  "ph:clock-fill": (
    <path
      fill="currentColor"
      d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m56 112h-56a8 8 0 0 1-8-8V72a8 8 0 0 1 16 0v48h48a8 8 0 0 1 0 16"
    />
  ),
  "line-md:log-out": (
    <path
      fill="currentColor"
      d="m17 7-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5M4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4z"
    />
  ),
  "bi:bootstrap-reboot": (
    <g fill="currentColor">
      <path d="M1.161 8a6.84 6.84 0 1 0 6.842-6.84.58.58 0 1 1 0-1.16 8 8 0 1 1-6.556 3.412l-.663-.577a.58.58 0 0 1 .227-.997l2.52-.69a.58.58 0 0 1 .728.633l-.332 2.592a.58.58 0 0 1-.956.364l-.643-.56A6.8 6.8 0 0 0 1.16 8z" />
      <path d="M6.641 11.671V8.843h1.57l1.498 2.828h1.314L9.377 8.665c.897-.3 1.427-1.106 1.427-2.1 0-1.37-.943-2.246-2.456-2.246H5.5v7.352zm0-3.75V5.277h1.57c.881 0 1.416.499 1.416 1.32 0 .84-.504 1.324-1.386 1.324z" />
    </g>
  ),
  "fluent:delete-16-regular": (
    <path
      fill="currentColor"
      d="M7 3h2a1 1 0 0 0-2 0M6 3a2 2 0 1 1 4 0h4a.5.5 0 0 1 0 1h-.564l-1.205 8.838A2.5 2.5 0 0 1 9.754 15H6.246a2.5 2.5 0 0 1-2.477-2.162L2.564 4H2a.5.5 0 0 1 0-1zm1 3.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0zM9.5 6a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5m-4.74 6.703A1.5 1.5 0 0 0 6.246 14h3.508a1.5 1.5 0 0 0 1.487-1.297L12.427 4H3.573z"
    />
  ),
  "jam:alert-f": (
    <path
      fill="currentColor"
      d="M10 20.393c-5.523 0-10-4.477-10-10 0-5.522 4.477-10 10-10s10 4.478 10 10c0 5.523-4.477 10-10 10m0-15a1 1 0 0 0-1 1v5a1 1 0 0 0 2 0v-5a1 1 0 0 0-1-1m0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2"
    />
  ),
  "gridicons:cross-circle": (
    <path
      fill="currentColor"
      d="M19.1 4.9C15.2 1 8.8 1 4.9 4.9S1 15.2 4.9 19.1s10.2 3.9 14.1 0 4-10.3.1-14.2m-4.3 11.3L12 13.4l-2.8 2.8-1.4-1.4 2.8-2.8-2.8-2.8 1.4-1.4 2.8 2.8 2.8-2.8 1.4 1.4-2.8 2.8 2.8 2.8z"
    />
  ),
  "mdi:tick-circle": (
    <path
      fill="currentColor"
      d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8z"
    />
  ),
  "icon-park-solid:caution": (
    <>
      <defs>
        <mask id="a">
          <g fill="none" strokeWidth={4}>
            <path
              fill="#fff"
              fillRule="evenodd"
              stroke="#fff"
              strokeLinejoin="round"
              d="M24 5 2 43h44z"
              clipRule="evenodd"
            />
            <path
              stroke="#000"
              strokeLinecap="round"
              d="M24 35v1m0-17 .008 10"
            />
          </g>
        </mask>
      </defs>
      <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#a)" />
    </>
  ),
  "pepicons-pencil:dots-y": (
    <path
      fill="currentColor"
      d="M9 15.25a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0m0-5a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0m0-5a1.249 1.249 0 1 1 2.5 0 1.25 1.25 0 1 1-2.5 0"
    />
  ),
  CR: <path fill="currentColor" d="M12.6 12 8 7.4 9.4 6l6 6-6 6L8 16.6z" />,
  "ph:calendar-duotone": (
    <g fill="currentColor">
      <path
        d="M216 48v40H40V48a8 8 0 0 1 8-8h160a8 8 0 0 1 8 8"
        opacity={0.2}
      />
      <path d="M208 32h-24v-8a8 8 0 0 0-16 0v8H88v-8a8 8 0 0 0-16 0v8H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M72 48v8a8 8 0 0 0 16 0v-8h80v8a8 8 0 0 0 16 0v-8h24v32H48V48Zm136 160H48V96h160zm-96-88v64a8 8 0 0 1-16 0v-51.06l-4.42 2.22a8 8 0 0 1-7.16-14.32l16-8A8 8 0 0 1 112 120m59.16 30.45L152 176h16a8 8 0 0 1 0 16h-32a8 8 0 0 1-6.4-12.8l28.78-38.37a8 8 0 1 0-13.31-8.83 8 8 0 1 1-13.85-8A24 24 0 0 1 176 136a23.76 23.76 0 0 1-4.84 14.45" />
    </g>
  ),
  "fluent:live-24-regular": (
    <path
      fill="currentColor"
      d="M5.99 4.929a.75.75 0 0 1 0 1.06 8.5 8.5 0 0 0 0 12.021.75.75 0 0 1-1.061 1.06c-3.905-3.905-3.905-10.236 0-14.141a.75.75 0 0 1 1.06 0m13.081 0c3.905 3.905 3.905 10.237 0 14.142a.75.75 0 0 1-1.06-1.06 8.5 8.5 0 0 0 0-12.022.75.75 0 1 1 1.06-1.06M8.818 7.757a.75.75 0 0 1 0 1.06 4.5 4.5 0 0 0 0 6.365.75.75 0 0 1-1.06 1.06 6 6 0 0 1 0-8.485.75.75 0 0 1 1.06 0m7.425 0a6 6 0 0 1 0 8.485.75.75 0 1 1-1.061-1.06 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 1.06-1.06M12 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3"
    />
  ),
  "solar:playback-speed-bold": (
    <>
      <path
        fill="currentColor"
        d="M9.608 1.517c.77-.175 1.57-.267 2.392-.267 5.937 0 10.75 4.813 10.75 10.75S17.937 22.75 12 22.75c-.822 0-1.622-.092-2.392-.267a.75.75 0 1 1 .332-1.463 9.25 9.25 0 1 0 0-18.04.75.75 0 1 1-.332-1.463M7.314 3.132a.75.75 0 0 1-.235 1.034A9.303 9.303 0 0 0 4.166 7.08a.75.75 0 0 1-1.27-.8A10.803 10.803 0 0 1 6.28 2.897a.75.75 0 0 1 1.035.235M2.98 9.94a.75.75 0 1 0-1.463-.332c-.175.77-.267 1.57-.267 2.392 0 .822.092 1.622.267 2.393a.75.75 0 0 0 1.463-.333A9.283 9.283 0 0 1 2.75 12c0-.709.08-1.398.23-2.06m.152 6.746a.75.75 0 0 1 1.034.235 9.302 9.302 0 0 0 2.913 2.913.75.75 0 0 1-.8 1.27 10.804 10.804 0 0 1-3.382-3.383.75.75 0 0 1 .235-1.035"
      />
      <path
        fill="currentColor"
        d="M15.414 10.941c.781.462.781 1.656 0 2.118l-4.72 2.787C9.934 16.294 9 15.71 9 14.786V9.214c0-.924.934-1.507 1.694-1.059z"
      />
    </>
  ),
  "mdi:events-check": (
    <path
      fill="currentColor"
      d="M21 17V8H7v9zm0-14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1V1h2v2h8V1h2v2zm-3.47 8.06-4.44 4.44-2.68-2.68 1.06-1.06 1.62 1.62L16.47 10zM3 21h14v2H3a2 2 0 0 1-2-2V9h2z"
    />
  ),
  "carbon:settings": (
    <>
      <path
        fill="currentColor"
        d="M27 16.76v-1.53l1.92-1.68A2 2 0 0 0 29.3 11l-2.36-4a2 2 0 0 0-1.73-1 2 2 0 0 0-.64.1l-2.43.82a11.35 11.35 0 0 0-1.31-.75l-.51-2.52a2 2 0 0 0-2-1.61h-4.68a2 2 0 0 0-2 1.61l-.51 2.52a11.48 11.48 0 0 0-1.32.75l-2.38-.86A2 2 0 0 0 6.79 6a2 2 0 0 0-1.73 1L2.7 11a2 2 0 0 0 .41 2.51L5 15.24v1.53l-1.89 1.68A2 2 0 0 0 2.7 21l2.36 4a2 2 0 0 0 1.73 1 2 2 0 0 0 .64-.1l2.43-.82a11.35 11.35 0 0 0 1.31.75l.51 2.52a2 2 0 0 0 2 1.61h4.72a2 2 0 0 0 2-1.61l.51-2.52a11.48 11.48 0 0 0 1.32-.75l2.42.82a2 2 0 0 0 .64.1 2 2 0 0 0 1.73-1l2.28-4a2 2 0 0 0-.41-2.51ZM25.21 24l-3.43-1.16a8.86 8.86 0 0 1-2.71 1.57L18.36 28h-4.72l-.71-3.55a9.36 9.36 0 0 1-2.7-1.57L6.79 24l-2.36-4 2.72-2.4a8.9 8.9 0 0 1 0-3.13L4.43 12l2.36-4 3.43 1.16a8.86 8.86 0 0 1 2.71-1.57L13.64 4h4.72l.71 3.55a9.36 9.36 0 0 1 2.7 1.57L25.21 8l2.36 4-2.72 2.4a8.9 8.9 0 0 1 0 3.13L27.57 20Z"
      />
      <path
        fill="currentColor"
        d="M16 22a6 6 0 1 1 6-6 5.94 5.94 0 0 1-6 6m0-10a3.91 3.91 0 0 0-4 4 3.91 3.91 0 0 0 4 4 3.91 3.91 0 0 0 4-4 3.91 3.91 0 0 0-4-4"
      />
    </>
  ),
  "5:5": (
    <>
      <circle cx={11.528} cy={88.472} r={5.824} fill="currentColor" />
      <circle cx={88.472} cy={11.528} r={5.824} fill="currentColor" />
      <circle cx={69.236} cy={11.528} r={5.824} fill="currentColor" />
      <circle cx={50} cy={11.528} r={5.824} fill="currentColor" />
      <circle cx={30.764} cy={11.528} r={5.824} fill="currentColor" />
      <circle cx={11.528} cy={11.528} r={5.824} fill="currentColor" />
      <circle cx={88.472} cy={88.472} r={5.824} fill="currentColor" />
      <circle cx={88.472} cy={69.236} r={5.824} fill="currentColor" />
      <circle cx={88.472} cy={50} r={5.824} fill="currentColor" />
      <circle cx={88.472} cy={30.764} r={5.824} fill="currentColor" />
      <circle cx={69.472} cy={88.472} r={5.824} fill="currentColor" />
      <circle cx={69.472} cy={69.236} r={5.824} fill="currentColor" />
      <circle cx={69.472} cy={50} r={5.824} fill="currentColor" />
      <circle cx={69.472} cy={30.764} r={5.824} fill="currentColor" />
      <circle cx={50.472} cy={88.472} r={5.824} fill="currentColor" />
      <circle cx={50.472} cy={69.236} r={5.824} fill="currentColor" />
      <circle cx={50.472} cy={50} r={5.824} fill="currentColor" />
      <circle cx={50.472} cy={30.764} r={5.824} fill="currentColor" />
      <circle cx={30.472} cy={88.472} r={5.824} fill="currentColor" />
      <circle cx={30.472} cy={69.236} r={5.824} fill="currentColor" />
      <circle cx={30.472} cy={50} r={5.824} fill="currentColor" />
      <circle cx={30.472} cy={30.764} r={5.824} fill="currentColor" />
      <circle cx={11.472} cy={69.236} r={5.824} fill="currentColor" />
      <circle cx={11.472} cy={50} r={5.824} fill="currentColor" />
      <circle cx={11.472} cy={30.764} r={5.824} fill="currentColor" />
      <circle cx={88.472} cy={11.528} r={5.824} fill="currentColor" />
      <circle cx={69.236} cy={11.528} r={5.824} fill="currentColor" />
      <circle cx={50} cy={11.528} r={5.824} fill="currentColor" />
      <circle cx={30.764} cy={11.528} r={5.824} fill="currentColor" />
      <circle cx={11.528} cy={11.528} r={5.824} fill="currentColor" />
    </>
  ),
  "4:4": (
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={4}>
      <rect width={40} height={40} x={4} y={4} strokeLinejoin="round" rx={2} />
      <path d="M14 4v40M24 4v40M34 4v40" />
      <path strokeLinejoin="round" d="M4 14h40M4 34h40M4 24h40" />
    </g>
  ),
  "3:3": (
    <path
      fill="currentColor"
      d="M10 4v4h4V4zm6 0v4h4V4zm0 6v4h4v-4zm0 6v4h4v-4zm-2 4v-4h-4v4zm-6 0v-4H4v4zm0-6v-4H4v4zm0-6V4H4v4zm2 6h4v-4h-4zM4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4c-1.08 0-2-.9-2-2V4a2 2 0 0 1 2-2"
    />
  ),
  "2:2": (
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M12.5 2H8v5h5V2.5a.5.5 0 0 0-.5-.5m.5 6H8v5h4.5a.5.5 0 0 0 .5-.5zM7 7V2H2.5a.5.5 0 0 0-.5.5V7zM2 8v4.5a.5.5 0 0 0 .5.5H7V8zm.5-7A1.5 1.5 0 0 0 1 2.5v10A1.5 1.5 0 0 0 2.5 14h10a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 12.5 1z"
      clipRule="evenodd"
    />
  ),
  "1:1": (
    <path
      fill="currentColor"
      d="M208 34H48a14 14 0 0 0-14 14v160a14 14 0 0 0 14 14h160a14 14 0 0 0 14-14V48a14 14 0 0 0-14-14m2 174a2 2 0 0 1-2 2H48a2 2 0 0 1-2-2V48a2 2 0 0 1 2-2h160a2 2 0 0 1 2 2Z"
    />
  ),
  Default: (
    <path
      fill="currentColor"
      d="M2 7.25A3.25 3.25 0 0 1 5.25 4h13.5A3.25 3.25 0 0 1 22 7.25v5.56a6.518 6.518 0 0 0-1.5-1.078V7.25a1.75 1.75 0 0 0-1.75-1.75H5.25A1.75 1.75 0 0 0 3.5 7.25v9.5c0 .966.784 1.75 1.75 1.75h5.826c.081.523.224 1.026.422 1.5H5.25A3.25 3.25 0 0 1 2 16.75zm12.278 6.726a2 2 0 0 1-1.441 2.496l-.584.144a5.728 5.728 0 0 0 .006 1.808l.54.13a2 2 0 0 1 1.45 2.51l-.187.631c.44.386.94.699 1.484.922l.494-.519a2 2 0 0 1 2.899 0l.498.525a5.276 5.276 0 0 0 1.483-.913l-.198-.686a2 2 0 0 1 1.441-2.496l.584-.144a5.716 5.716 0 0 0-.006-1.808l-.54-.13a2 2 0 0 1-1.45-2.51l.187-.63a5.282 5.282 0 0 0-1.484-.922l-.493.518a2 2 0 0 1-2.9 0l-.498-.525a5.28 5.28 0 0 0-1.483.912zM17.5 19c-.8 0-1.45-.672-1.45-1.5S16.7 16 17.5 16c.8 0 1.45.672 1.45 1.5S18.3 19 17.5 19"
    />
  ),
  "2C": (
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zm9-1v18"
    />
  ),
  "1C": (
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"
    />
  ),
  Sideline: (
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M2 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0m8 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0m8 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0"
      clipRule="evenodd"
    />
  ),
  Copy: (
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    >
      <rect width={14} height={14} x={8} y={8} rx={2} ry={2} />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </g>
  ),
  Tablet: (
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    >
      <rect width={10} height={14} x={3} y={8} rx={2} />
      <path d="M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4M8 18h.01" />
    </g>
  ),
  Camera: (
    <path
      fill="currentColor"
      d="M2 4.5A1.5 1.5 0 0 1 3.5 3h13a1.5 1.5 0 0 1 0 3h-13A1.5 1.5 0 0 1 2 4.5M10 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6m-2 3a2 2 0 1 1 4 0 2 2 0 0 1-4 0M3 7h14v4a7 7 0 1 1-14 0zm7 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8"
    />
  ),
  Hub: (
    <path
      fill="currentColor"
      d="M6 23q-1.25 0-2.125-.875T3 20q0-1.25.875-2.125T6 17q.35 0 .65.075t.575.2L8.65 15.5q-.7-.775-.975-1.75T7.55 11.8l-2.025-.675q-.425.625-1.075 1T3 12.5q-1.25 0-2.125-.875T0 9.5q0-1.25.875-2.125T3 6.5q1.25 0 2.125.875T6 9.5v.2l2.025.7q.5-.9 1.338-1.525t1.887-.8V5.9q-.975-.275-1.612-1.063T9 3q0-1.25.875-2.125T12 0q1.25 0 2.125.875T15 3q0 1.05-.65 1.838T12.75 5.9v2.175q1.05.175 1.888.8t1.337 1.525L18 9.7v-.2q0-1.25.875-2.125T21 6.5q1.25 0 2.125.875T24 9.5q0 1.25-.875 2.125T21 12.5q-.8 0-1.463-.375t-1.062-1l-2.025.675q.15.975-.125 1.938T15.35 15.5l1.425 1.75q.275-.125.575-.187T18 17q1.25 0 2.125.875T21 20q0 1.25-.875 2.125T18 23q-1.25 0-2.125-.875T15 20q0-.5.163-.962t.437-.838l-1.425-1.775Q13.15 17 11.988 17T9.8 16.425L8.4 18.2q.275.375.438.838T9 20q0 1.25-.875 2.125T6 23"
    />
  ),
  Info: (
    <path
      fill="currentColor"
      d="M24.332 13.246c0 1.875 1.5 3.375 3.375 3.375 1.898 0 3.375-1.5 3.352-3.375 0-1.898-1.454-3.398-3.352-3.398-1.875 0-3.375 1.5-3.375 3.398M18.52 44.231c0 1.148.82 1.921 2.062 1.921h14.836c1.242 0 2.063-.773 2.063-1.922 0-1.124-.82-1.898-2.063-1.898h-4.711V24.449c0-1.265-.82-2.11-2.039-2.11h-7.43c-1.218 0-2.039.75-2.039 1.876 0 1.172.82 1.945 2.04 1.945h5.132v16.172h-5.789c-1.242 0-2.062.773-2.062 1.898"
    />
  ),
};

const SvgComponent = ({
  name,
  ...props
}: { name: string } & SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...props}>
      {svgs[name]}
    </svg>
  );
};

export default SvgComponent;
