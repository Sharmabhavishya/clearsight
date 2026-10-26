# ClearSight: Public information people can actually see

> **Hacktober Hackdays · Tech for Social Good · Built on Cloudinary**
> One image in, a full accessibility pack out: colour-blind-safe, low-vision, low-bandwidth and photocopy-ready versions, each a shareable Cloudinary URL.

---

## 1. The problem

Public information is increasingly published as **a single image**: vaccination-drive posters, flood evacuation maps, heatwave advisories, school timetables, NGO infographics. That one image is usually full-colour, full-resolution and designed on a large monitor. That fails several large groups of people:

- **Colour vision deficiency** affects roughly **1 in 12 men and 1 in 200 women**. On a map where red means "danger" and green means "safe", the two zones can look the same to them.
- **2.2 billion people** live with a near or distance vision impairment (WHO, *World Report on Vision*). Low contrast and small text on a phone screen shut them out.
- **2.6 billion people were still offline in 2024** (ITU), and far more are on slow, metered or congested connections, especially during the disasters when public notices matter most. A 1 MB poster can cost real money or fail to load at all.
- **Paper still matters.** In many communities a notice is printed or photocopied in black and white and pinned to a board, and colour-coded meaning disappears.

The organisations that publish these images (local governments, clinics, schools, small NGOs) rarely have a designer, an accessibility specialist or a developer on hand. They need something that takes one image and fixes all of this **in seconds, without redesigning anything**.

## 2. The solution: ClearSight

ClearSight is a web tool that takes one image and generates an **accessibility pack** using Cloudinary's media pipeline:

| Version | What it does | Who it helps |
|---|---|---|
| **Colour-blind simulations** (deuteranopia, protanopia, tritanopia, monochromacy) | Shows exactly what colour-blind readers see | Publishers checking their design before release |
| **Colour-blind assist: stripes** | Overlays stripe patterns on problem colours | Colour-blind readers |
| **Colour-blind assist: x-ray** | Shifts colours so confusable ones separate | Colour-blind readers |
| **Low-vision boost** | Auto-contrast and sharpening | Low-vision readers, cheap or dim screens |
| **Low-bandwidth (2G-friendly)** | 480px wide, modern format, eco quality | Rural, metered or crisis-hit networks |
| **Photocopy / print-ready** | High-contrast greyscale | Notice boards and black-and-white printing |

### User flow
1. **Pick an image**: one of the samples, or upload your own (straight to your Cloudinary account).
2. **See it the way others do**: a drag slider compares the original with any version side by side.
3. **Get the pack**: every version as a card with a live preview, real measured file size, % data saved, and Open / Download / Copy URL buttons.
4. **Publish it**: a ready-made HTML snippet with a responsive `srcset` (slow devices get the light version automatically) and links to the colour-blind, high-contrast and print versions.

### Measured impact (sample poster)
On the `cld-sample-4` sample, the original is **818 KB**. The low-bandwidth version is **28 KB, about 96.5% smaller**. Across 10,000 views on a metered network, that's roughly **7.4 GB of data saved**, with the same image still readable. The app measures this live for every image, so the numbers aren't estimates.

## 3. Why Cloudinary is the core, not an add-on

All of ClearSight's image processing is done by Cloudinary. There's no image-processing code in the app at all.

- **Upload API (unsigned)**: images go directly from the browser to `POST https://api.cloudinary.com/v1_1/<cloud>/image/upload` using an unsigned upload preset, tagged `clearsight`. No backend, and the API secret never reaches the client.
- **On-the-fly URL transformations**: each version is just a URL. Nothing is pre-rendered or stored twice. Versions are generated at the edge on first request and cached by Cloudinary's CDN.
- **Accessibility effects**: `e_simulate_colorblind:<type>` and `e_assist_colorblind` (stripes and x-ray) are built-in Cloudinary effects that most people don't know exist. ClearSight puts them in front of the people who need them.
- **`f_auto` + `q_auto`**: automatic format (WebP/AVIF where supported) and perceptual quality. `q_auto:eco` drives the low-bandwidth version.
- **Readability effects**: `e_auto_contrast`, `e_sharpen`, `e_grayscale`, `e_contrast`.
- **`fl_attachment`**: one-click downloads of any version.
- **Open CORS on delivery**: Cloudinary serves assets with `Access-Control-Allow-Origin: *`, which lets the browser fetch each version and report its real byte size.

