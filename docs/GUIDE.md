# ClearSight: the complete guide

> **See what everyone sees.** A free, open-source accessibility tool built on Cloudinary.
>
> **Bhavishya Sharma**
>
> **Dhruv Mittal**

**Live site:** https://resplendent-maamoul-58cc39.netlify.app · **Code:** https://github.com/Sharmabhavishya/clearsight

---

## 1. ClearSight in one minute

**The purpose.** Public information is mostly published as one full-colour image: flood maps, air-quality maps, vaccination posters, school notices, charts. That single image quietly fails a lot of people. ClearSight does two jobs:

1. **For colour-blind people:** it answers the question they are asked, and stuck on, every day: *“which part is red?”*
2. **For the people who publish notices:** it turns one image into a full **accessibility pack** (13 versions) in seconds, scores how accessible it is, and gives them everything they need to publish the fixes.

**How it’s built.** Every image ClearSight shows is a **Cloudinary URL**. There is no server and no image-processing code of our own. Cloudinary uploads, transforms, measures and delivers everything.

---

## 2. The problem, with sources

| Fact | Source |
|---|---|
| **1 in 12 men** (and 1 in 200 women) have colour vision deficiency | Colour Blind Awareness |
| In India, **8.12% of men** in a 3,131-person hospital study had colour vision deficiency, often undetected | JCDR, 2022 |
| **2.2 billion people** live with a vision impairment | WHO, *World Report on Vision* |
| **2.6 billion people** were offline in 2024, and many more are on slow, metered data | ITU, *Facts and Figures 2024* |
| **66–90%** of colour-blind people have trouble with everyday tasks such as reading charts | BMC Ophthalmology, 2017 |
| Matching a chart’s legend to the chart is *“impossible”*, and many colour-blind people simply skip pie charts | We Are Colorblind |
| Recolouring filters (“daltonisation”) are often criticised for making images look unnatural | Accessibility guides and research summaries |

**What this means:** the most common problem is **colour used as the only label** (“the red zone”, “the green line”). That is exactly what ClearSight attacks.

---

## 3. Who it is for

| Person | What they get |
|---|---|
| **A colour-blind reader** | Colour Spotlight, the colour reader, the camera view, the pair checker |
| **A publisher** (municipality, clinic, school, NGO) with no designer | The Studio: simulate, fix, score and publish a poster in a minute |
| **Anyone with full colour vision** (including judges) | The vision lens, the hero demo and the dot-plate test let them *feel* the problem in seconds |

---

## 4. A tour of the site, top to bottom

### 4.1 Navigation bar and the Vision lens

- Links jump to each section: Spotlight, Camera, Tools, Studio, Report.
- **On phones** (under 760 px wide) the nav shows only the logo and the Vision lens button. A bottom **thumb dock** gives Spotlight, Camera, Tools and Studio, and highlights the section you are in.
- **Vision lens** (top right): turns the **whole website** into what a colour-blind person sees: Deuteranopia, Protanopia, Tritanopia or No colour. A small chip at the bottom (“Viewing as Deuteranopia · Reset”) reminds you it’s on and switches it off in one click.
- **Tech:** SVG `feColorMatrix` filters built from the Machado 2009 colour-vision matrices, applied with a CSS `filter`. This happens in the browser so the whole page, not just one image, changes instantly.

### 4.2 Hero: “Design for every eye.”

- A **live drag slider** over a flood-warning poster. Left side: what you see. Right side: what someone else sees.
- The words “every eye.” cycle through red, amber and green as seen with normal vision, deuteranopia, protanopia, tritanopia and no colour (computed with the Machado 2009 matrices), with a small sticker naming the current vision type. It stops for reduced-motion users.
- Seven ways of seeing: **Deuteranopia, Protanopia, Tritanopia, No colour, Blurry vision, Safe palette, Stripes fix**.
- The flood poster itself is **drawn entirely by Cloudinary**: coloured blocks (`e_colorize`) and text (`l_text`) layered on a sample image. No design file was ever uploaded.
- **Cloudinary:** `e_simulate_colorblind`, `e_grayscale`, `e_blur`, `e_replace_color`, `e_assist_colorblind`.
- Below the hero: three numbers that count up (1 in 12 men, 2.2B people, 97% smaller files) and a scrolling strip of the Cloudinary transformations the site uses.

### 4.3 Colour Spotlight: “Which part is red?” (flagship)

**What it does.** Tap a colour, and only that colour stays in colour. Everything else turns grey.

