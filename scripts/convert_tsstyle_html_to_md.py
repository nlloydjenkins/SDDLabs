from __future__ import annotations

import html as html_lib
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Callable


ROOT = Path(__file__).resolve().parents[1]
HTML_PATH = ROOT / "docs" / "tsstyle" / "My TypeScript Style Guide.htm"
OUT_DIR = ROOT / "docs" / "tsstyle"


@dataclass(frozen=True)
class HeadingMatch:
    id: str
    title_html: str
    start: int
    end: int


def _strip_tags(s: str) -> str:
    s = re.sub(r"<br\s*/?>", "\n", s, flags=re.IGNORECASE)
    s = re.sub(r"<[^>]+>", "", s)
    return html_lib.unescape(s).strip()


def _protect_blocks(text: str, pattern: re.Pattern[str], transform: Callable[[re.Match[str]], str]):
    blocks: list[str] = []

    def repl(m: re.Match[str]) -> str:
        blocks.append(transform(m))
        return f"@@BLOCK{len(blocks) - 1}@@"

    text = pattern.sub(repl, text)
    return text, blocks


def _restore_blocks(text: str, blocks: list[str]) -> str:
    for i, block in enumerate(blocks):
        text = text.replace(f"@@BLOCK{i}@@", block)
    return text


def _convert_code_block(m: re.Match[str]) -> str:
    class_attr = (m.group("class") or "").lower()
    raw = m.group("code")

    lang = ""
    if "language-ts" in class_attr or "language-typescript" in class_attr:
        lang = "ts"
    elif "language-js" in class_attr or "language-javascript" in class_attr:
        lang = "js"
    elif "language-json" in class_attr:
        lang = "json"

    code = html_lib.unescape(raw)
    code = code.replace("\r\n", "\n").replace("\r", "\n")
    code = code.strip("\n")

    fence = "```"
    return f"{fence}{lang}\n{code}\n{fence}\n\n"


def _convert_table(m: re.Match[str]) -> str:
    # Preserve tables as HTML to avoid losing structure.
    table_html = html_lib.unescape(m.group(0))
    table_html = table_html.replace("\r\n", "\n").replace("\r", "\n")
    return f"\n\n{table_html}\n\n"


def _convert_blockquote(m: re.Match[str]) -> str:
    inner = m.group("inner")
    # Convert inner similarly but keep it simple.
    inner = html_lib.unescape(inner)
    inner = re.sub(r"<br\s*/?>", "\n", inner, flags=re.IGNORECASE)
    inner = re.sub(r"</p>\s*<p[^>]*>", "\n\n", inner, flags=re.IGNORECASE)
    inner = re.sub(r"<p[^>]*>", "", inner, flags=re.IGNORECASE)
    inner = re.sub(r"</p>", "", inner, flags=re.IGNORECASE)
    inner = re.sub(r"<[^>]+>", "", inner)
    inner = inner.strip()

    lines = [f"> {line}" if line.strip() else ">" for line in inner.splitlines()]
    return "\n".join(lines) + "\n\n"


