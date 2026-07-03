import json, re

with open(r'psymed Mockups (Standalone).html', 'r', encoding='utf-8') as f:
    content = f.read()

tag = '__bundler/template'
pat_open = 'type="' + tag + '">'
idx_start = content.find(pat_open)
print('pat idx:', idx_start)
if idx_start >= 0:
    idx_end = content.find('</script>', idx_start)
    raw = content[idx_start+len(pat_open):idx_end]
    template = json.loads(raw)
    print('Template length:', len(template))
    with open('template_out.html', 'w', encoding='utf-8') as out:
        out.write(template)
    print('Written to template_out.html')
else:
    print('Not found')
    # Show context around where it might be
    idx = content.find('__bundler')
    print('First __bundler at:', idx)
    print(content[idx:idx+200])
