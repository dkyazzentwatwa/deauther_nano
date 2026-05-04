#!/usr/bin/env python3
# webConverter without minification — Python 3.9 compatible
import os, gzip, binascii
from pathlib import Path, PurePath

p = Path.cwd()
parent = p.parent.parent
license_file_path = str(os.path.join(str(parent), "LICENSE"))
arduino_file_path = str(os.path.join(str(parent / PurePath('esp8266_deauther')), "webfiles.h"))
dir = parent / PurePath('web_interface')
datadir = parent / PurePath('esp8266_deauther') / PurePath('data')
compressed = datadir / PurePath('web')
os.makedirs(str(compressed / PurePath('js')),   exist_ok=True)
os.makedirs(str(compressed / PurePath('lang')), exist_ok=True)

progmem_definitions = ""
copy_files_function = ""
webserver_events = ""
load_lang = ""

def file_to_hex(path):
    with open(path, 'rb') as f:
        raw = f.read()
    h = binascii.hexlify(raw).decode()
    return ', '.join('0x' + h[i:i+2] for i in range(0, len(h), 2))

def compress_and_add(src_path, gz_path, array_name, copy_dest, server_path, mime):
    global progmem_definitions, copy_files_function, webserver_events
    with open(src_path, encoding='UTF-8') as f:
        content = f.read()
    with gzip.GzipFile(gz_path, mode='w', mtime=0) as fo:
        fo.write(content.encode('UTF-8'))
    hex_str = file_to_hex(gz_path)
    progmem_definitions += f"const char {array_name}[] PROGMEM = {{{hex_str}}};\n"
    copy_files_function += f'  if(!LittleFS.exists("{copy_dest}") || force) progmemToSpiffs({array_name}, sizeof({array_name}), "{copy_dest}");\n'
    webserver_events    += f'server.on("{server_path}", HTTP_GET, [](){{\n  sendProgmem({array_name}, sizeof({array_name}), {mime});\n}});\n'
    print(f"[+] {os.path.basename(src_path)} → {gz_path}")

filelist = list(Path(dir).glob('**/*'))
html_files = [x for x in filelist if x.is_file() and x.suffix == '.html' and 'compressed' not in x.parts]
css_files  = [x for x in filelist if x.is_file() and x.suffix == '.css'  and 'compressed' not in x.parts]
js_files   = [x for x in filelist if x.is_file() and x.suffix == '.js'   and 'compressed' not in x.parts]
lang_files = [x for x in filelist if x.is_file() and x.suffix == '.lang' and 'compressed' not in x.parts]

for f in html_files:
    b = f.name
    compress_and_add(str(f), str(compressed / (b + '.gz')),
                     b.replace('.',''), f'/web/{b}.gz', f'/{b}', 'W_HTML')

for f in css_files:
    b = f.name
    compress_and_add(str(f), str(compressed / (b + '.gz')),
                     b.replace('.',''), f'/web/{b}.gz', f'/{b}', 'W_CSS')

for f in js_files:
    b = f.name
    compress_and_add(str(f), str(compressed / PurePath('js') / (b + '.gz')),
                     b.replace('.',''), f'/web/js/{b}.gz', f'/js/{b}', 'W_JS')

for f in lang_files:
    b = f.name
    lang_name = b.replace('.lang','')
    gz_path = str(compressed / PurePath('lang') / (b + '.gz'))
    with open(str(f), encoding='UTF-8') as fh:
        content = fh.read()
    with gzip.GzipFile(gz_path, mode='w', mtime=0) as fo:
        fo.write(content.encode('UTF-8'))
    array_name = b.replace('.','')
    hex_str = file_to_hex(gz_path)
    progmem_definitions += f"const char {array_name}[] PROGMEM = {{{hex_str}}};\n"
    copy_files_function += f'  if(!LittleFS.exists("/web/lang/{b}.gz") || force) progmemToSpiffs({array_name}, sizeof({array_name}), "/web/lang/{b}.gz");\n'
    webserver_events    += f'server.on("/lang/{b}", HTTP_GET, [](){{\n  sendProgmem({array_name}, sizeof({array_name}), W_JSON);\n}});\n'
    if load_lang:
        load_lang += f'    else if(String(settings::getWebSettings().lang) == "{lang_name}") sendProgmem({array_name}, sizeof({array_name}), W_JSON);\n'
    else:
        load_lang  = f'    if(String(settings::getWebSettings().lang) == "{lang_name}") sendProgmem({array_name}, sizeof({array_name}), W_JSON);\n'
    print(f"[+] {b} → {gz_path}")

# LICENSE
gz_path = str(compressed / 'LICENSE.gz')
with open(license_file_path, encoding='UTF-8') as f:
    content = f.read()
with gzip.GzipFile(gz_path, mode='w', mtime=0) as fo:
    fo.write(content.encode('UTF-8'))
hex_str = file_to_hex(gz_path)
progmem_definitions += f"const char LICENSE[] PROGMEM = {{{hex_str}}};\n"
copy_files_function += f'  if(!LittleFS.exists("/web/LICENSE.gz") || force) progmemToSpiffs(LICENSE, sizeof(LICENSE), "/web/LICENSE.gz");\n'
print("[+] LICENSE compressed")

print("[+] Writing webfiles.h ...")
with open(arduino_file_path, 'w') as f:
    f.write("#ifndef webfiles_h\n#define webfiles_h\n\n")
    f.write("// comment that out if you want to save program memory and know how to upload the web files to the SPIFFS manually\n")
    f.write("#define USE_PROGMEM_WEB_FILES \n\n")
    f.write("#ifdef USE_PROGMEM_WEB_FILES\n")
    f.write(progmem_definitions)
    f.write("#endif\n\n")
    f.write("void copyWebFiles(bool force){\n#ifdef USE_PROGMEM_WEB_FILES\n")
    f.write("if(settings::getWebSettings().use_spiffs){\n")
    f.write(copy_files_function)
    f.write("}\n#endif\n}\n\n#endif\n")

print("\n[+] Done!")
