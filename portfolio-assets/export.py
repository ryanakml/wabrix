"""Export delivery formats and record reproducible file provenance."""

from hashlib import sha256
from json import dumps
from pathlib import Path
import subprocess

from PIL import Image, ImageChops, ImageCms


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "output"
LOGO_SOURCE = ROOT.parent / "apps/web-2/public/logo.png"
LOGO_TRIMMED = ROOT / "source/wabrix-logo-trimmed.png"


def digest(path: Path) -> str:
    return sha256(path.read_bytes()).hexdigest()


original = Image.open(LOGO_SOURCE).convert("RGBA")
trimmed = Image.open(LOGO_TRIMMED).convert("RGBA")
bbox = original.getbbox()
assert bbox == (342, 247, 1632, 555)
assert ImageChops.difference(original.crop(bbox), trimmed).getbbox() is None, "Logo pixels changed during trim"
srgb_profile = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB")).tobytes()

try:
    revision = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT.parent, text=True).strip()
except (OSError, subprocess.CalledProcessError):
    revision = "unknown"

manifest = {
    "story": "Knowledge Base source to Bot Emulator preview; fictional demo knowledge",
    "caption": "Wabrix Knowledge Base and Bot Emulator — interface reconstruction with fictional demo knowledge; preview only, no WhatsApp message sent.",
    "alt": "Wabrix Knowledge Base source beside a bot preview showing a response drawn from that source.",
    "repo_revision": revision,
    "original_logo": str(LOGO_SOURCE.relative_to(ROOT.parent)),
    "original_logo_sha256": digest(LOGO_SOURCE),
    "trimmed_logo": str(LOGO_TRIMMED.relative_to(ROOT.parent)),
    "trimmed_logo_sha256": digest(LOGO_TRIMMED),
    "logo_trim_bbox": bbox,
    "fonts": {
        "Geist": {
            "source_css": "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap",
            "license": "fonts/geist-OFL.txt",
            "files_sha256": {str(weight): digest(ROOT / f"fonts/geist-{weight}.ttf") for weight in (400, 500, 600, 700)},
        },
        "Albert Sans": {
            "source_css": "https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;600;700&display=swap",
            "license": "fonts/albert-sans-OFL.txt",
            "files_sha256": {str(weight): digest(ROOT / f"fonts/albert-sans-{weight}.ttf") for weight in (400, 500, 600, 700)},
        },
    },
    "purple": "#7d40fa, sampled from original logo pixel (650, 350)",
    "variants": {},
}

for variant in ("desktop", "tablet", "mobile"):
    png = OUT / f"wabrix-{variant}.png"
    webp = OUT / f"wabrix-{variant}.webp"
    avif = OUT / f"wabrix-{variant}.avif"
    image = Image.open(png)
    assert image.size == (2250, 1000), f"Wrong dimensions: {png}"
    assert image.mode in ("RGB", "RGBA")
    if image.mode == "RGBA":
        assert image.getchannel("A").getextrema() == (255, 255), f"Transparency in {png}"
    rgb = image.convert("RGB")
    rgb.save(png, "PNG", optimize=True, icc_profile=srgb_profile)
    rgb.save(webp, "WEBP", quality=88, method=6, icc_profile=srgb_profile)
    rgb.save(avif, "AVIF", quality=78, speed=4, icc_profile=srgb_profile)
    files = {}
    for path in (png, webp, avif):
        verified = Image.open(path)
        assert verified.size == (2250, 1000), f"Wrong dimensions: {path}"
        assert verified.info.get("icc_profile"), f"Missing sRGB profile: {path}"
        files[path.suffix[1:]] = {"path": path.name, "bytes": path.stat().st_size, "sha256": digest(path)}
    manifest["variants"][variant] = files

(OUT / "manifest.json").write_text(dumps(manifest, indent=2) + "\n")
print("Exported WebP and AVIF for desktop, tablet, and mobile; dimensions and logo pixels verified.")
