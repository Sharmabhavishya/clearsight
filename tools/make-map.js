// Builds the "Air quality today" India map poster as an SVG (example data), 1500 x 1000.
// Boundaries: DataMeet states GeoJSON (Survey of India based). Usage: node make-map.js states.geojson out.svg
// Get the boundaries from https://cdn.jsdelivr.net/gh/datameet/maps@master/website/docs/data/geojson/states.geojson, then upload the SVG to Cloudinary.
const fs = require('fs');
const [src, out] = process.argv.slice(2);
const g = JSON.parse(fs.readFileSync(src, 'utf8'));

const AQI = { good: '#2e9e44', moderate: '#e6c619', poor: '#f08c00', severe: '#c92a2a' };
const LEVEL = {
  severe: ['NCT of Delhi', 'Haryana', 'Punjab', 'Uttar Pradesh', 'Bihar', 'Chandigarh'],
  poor: ['Rajasthan', 'Madhya Pradesh', 'West Bengal', 'Jharkhand', 'Gujarat'],
  moderate: ['Maharashtra', 'Chhattisgarh', 'Odisha', 'Telangana', 'Assam', 'Uttarakhand', 'Himachal Pradesh', 'Jammu & Kashmir', 'Daman & Diu', 'Dadara & Nagar Havelli'],
};
const levelOf = name => Object.keys(LEVEL).find(k => LEVEL[k].includes(name)) || 'good';

// Projection: equirectangular with the x axis scaled for latitude ~23°N, fitted into the map box.
const BOX = { x: 70, y: 60, w: 800, h: 880 };
const K = Math.cos(23 * Math.PI / 180);
const [minX, minY, maxX, maxY] = [68.18, 6.75, 97.42, 37.08];
const s = Math.min(BOX.w / ((maxX - minX) * K), BOX.h / (maxY - minY));
const ox = BOX.x + (BOX.w - (maxX - minX) * K * s) / 2, oy = BOX.y + (BOX.h - (maxY - minY) * s) / 2;
const P = ([lon, lat]) => [ox + (lon - minX) * K * s, oy + (maxY - lat) * s];

// Douglas-Peucker in screen pixels.
function simplify(pts, tol) {
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop(); let idx = -1, dmax = tol;
    const [x1, y1] = pts[a], [x2, y2] = pts[b], dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    // Closed rings start and end on the same point: measure distance to that point instead of a line.
    for (let i = a + 1; i < b; i++) { const d = L ? Math.abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / L : Math.hypot(pts[i][0] - x1, pts[i][1] - y1); if (d > dmax) { dmax = d; idx = i; } }
    if (idx > 0) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
const area = r => { let A = 0; for (let i = 0; i < r.length; i++) { const [x1, y1] = r[i], [x2, y2] = r[(i + 1) % r.length]; A += x1 * y2 - x2 * y1; } return Math.abs(A / 2); };
const ringPath = ring => { const p = simplify(ring.map(P), 0.6); return p.length < 3 || area(p) < 1.5 ? '' : 'M' + p.map(([x, y]) => x.toFixed(1) + ' ' + y.toFixed(1)).join('L') + 'Z'; };

let states = '';
for (const f of g.features) {
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  const d = polys.map(poly => poly.map(ringPath).join('')).join('');
  if (d) states += `<path d="${d}" fill="${AQI[levelOf(f.properties.ST_NM)]}"/>`;
}

// Cities (example readings), placed by real coordinates.
const CITIES = [
  ['Delhi', 77.21, 28.61, 412, 'severe', 'r'], ['Lucknow', 80.95, 26.85, 338, 'severe', 'r'], ['Patna', 85.14, 25.59, 321, 'severe', 'r'],
  ['Jaipur', 75.79, 26.91, 246, 'poor', 'l'], ['Kolkata', 88.36, 22.57, 214, 'poor', 'r'], ['Ahmedabad', 72.57, 23.02, 228, 'poor', 'l'],
  ['Mumbai', 72.88, 19.08, 142, 'moderate', 'l'], ['Hyderabad', 78.49, 17.39, 118, 'moderate', 'r'],
  ['Bengaluru', 77.59, 12.97, 68, 'good', 'l'], ['Chennai', 80.27, 13.08, 74, 'good', 'r'], ['Kochi', 76.27, 9.93, 41, 'good', 'l'],
];
let cities = '';
for (const [name, lon, lat, , , side] of CITIES) {
  const [x, y] = P([lon, lat]);
  const tx = side === 'r' ? x + 14 : x - 14, anchor = side === 'r' ? 'start' : 'end';
  cities += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="#ffffff" stroke="#1d1d1f" stroke-width="3"/>`;
  cities += `<text x="${tx.toFixed(1)}" y="${(y + 7).toFixed(1)}" text-anchor="${anchor}" class="city">${name}</text>`;
}

// Right-hand panel: title, legend with Indian AQI bands, city readings.
const PX = 930;
const legend = [['Good', '0 – 100', 'good'], ['Moderate', '101 – 200', 'moderate'], ['Poor', '201 – 300', 'poor'], ['Severe', '301 +', 'severe']]
  .map(([label, range, k], i) => { const y = 300 + i * 62; return `<rect x="${PX}" y="${y}" width="40" height="40" rx="8" fill="${AQI[k]}"/><text x="${PX + 58}" y="${y + 29}" class="lg">${label}</text><text x="${PX + 470}" y="${y + 29}" text-anchor="end" class="rg">${range}</text>`; }).join('');
const readings = CITIES.filter((_, i) => [0, 1, 3, 6, 8].includes(i))
  .map(([name, , , v], i) => { const y = 640 + i * 52; return `<text x="${PX}" y="${y}" class="rd">${name}</text><text x="${PX + 470}" y="${y}" text-anchor="end" class="rv">${v}</text><line x1="${PX}" x2="${PX + 470}" y1="${y + 18}" y2="${y + 18}" stroke="#e3e3e6" stroke-width="2"/>`; }).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="1000" viewBox="0 0 1500 1000">
<style>
  text { font-family: Arial, Helvetica, sans-serif; fill: #1d1d1f; }
  .t { font-size: 64px; font-weight: 700; letter-spacing: -1px; }
  .st { font-size: 28px; fill: #6e6e73; }
  .h { font-size: 22px; font-weight: 700; fill: #6e6e73; letter-spacing: 2px; }
  .lg { font-size: 30px; font-weight: 700; }
  .rg { font-size: 26px; fill: #6e6e73; }
  .rd { font-size: 28px; }
  .rv { font-size: 28px; font-weight: 700; }
  .city { font-size: 24px; font-weight: 700; paint-order: stroke; stroke: #ffffff; stroke-width: 6px; stroke-linejoin: round; }
  .src { font-size: 18px; fill: #8e8e93; }
</style>
<rect width="1500" height="1000" fill="#ffffff"/>
<g stroke="#ffffff" stroke-width="1.4" stroke-linejoin="round">${states}</g>
<g>${cities}</g>
<text x="${PX}" y="130" class="t">AIR QUALITY</text>
<text x="${PX}" y="196" class="t">TODAY</text>
<text x="${PX}" y="246" class="st">Example data. Which states are severe?</text>
${legend}
<text x="${PX}" y="590" class="h">CITY AQI</text>
${readings}
<text x="${PX}" y="960" class="src">Example data for a demo. Boundaries: Survey of India via DataMeet.</text>
</svg>`;
fs.writeFileSync(out, svg);
console.log('wrote', out, (svg.length / 1024).toFixed(0) + ' KB');