**How to use it.**
1. Choose an image: **Air quality map**, Flood warning, Dahlias, Breakfast, or **your own image**.
2. Tap a **colour chip** (ClearSight lists the image’s main colours in everyday words: Red, Orange, Hot pink…), or **tap anywhere on the image**, including a legend swatch.
3. Read the answer: *“Red covers 8% of the image, in 3 places.”*
4. Optional: **See it as deuteranopia** (feel the problem first), **Hold to see all colours** (compare), the **Match** slider (catch lighter and darker shades in photos), **Download**, **Clear**.

**The demo moment.** On the air-quality map, switch on *See it as deuteranopia*: red, orange and green tiles turn into similar olives. Tap the *Severe* legend swatch: only Delhi and Noida light up.

**How it works.**
- **Cloudinary** `e_make_transparent:<tolerance>,co_rgb:<colour>` cuts the chosen colour out of the image, and `e_grayscale` greys the rest.
- The browser lays that grey layer over the original, so the holes show the true colour.
- ClearSight then reads the layer’s transparent pixels to count **how much** of the image is that colour and **in how many separate places** (a flood-fill count that ignores specks).
- The colour chips come from reading the image’s pixels and grouping them by everyday colour name. Washed-out colours (near white) are ignored because they are usually compression noise.
- A tap reads a 15×15 patch of the **full-size, lossless** image and prefers the most vivid colour, so tapping on a letter inside a red tile still picks the red tile.
- Animation: the grey spreads out in a circle from where you tapped.

**Why it matters.** It answers the question directly, without recolouring anything, so nothing looks unnatural and nothing new gets confused.

### 4.4 See any poster, live (Camera)

- Point your camera at a real notice and see it **live** through colour-blind eyes, with a drag slider between “You see” and “Deuteranopia sees”. Modes: Deuteranopia, Protanopia, Tritanopia, No colour, Blurry vision.
- **Snap and build the pack** sends that frame to Cloudinary, and the whole site (Studio, Report, Spotlight) switches to it.
- **Privacy:** the video never leaves the device until you press Snap.
- **Tech:** `getUserMedia` for the camera, SVG filters for the live view, Cloudinary Upload API for the snapshot.

### 4.5 Can you read this number? (Dot-plate test)

- A circle of coloured dots, **drawn fresh every time** in a canvas, hides a two-digit number. Type what you see and press Check.
- **See it as 1 in 12 men do** flips the plate to the deuteranopia view, and the number disappears.
- The colours were chosen by calculation: clearly different for normal vision (colour difference about 53) and nearly identical under deuteranopia (about 5).
- Labelled **“Just for fun. Not a medical test.”**

### 4.6 Tools for every day

**What colour is this? (Colour reader)**
- Move over the poster (or use arrow keys), or switch to the **camera**, and it names the colour in everyday words (30 names, like Navy, Olive or Coral) with its hex code. **Copy** puts it on the clipboard.
- It averages a small patch so one stray pixel doesn’t decide the name.
- Warning shown on the page: lighting changes colours, so double-check anything safety-critical like electrical wiring.

**Can everyone tell these apart? (Pair checker)**
- Pick two colours (or a preset like Red + green). It shows:
  - the **WCAG contrast ratio** with an AA pass or fail (4.5:1 for text, 3:1 for large text);
  - whether the two colours stay distinguishable for **normal vision, deuteranopia, protanopia and tritanopia** (“Clearly different”, “Close, add a label”, “Hard to tell apart”).
- **Suggest a safer second colour** picks one from the **Okabe–Ito** colour-blind-safe palette: the one that stays most different across all three kinds of colour blindness, preferring ones that also pass contrast.

### 4.7 The Studio: three calm steps

**Step 1: Pick a poster.** Seven samples (including the flood warning and the air-quality map), your recent uploads, or **Upload a poster** (drag and drop, paste, or browse). Images only, up to 10 MB. Uploads show a progress bar.

**Step 2: Look through their eyes.** A big comparison of the original against any version, as a **drag slider** or **side by side**. Works with the keyboard. For the stripes fix, a **Strength** slider (10–100) controls how strong the pattern is.