### Transformation reference

```
Simulate   e_simulate_colorblind:deuteranopia | protanopia | tritanopia | rod_monochromacy
Assist     e_assist_colorblind:20            e_assist_colorblind:xray
Low vision e_auto_contrast/e_sharpen:80/w_1600,c_limit,f_auto,q_auto
Low data   w_480,c_limit,f_auto,q_auto:eco
Print      e_grayscale/e_contrast:40
Download   <any of the above>/fl_attachment
```

Every one of these was tested against the live `res.cloudinary.com` endpoint (HTTP 200) before it went into the app.

## 4. Technical decisions

| Decision | Why |
|---|---|
| **Single static HTML file, vanilla JS, no build** | Hosts anywhere for free (GitHub Pages, Netlify Drop) and is about 20 KB. A low-bandwidth tool shouldn't ship a heavy JS bundle. |
| **Cloudinary's public `demo` cloud for samples** | Judges and users can try it instantly with no account. |
| **Direct REST upload instead of the Upload Widget script** | One less third-party script to load and fewer failure points. A plain `fetch` + `FormData` call is all it takes. |
| **Unsigned upload preset** | No server needed. The secret key is never exposed. Each org uses its own Cloudinary account and keeps ownership of its media. |
| **URLs as the output, not files** | A URL can go into any CMS, WhatsApp message or email. Cloudinary's CDN caches each version globally. |
| **Real size measurement in the browser** | Impact claims are measured per image, not assumed. |
| **Accessible UI by default** | Semantic landmarks, `aria-live` status updates, visible focus rings, keyboard-operable slider (range input), automatic dark mode, mobile-first layout. An accessibility tool has to be accessible itself. |
| **Settings remembered locally** | Cloud name and preset are saved in `localStorage` (inside try/catch) so repeat publishers don't retype them. |

## 5. Architecture

```
 Browser (index.html)
   │
   ├── Upload ─────────► Cloudinary Upload API  (unsigned preset, tag: clearsight)
   │                         │ returns public_id, version, format
   │                         ▼
   ├── Build URLs ─────► res.cloudinary.com/<cloud>/image/upload/<transformation>/v<ver>/<public_id>.<fmt>
   │                         │ generated on first request, then CDN-cached
   │                         ▼
   ├── Render cards, compare slider, measure bytes (CORS fetch → blob.size)
   │
   └── Output: shareable URLs + HTML snippet (srcset + accessible-version links)
```

## 6. Project journey

1. **Problem selection.** I wanted a social-good problem where *media itself* is the barrier, so Cloudinary would be essential rather than incidental. Inaccessible public-information images hit four groups at once (colour-blind, low-vision, low-bandwidth, print-only) and fit that brief.
2. **Capability check first.** Before writing UI, I tested every candidate transformation against Cloudinary's live delivery endpoint with `curl`, including colour-blind simulation types, assist modes, `q_auto:eco`, chained transformations and `fl_attachment`. I also confirmed that delivery is CORS-open, which made real in-browser size measurement possible.
3. **A dead end.** My first plan used a public Ishihara colour-test plate from Wikimedia through Cloudinary's *fetch* delivery type. Wikimedia rejects those requests (HTTP 400), so I switched to Cloudinary's own demo assets. That's more reliable for judges.
4. **Build.** One HTML file: sample picker, upload, compare slider, accessibility-pack grid, impact summary and HTML snippet generator.
5. **Verification.** JS syntax checked with Node. Every generated URL pattern was checked for HTTP 200. The upload error path was checked against the real API error format (`{"error":{"message":"Upload preset not found"}}`).

## 7. What's next

- **AI alt text and OCR** (Cloudinary AI add-ons) so screen-reader users get the text inside posters.
- **Translated text overlays** for multilingual communities.
- **Colour-contrast audit score** per image with a pass/fail badge for WCAG.
- **Bulk mode**: process a whole folder of notices via the `clearsight` tag.
- **Offline PWA** so field workers can prepare packs before going into low-connectivity areas.

## 8. Links

- **Live demo:** https://resplendent-maamoul-58cc39.netlify.app
- **Source code:** a single self-contained `index.html` (view source on the live demo)
- **Built with:** Cloudinary Upload API · Transformations · f_auto/q_auto · e_simulate_colorblind · e_assist_colorblind
