/**
 * psymed.js — Script compartido de navegación e interacciones
 * Se incluye en todas las pantallas con: <script src="../psymed.js"></script>
 * Cada pantalla define window.PSYMED_ROLE = 'doctor' | 'paciente'
 * y window.PSYMED_PAGE = 'login' | 'agenda' | etc.
 */
(function () {
  /* ──────────────────────────────────────────────────────────────
     0. LAYOUT: hacer que el contenedor ocupe el viewport completo
     ────────────────────────────────────────────────────────────── */
  function fixLayout() {
    // El primer <div> hijo del body es el wrapper que contiene la pantalla
    var wrapper = document.body.firstElementChild;
    if (!wrapper) return;

    // El contenedor de la pantalla (tiene width:1040px)
    var screen = wrapper.firstElementChild;
    if (!screen) return;

    // Quitar el ancho fijo de 1040px y hacer que llene el viewport
    screen.style.width = '100%';
    screen.style.minWidth = '0';
    screen.style.borderRadius = '0';
    screen.style.boxShadow = 'none';
    screen.style.border = 'none';

    // El contenido interno con height:600px — expandirlo al viewport restante
    var contentArea = screen.children[1]; // segundo hijo = área de contenido
    if (contentArea) {
      var navH = 56; // altura de la navbar
      contentArea.style.height = 'auto';
      contentArea.style.minHeight = 'calc(100vh - ' + navH + 'px)';
    }
  }

  /* ──────────────────────────────────────────────────────────────
     1. RUTAS DE NAVEGACIÓN
     ────────────────────────────────────────────────────────────── */
  var role = window.PSYMED_ROLE || 'doctor';
  var base = '../' + role + '/';   // ruta relativa desde doctor/ o paciente/

  // Tabs del navbar → destino
  var NAV = {
    doctor: {
      'Agenda':    'agenda.html',
      'Pacientes': 'lista.html',
      'Citas':     'citas.html',
      'Asistente': 'asistente.html'
    },
    paciente: {
      'Inicio':    'agenda.html',
      'Mis Citas': 'citas.html',
      'Terapia':   'citas.html'
    }
  };

  // Texto de botón/acción → destino (texto exacto del nodo hoja)
  var ACTIONS = {
    doctor: {
      'Entrar':           'agenda.html',
      'Crear cuenta':     'agenda.html',
      'Add Patient':      'nuevo.html',
      'Watch Patients':   'lista.html',
      'Guardar cambios':  'lista.html',
      'Upload':           'lista.html',
      'Cancelar':         'back',
      'Back':             'back',
      'Guardar':          'back',
      'Save':             'back',
      'Receta médica':    'documentos.html',
      'Asignaciones':     'nuevo.html',
      'Ver ficha completa': 'ficha.html',
      'Agendar cita':     'citas.html',
      'Revisar medicación': 'medicacion.html',
      'Add / Edit':       'nuevo.html',
      'New Date':         'citas.html',
      'Editar':           'perfil.html',
      'Diagnóstico':      'resumen.html',
      'Historia Clínica': 'resumen.html',
      'Terapia':          'panel.html',
      'Notas':            'resumen.html',
      'Citas':            'citas.html'
    },
    paciente: {
      'Entrar':           'agenda.html',
      'Enviar reporte':   'agenda.html',
      'Completar':        'reporte.html',
      'Ver terapia':      'citas.html',
      'Back':             'back'
    }
  };

  var navMap     = NAV[role]     || {};
  var actionMap  = ACTIONS[role] || {};

  function go(dest) {
    if (dest === 'back') { history.back(); return; }
    // Si ya estamos en la subcarpeta, no añadir base
    var cur = window.location.pathname;
    if (cur.indexOf('/' + role + '/') !== -1) {
      window.location.href = dest;
    } else {
      window.location.href = base + dest;
    }
  }

  /* ──────────────────────────────────────────────────────────────
     2. HELPERS DE DETECCIÓN
     ────────────────────────────────────────────────────────────── */

  // Texto propio del nodo (sin texto de hijos) — más fiable que textContent
  function ownText(el) {
    var text = '';
    el.childNodes.forEach(function (n) {
      if (n.nodeType === 3) text += n.textContent;
    });
    return text.trim();
  }

  function hasStyle(el, prop) {
    return (el.getAttribute('style') || '').indexOf(prop) !== -1;
  }

  function makeClickable(el, dest) {
    el.style.cursor = 'pointer';
    el.style.transition = el.style.transition || 'transform .15s, box-shadow .15s';
    el.addEventListener('mouseenter', function () {
      el.style.transform = 'translateY(-1px)';
      el.style.opacity = '0.92';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transform = '';
      el.style.opacity = '';
    });
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      go(dest);
    });
  }

  /* ──────────────────────────────────────────────────────────────
     3. VINCULACIÓN DE ELEMENTOS
     ────────────────────────────────────────────────────────────── */
  function bindAll() {

    /* 3a. TABS DEL NAVBAR */
    document.querySelectorAll('span').forEach(function (el) {
      if (hasStyle(el, 'padding:7px 13px') && hasStyle(el, 'border-radius:9px')) {
        var txt = el.textContent.trim();
        if (navMap[txt]) makeClickable(el, navMap[txt]);
      }
    });

    /* 3b. BOTONES DE ACCIÓN (spans con texto propio) */
    document.querySelectorAll('span').forEach(function (el) {
      var t = ownText(el);
      if (t && actionMap[t]) {
        if (hasStyle(el, 'border-radius') || hasStyle(el, 'display:flex') || hasStyle(el, 'display:inline-flex')) {
          makeClickable(el, actionMap[t]);
        }
      }
    });

    /* 3c. BOTONES DE ACCIÓN (divs con texto propio) */
    document.querySelectorAll('div').forEach(function (el) {
      var t = ownText(el);
      if (t && actionMap[t]) {
        if (hasStyle(el, 'border-radius') && (hasStyle(el, 'background') || hasStyle(el, 'border'))) {
          makeClickable(el, actionMap[t]);
        }
      }
    });

    /* 3d. TARJETAS DE PACIENTE (en agenda y lista) */
    document.querySelectorAll('div').forEach(function (el) {
      var s = el.getAttribute('style') || '';
      // Tarjeta de paciente en agenda (padding:13px)
      if (s.indexOf('border-radius:13px') !== -1 && s.indexOf('padding:13px') !== -1) {
        el.style.cursor = 'pointer';
        el.style.transition = 'transform .15s, box-shadow .15s';
        el.addEventListener('mouseenter', function () { el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 6px 16px rgba(0,0,0,.1)'; });
        el.addEventListener('mouseleave', function () { el.style.transform = ''; el.style.boxShadow = ''; });
        el.addEventListener('click', function (e) { e.stopPropagation(); go(role === 'doctor' ? 'ficha.html' : 'agenda.html'); });
      }
      // Fila de paciente en lista (padding:13px 20px)
      if (s.indexOf('border-top:1px solid #F0F3F5') !== -1 && s.indexOf('padding:13px 20px') !== -1) {
        el.style.cursor = 'pointer';
        el.style.transition = 'background .15s';
        el.addEventListener('mouseenter', function () { el.style.background = '#F8FBFC'; });
        el.addEventListener('mouseleave', function () { el.style.background = ''; });
        el.addEventListener('click', function (e) { e.stopPropagation(); go('ficha.html'); });
      }
    });

    /* 3e. ELEMENTOS DE HISTORIA CLÍNICA en ficha (sidebar derecha) */
    document.querySelectorAll('div').forEach(function (el) {
      var s = el.getAttribute('style') || '';
      if (s.indexOf('border-radius:12px') !== -1 && s.indexOf('padding:14px 15px') !== -1) {
        var label = el.querySelector('span[style*="font-weight:700"]') || el.querySelector('span[style*="font-weight:600"]');
        if (!label) return;
        var txt = label.textContent.trim();
        var dest = {
          'Diagnóstico':      'resumen.html',
          'Historia Clínica': 'resumen.html',
          'Terapia':          'panel.html',
          'Notas':            'resumen.html',
          'Citas':            'citas.html'
        }[txt];
        if (dest) {
          el.style.cursor = 'pointer';
          el.style.transition = 'background .15s, border-color .15s';
          el.addEventListener('mouseenter', function () { el.style.background = '#E6F2F3'; el.style.borderColor = '#CCE5E7'; });
          el.addEventListener('mouseleave', function () { el.style.background = ''; el.style.borderColor = ''; });
          el.addEventListener('click', function (e) { e.stopPropagation(); go(dest); });
        }
      }
    });

    /* 3f. ICONO DE AJUSTES / PERFIL (gear icon) */
    document.querySelectorAll('span').forEach(function (el) {
      var s = el.getAttribute('style') || '';
      // El span del icono settings tiene border-radius:9px y svg interno de settings
      if (s.indexOf('border-radius:9px') !== -1 && s.indexOf('34px') !== -1 && el.querySelector('circle[cx="12"]')) {
        makeClickable(el, 'perfil.html');
      }
    });

    /* 3g. AVATAR del doctor (círculo LS) — va a perfil */
    document.querySelectorAll('span').forEach(function (el) {
      var s = el.getAttribute('style') || '';
      if (s.indexOf('border-radius:50%') !== -1 && s.indexOf('background:#0E7C86') !== -1 && el.textContent.trim() === 'LS') {
        makeClickable(el, 'perfil.html');
      }
    });

    /* 3h. "¿No tienes cuenta? Regístrate" */
    document.querySelectorAll('span').forEach(function (el) {
      if (el.textContent.trim() === 'Regístrate') {
        makeClickable(el, 'registro.html');
      }
      if (el.textContent.trim() === 'Inicia sesión') {
        makeClickable(el, 'login.html');
      }
    });

    /* 3i. "Cancelar" en cualquier span/div que solo diga "Cancelar" */
    document.querySelectorAll('span').forEach(function (el) {
      if (ownText(el) === 'Cancelar') makeClickable(el, 'back');
    });

    /* 3j. "Add New" en Prescripción actual → medicacion.html */
    document.querySelectorAll('span').forEach(function (el) {
      var s = el.getAttribute('style') || '';
      var t = ownText(el);
      // "Add New" pill verde en panel.html
      if (t === 'Add New' && s.indexOf('background:#0E7C86') !== -1) {
        makeClickable(el, 'medicacion.html');
      }
      // "Editar" pill gris en panel.html → medicacion también
      if (t === 'Editar' && s.indexOf('border-radius:8px') !== -1) {
        makeClickable(el, 'medicacion.html');
      }
    });

    document.querySelectorAll('div').forEach(function (el) {
      var s = el.getAttribute('style') || '';
      // "Prescripción actual" Editar button (div)
      if (ownText(el) === 'Editar' && s.indexOf('border-radius:8px') !== -1) {
        makeClickable(el, 'medicacion.html');
      }
    });

    /* 3k. Tarjetas de cita en citas.html doctor → panel */
    document.querySelectorAll('div').forEach(function (el) {
      var s = el.getAttribute('style') || '';
      if (s.indexOf('border-radius:12px') !== -1 && s.indexOf('padding:13px 16px') !== -1 && s.indexOf('display:flex') !== -1) {
        if (el.querySelector('div[style*="font-weight:700"]')) {
          el.style.cursor = 'pointer';
          el.style.transition = 'background .12s';
          el.addEventListener('mouseenter', function () { el.style.background = '#F4F7F9'; });
          el.addEventListener('mouseleave', function () { el.style.background = ''; });
          el.addEventListener('click', function (e) { e.stopPropagation(); go('panel.html'); });
        }
      }
    });
  }

  /* ──────────────────────────────────────────────────────────────
     4. INYECCIÓN DEL BOTÓN "ASISTENTE" EN EL NAVBAR DEL DOCTOR
     Solo se añade si no existe ya (la pantalla asistente.html ya lo tiene)
     ────────────────────────────────────────────────────────────── */
  function injectAsistenteTab() {
    if (role !== 'doctor') return;

    // Buscar el contenedor de tabs del navbar (tiene los spans de Agenda/Pacientes/Citas)
    var navTabsContainer = null;
    document.querySelectorAll('div').forEach(function (el) {
      var s = el.getAttribute('style') || '';
      if (s.indexOf('display:flex') !== -1 && s.indexOf('gap:3px') !== -1 && s.indexOf('margin-left:6px') !== -1) {
        navTabsContainer = el;
      }
    });
    if (!navTabsContainer) return;

    // Comprobar que el tab "Asistente" no existe ya
    var already = false;
    navTabsContainer.querySelectorAll('span').forEach(function (sp) {
      if (sp.textContent.indexOf('Asistente') !== -1) already = true;
    });
    if (already) {
      // Ya existe: solo asegurarse de que sea clickable
      navTabsContainer.querySelectorAll('span').forEach(function (sp) {
        if (sp.textContent.indexOf('Asistente') !== -1) {
          sp.style.cursor = 'pointer';
          sp.addEventListener('click', function () { go('asistente.html'); });
        }
      });
      return;
    }

    // Crear el tab de Asistente con el mismo estilo que los otros tabs inactivos
    // pero con el icono de estrella para diferenciarlo
    var tab = document.createElement('span');
    tab.style.cssText = 'padding:7px 13px;border-radius:9px;color:#5C6E78;font-weight:600;font-size:13px;display:inline-flex;align-items:center;gap:6px;cursor:pointer;transition:background .15s,color .15s';
    tab.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style="flex:none"><path d="M12 2l1.9 5.1L19 9l-5.1 1.9L12 16l-1.9-5.1L5 9l5.1-1.9z"></path></svg>Asistente';
    tab.addEventListener('mouseenter', function () {
      tab.style.background = '#F4F7F9';
      tab.style.color = '#0A5C64';
    });
    tab.addEventListener('mouseleave', function () {
      tab.style.background = '';
      tab.style.color = '#5C6E78';
    });
    tab.addEventListener('click', function () { go('asistente.html'); });

    navTabsContainer.appendChild(tab);
  }

  /* ──────────────────────────────────────────────────────────────
     5. MICRO-ANIMATIONS HOVER para botones primarios
     ────────────────────────────────────────────────────────────── */
  function addHoverEffects() {
    // Botones primarios verdes del doctor
    document.querySelectorAll('div,span').forEach(function (el) {
      var s = el.getAttribute('style') || '';
      if (s.indexOf('background:#0E7C86') !== -1 && s.indexOf('color:#fff') !== -1 && s.indexOf('border-radius') !== -1) {
        if (!el.dataset.hovered) {
          el.dataset.hovered = '1';
          el.style.transition = 'opacity .15s, transform .15s';
          el.addEventListener('mouseenter', function () { el.style.opacity = '0.88'; el.style.transform = 'translateY(-1px)'; });
          el.addEventListener('mouseleave', function () { el.style.opacity = ''; el.style.transform = ''; });
        }
      }
      // Botones primarios naranja del paciente
      if (s.indexOf('background:#D9803F') !== -1 && s.indexOf('color:#fff') !== -1 && s.indexOf('border-radius') !== -1) {
        if (!el.dataset.hovered) {
          el.dataset.hovered = '1';
          el.style.transition = 'opacity .15s, transform .15s';
          el.addEventListener('mouseenter', function () { el.style.opacity = '0.88'; el.style.transform = 'translateY(-1px)'; });
          el.addEventListener('mouseleave', function () { el.style.opacity = ''; el.style.transform = ''; });
        }
      }
    });
  }

  /* ──────────────────────────────────────────────────────────────
     5. INIT
     ────────────────────────────────────────────────────────────── */
  function init() {
    fixLayout();
    injectAsistenteTab();
    bindAll();
    addHoverEffects();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