**Step 3: The pack.** All **13 versions** as cards, with the Original shown large, leading the grid. Each card has its with its **real delivered size** and the % saved. Filter by All, Simulate, Fix, Reach. Each card has Open, Download and Copy link.
- **Full-screen viewer:** step through versions. It shows **“How Cloudinary made this”**: the real width, height, format and file size reported by Cloudinary (`fl_getinfo`), and every part of the URL explained in plain English.
- **Download pack (.zip):** every version as JPG/PNG so they open anywhere, plus a README.
- **Share card:** a ready-made 1600×900 image, “What you see vs. what 1 in 12 men see”, for WhatsApp or LinkedIn.

### 4.8 The 13-version accessibility pack

| Group | Version | What it does | Cloudinary transformation |
|---|---|---|---|
| Baseline | Original | The image as published | none |
| Simulate | Deuteranopia | Green-weak vision | `e_simulate_colorblind:deuteranopia` |
| Simulate | Protanopia | Red-weak vision | `e_simulate_colorblind:protanopia` |
| Simulate | Tritanopia | Blue-yellow weak vision | `e_simulate_colorblind:tritanopia` |
| Simulate | Monochromacy | No colour at all | `e_grayscale` |
| Fix | Colour-blind stripes | Adds stripes to confusable colours | `e_assist_colorblind:<strength>` |
| Fix | Colour-blind X-ray | Pushes confusable hues apart | `e_assist_colorblind:xray` |
| Fix | Print-safe | Survives black-and-white photocopying | `e_assist_colorblind:40/e_grayscale/e_contrast:30` |
| Fix | Safe palette | Swaps red→vermillion, green→blue | `e_replace_color` (twice) |
| Reach | Low-vision boost | Sharper and higher contrast, up to 1600 px wide | `w_1600,c_limit/e_sharpen:80/e_auto_contrast` |
| Reach | Low data | For slow, metered networks | `w_480,c_limit/f_auto,q_auto:eco` |
| Reach | Chat-ready square | Nothing cropped in chat apps | `w_1080,h_1080,c_pad,b_white` |
| Reach | Story (9:16) | WhatsApp/Instagram status | `ar_9:16,c_pad,b_auto,w_1080` |

Every version except the original and the stripes and print versions (which must stay sharp) also gets `f_auto,q_auto`, so each browser receives the lightest format it supports (AVIF or WebP).

### 4.9 Accessibility report

- A score **out of 100**, with a verdict: **Ready to publish** (85+), **Needs work** (60+), or **At risk**.
- Four checks, calculated from the **actual pixels**:
  1. **Colour-blind safety:** colours that are clearly different normally but collapse together under deuteranopia or protanopia.
  2. **Photocopy safety:** different colours with almost the same lightness, which merge in black-and-white printing.
  3. **Tonal contrast:** the spread between light and dark.
  4. **Data weight:** the real file size.
- It lists the **exact colour pairs** that collapse, and tells you what to fix.
- **How:** ClearSight downloads small versions from Cloudinary (original, deuteranopia, protanopia), groups pixels into colour clusters, and compares them with CIELAB colour difference (ΔE).

### 4.10 Publish it everywhere

- **Say it in plain words:** type a line and Cloudinary prints it under the poster (`l_text`). 11 languages: English plus 10 Indian scripts. Six are one-tap examples: **English, हिन्दी, বাংলা, தமிழ், తెలుగు, ગુજરાતી**. The others (Marathi, Punjabi, Kannada, Malayalam, Odia, Urdu) work by typing. ClearSight detects the script and picks the matching Google font Cloudinary supports: Arial (English), Hind (Devanagari), Hind Siliguri (Bengali), Hind Madurai (Tamil), Hind Guntur (Telugu), Hind Vadodara (Gujarati), Mukta Mahee (Gurmukhi), Baloo Tamma (Kannada), Baloo Chettan (Malayalam), Baloo Bhaina (Odia), Lateef (Urdu). Cloudinary supports only some Google fonts (the Noto Sans Indic fonts return “Unsupported font family”), so each one was checked by rendering a real sentence. The translations are examples; you can edit them.
- **Turn it into a story video:** Cloudinary’s `e_zoompan` turns the poster (with or without your line) into a six-second MP4. Download included.
- **Describe the image:** alt text for screen readers, plus a paste-ready snippet in **HTML** (with `srcset` and links to the accessible versions), **Markdown** or plain **Links**.
- **QR code for the printed poster:** points to **this pack**, the **colour-blind** version or the **low-data** version. Download as PNG and print it on the notice.
- **Share:** uses the phone’s share sheet where available.
- **Scan to phone:** on desktop, a QR code in the closing card opens the site on a phone.

### 4.11 How it works, the note, and the footer

