import os
import subprocess
import re

source_path = "/Users/adowyer/.gemini/antigravity/brain/975d7374-f84b-4070-a59a-ca0b16b90efd/ximia_audit_es.md"
output_html = "/Users/adowyer/Documents/XIMIA/ximia-landing/temp_audit.html"
output_docx = "/Users/adowyer/Documents/XIMIA/ximia-landing/Ximia_AI_Auditoria_Comercial.docx"

def md_to_html(md_text):
    # Basic header conversion
    md_text = re.sub(r'^# (.*)$', r'<h1>\1</h1>', md_text, flags=re.MULTILINE)
    md_text = re.sub(r'^## (.*)$', r'<h2>\1</h2>', md_text, flags=re.MULTILINE)
    md_text = re.sub(r'^### (.*)$', r'<h3>\1</h3>', md_text, flags=re.MULTILINE)
    
    lines = md_text.split('\n')
    html_lines = []
    in_list = False
    in_table = False
    table_rows = []

    for line in lines:
        # Handle Tables
        if line.strip().startswith('|'):
            if not in_table:
                in_table = True
                table_rows = []
            # Skip separator lines |---|
            if re.match(r'^\|[\s:-|]*\|$', line.strip()):
                continue
            cells = [cell.strip() for cell in line.strip('|').split('|')]
            row_html = "<tr>" + "".join(f"<td>{c}</td>" for c in cells) + "</tr>"
            table_rows.append(row_html)
            continue
        else:
            if in_table:
                html_lines.append("<table border='1' style='border-collapse: collapse; width: 100%;'>" + "".join(table_rows) + "</table>")
                in_table = False

        # Handle Lists
        if line.strip().startswith('* ') or line.strip().startswith('- '):
            if not in_list:
                html_lines.append("<ul>")
                in_list = True
            content = line.strip()[2:]
            html_lines.append(f"<li>{content}</li>")
            continue
        else:
            if in_list:
                html_lines.append("</ul>")
                in_list = False

        # Handle Blockquotes (Alerts)
        if line.strip().startswith('>'):
            content = line.strip()[1:].strip()
            if content.startswith('[!'):
                continue # Skip alert headers for clean docx
            html_lines.append(f"<blockquote>{content}</blockquote>")
            continue

        # Handle regular paragraphs
        if line.strip():
            # Bold
            line = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', line)
            html_lines.append(f"<p>{line}</p>")
        else:
            html_lines.append("<br/>")

    return f"<html><head><meta charset='utf-8'></head><body>{''.join(html_lines)}</body></html>"

try:
    with open(source_path, 'r', encoding='utf-8') as f:
        md_content = f.read()

    html_content = md_to_html(md_content)

    with open(output_html, 'w', encoding='utf-8') as f:
        f.write(html_content)

    # Use textutil to convert HTML to DOCX
    subprocess.run(["textutil", "-convert", "docx", output_html, "-output", output_docx], check=True)
    
    print(f"Success! File created at: {output_docx}")
    # Clean up temp file
    if os.path.exists(output_html):
        os.remove(output_html)

except Exception as e:
    print(f"Error: {e}")
