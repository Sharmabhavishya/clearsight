# ClearSight: See what everyone sees

> **A free, open-source accessibility tool · Built on Cloudinary · By Bhavishya Sharma**
> One public notice in, a full accessibility pack out: colour-blind-safe, low-vision, low-data and print-ready versions, each a shareable Cloudinary URL.

**Live demo:** https://resplendent-maamoul-58cc39.netlify.app
**Source code:** https://github.com/Sharmabhavishya/clearsight

---

## 1. The problem

Public information is increasingly published as **a single image**: flood evacuation maps, vaccination-drive posters, heatwave advisories, school notices, NGO infographics. That image is usually full-colour, full-resolution and designed on a large monitor, so it fails several large groups of people:

- **Colour vision deficiency** affects about **1 in 12 men and 1 in 200 women** (Colour Blind Awareness). On a map where red means “evacuate” and green means “safe”, the two zones can look the same.
- **2.2 billion people** live with a near or distance vision impairment (WHO, *World Report on Vision*). Low contrast and small detail shut them out.
- **2.6 billion people were still offline in 2024** (ITU, *Facts and Figures 2024*), and far more are on slow or metered data, often during the very disasters when notices matter most.
- **Paper still matters.** Notices get photocopied in black and white for notice boards, and colour-coded meaning disappears.

The organisations that publish these images (local governments, clinics, schools, small NGOs) rarely have a designer, an accessibility specialist or a developer. They need something that fixes all of this **in seconds, without redesigning anything**.

## 2. The solution: ClearSight

ClearSight takes one image and produces a **13-version accessibility pack** with Cloudinary, then tells you how accessible the original is and how to publish the fixes.

### The fix, proven on a real-style notice

The demo includes a **flood-warning poster built entirely from Cloudinary overlays**: three colour-coded zones (red “Evacuate now”, amber “Get ready”, green “Safe”). Under Cloudinary’s deuteranopia simulation, the red and green zones **turn almost the same olive colour**. With Cloudinary’s `e_assist_colorblind`, red gets horizontal stripes and green gets vertical ones, so the zones are distinguishable again. They stay distinguishable even after conversion to black and white.

### The pack

| Version | What it does | Who it helps |
|---|---|---|
| **Deuteranopia / Protanopia / Tritanopia / Monochromacy** | Simulates each type of colour blindness | Publishers checking their design before release |
| **Colour-blind stripes** | Adds stripe patterns to confusable colours (adjustable strength) | Colour-blind readers |
| **Colour-blind X-ray** | Shifts hues apart so confusable colours separate | Colour-blind readers (best for photos and maps) |
| **Print-safe** | Stripes plus high-contrast greyscale | Photocopied notice boards |
| **Low-vision boost** | Auto-contrast and sharpening | Low-vision readers, dim or low-cost screens |
| **Low data** | 480px, WebP/AVIF, eco quality | Slow, metered or disaster-hit networks |
| **Safe palette** | Swaps red for vermillion and green for blue (`e_replace_color`) | Colour-blind readers, without changing the design |
| **Chat-ready square** | Padded 1080×1080 so nothing gets cropped | Forwarding in WhatsApp and community groups |
| **Story (9:16)** | Tall format padded with the image’s own colours (`b_auto`) | WhatsApp and Instagram status |

### User flow

1. **Start with any image**: a sample, or your own (drag and drop, paste or browse). Uploads work straight away with no account, or can go to your own Cloudinary account.
2. **Walk in their shoes**: an inspector compares the original with any version, using a drag slider or side by side. The slider is keyboard-operable, and the stripe strength is adjustable.
3. **Get the pack**: every version as a card showing its real delivered size and % saved, with Open, Download and Copy link buttons. A fullscreen viewer lets you step through versions. **Download pack (.zip)** exports everything as JPG/PNG with a README.
4. **Read the report**: an accessibility score out of 100 across four checks (colour-blind safety, photocopy safety, tonal contrast, data weight), the exact colour pairs that collapse together, and concrete next steps.
5. **Publish it everywhere**: paste-ready HTML (with `srcset` and links to the accessible versions) or Markdown that includes your alt text, plus a **QR code for the printed poster** that opens the accessible version on any phone.

### Measured impact

- **Breakfast sample:** original 799 KB → low-data version 28 KB, **97% smaller** (measured in Chrome with WebP/AVIF).
- **Flood warning sample:** the report flags the red/green zone pair as hard to tell apart, with colour-blind safety scored 39/100. Stripes fix it.

The app measures sizes live for every image, so the numbers shown aren’t estimates.

## 3. Why Cloudinary is the core, not an add-on

ClearSight contains **no image-processing code**. Every version is a Cloudinary URL.