- **How it works:** Upload → Transform → Deliver, the three Cloudinary steps.
- **The note:** “Why I built this”. The quote **lights up word by word as you scroll**. Signed by Bhavishya Sharma and Dhruv Mittal.
- **Footer:** links, the team (Bhavishya Sharma, Dhruv Mittal), GitHub, the write-up and the MIT licence.

### 4.12 Behind the scenes

- **Connect your own Cloudinary:** a settings dialog takes a cloud name and an **unsigned upload preset**. Stored only in your browser. ClearSight never asks for an API key or secret.
- **Shareable links:** every pack has its own address (for example `#s=aqi`), so you can send someone the exact pack you made.
- **Works offline:** a service worker (cache `clearsight-v5`, which also pre-caches the manifest and an icon) keeps the site and the images you’ve already seen working on bad Wi-Fi.
- **Installable:** a web app manifest (`site/manifest.webmanifest`) and icons (`icon-180.png`, `icon-192.png`, `icon-512.png`) make “Add to Home screen” work. The PNG icons were rendered by Cloudinary from an SVG (`w_512,h_512,c_fill/f_png`).
- **Presenter keyboard shortcuts (desktop):** 1–9 jump to sections (1 top, 2 Spotlight, 3 Camera, 4 dot plate, 5 tools, 6 Studio, 7 Report, 8 Publish, 9 How it works). V cycles the page-wide vision lens. ? shows the list. They are ignored while you are typing.
- **Phone layout:** every section has a proper phone layout (320–430 px), tested with no horizontal scrolling at 320, 390, 768 and 1440 px.
- **Lighthouse (30 Oct 2026):** 100 accessibility, 100 best practices and 100 SEO, on both mobile and desktop.

---

## 5. Every Cloudinary feature we use, and why

| Cloudinary feature | Where | Why |
|---|---|---|
| **Upload API, unsigned preset** | Upload, camera snap | Browser uploads with no server and no secret in the code |
| `e_simulate_colorblind` | Hero, pack, report | Shows what colour-blind readers see |
| `e_assist_colorblind` (stripes, X-ray) | Pack, hero | Meaning survives without colour |
| `e_replace_color` | Safe palette | Swaps risky reds and greens for safe colours |
| `e_make_transparent` + `e_grayscale` | **Colour Spotlight** | Finds every pixel of one colour |
| `e_grayscale`, `e_contrast`, `e_auto_contrast`, `e_sharpen`, `e_blur` | Pack, hero | Print-safe, low-vision and blur views |
| `l_text` + `fl_layer_apply` (with Hind, Baloo, Mukta and Lateef fonts) | Posters, label | Draws posters and prints labels in Indian scripts |
| `e_colorize` | Sample posters | Solid colour blocks, no uploaded design needed |
| `c_pad`, `b_white`, `b_auto`, `ar_9:16` | Square and story | Reformat without cropping anything |
| `e_zoompan` → `.mp4` | Story video | Turns an image into a video |
| `f_auto`, `q_auto`, `q_auto:eco` | Everywhere | Lightest file for each device and network |
| `fl_getinfo` | Full-screen viewer | Real dimensions, format and bytes, straight from Cloudinary |
| `fl_attachment` | Downloads | Download instead of open |
| Global CDN + open CORS | Everywhere | Fast delivery; lets the browser measure and analyse pixels |

**The point to make:** ClearSight has **no image-processing code**. Cloudinary is the engine, not an add-on.

---

## 6. The rest of the tech stack, and why

| Technology | Why we chose it |
|---|---|
| **Plain HTML, CSS and JavaScript, one file** | No build step and no framework to break. It loads fast and anyone can read the code. |
| **Canvas API** | Reads pixels for the report, Spotlight counts, colour reader and dot plate; draws the share card. |
| **SVG colour-matrix filters** | Instant page-wide vision lens and live camera simulation. |
| **Colour science:** Machado 2009 matrices, CIELAB ΔE, WCAG contrast, Okabe–Ito palette | Recognised research and standards, not guesswork. |
| **getUserMedia** | Live camera, on the device. |
| **Web Share, Clipboard APIs** | Share and copy in one tap. |
| **Service worker** | Offline mode for bad venue or field Wi-Fi. |
| **IntersectionObserver, MutationObserver** | Scroll animations, the lit quote, keeping panels in sync. |
| **JSZip, qrcode-generator** (via cdnjs) | Zip export and QR codes, no server needed. |
| **Geist and Geist Mono** (Google Fonts) | Clean, modern type that stays readable. |
| **Netlify** | Static hosting, with strict security headers. |
| **GitHub** | Open source under the MIT licence. |

