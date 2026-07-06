/**
 * psymed.js — Script compartido de navegación e interacciones
 * Se incluye en todas las pantallas con: <script src="../psymed.js"></script>
 * Cada pantalla define window.PSYMED_ROLE = 'doctor' | 'paciente'
 * y opcionalmente window.PSYMED_PAGE = 'login' | 'agenda' | etc.
 *
 * ESTRATEGIA PRINCIPAL: atributos data-nav="destino.html" y data-back
 * ESTRATEGIA SECUNDARIA (fallback): text-matching por estilo inline
 */
(function () {

  /* ──────────────────────────────────────────────────────────────
     0. LAYOUT: hacer que el contenedor ocupe el viewport completo
     ────────────────────────────────────────────────────────────── */
  function fixLayout() {
    var wrapper = document.body.firstElementChild;
    if (!wrapper) return;
    var screen = wrapper.firstElementChild;
    if (!screen) return;
    screen.style.width = '100%';
    screen.style.minWidth = '0';
    screen.style.borderRadius = '0';
    screen.style.boxShadow = 'none';
    screen.style.border = 'none';
    var contentArea = screen.children[1];
    if (contentArea) {
      var navH = 56;
      contentArea.style.height = 'auto';
      contentArea.style.minHeight = 'calc(100vh - ' + navH + 'px)';
    }
  }

  /* ──────────────────────────────────────────────────────────────
     1. RUTAS DE NAVEGACIÓN
     ────────────────────────────────────────────────────────────── */
  var role = window.PSYMED_ROLE || 'doctor';
  var base = '../' + role + '/';

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

  // Texto de botón → destino (fallback cuando no hay data-nav)
  var ACTIONS = {
    doctor: {
      'Entrar':             'agenda.html',
      'Crear cuenta':       'agenda.html',
      'Add Patient':        'nuevo.html',
      'Watch Patients':     'lista.html',
      'Guardar cambios':    'lista.html',
      'Upload':             'lista.html',
      'Cancelar':           'back',
      'Back':               'back',
      'Guardar':            'back',
      'Save':               'back',
      'Receta médica':      'documentos.html',
      'Asignaciones':       'nuevo.html',
      'Ver ficha completa': 'ficha.html',
      'Agendar cita':       'citas.html',
      'Revisar medicación': 'medicacion.html',
      'Add / Edit':         'nuevo.html',
      'New Date':           'citas.html',
      'Editar':             'perfil.html',
      'Diagnóstico':        'resumen.html',
      'Historia Clínica':   'resumen.html',
      'Terapia':            'panel.html',
      'Notas':              'resumen.html',
      'Citas':              'citas.html',
      'Add New':            'medicacion.html',
      'Regístrate':         'registro.html',
      'Inicia sesión':      'login.html'
    },
    paciente: {
      'Entrar':           'agenda.html',
      'Enviar reporte':   'agenda.html',
      'Completar':        'reporte.html',
      'Ver terapia':      'citas.html',
      'Back':             'back',
      'Cancelar':         'back'
    }
  };

  var navMap    = NAV[role]     || {};
  var actionMap = ACTIONS[role] || {};

  function go(dest) {
    if (dest === 'back') { history.back(); return; }
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
    if (el.dataset.psyBound) return; // evitar doble binding
    el.dataset.psyBound = '1';
    el.style.cursor = 'pointer';
    el.style.transition = el.style.transition || 'transform .15s, opacity .15s';
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
     3. PRIORIDAD 0: data-nav y data-back attributes
     Cualquier elemento con data-nav="destino.html" se vuelve clickeable.
     ────────────────────────────────────────────────────────────── */
  function bindDataNav() {
    document.querySelectorAll('[data-nav]').forEach(function (el) {
      var dest = el.getAttribute('data-nav');
      if (dest) makeClickable(el, dest);
    });
    document.querySelectorAll('[data-back]').forEach(function (el) {
      makeClickable(el, 'back');
    });
  }

  /* ──────────────────────────────────────────────────────────────
     4. PRIORIDAD 1: TABS DEL NAVBAR
     ────────────────────────────────────────────────────────────── */
  function bindNavTabs() {
    document.querySelectorAll('span').forEach(function (el) {
      if (hasStyle(el, 'padding:7px 13px') && hasStyle(el, 'border-radius:9px')) {
        var txt = el.textContent.trim();
        if (navMap[txt]) makeClickable(el, navMap[txt]);
      }
    });
  }

  /* ──────────────────────────────────────────────────────────────
     5. PRIORIDAD 2: BOTONES POR TEXTO (fallback)
     ────────────────────────────────────────────────────────────── */
  function bindActionButtons() {
    // spans
    document.querySelectorAll('span').forEach(function (el) {
      var t = ownText(el);
      if (t && actionMap[t]) {
        if (hasStyle(el, 'border-radius') || hasStyle(el, 'display:flex') || hasStyle(el, 'display:inline-flex')) {
          makeClickable(el, actionMap[t]);
        }
      }
      // También buscar por textContent completo (para casos con SVG dentro)
      var full = el.textContent.trim();
      if (full && actionMap[full] && full !== t) {
        if (hasStyle(el, 'border-radius') || hasStyle(el, 'display:flex') || hasStyle(el, 'display:inline-flex')) {
          makeClickable(el, actionMap[full]);
        }
      }
    });

    // divs
    document.querySelectorAll('div').forEach(function (el) {
      var t = ownText(el);
      if (t && actionMap[t]) {
        if (hasStyle(el, 'border-radius') && (hasStyle(el, 'background') || hasStyle(el, 'border'))) {
          makeClickable(el, actionMap[t]);
        }
      }
    });
  }

  /* ──────────────────────────────────────────────────────────────
     6. TARJETAS DE PACIENTE (agenda y lista)
     ────────────────────────────────────────────────────────────── */
  function bindPatientCards() {
    document.querySelectorAll('div').forEach(function (el) {
      var s = el.getAttribute('style') || '';
      // Tarjeta paciente en agenda (padding:13px o padding:13px 18px 13px 16px)
      if (s.indexOf('border-radius:13px') !== -1 && s.indexOf('padding:13px') !== -1) {
        if (!el.dataset.psyBound) {
          el.style.cursor = 'pointer';
          el.style.transition = 'transform .15s, box-shadow .15s';
          el.addEventListener('mouseenter', function () { el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 6px 16px rgba(0,0,0,.1)'; });
          el.addEventListener('mouseleave', function () { el.style.transform = ''; el.style.boxShadow = ''; });
          el.addEventListener('click', function (e) { e.stopPropagation(); go(role === 'doctor' ? 'ficha.html' : 'agenda.html'); });
          el.dataset.psyBound = '1';
        }
      }
      // Fila de paciente en lista
      if (s.indexOf('border-top:1px solid #F0F3F5') !== -1 && s.indexOf('padding:13px 20px') !== -1) {
        if (!el.dataset.psyBound) {
          el.style.cursor = 'pointer';
          el.style.transition = 'background .15s';
          el.addEventListener('mouseenter', function () { el.style.background = '#F8FBFC'; });
          el.addEventListener('mouseleave', function () { el.style.background = ''; });
          el.addEventListener('click', function (e) { e.stopPropagation(); go('ficha.html'); });
          el.dataset.psyBound = '1';
        }
      }
    });
  }

  /* ──────────────────────────────────────────────────────────────
     7. SIDEBAR HISTORIA CLÍNICA (ficha.html)
     ────────────────────────────────────────────────────────────── */
  function bindFichaHistoria() {
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
        if (dest && !el.dataset.psyBound) {
          el.dataset.psyBound = '1';
          el.style.cursor = 'pointer';
          el.style.transition = 'background .15s, border-color .15s';
          el.addEventListener('mouseenter', function () { el.style.background = '#E6F2F3'; el.style.borderColor = '#CCE5E7'; });
          el.addEventListener('mouseleave', function () { el.style.background = ''; el.style.borderColor = ''; });
          el.addEventListener('click', function (e) { e.stopPropagation(); go(dest); });
        }
      }
    });
  }

  /* ──────────────────────────────────────────────────────────────
     8. ICONO SETTINGS → perfil
     ────────────────────────────────────────────────────────────── */
  function bindSettingsIcon() {
    document.querySelectorAll('span').forEach(function (el) {
      var s = el.getAttribute('style') || '';
      if (s.indexOf('border-radius:9px') !== -1 && s.indexOf('34px') !== -1 && el.querySelector('circle[cx="12"]')) {
        makeClickable(el, 'perfil.html');
      }
    });
    // Avatar LS → perfil
    document.querySelectorAll('span').forEach(function (el) {
      var s = el.getAttribute('style') || '';
      if (s.indexOf('border-radius:50%') !== -1 && s.indexOf('background:#0E7C86') !== -1 && el.textContent.trim() === 'LS') {
        makeClickable(el, 'perfil.html');
      }
    });
  }

  /* ──────────────────────────────────────────────────────────────
     9. TARJETAS DE CITA EN citas.html → panel
     ────────────────────────────────────────────────────────────── */
  function bindCitasCards() {
    document.querySelectorAll('div').forEach(function (el) {
      var s = el.getAttribute('style') || '';
      if (s.indexOf('border-radius:12px') !== -1 && s.indexOf('padding:13px 16px') !== -1 && s.indexOf('display:flex') !== -1) {
        if (el.querySelector('div[style*="font-weight:700"]') || el.querySelector('div[style*="font-weight:800"]')) {
          if (!el.dataset.psyBound) {
            el.dataset.psyBound = '1';
            el.style.cursor = 'pointer';
            el.style.transition = 'background .12s';
            el.addEventListener('mouseenter', function () { el.style.background = '#F4F7F9'; });
            el.addEventListener('mouseleave', function () { el.style.background = ''; });
            el.addEventListener('click', function (e) { e.stopPropagation(); go('panel.html'); });
          }
        }
      }
    });
  }

  /* ──────────────────────────────────────────────────────────────
     10. INYECCIÓN DEL TAB "ASISTENTE" EN EL NAVBAR DEL DOCTOR
     ────────────────────────────────────────────────────────────── */
  function injectAsistenteTab() {
    if (role !== 'doctor') return;
    var navTabsContainer = null;
    document.querySelectorAll('div').forEach(function (el) {
      var s = el.getAttribute('style') || '';
      if (s.indexOf('display:flex') !== -1 && s.indexOf('gap:3px') !== -1 && s.indexOf('margin-left:6px') !== -1) {
        navTabsContainer = el;
      }
    });
    if (!navTabsContainer) return;
    var already = false;
    navTabsContainer.querySelectorAll('span').forEach(function (sp) {
      if (sp.textContent.indexOf('Asistente') !== -1) already = true;
    });
    if (already) {
      navTabsContainer.querySelectorAll('span').forEach(function (sp) {
        if (sp.textContent.indexOf('Asistente') !== -1 && !sp.dataset.psyBound) {
          sp.style.cursor = 'pointer';
          sp.dataset.psyBound = '1';
          sp.addEventListener('click', function () { go('asistente.html'); });
        }
      });
      return;
    }
    var tab = document.createElement('span');
    tab.style.cssText = 'padding:7px 13px;border-radius:9px;color:#5C6E78;font-weight:600;font-size:13px;display:inline-flex;align-items:center;gap:6px;cursor:pointer;transition:background .15s,color .15s';
    tab.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style="flex:none"><path d="M12 2l1.9 5.1L19 9l-5.1 1.9L12 16l-1.9-5.1L5 9l5.1-1.9z"></path></svg>Asistente';
    tab.addEventListener('mouseenter', function () { tab.style.background = '#F4F7F9'; tab.style.color = '#0A5C64'; });
    tab.addEventListener('mouseleave', function () { tab.style.background = ''; tab.style.color = '#5C6E78'; });
    tab.addEventListener('click', function () { go('asistente.html'); });
    navTabsContainer.appendChild(tab);
  }

  /* ──────────────────────────────────────────────────────────────
     11. HOVER EFFECTS para botones primarios
     ────────────────────────────────────────────────────────────── */
  function addHoverEffects() {
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
     12. INIT
     ────────────────────────────────────────────────────────────── */
  function init() {
    fixLayout();
    injectAsistenteTab();
    bindDataNav();       // PRIORIDAD 0: data-nav attrs (más robusto)
    bindNavTabs();       // PRIORIDAD 1: navbar tabs
    bindActionButtons(); // PRIORIDAD 2: text-matching fallback
    bindPatientCards();  // tarjetas de paciente
    bindFichaHistoria(); // sidebar historia clínica
    bindSettingsIcon();  // icono de ajustes y avatar
    bindCitasCards();    // tarjetas de cita
    addHoverEffects();   // micro-animations
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