def html_fragment_to_markdown(fragment: str, base_heading_level: int) -> str:
    fragment = fragment.replace("\r\n", "\n").replace("\r", "\n")

    # Drop anchor-only paragraphs and standalone anchors.
    fragment = re.sub(r"<p>\s*(<a\s+id=[^>]+></a>\s*)+</p>", "", fragment, flags=re.IGNORECASE)
    fragment = re.sub(r"<a\s+id=[^>]+></a>", "", fragment, flags=re.IGNORECASE)

    # Protect tables and code blocks before doing other conversions.
    table_pat = re.compile(r"<table\b[\s\S]*?</table>", flags=re.IGNORECASE)
    fragment, table_blocks = _protect_blocks(fragment, table_pat, _convert_table)

    code_pat = re.compile(
        r"<pre><code(?P<attrs>[^>]*)class=\"(?P<class>[^\"]*)\"[^>]*>(?P<code>[\s\S]*?)</code></pre>",
        flags=re.IGNORECASE,
    )
    fragment, code_blocks = _protect_blocks(fragment, code_pat, _convert_code_block)

    # Blockquotes
    bq_pat = re.compile(r"<blockquote>(?P<inner>[\s\S]*?)</blockquote>", flags=re.IGNORECASE)
    fragment = bq_pat.sub(_convert_blockquote, fragment)

    # Headings
    def heading_repl(m: re.Match[str]) -> str:
        level = int(m.group("lvl"))
        title = _strip_tags(m.group("title"))
        md_level = max(1, level - base_heading_level + 1)
        md_level = min(6, md_level)
        return f"{'#' * md_level} {title}\n\n"

    fragment = re.sub(
        r"<h(?P<lvl>[1-6])\b[^>]*>(?P<title>[\s\S]*?)</h\1>",
        heading_repl,
        fragment,
        flags=re.IGNORECASE,
    )

    # Paragraphs
    fragment = re.sub(r"</p>\s*<p[^>]*>", "\n\n", fragment, flags=re.IGNORECASE)
    fragment = re.sub(r"<p[^>]*>", "", fragment, flags=re.IGNORECASE)
    fragment = re.sub(r"</p>", "\n\n", fragment, flags=re.IGNORECASE)

    # Lists (simple)
    def ul_repl(m: re.Match[str]) -> str:
        inner = m.group("inner")
        items = re.findall(r"<li[^>]*>([\s\S]*?)</li>", inner, flags=re.IGNORECASE)
        md_items: list[str] = []
        for item in items:
            text = _strip_tags(item)
            if text:
                md_items.append(f"- {text}")
        return "\n".join(md_items) + "\n\n" if md_items else ""

    fragment = re.sub(r"<ul[^>]*>(?P<inner>[\s\S]*?)</ul>", ul_repl, fragment, flags=re.IGNORECASE)

    def ol_repl(m: re.Match[str]) -> str:
        inner = m.group("inner")
        items = re.findall(r"<li[^>]*>([\s\S]*?)</li>", inner, flags=re.IGNORECASE)
        md_items: list[str] = []
        for idx, item in enumerate(items, start=1):
            text = _strip_tags(item)
            if text:
                md_items.append(f"{idx}. {text}")
        return "\n".join(md_items) + "\n\n" if md_items else ""

    fragment = re.sub(r"<ol[^>]*>(?P<inner>[\s\S]*?)</ol>", ol_repl, fragment, flags=re.IGNORECASE)

    # Inline formatting
    fragment = re.sub(r"<em>([\s\S]*?)</em>", lambda m: f"*{_strip_tags(m.group(1))}*", fragment, flags=re.IGNORECASE)
    fragment = re.sub(
        r"<strong>([\s\S]*?)</strong>",
        lambda m: f"**{_strip_tags(m.group(1))}**",
        fragment,
        flags=re.IGNORECASE,
    )

    # Inline code (after stripping emphasis/strong)
    fragment = re.sub(
        r"<code\b[^>]*>([\s\S]*?)</code>",
        lambda m: f"`{_strip_tags(m.group(1))}`",
        fragment,
        flags=re.IGNORECASE,
    )

    # Line breaks
    fragment = re.sub(r"<br\s*/?>", "\n", fragment, flags=re.IGNORECASE)

    # Drop remaining tags but keep their text.
    fragment = re.sub(r"<[^>]+>", "", fragment)

    # Unescape HTML entities.
    fragment = html_lib.unescape(fragment)

    # Restore protected blocks.
    fragment = _restore_blocks(fragment, table_blocks)
    fragment = _restore_blocks(fragment, code_blocks)

    # Normalize whitespace.
    fragment = re.sub(r"[ \t]+\n", "\n", fragment)
    fragment = re.sub(r"\n{3,}", "\n\n", fragment)
    fragment = fragment.strip() + "\n"

    return fragment


def _find_headings(html: str, level: int) -> list[HeadingMatch]:
    pat = re.compile(
        rf'<h{level}\b[^>]*\bid="(?P<id>[^"]+)"[^>]*>(?P<title>[\s\S]*?)</h{level}>',
        flags=re.IGNORECASE,
    )
    out: list[HeadingMatch] = []
    for m in pat.finditer(html):
        out.append(HeadingMatch(id=m.group("id"), title_html=m.group("title"), start=m.start(), end=m.end()))
    return out


