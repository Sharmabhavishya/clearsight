# ClearSight

**Public information people can actually see.**

ClearSight turns one public-information image (a health notice, evacuation map, school chart or NGO poster) into a full **accessibility pack** using Cloudinary:

| Version | Cloudinary transformation | Who it helps |
|---|---|---|
| Deuteranopia / Protanopia / Tritanopia / Monochromacy view | `e_simulate_colorblind:<type>` | Designers checking what colour-blind readers see |
| Colour-blind assist (stripes) | `e_assist_colorblind:20` | Colour-blind readers telling regions apart |
| Colour-blind assist (x-ray) | `e_assist_colorblind:xray` | Colour-blind readers, colour shift |
| Low-vision boost | `e_auto_contrast/e_sharpen:80/w_1600,c_limit,f_auto,q_auto` | Low-vision readers, dim or cheap screens |
| Low-bandwidth (2G-friendly) | `w_480,c_limit,f_auto,q_auto:eco` | Rural, metered or crisis-hit networks |
| Photocopy / print-ready | `e_grayscale/e_contrast:40` | Black-and-white notice boards |

Every version is a live Cloudinary delivery URL generated on demand. The app measures each file's real size in the browser and shows how much data the light version saves. It also produces a copy-paste HTML snippet (`srcset` plus links to the accessible versions) for any website or CMS.

## Run it

It's a single static file with no build step and no dependencies.

- **Locally:** open `index.html` in a browser.
- **Deploy:** drag the folder onto <https://app.netlify.com/drop>, or push to GitHub and turn on GitHub Pages.

The samples come from Cloudinary's public `demo` cloud, so the app works with no account.

## Uploading your own images

1. Cloudinary Console → **Settings → Upload → Upload presets → Add upload preset**
2. Set **Signing mode: Unsigned** and save.
3. In ClearSight, open *Upload your own image*, enter your **cloud name** and **preset name**, choose a file, then click **Upload & generate pack**.

Uploads go straight from the browser to the Cloudinary Upload API (`POST https://api.cloudinary.com/v1_1/<cloud>/image/upload`) and are tagged `clearsight`. Your API secret never touches the browser.

## Tech

- Cloudinary Upload API (unsigned, from the browser)
- Cloudinary on-the-fly transformations and URL-based delivery
- `f_auto` / `q_auto` automatic format and quality
- Cloudinary accessibility effects: `e_simulate_colorblind`, `e_assist_colorblind`
- Vanilla HTML, CSS and JS: no framework, no build, about 20 KB total

See [NOTION.md](NOTION.md) for the full project journey and technical decisions.