- **Upload API (unsigned):** images go straight from the browser to `POST https://api.cloudinary.com/v1_1/<cloud>/image/upload` with an unsigned preset, tagged `clearsight`. There’s no backend, and the API secret never reaches the client.
- **On-the-fly transformations:** nothing is pre-rendered or stored twice. Versions are generated at the edge on first request and cached on Cloudinary’s CDN.
- **Accessibility effects:** `e_simulate_colorblind` and `e_assist_colorblind` are built-in Cloudinary effects most people don’t know exist. ClearSight puts them in front of the people who need them.
- **`f_auto` + `q_auto`:** each browser gets the lightest format it supports. `q_auto:eco` drives the low-data version.
- **Layers as a design tool:** the flood-warning sample is made from `e_colorize` solid fills, `l_text` overlays and `fl_layer_apply`, with no uploaded asset.
- **Readability effects:** `e_auto_contrast`, `e_sharpen`, `e_grayscale`, `e_contrast`, `c_pad`.
- **Text in Indian scripts:** the plain-words label picks a Google font Cloudinary supports for the script it detects: Hind (Devanagari), Hind Siliguri (Bengali), Hind Madurai (Tamil), Hind Guntur (Telugu) and Hind Vadodara (Gujarati).
- **Image to video:** `e_zoompan` turns the poster, with its label, into a six-second MP4 for status updates. Cloudinary keeps overlays in the video but drops colour effects, so the video offers only what really survives.
- **`fl_getinfo`:** the fullscreen viewer asks Cloudinary for each version’s real width, height, format and bytes, and explains every parameter in its URL.
- **Open CORS on delivery:** Cloudinary serves `Access-Control-Allow-Origin: *`, so the browser can measure real byte sizes, build the zip and analyse pixels for the report.

### Transformation reference

```
Simulate      e_simulate_colorblind:deuteranopia | protanopia | tritanopia
No colour     e_grayscale
Stripes       e_assist_colorblind:<10–100>
X-ray         e_assist_colorblind:xray
Print-safe    e_assist_colorblind:40/e_grayscale/e_contrast:30
Low vision    w_1600,c_limit/e_sharpen:80/e_auto_contrast/f_auto,q_auto
Low data      w_480,c_limit/f_auto,q_auto:eco
Safe palette  e_replace_color:0072b2:40:2e9e44/e_replace_color:d55e00:40:d62828/f_auto,q_auto
Chat square   w_1080,h_1080,c_pad,b_white/f_auto,q_auto
Story         ar_9:16,c_pad,b_auto,w_1080/f_auto,q_auto
Label         c_pad,w_1.0,h_1.2,b_white/l_text:Hind_80_bold:<line>/fl_layer_apply,g_south
Video         <label>/e_zoompan:du_6/w_720 → .mp4
Details       <any version>/fl_getinfo
```

Every transformation was tested against the live `res.cloudinary.com` endpoint before it went into the app, and the visual results were checked by eye.

## 4. How the accessibility report works

1. ClearSight downloads three small (200px-wide) versions from Cloudinary: the original, the deuteranopia simulation and the protanopia simulation.
2. It reads their pixels in a canvas and groups the original’s pixels into colour clusters, keeping clusters that cover at least 1.5% of the image.
3. For every pair of clusters it compares CIELAB colour distances (ΔE):
   - **Colour-blind risk:** clearly different in the original (ΔE ≥ 30), but hard to tell apart in a simulation (ΔE < 27 and under 40% of the original difference).
   - **Photocopy risk:** clearly different colours with almost the same lightness (ΔL* < 10).
4. **Tonal contrast** comes from the spread of lightness. **Data weight** comes from the original’s real file size.

The thresholds were tuned from measured data. For the flood poster, the red/green pair measures ΔE 116 in the original but only 24.5 under deuteranopia and 17.8 under protanopia. The report is labelled as a screening aid, not a formal WCAG audit.

## 5. Technical decisions

| Decision | Why |
|---|---|
| **Static site, vanilla JS, no build** | Hosts anywhere for free, loads fast, and is easy for anyone to audit. A low-bandwidth tool shouldn’t ship a heavy bundle. |
| **Cloudinary’s public `demo` cloud for samples** | Anyone can try it instantly with no account. |
| **Unsigned uploads straight from the browser** | No server and no secret to leak. Each organisation keeps its media in its own Cloudinary account. |
| **One fetch per version** | The same downloaded file is displayed, measured, compared and zipped, so the sizes shown are exactly what was delivered. |
| **Downloads as JPG/PNG, previews as WebP/AVIF** | Previews are as light as possible. Downloaded files open on any phone, PC or printer. |
| **Stripes and print-safe keep full quality** | Lossy compression blurs thin stripe patterns, so these skip `q_auto`. |
| **Shareable deep links (`#s=poster`)** | A pack can be shared or encoded in a QR code on a printed poster. |
| **Strict Content Security Policy** | Scripts only from the site and cdnjs. Images only from Cloudinary. No framing. |
| **Accessible UI** | Semantic landmarks, a keyboard-operable slider, live regions, visible focus, reduced-motion support, mobile-first layout. An accessibility tool has to be accessible itself. |
| **Apple-inspired design** | Generous whitespace, large type and restrained colour keep the focus on the images. |
| **Colour-blind-safe interface** | ClearSight practises what it preaches. Ratings use a blue/orange/vermillion palette (based on Okabe–Ito) instead of green/red, and every rating also has a word (Good, Fair, Poor) and a pattern (solid or striped bars), so no information depends on colour alone. |
| **Works on every phone** | Tested at 320, 360, 375, 390, 414 and 430px wide and in landscape. Finger-sized tap targets on touch screens, notch-safe spacing, no zoom-on-focus on iPhone, and a swipeable view picker. |

