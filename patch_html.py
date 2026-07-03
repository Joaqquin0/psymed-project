"""
patch_html.py  — Actualiza todos los HTMLs de psymed para:
  1. Añadir <link rel="stylesheet" href="../psymed.css">
  2. Reemplazar el <script>...(function(){...})()...</script> duplicado
     por <script>window.PSYMED_ROLE='doctor';</script><script src="../psymed.js"></script>
  3. Hacer que el contenedor principal ocupe el 100% del ancho
  4. Añadir la clase CSS correcta al body según el tipo de pantalla
"""
import os, re

ROOT = os.path.dirname(os.path.abspath(__file__))

# Archivos y su metadata
FILES = {
    # (ruta_relativa, rol, clase_body)
    'doctor/login.html':     ('doctor',   'bg-dark'),
    'doctor/registro.html':  ('doctor',   'bg-dark'),
    'doctor/agenda.html':    ('doctor',   'bg-white'),
    'doctor/lista.html':     ('doctor',   'bg-white'),
    'doctor/nuevo.html':     ('doctor',   'bg-white'),
    'doctor/ficha.html':     ('doctor',   'bg-white'),
    'doctor/panel.html':     ('doctor',   'bg-white'),
    'doctor/medicacion.html':('doctor',   'bg-white'),
    'doctor/resumen.html':   ('doctor',   'bg-white'),
    'doctor/documentos.html':('doctor',   'bg-white'),
    'doctor/citas.html':     ('doctor',   'bg-white'),
    'doctor/perfil.html':    ('doctor',   'bg-white'),
    'doctor/asistente.html': ('doctor',   'bg-white'),
    'paciente/login.html':   ('paciente', 'bg-dark'),
    'paciente/agenda.html':  ('paciente', 'bg-patient'),
    'paciente/reporte.html': ('paciente', 'bg-patient'),
    'paciente/citas.html':   ('paciente', 'bg-patient'),
}

# El bloque <style> que está en todos los archivos (lo detectamos y reemplazamos)
STYLE_PATTERN = re.compile(
    r'<style>\s*\*\{margin:0.*?div\[style\*="cursor"\]\{cursor:pointer\}\s*</style>',
    re.DOTALL
)

# El bloque <script> con la función anónima
SCRIPT_PATTERN = re.compile(
    r'<script>\s*\(function\(\)\{.*?\}\)\(\);\s*</script>',
    re.DOTALL
)

NEW_STYLE = '<link rel="stylesheet" href="../psymed.css">'

def patch_file(rel_path, role, body_class):
    full_path = os.path.join(ROOT, rel_path.replace('/', os.sep))
    if not os.path.exists(full_path):
        print(f'  SKIP (not found): {rel_path}')
        return

    with open(full_path, 'r', encoding='utf-8') as f:
        html = f.read()

    original = html

    # 1. Reemplazar el bloque <style> duplicado por el link al CSS compartido
    html, n1 = STYLE_PATTERN.subn(NEW_STYLE, html)

    # 2. Reemplazar el script inline por la referencia compartida
    new_script = (
        f'<script>window.PSYMED_ROLE="{role}";</script>\n'
        f'<script src="../psymed.js"></script>'
    )
    html, n2 = SCRIPT_PATTERN.subn(new_script, html)

    # 3. Corregir el body class para que use la clase de psymed.css
    # Reemplazar clases antiguas por la nueva
    html = re.sub(
        r'<body\s+class="[^"]*"',
        f'<body class="{body_class}"',
        html
    )

    # 4. Hacer que el div contenedor con width:1040px use 100%
    html = re.sub(
        r'(<div style=")(width:1040px;)',
        r'\1width:100%;',
        html,
        count=1  # solo el primer div, que es el contenedor principal
    )

    if html == original:
        print(f'  NO CHANGE: {rel_path}')
    else:
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'  PATCHED ({n1} style, {n2} script): {rel_path}')

if __name__ == '__main__':
    print('Patching PsyMed HTML files...')
    for rel, (role, body_class) in FILES.items():
        patch_file(rel, role, body_class)
    print('Done!')
