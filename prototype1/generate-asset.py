import gzip

files = [
    ['index.html', 'index_page'],
    ['style.css', 'style_css'],
    ['script.js', 'script_js'],
    ['mcFavicon.png', 'mcFavicon'],
    
]

with open('assets.h', 'w') as out_file:
    for filename, var_name in files:
        with open(filename, 'rb') as in_file:
            data = in_file.read()
            print(f'file: {filename}, {len(data)} bytes')
            data = gzip.compress(data)
            print(f"compressed size: {len(data)} bytes")
            out_file.write(f'static const char {var_name}[] PROGMEM = {{')
            for byte in data:
                out_file.write(hex(byte))
                out_file.write(', ')
            out_file.write('};\n')
