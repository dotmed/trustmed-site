from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import re,sys
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site').resolve(); errors=set(); checked=set()
def check(ref, file):
 ref=ref.replace('&amp;','&').strip()
 if not ref or ref.startswith(('#','data:','mailto:','tel:','javascript:','//')):return
 u=urlsplit(ref)
 if u.scheme or u.netloc:return
 part=unquote(u.path)
 if not part:return
 dest=(root/part.lstrip('/') if part.startswith('/') else file.parent/part)
 if dest.is_dir():dest=dest/'index.html'
 if not dest.exists() and not dest.suffix:dest=dest/'index.html'
 checked.add(str(dest))
 if not dest.exists():errors.add((str(file.relative_to(root)),ref))
class Scan(HTMLParser):
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  for k in ('src','href','poster'):
   if k in a:check(a[k],self.file)
  if 'srcset' in a:
   for part in a['srcset'].split(','):check(part.strip().split(' ')[0],self.file)
for file in root.rglob('*.html'):
 p=Scan();p.file=file;p.feed(file.read_text())
for file in root.rglob('*.css'):
 for ref in re.findall(r'url\([\s\'"]*([^\)\'"\s]+)',file.read_text()):check(ref,file)
print('Checked',len(checked),'unique local destinations;',len(errors),'missing references')
for e in sorted(errors):print(*e,sep=' -> ')
sys.exit(bool(errors))