---

## 7. Architecture

```
Browser (ClearSight, one HTML file)
   │  upload (unsigned preset)            ┌──────────────────────────┐
   ├────────────────────────────────────► │ Cloudinary Upload API     │
   │                                      └──────────────────────────┘
   │  every version = a URL               ┌──────────────────────────┐
   ├────────────────────────────────────► │ Cloudinary transformations│
   │  ◄──── image / video / JSON ──────── │ + global CDN              │
   │                                      └──────────────────────────┘
   └─ reads pixels in a canvas → report, Spotlight counts, colour names
```

No backend, no database, no tracking.

---

## 8. Security and privacy

- **No secrets in the code or the repository.** Uploads use an unsigned preset; the API key and secret are never used in the browser.
- **Strict Content Security Policy:** scripts only from the site and cdnjs; images and video only from Cloudinary.
- **Camera privacy:** the live video never leaves the device until you press Snap.
- **No analytics, no cookies for tracking.** Your own Cloudinary details, if you add them, stay in your browser.

---

## 9. Accessibility of ClearSight itself

- Colour is never the only signal: every rating also has a **word** and a **pattern**.
- Semantic HTML, a keyboard-operable slider, visible focus, live regions that announce results.
- Respects **reduced motion**: animations are turned down for people who ask for that.
- The site’s own palette is colour-blind-safe (Okabe–Ito blue and orange).

---

## 10. Nuances and honest limits

| Situation | What happens, and why |
|---|---|
| **Simulations are approximations** | They model typical deuteranopia, protanopia and tritanopia. Real people vary, especially with milder forms. |
| **Spotlight on photos** | Real photos have many shades of one colour. Use the **Match** slider to widen or narrow what counts. |
| **Tapping text or edges in the Spotlight** | Letters are anti-aliased. ClearSight prefers the vivid tile colour; a tap on pure white says “That spot is white, grey or black”. |
| **Similar colours** (orange vs yellow) | The default match (12) keeps them apart. A very loose match can merge them. |
| **First time a version is requested** | Cloudinary renders it on demand, which can take a second or two. After that it comes from the CDN. |
| **Story video** | Cloudinary keeps text and layers in video but drops colour effects, so the video offers the poster and the poster with your line only. |
| **Camera** | Needs permission and a secure (https) page. Lighting changes colours. |
| **Colour reader** | Names are everyday words, not paint-chart names. Double-check anything safety-critical. |
| **Dot plate** | For awareness only, not a diagnosis. |
| **Air-quality map** | **Example data**, clearly labelled on the image. Not a live reading. |
| **Uploads** | Go to the project’s Cloudinary account unless you connect your own. Images only, up to 10 MB. |
| **Label languages** | Ten Indian scripts are tested with matching fonts, plus English. Others fall back to Arial. |
| **Offline mode** | Works for pages and images you’ve already opened. New uploads need a connection. |
| **QR “This pack”** | Needs the site to be on a web address (it is, on Netlify). |
| **Screen size** | Every section has a phone layout (320–430 px). Presenter keys are desktop only. |

---

## 11. Questions judges might ask

**Is this just a filter?**
No. Filters recolour. ClearSight’s Spotlight **answers a question** (“which part is red?”) and its Studio produces 13 ready-to-publish versions, scores the original, and gives publishing tools.

**Why Cloudinary and not your own code?**
Cloudinary already has the colour-blind effects, colour keying, text layers in Indian fonts, video, format optimisation and a global CDN. Using URLs means **zero servers** and every version is cached worldwide. We also tested Cloudinary’s generative AI recolour (`e_gen_recolor`): it erased the letter C on the flood poster and missed the legend swatch, so ClearSight uses deterministic transformations.

**How do you know the numbers are real?**
File sizes come from the actual delivered files and from Cloudinary’s `fl_getinfo`. Report scores come from reading the actual pixels.

**What about privacy?**
No backend, no tracking, camera stays on the device until Snap, no secrets in the code.

**What’s next?**
A bulk mode for whole folders of notices, and AI-generated alt text with Cloudinary’s add-ons.

---

## 12. Team

**Bhavishya Sharma**

**Dhruv Mittal**

Open source under the MIT licence: https://github.com/Sharmabhavishya/clearsight
