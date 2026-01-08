import html
import json
import uuid
import zipfile
import argparse
from datetime import datetime, timezone
from pathlib import Path


def _slugify(s: str) -> str:
    return ''.join(ch.lower() if ch.isalnum() else '-' for ch in s).strip('-')


def _as_paragraphs(text: str) -> str:
    text = (text or '').strip()
    if not text:
        return ''

    parts = [p.strip() for p in text.split('\n\n') if p.strip()]
    return '\n'.join(f'<p>{html.escape(p).replace("\n", "<br/>")}</p>' for p in parts)


def build_epub(questions: list[dict], out_path: Path, *, title: str) -> Path:
    book_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')

    creator = 'GRCJP'
    language = 'en'

    domains: dict[str, list[dict]] = {}
    for q in questions:
        domains.setdefault(q.get('domain', 'Uncategorized'), []).append(q)

    domain_items = []
    for domain, items in domains.items():
        domain_items.append((domain, _slugify(domain) or 'domain'))

    oebps = 'OEBPS'

    container_xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">\n'
        '  <rootfiles>\n'
        '    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>\n'
        '  </rootfiles>\n'
        '</container>\n'
    )

    style_css = (
        'body { font-family: serif; line-height: 1.5; }\n'
        'h1, h2, h3 { font-family: sans-serif; }\n'
        'h1 { font-size: 1.6em; margin: 0 0 0.8em 0; }\n'
        'h2 { font-size: 1.2em; margin: 1.2em 0 0.5em 0; }\n'
        '.domain { font-size: 0.9em; color: #555; margin: 0 0 0.3em 0; }\n'
        '.qa { margin: 0 0 1.2em 0; }\n'
        '.answer { margin-top: 0.3em; }\n'
        '.answer b { font-family: sans-serif; }\n'
        'hr { border: none; border-top: 1px solid #ccc; margin: 1.2em 0; }\n'
    )

    title_xhtml = (
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<!DOCTYPE html>\n'
        '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">\n'
        '<head>\n'
        '  <title>CMMC Rapid Memory</title>\n'
        '  <link rel="stylesheet" type="text/css" href="styles/style.css"/>\n'
        '</head>\n'
        '<body>\n'
        f'  <h1>{html.escape(title)}</h1>\n'
        '  <p><b>Rapid Memory Mode:</b> Question → Answer</p>\n'
        '  <p>This book was generated from the CMMC CCP Test Bank JSON.</p>\n'
        '</body>\n'
        '</html>\n'
    )

    nav_items = []
    manifest_items = [
        '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
        '<item id="css" href="styles/style.css" media-type="text/css"/>',
        '<item id="icon" href="pwa-icon.svg" media-type="image/svg+xml"/>',
        '<item id="title" href="text/title.xhtml" media-type="application/xhtml+xml"/>',
        '<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>',
    ]
    spine_items = ['<itemref idref="title"/>']

    chapters: dict[str, str] = {}
    for idx, (domain, slug) in enumerate(domain_items, start=1):
        file_name = f'text/{idx:02d}-{slug}.xhtml'
        item_id = f'domain{idx:02d}'

        nav_items.append((domain, file_name))
        manifest_items.append(
            f'<item id="{item_id}" href="{file_name}" media-type="application/xhtml+xml"/>'
        )
        spine_items.append(f'<itemref idref="{item_id}"/>')

        q_blocks = []
        for q in domains[domain]:
            qid = q.get('id') or ''
            question_text = (q.get('question') or '').strip()

            correct_choice = None
            for c in q.get('choices') or []:
                if c.get('correct') is True:
                    correct_choice = c
                    break

            answer_text = (correct_choice or {}).get('text') or ''
            answer_id = (correct_choice or {}).get('id') or ''

            q_blocks.append(
                '<div class="qa">\n'
                f'  <h2 id="{html.escape(qid)}">{html.escape(qid)}</h2>\n'
                f'  {_as_paragraphs(question_text)}\n'
                f'  <p class="answer"><b>Answer:</b> {html.escape(answer_id)}{": " if answer_text else ""}{html.escape(answer_text)}</p>\n'
                '  <hr/>\n'
                '</div>'
            )

        chapters[file_name] = (
            '<?xml version="1.0" encoding="utf-8"?>\n'
            '<!DOCTYPE html>\n'
            '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">\n'
            '<head>\n'
            f'  <title>{html.escape(domain)}</title>\n'
            '  <link rel="stylesheet" type="text/css" href="../styles/style.css"/>\n'
            '</head>\n'
            '<body>\n'
            f'  <p class="domain">{html.escape(domain)}</p>\n'
            f'  <h1>{html.escape(domain)}</h1>\n'
            + '\n'.join(q_blocks)
            + '\n</body>\n</html>\n'
        )

    nav_xhtml = (
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<!DOCTYPE html>\n'
        '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en">\n'
        '<head>\n'
        '  <title>Table of Contents</title>\n'
        '  <link rel="stylesheet" type="text/css" href="styles/style.css"/>\n'
        '</head>\n'
        '<body>\n'
        '  <nav epub:type="toc" id="toc">\n'
        '    <h1>Contents</h1>\n'
        '    <ol>\n'
        + ''.join(
            f'      <li><a href="{html.escape(href)}">{html.escape(label)}</a></li>\n'
            for (label, href) in nav_items
        )
        + '    </ol>\n'
        '  </nav>\n'
        '</body>\n'
        '</html>\n'
    )

    ncx_navpoints = []
    for i, (label, href) in enumerate(nav_items, start=1):
        ncx_navpoints.append(
            '    <navPoint id="navPoint-{i}" playOrder="{i}">\n'
            '      <navLabel><text>{label}</text></navLabel>\n'
            '      <content src="{href}"/>\n'
            '    </navPoint>\n'.format(i=i, label=html.escape(label), href=html.escape(href))
        )

    toc_ncx = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">\n'
        '<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">\n'
        '  <head>\n'
        f'    <meta name="dtb:uid" content="{book_id}"/>\n'
        '  </head>\n'
        f'  <docTitle><text>{html.escape(title)}</text></docTitle>\n'
        '  <navMap>\n'
        + ''.join(ncx_navpoints)
        + '  </navMap>\n'
        '</ncx>\n'
    )

    content_opf = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="3.0">\n'
        '  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">\n'
        f'    <dc:identifier id="bookid">urn:uuid:{book_id}</dc:identifier>\n'
        f'    <dc:title>{html.escape(title)}</dc:title>\n'
        f'    <dc:language>{html.escape(language)}</dc:language>\n'
        f'    <dc:creator>{html.escape(creator)}</dc:creator>\n'
        f'    <dc:date>{html.escape(now)}</dc:date>\n'
        '  </metadata>\n'
        '  <manifest>\n'
        + ''.join(f'    {line}\n' for line in manifest_items)
        + '  </manifest>\n'
        '  <spine toc="ncx">\n'
        + ''.join(f'    {line}\n' for line in spine_items)
        + '  </spine>\n'
        '</package>\n'
    )

    out_path.parent.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(out_path, 'w') as zf:
        zf.writestr(
            'mimetype',
            'application/epub+zip',
            compress_type=zipfile.ZIP_STORED,
        )
        zf.writestr('META-INF/container.xml', container_xml, compress_type=zipfile.ZIP_DEFLATED)
        zf.writestr(f'{oebps}/content.opf', content_opf, compress_type=zipfile.ZIP_DEFLATED)
        zf.writestr(f'{oebps}/toc.ncx', toc_ncx, compress_type=zipfile.ZIP_DEFLATED)
        zf.writestr(f'{oebps}/nav.xhtml', nav_xhtml, compress_type=zipfile.ZIP_DEFLATED)
        zf.writestr(f'{oebps}/styles/style.css', style_css, compress_type=zipfile.ZIP_DEFLATED)

        icon_path = Path(__file__).resolve().parents[1] / 'public' / 'pwa-icon.svg'
        if icon_path.exists():
            zf.write(icon_path, arcname=f'{oebps}/pwa-icon.svg')

        zf.writestr(f'{oebps}/text/title.xhtml', title_xhtml, compress_type=zipfile.ZIP_DEFLATED)
        for href, content in chapters.items():
            zf.writestr(f'{oebps}/{href}', content, compress_type=zipfile.ZIP_DEFLATED)

    return out_path


def main() -> None:
    app_dir = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description='Export Rapid Memory EPUB from a selected question bank.')
    parser.add_argument(
        '--bank',
        choices=['bank206', 'bank170'],
        default='bank206',
        help='Which question bank to export (default: bank206).',
    )
    args = parser.parse_args()

    questions_path = app_dir / 'data' / ('questions_170.json' if args.bank == 'bank170' else 'questions.json')
    out_path = app_dir / 'exports' / ('CMMC-Rapid-Memory-170.epub' if args.bank == 'bank170' else 'CMMC-Rapid-Memory-206.epub')
    title = 'CMMC CCP Test Bank — Rapid Memory (170)' if args.bank == 'bank170' else 'CMMC CCP Test Bank — Rapid Memory (206)'

    questions = json.loads(questions_path.read_text(encoding='utf-8'))
    build_epub(questions, out_path, title=title)
    print(f'Wrote: {out_path}')


if __name__ == '__main__':
    main()