## 6. Architecture

```
 Browser (site/index.html)
   │
   ├── Upload ───────► Cloudinary Upload API (unsigned preset, tag: clearsight)
   │                      │ returns public_id, version, format
   │                      ▼
   ├── Build URLs ───► res.cloudinary.com/<cloud>/image/upload/<transformation>/v<ver>/<public_id>.<fmt>
   │                      │ rendered on first request, then CDN-cached
   │                      ▼
   ├── fetch() each version once ─► display · measure bytes · compare · zip
   ├── Canvas pixel analysis ─────► accessibility report
   │
   └── Output: links · HTML/Markdown snippet · zip · QR code · shareable #link
```

## 7. Project journey

1. **Problem selection.** I wanted a problem where *media itself* is the barrier, so Cloudinary would be essential rather than incidental. Inaccessible public-information images hit four groups at once: colour-blind, low-vision, low-bandwidth and print-only readers.
2. **Capability check first.** Before writing any UI, I tested every candidate transformation against Cloudinary’s live endpoint with `curl`, including simulation types, assist modes, `q_auto:eco`, chained transformations and `fl_attachment`, and confirmed CORS was open.
3. **Dead ends.** Using public images through Cloudinary’s *fetch* delivery failed: Wikimedia returned 400 and Unsplash 401 on the demo cloud. I switched to Cloudinary’s own demo assets.
4. **Version 1** was a quick first build: a single-page tool with a sample picker, upload, a compare slider, the pack grid and an HTML snippet.
5. **Testing found real bugs.** Running v1 in a real browser revealed:
   - size comparisons missing for versions that loaded before the original
   - every image downloaded twice
   - sizes measured as JPEG while users were shown WebP/AVIF
   - a slider that grabbed the image instead of dragging
   - a Copy button that stuck on “Copied”
   - Chrome restoring stale control values on reload
6. **The poster.** Sample photos don’t show the stakes, so I built a flood-warning notice out of Cloudinary overlays. Then I sampled pixels from Cloudinary’s simulations to confirm that the red and green zones really collapse (ΔE 116 → 24.5).
7. **Version 2:**
   - an Apple-inspired redesign
   - an 11-version pack with print-safe (stripes + greyscale, verified by eye) and a chat-ready square
   - the pixel-based accessibility report
   - zip export, a QR code for printed posters, deep links
   - drag, drop and paste uploads with progress
   - a fullscreen viewer and a strict CSP
8. **Verification.** Tested end to end in Chrome under the production security headers:
   - every version loads, sizes and savings render, and the report computes
   - slider drag and keyboard, side-by-side mode and stripe strength
   - filters, the lightbox, single and zip downloads (11 JPG/PNG files plus a README), the QR PNG
   - settings validation, upload error handling and non-image rejection
   - deep-link reload, no console errors, and no horizontal overflow at phone width
   - real uploads on the live site: an image dropped in by a visitor goes to Cloudinary through the unsigned preset and produces the full pack and report
9. **More Cloudinary, easier to use:**
   - the plain-words label in six languages, each script rendered in a matching Hind font
   - a story video made with `e_zoompan`; testing showed colour effects don’t survive into video, so the options were cut to the poster and the poster with its label
   - a 9:16 story version with `b_auto` padding, making the pack 13 versions
   - “How Cloudinary made this” in the fullscreen viewer, from `fl_getinfo`
   - “Suggest a safer second colour” in the pair checker (Okabe–Ito palette, best worst-case ΔE across all three kinds of colour blindness, WCAG AA contrast first)
   - a Copy button on the colour reader and a “Viewing as … Reset” chip for the vision lens
   - a service-worker fix: a cached `<img>` copy could block a later download of the same file

## 8. What’s next

- **AI alt text and OCR** (Cloudinary AI add-ons) so screen-reader users get the words inside posters automatically.
- **More languages** for the label (Kannada, Malayalam, Punjabi, Odia, Urdu), once matching fonts are confirmed in Cloudinary.
- **Bulk mode** to process a whole folder of notices using the `clearsight` tag.
- **Offline PWA** so field workers can prepare packs before going into low-connectivity areas.
- **Formal WCAG contrast checks** for text regions, alongside the colour-cluster screening.

## 9. Links

- **Live demo:** https://resplendent-maamoul-58cc39.netlify.app
- **Source code:** https://github.com/Sharmabhavishya/clearsight
- **Built with:** Cloudinary Upload API · Transformations · Overlays · f_auto/q_auto · e_simulate_colorblind · e_assist_colorblind · e_replace_color · l_text (Hind fonts) · e_zoompan · b_auto · fl_getinfo