def _slice_between(html: str, start: int, end: int) -> str:
    return html[start:end]


def _write_md(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def main() -> None:
    if not HTML_PATH.exists():
        raise SystemExit(f"Missing HTML file: {HTML_PATH}")

    html = HTML_PATH.read_text(encoding="utf-8", errors="replace")

    h2s = _find_headings(html, 2)
    if not h2s:
        raise SystemExit("No <h2> headings found; cannot split document.")

    def h2_chunk(h2_id: str) -> str:
        matches = [h for h in h2s if h.id == h2_id]
        if not matches:
            raise SystemExit(f"Missing expected <h2 id=\"{h2_id}\"> in HTML")
        h = matches[0]
        idx = h2s.index(h)
        start = h.start
        end = h2s[idx + 1].start if idx + 1 < len(h2s) else len(html)
        return _slice_between(html, start, end)

    # README: from <h1> to first <h2>
    h1_m = re.search(r'<h1\b[^>]*>([\s\S]*?)</h1>', html, flags=re.IGNORECASE)
    if not h1_m:
        raise SystemExit("No <h1> found; cannot generate README.md")
    h1_start = h1_m.start()
    readme_html = _slice_between(html, h1_start, h2s[0].start)

    # Append a plain section list (no links) to make README usable without inventing new content.
    section_titles = [_strip_tags(h.title_html) for h in h2s]
    readme_html += "\n<p><strong>Sections</strong></p>\n<ul>" + "".join(
        f"<li>{html_lib.escape(t)}</li>" for t in section_titles
    ) + "</ul>\n"

    _write_md(OUT_DIR / "README.md", html_fragment_to_markdown(readme_html, base_heading_level=1))

    # Top-level sections
    h2_to_file: dict[str, str] = {
        "introduction": "01-introduction.md",
        "source-file-basics": "02-source-file-basics.md",
        "source-file-structure": "03-source-file-structure.md",
        "naming": "05-naming.md",
        "type-system": "06-type-system.md",
        "toolchain": "07-toolchain-requirements.md",
        "comments": "08-comments-and-documentation.md",
        "policies": "09-policies.md",
    }

    for h2_id, filename in h2_to_file.items():
        chunk = h2_chunk(h2_id)
        _write_md(OUT_DIR / filename, html_fragment_to_markdown(chunk, base_heading_level=2))

    # Language features section -> split by h3
    lang_chunk = h2_chunk("language-features")

    # Find h3 headings within the language features chunk
    h3_pat = re.compile(
        r'<h3\b[^>]*\bid="(?P<id>[^"]+)"[^>]*>(?P<title>[\s\S]*?)</h3>',
        flags=re.IGNORECASE,
    )
    h3s = list(h3_pat.finditer(lang_chunk))
    if not h3s:
        raise SystemExit("No <h3> headings found within language-features section.")

    first_h3_start = h3s[0].start()
    lang_intro = lang_chunk[:first_h3_start]
    _write_md(OUT_DIR / "04-language-features" / "README.md", html_fragment_to_markdown(lang_intro, base_heading_level=2))

    h3_to_file: dict[str, str] = {
        "local-variable-declarations": "01-local-variable-declarations.md",
        "array-literals": "02-array-literals.md",
        "object-literals": "03-object-literals.md",
        "classes": "04-classes.md",
        "functions": "05-functions.md",
        "this": "06-this.md",
        "interfaces": "07-interfaces.md",
        "primitive-literals": "08-primitive-literals.md",
        "control-structures": "09-control-structures.md",
        "decorators": "10-decorators.md",
        "disallowed-features": "11-disallowed-features.md",
    }

    for i, m in enumerate(h3s):
        h3_id = m.group("id")
        start = m.start()
        end = h3s[i + 1].start() if i + 1 < len(h3s) else len(lang_chunk)
        sub_html = lang_chunk[start:end]

        filename = h3_to_file.get(h3_id)
        if not filename:
            # Fail loudly so we don't silently drop content.
            raise SystemExit(f"Unmapped language-features <h3 id=\"{h3_id}\">; please add mapping.")

        _write_md(OUT_DIR / "04-language-features" / filename, html_fragment_to_markdown(sub_html, base_heading_level=3))


if __name__ == "__main__":
    main()
