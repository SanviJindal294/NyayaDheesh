from zipfile import ZipFile,ZIP_DEFLATED
import sys,io
from xml.etree import ElementTree as ET
from xml.sax.saxutils import escape
if sys.argv[1]=='extract':
 z=ZipFile(io.BytesIO(sys.stdin.buffer.read()))
 if z.getinfo('word/document.xml').file_size>5000000:raise ValueError('Document too large')
 root=ET.fromstring(z.read('word/document.xml'))
 sys.stdout.buffer.write('\n'.join(''.join(p.itertext()) for p in root.findall('.//{*}p')).encode())
else:
 out=io.BytesIO()
 with ZipFile(out,'w',ZIP_DEFLATED) as z:
  z.writestr('[Content_Types].xml','<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
  z.writestr('_rels/.rels','<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
  z.writestr('word/document.xml','<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+''.join('<w:p><w:r><w:t xml:space="preserve">'+escape(line)+'</w:t></w:r></w:p>' for line in sys.stdin.buffer.read().decode().splitlines())+'</w:body></w:document>')
 sys.stdout.buffer.write(out.getvalue())
