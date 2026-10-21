/* Venture Kart — Investor portal. Hash routes: #/ (public site), #/login, #/app/<page>. Mock data only. */
(function(){
  'use strict';
  var app = document.getElementById('app');
  var ST = { cargo:'daily', fin:'overview', prog:'ms', doc:'all', docq:'', msg:0, slot:'11:30 AM', navOpen:false };
  var RAF = null, OBS = [];

  // ---------------- icons ----------------
  var P = {
    dash:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    home:'<path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>',
    building:'<path d="M4 21V5a1 1 0 011-1h9a1 1 0 011 1v16M15 9h4a1 1 0 011 1v11M2 21h20M8 8h3M8 12h3M8 16h3"/>',
    cpu:'<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4M10 10h4v4h-4z"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    trend:'<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>', up:'<path d="M12 19V5M5 12l7-7 7 7"/>',
    wallet:'<path d="M20 7H5a2 2 0 010-4h13v4M3 5v14a2 2 0 002 2h15V7"/><circle cx="16" cy="14" r="1.3"/>',
    file:'<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    folder:'<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    chat:'<path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z"/>',
    cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h2M14 14h2M8 17h2"/>',
    users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 7M18 14a6 6 0 013.5 6"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
    gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>',
    ship:'<path d="M3 17l2 4h14l2-4-9-3z"/><path d="M5 15V9h14v6M9 9V5h6v4M12 3v2"/>',
    plane:'<path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    truck:'<path d="M1 6h13v10H1zM14 10h4l3 3v3h-7z"/><circle cx="5.5" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/>',
    box:'<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    dollar:'<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.4-1-1.5-1.7-3-1.7-1.8 0-3 .9-3 2.1 0 2.9 6 1.4 6 4.3 0 1.2-1.3 2.1-3 2.1-1.6 0-2.7-.7-3.1-1.8M12 6.5v1.3M12 16.3v1.2"/>',
    card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
    check:'<path d="M20 6L9 17l-5-5"/>', checkc:'<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    bell:'<path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"/>',
    chev:'<path d="M9 6l6 6-6 6"/>', chevd:'<path d="M6 9l6 6 6-6"/>', arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>', left:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
    dl:'<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>', eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
    shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>', logout:'<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>',
    menu:'<path d="M3 6h18M3 12h18M3 18h18"/>', x:'<path d="M18 6L6 18M6 6l12 12"/>',
    bars:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>', pie:'<path d="M21 12A9 9 0 1112 3v9z"/><path d="M15 3.5A9 9 0 0120.5 9H15z"/>',
    award:'<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/>', zap:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    layers:'<path d="M12 2l10 5-10 5L2 7z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>',
    pin:'<path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    anchor:'<circle cx="12" cy="5" r="2.5"/><path d="M12 7.5V21M5 12H2a10 10 0 0020 0h-3M8 11h8"/>',
    video:'<rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-3v10l-6-3z"/>',
    phone:'<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/>',
    send:'<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>', clip:'<path d="M21 11l-8.5 8.5a5 5 0 01-7-7L14 4a3.5 3.5 0 015 5l-8.5 8.5a2 2 0 01-3-3L15 7"/>',
    receipt:'<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
    ai:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    warehouse:'<path d="M3 21V9l9-5 9 5v12M7 21v-8h10v8M7 17h10"/>', cloud:'<path d="M18 10h-1.3A7 7 0 104 15.7 4.5 4.5 0 008.5 20H18a5 5 0 000-10z"/>',
    mobile:'<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>', mega:'<path d="M3 11v2a1 1 0 001 1h3l5 4V6L7 10H4a1 1 0 00-1 1zM16 8a5 5 0 010 8"/>',
    star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>', alert:'<path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17.5v.5"/>'
  };
  function ic(n, cls){ return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24">' + P[n] + '</svg>'; }
  var CROWN = '<svg viewBox="0 0 64 40"><path d="M4 34L10 8l14 14L32 4l8 18L54 8l6 26z"/><rect x="4" y="35.5" width="56" height="3.5" rx="1.5"/></svg>';
  function logo(cls, tag){ return '<div class="iv-logo ' + (cls || '') + '"><span class="iv-emb">' + CROWN + '</span><div><b>VENTURE KART</b><small>GLOBAL TRADE &amp; LOGISTICS PLATFORM</small>' + (tag ? '<em>' + tag + '</em>' : '') + '</div></div>'; }
  function pill(s){ var c = /^(Completed|Delivered|Cleared|Verified|Confirmed|Signed|Accredited|Valid)$/.test(s) ? 'ok' : /^(In Progress|In Transit|Pending|Requested)$/.test(s) ? 'prog' : /^(Planned|Projected|Estimated)$/.test(s) ? 'plan' : 'bad'; return '<span class="pill ' + c + '">' + s + '</span>'; }
  function money(n){ return '$' + n.toLocaleString('en-US'); }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]; }); }

  // shared SVG defs (gradients, glow)
  document.body.insertAdjacentHTML('afterbegin', '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3D597"/><stop offset=".5" stop-color="#D4A256"/><stop offset="1" stop-color="#9A6420"/></linearGradient>' +
    '<linearGradient id="bGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EBC683"/><stop offset="1" stop-color="#9A6A2C"/></linearGradient>' +
    '<linearGradient id="bBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E9DFF"/><stop offset="1" stop-color="#2A58B8"/></linearGradient>' +
    '<linearGradient id="bGreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FD8A0"/><stop offset="1" stop-color="#1A8A5F"/></linearGradient>' +
    '<linearGradient id="aGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2B66B" stop-opacity=".35"/><stop offset="1" stop-color="#E2B66B" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="aBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4B8BF5" stop-opacity=".35"/><stop offset="1" stop-color="#4B8BF5" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="arcg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFD27A" stop-opacity=".2"/><stop offset=".5" stop-color="#FFD27A"/><stop offset="1" stop-color="#FFD27A" stop-opacity=".3"/></linearGradient>' +
    '<filter id="glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
    '</defs></svg>');

  // ---------------- charts ----------------
  function bars(o){ // o: labels, series [{d,c}], max, ticks, fmt, h, every
    var W = o.w || 560, H = o.h || 200, L = 34, B = 22, T = 8, n = o.labels.length, gw = (W - L - 6) / n, s = o.series.length,
        bw = Math.min(o.bw || 16, gw * .7 / s), ih = H - B - T, out = '';
    o.ticks.forEach(function(t){ var y = T + ih - t / o.max * ih; out += '<line class="gl" x1="' + L + '" x2="' + W + '" y1="' + y + '" y2="' + y + '"/><text x="' + (L - 6) + '" y="' + (y + 3) + '" text-anchor="end">' + (o.fmt ? o.fmt(t) : t) + '</text>'; });
    o.labels.forEach(function(lb, i){ var cx = L + gw * i + gw / 2, x0 = cx - bw * s / 2 - (s - 1);
      o.series.forEach(function(se, k){ var v = Math.max(0, se.d[i]), h = v / o.max * ih; out += '<rect class="b" x="' + (x0 + k * (bw + 2)) + '" y="' + (T + ih - h) + '" width="' + bw + '" height="' + h + '" rx="2" fill="' + se.c + '"><title>' + (se.n || '') + ' ' + (o.fmt ? o.fmt(se.d[i]) : se.d[i]) + '</title></rect>'; });
      if (!o.every || i % o.every === 0) out += '<text x="' + cx + '" y="' + (H - 6) + '" text-anchor="middle">' + lb + '</text>'; });
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '">' + out + '</svg>'; }
  function line(o){
    var W = o.w || 520, H = o.h || 190, L = 40, B = 22, T = 10, n = o.labels.length, gx = (W - L - 14) / (n - 1), ih = H - B - T, out = '';
    function X(i){ return L + 7 + gx * i; } function Y(v){ return T + ih - v / o.max * ih; }
    o.ticks.forEach(function(t){ out += '<line class="gl" x1="' + L + '" x2="' + W + '" y1="' + Y(t) + '" y2="' + Y(t) + '"/><text x="' + (L - 6) + '" y="' + (Y(t) + 3) + '" text-anchor="end">' + o.fmt(t) + '</text>'; });
    o.labels.forEach(function(lb, i){ out += '<text x="' + X(i) + '" y="' + (H - 6) + '" text-anchor="middle">' + lb + '</text>'; });
    o.series.forEach(function(se){ var pts = se.d.map(function(v, i){ return X(i) + ',' + Y(v); });
      out += '<path d="M' + X(0) + ',' + Y(0) + ' L' + pts.join(' L') + ' L' + X(n - 1) + ',' + Y(0) + 'Z" fill="url(#' + se.a + ')"/>';
      out += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + se.c + '" stroke-width="2.2" stroke-linejoin="round"/>';
      se.d.forEach(function(v, i){ out += '<circle cx="' + X(i) + '" cy="' + Y(v) + '" r="3.4" fill="' + se.c + '" stroke="#08172A" stroke-width="1.5"><title>' + o.fmt(v) + '</title></circle>'; }); });
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '">' + out + '</svg>'; }
  function donut(segs, size, th, center, gap){
    var r = (size - th) / 2, C = 2 * Math.PI * r, acc = 0, tot = segs.reduce(function(a, s){ return a + s.v; }, 0), g = gap == null ? 2 : gap, out = '';
    segs.forEach(function(s){ var len = s.v / tot * C; out += '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + s.c + '" stroke-width="' + th + '" stroke-dasharray="' + Math.max(0, len - g) + ' ' + (C - len + g) + '" stroke-dashoffset="' + (-acc) + '"/>'; acc += len; });
    return '<div class="donut" style="width:' + size + 'px;height:' + size + 'px"><svg width="' + size + '" height="' + size + '" style="transform:rotate(-90deg)">' + out + '</svg><div class="c">' + (center || '') + '</div></div>'; }
  function legend(rows){ return '<div class="legend">' + rows.map(function(r){ return '<div><i style="background:' + r[0] + '"></i><span>' + r[1] + (r[3] ? '<small>' + r[3] + '</small>' : '') + '</span><em>' + r[2] + '</em></div>'; }).join('') + '</div>'; }

  // ---------------- world (land polygons, lon/lat) ----------------
  var LAND = [
    [[-168,66],[-162,70],[-140,70],[-125,72],[-95,72],[-80,73],[-62,66],[-56,52],[-66,45],[-70,42],[-76,35],[-81,31],[-80,25],[-82,27],[-84,30],[-90,29],[-97,26],[-97,22],[-92,18],[-87,21],[-88,16],[-83,10],[-79,8],[-80,7],[-85,11],[-92,14],[-105,20],[-110,24],[-112,30],[-117,32],[-124,40],[-124,48],[-133,56],[-150,60],[-160,58],[-165,62]],
    [[-55,60],[-44,60],[-20,70],[-18,80],[-40,83],[-65,80],[-58,75],[-52,68]],
    [[-80,8],[-72,12],[-62,10],[-50,0],[-35,-6],[-38,-13],[-41,-22],[-48,-26],[-58,-34],[-62,-40],[-66,-46],[-69,-52],[-72,-50],[-74,-42],[-71,-30],[-70,-18],[-76,-12],[-81,-5],[-80,0]],
    [[-10,36],[-9,43],[-2,44],[-5,48],[2,51],[5,53],[8,57],[5,62],[12,66],[18,70],[28,71],[40,68],[45,66],[40,60],[30,57],[28,46],[40,44],[30,41],[26,40],[23,36],[20,40],[16,38],[18,40],[13,44],[10,44],[8,44],[3,43],[0,38]],
    [[-5,50],[1,51],[2,53],[-1,55],[-3,58],[-6,57],[-5,54],[-3,53]],
    [[-17,21],[-16,28],[-9,33],[-5,36],[10,37],[11,33],[20,31],[32,31],[34,28],[39,18],[43,12],[51,12],[48,5],[40,-3],[40,-15],[35,-24],[32,-29],[27,-34],[19,-35],[16,-28],[12,-18],[13,-8],[9,-1],[9,4],[5,6],[-4,5],[-8,4],[-13,8],[-17,14]],
    [[44,-25],[47,-25],[50,-15],[49,-12],[44,-16]],
    [[28,46],[40,44],[50,45],[52,41],[54,37],[60,37],[67,37],[72,40],[80,42],[88,48],[96,42],[105,40],[118,40],[122,40],[127,40],[130,43],[135,44],[141,52],[136,55],[142,59],[155,59],[163,62],[178,65],[180,70],[160,71],[140,73],[113,74],[100,78],[80,73],[68,73],[60,70],[45,68],[40,66],[40,60],[30,57]],
    [[36,36],[43,37],[48,30],[56,26],[57,23],[59,22],[55,17],[44,12],[39,18],[34,28],[35,32]],
    [[44,38],[54,37],[62,37],[70,37],[74,35],[71,28],[67,25],[62,25],[57,26],[52,28],[48,30]],
    [[67,25],[71,28],[74,35],[80,32],[88,27],[92,26],[97,28],[92,22],[88,22],[86,20],[80,15],[78,8],[76,9],[73,16],[72,21],[69,22]],
    [[74,35],[80,42],[88,48],[96,42],[105,40],[118,40],[122,40],[121,32],[122,30],[119,25],[110,21],[106,17],[109,12],[105,9],[100,13],[99,8],[103,1],[100,3],[98,16],[94,17],[92,22],[97,28],[88,27],[80,32]],
    [[130,31],[135,34],[140,35],[141,41],[145,44],[141,45],[139,39],[133,35]],
    [[95,5],[106,-6],[104,-5],[98,2]], [[109,2],[117,7],[119,1],[116,-4],[110,-3]], [[105,-6],[115,-8],[114,-9],[106,-7]], [[131,-1],[141,-3],[150,-10],[141,-9],[132,-4]],
    [[114,-22],[122,-18],[130,-12],[137,-12],[136,-15],[142,-11],[146,-19],[153,-25],[151,-34],[146,-39],[140,-38],[135,-34],[131,-31],[124,-33],[115,-34],[113,-26]],
    [[172,-34],[178,-38],[174,-41],[167,-46],[171,-44]]
  ];
  function inPoly(x, y, p){ var c = false; for (var i = 0, j = p.length - 1; i < p.length; j = i++){ if (((p[i][1] > y) !== (p[j][1] > y)) && (x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0])) c = !c; } return c; }
  var DOTS = {};
  function landDots(step){ if (DOTS[step]) return DOTS[step]; var pts = [];
    for (var lat = 78; lat > -56; lat -= step) for (var lon = -168; lon < 190; lon += step){ var L = lon > 180 ? lon - 360 : lon; for (var k = 0; k < LAND.length; k++) if (inPoly(L, lat, LAND[k])){ pts.push([L, lat]); break; } }
    return (DOTS[step] = pts); }
  var HUB = [72.9, 19], DEST = [[55.3,25.2],[4.5,51.9],[-74,40.7],[-118.2,34],[-46.3,-23.9],[3.4,6.5],[39.7,-4],[103.8,1.3],[121.5,31.2],[139.7,35.6],[151.2,-33.9],[39.2,21.5],[10,53.5]];
  function worldMap(){
    var W = 720, H = 300; function X(lon){ return (lon + 168) / 360 * W; } function Y(lat){ return (80 - lat) / 138 * H; }
    var out = landDots(2.4).map(function(p){ return '<circle class="dot" cx="' + X(p[0]).toFixed(1) + '" cy="' + Y(p[1]).toFixed(1) + '" r="1.55"/>'; }).join('');
    var hx = X(HUB[0]), hy = Y(HUB[1]);
    function arc(ax, ay, bx, by){ var mx = (ax + bx) / 2, my = (ay + by) / 2, d = Math.hypot(bx - ax, by - ay); return '<path class="arc" d="M' + ax + ',' + ay + ' Q' + mx + ',' + (my - d * .32) + ' ' + bx + ',' + by + '"/>'; }
    DEST.forEach(function(d){ out += arc(hx, hy, X(d[0]), Y(d[1])); });
    [[[121.5,31.2],[-118.2,34]],[[4.5,51.9],[-74,40.7]],[[103.8,1.3],[151.2,-33.9]],[[55.3,25.2],[4.5,51.9]]].forEach(function(p){ out += arc(X(p[0][0]), Y(p[0][1]), X(p[1][0]), Y(p[1][1])); });
    DEST.forEach(function(d, i){ out += '<circle class="pt' + (i % 3 ? '' : ' pulse') + '" cx="' + X(d[0]) + '" cy="' + Y(d[1]) + '" r="2.8"/>'; });
    out += '<circle cx="' + hx + '" cy="' + hy + '" r="9" fill="rgba(255,210,122,.18)"/><circle class="pt" cx="' + hx + '" cy="' + hy + '" r="4"/>';
    return '<svg viewBox="0 0 ' + W + ' ' + H + '">' + out + '</svg>'; }
  // Rotating dotted globe on canvas (hero)
  function globe(cv){
    var ctx = cv.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1), S, R, pts = landDots(2.2), lon0 = 40, lat0 = 18 * Math.PI / 180, rad = Math.PI / 180;
    function size(){ S = cv.clientWidth; cv.width = S * dpr; cv.height = S * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); R = S / 2 * .98; }
    size();
    function proj(lon, lat, h){ var la = lat * rad, lo = (lon - lon0) * rad, x0 = Math.cos(la) * Math.cos(lo), y0 = Math.cos(la) * Math.sin(lo), z0 = Math.sin(la), k = R * (1 + (h || 0));
      return [S / 2 + k * y0, S / 2 - k * (z0 * Math.cos(lat0) - x0 * Math.sin(lat0)), x0 * Math.cos(lat0) + z0 * Math.sin(lat0)]; }
    function v3(lon, lat){ var la = lat * rad, lo = lon * rad; return [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)]; }
    var ARCS = DEST.map(function(d){ var a = v3(HUB[0], HUB[1]), b = v3(d[0], d[1]), om = Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])), seg = [];
      for (var t = 0; t <= 1.0001; t += 1 / 40){ var s1 = Math.sin((1 - t) * om) / Math.sin(om), s2 = Math.sin(t * om) / Math.sin(om), v = [a[0] * s1 + b[0] * s2, a[1] * s1 + b[1] * s2, a[2] * s1 + b[2] * s2];
        seg.push([Math.atan2(v[1], v[0]) / rad, Math.asin(v[2]) / rad, Math.sin(Math.PI * t) * om * .28]); } return seg; });
    var t0 = performance.now();
    function frame(now){
      lon0 = 40 + (now - t0) * .006;
      ctx.clearRect(0, 0, S, S);
      for (var i = 0; i < pts.length; i++){ var p = proj(pts[i][0], pts[i][1]); if (p[2] <= 0) continue; ctx.globalAlpha = .25 + p[2] * .65; ctx.fillStyle = '#7FA6D6'; ctx.beginPath(); ctx.arc(p[0], p[1], .9 + p[2] * 1.1, 0, 6.283); ctx.fill(); }
      var ph = ((now - t0) / 2400) % 1;
      ARCS.forEach(function(seg, ai){ ctx.beginPath(); var started = false;
        for (var j = 0; j < seg.length; j++){ var q = proj(seg[j][0], seg[j][1], seg[j][2]); if (q[2] < -.05){ started = false; continue; } if (!started){ ctx.moveTo(q[0], q[1]); started = true; } else ctx.lineTo(q[0], q[1]); }
        ctx.globalAlpha = .75; ctx.strokeStyle = '#E9C27A'; ctx.lineWidth = 1.1; ctx.stroke();
        var m = seg[Math.floor(((ph + ai * .13) % 1) * (seg.length - 1))], mq = proj(m[0], m[1], m[2]);
        if (mq[2] > 0){ ctx.globalAlpha = 1; ctx.fillStyle = '#FFE3A6'; ctx.shadowColor = '#FFD27A'; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(mq[0], mq[1], 2.2, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0; }
        var e = proj(seg[seg.length - 1][0], seg[seg.length - 1][1]); if (e[2] > 0){ ctx.globalAlpha = .9; ctx.fillStyle = '#FFD27A'; ctx.beginPath(); ctx.arc(e[0], e[1], 2.4, 0, 6.283); ctx.fill(); } });
      var h = proj(HUB[0], HUB[1]); if (h[2] > 0){ ctx.globalAlpha = .25; ctx.fillStyle = '#FFD27A'; ctx.beginPath(); ctx.arc(h[0], h[1], 9, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(h[0], h[1], 3.6, 0, 6.283); ctx.fill(); }
      ctx.globalAlpha = 1;
      RAF = requestAnimationFrame(frame); }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) frame(t0); else RAF = requestAnimationFrame(frame);
    window.addEventListener('resize', size); }

  // ---------------- data ----------------
  var CARGO = {
    daily:{ labels:['15 Oct', '16 Oct', '17 Oct', '18 Oct', '19 Oct', '20 Oct', '21 Oct'], a:[31, 29, 26, 34, 33, 38, 28], b:[17, 18, 15, 20, 23, 26, 18], max:50, ticks:[0, 10, 20, 30, 40, 50] },
    monthly:{ labels:['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], a:[298, 334, 371, 402, 447, 482], b:[180, 204, 226, 251, 276, 301], max:500, ticks:[0, 100, 200, 300, 400, 500] },
    yearly:{ labels:['2022', '2023', '2024', '2025', '2026'], a:[820, 1460, 2310, 3380, 4210], b:[510, 890, 1420, 2050, 2610], max:5000, ticks:[0, 1000, 2000, 3000, 4000, 5000] }
  };
  var SHIP = [['VK-2026-1043', 'Electronics', 'CN', 'AE', 'In Transit', 65], ['VK-2026-1042', 'Textiles', 'IN', 'DE', 'Delivered', 100], ['VK-2026-1041', 'Fresh Fruits', 'LK', 'OM', 'In Transit', 40], ['VK-2026-1040', 'Pharma', 'SG', 'US', 'Cleared', 100], ['VK-2026-1039', 'Machinery', 'TR', 'SA', 'In Transit', 70]];
  var FEAT = [['user', 'Buyer & Seller Registration', 'Verified and secure onboarding', 'Completed'], ['search', 'Product Sourcing & Quotations', 'AI-powered matching and pricing', 'Completed'], ['file', 'Order Tracking & Documentation', 'Real-time tracking & trade docs', 'Completed'], ['warehouse', 'Warehouse & Vessel Booking', 'Global storage and shipping', 'In Progress'], ['plane', 'Air Cargo Booking', 'Global airline partners', 'In Progress'], ['ai', 'Payments, Notifications & AI Tools', 'Secure payments and smart tools', 'Planned']];
  var MS = [['Website & App Development', 'Platform design and development in progress', 'In Progress', 'Aug 2026'], ['Airline & Shipping Line Discussions', 'Initial discussions with 4 major carriers', 'In Progress', 'Sep 2026'], ['Supplier & Buyer Network', 'Onboarding verified suppliers and buyers', 'Completed', 'Jul 2026'], ['MoU with Logistics Partners', '3 logistics partners signed, more in progress', 'In Progress', 'Oct 2026'], ['Payment Gateway Integration', 'Multi-currency escrow and settlements', 'In Progress', 'Oct 2026'], ['Seller Verification Module', 'KYC, documents and quality checks', 'In Progress', 'Oct 2026'], ['Company Incorporation & Brand', 'Entity, trademarks and domains secured', 'Completed', 'Mar 2026'], ['Pilot Shipments', 'First trade lanes India → UAE and Europe', 'Completed', 'Jun 2026'], ['Warehouse Partner Onboarding', 'Bonded warehouses near 8 major ports', 'Planned', 'Nov 2026'], ['Certifications & Approvals', 'Compliance and regulatory approvals', 'Planned', 'Q1 2027'], ['AI Sourcing & Pricing Tools', 'Smart matching and price intelligence', 'Planned', 'Q1 2027'], ['Global Launch', 'Public launch across 35 countries', 'Planned', 'Q2 2027']];
  var PART = [['Shipping lines', '4 carriers in discussion', 'In Progress', 'Sep 2026'], ['Airlines (cargo)', '2 cargo airlines shortlisted', 'In Progress', 'Oct 2026'], ['Freight forwarders', '3 MoUs signed', 'Completed', 'Oct 2026'], ['Customs brokers', 'Network across 6 ports', 'In Progress', 'Oct 2026'], ['Banks & payment partners', 'Escrow and FX partner selection', 'Planned', 'Dec 2026']];
  var AGR = [['Logistics partner MoU — West Coast', 'Signed with 3 partners', 'Completed', 'Oct 2026'], ['Supplier onboarding agreements', '120+ verified suppliers', 'Completed', 'Jul 2026'], ['Warehouse service agreement', 'Draft under review', 'In Progress', 'Nov 2026'], ['Payment processing agreement', 'Term sheet stage', 'Planned', 'Dec 2026']];
  var CERT = [['Importer Exporter Code (IEC)', 'Issued', 'Completed', 'Apr 2026'], ['GST registration', 'Issued', 'Completed', 'Apr 2026'], ['ISO 9001 quality management', 'Audit scheduled', 'In Progress', 'Dec 2026'], ['ISO 27001 information security', 'Gap assessment', 'Planned', 'Q1 2027'], ['AEO (Authorised Economic Operator)', 'Application planned', 'Planned', 'Q2 2027']];
  var DOCS = [['Venture Kart Pitch Deck — Oct 2026', 'pdf', 'Pitch', '8.4 MB', '18 Oct 2026', 1], ['Business Plan 2026–2030', 'pdf', 'Pitch', '3.1 MB', '12 Oct 2026'], ['Financial Model (5-year)', 'xlsx', 'Financial', '1.2 MB', '15 Oct 2026', 1], ['Q3 2026 Financial Summary', 'pdf', 'Reports', '940 KB', '08 Oct 2026', 1], ['Use of Funds Breakdown', 'pdf', 'Financial', '620 KB', '05 Oct 2026'], ['Monthly Investor Update — Sep 2026', 'pdf', 'Reports', '760 KB', '02 Oct 2026'], ['Certificate of Incorporation', 'pdf', 'Legal', '410 KB', '22 Mar 2026'], ['Memorandum & Articles of Association', 'pdf', 'Legal', '1.8 MB', '22 Mar 2026'], ['Term Sheet (Draft) — Series A', 'pdf', 'Legal', '—', 'After NDA', 0, 1], ['Cap Table', 'xlsx', 'Financial', '—', 'After NDA', 0, 1], ['Due Diligence Checklist', 'pdf', 'Due diligence', '280 KB', '10 Oct 2026'], ['Logistics Partner MoUs (3)', 'pdf', 'Due diligence', '2.6 MB', '14 Oct 2026', 1], ['Product Walkthrough — Buyer & Seller Apps', 'pptx', 'Pitch', '12.6 MB', '30 Sep 2026']];
  var MSGS = [
    ['Investor Relations', 'IR', 'Platform development is 65% complete', '18 Oct', 1, ['Dear Rajesh,', 'We are pleased to share that overall platform development has reached 65%. The buyer app, seller app and order tracking modules are feature-complete and in internal testing. Warehouse and vessel booking are now in active development.', 'A detailed product walkthrough is available in the data room. We will demo the latest build on the quarterly investor call on 28 Oct.', 'Warm regards,<br>Investor Relations · Venture Kart'], 'Product Walkthrough — Buyer & Seller Apps.pptx'],
    ['Office of the CEO', 'CE', 'Partnership discussion with Maersk is ongoing', '15 Oct', 1, ['Dear Rajesh,', 'A quick update on our carrier partnerships: discussions with Maersk and three other shipping lines are progressing well. We expect to share outcomes in our next monthly update.', 'Thank you for your continued support.', 'Chairman & CEO, Venture Kart']],
    ['Finance Team', 'FT', 'Q3 2026 financial summary is now available', '08 Oct', 1, ['Dear Rajesh,', 'The Q3 2026 financial summary is now available in the data room under Reports. It covers platform transaction volumes, operating costs and runway.', 'Please reach out if you have any questions.', 'Finance Team · Venture Kart'], 'Q3 2026 Financial Summary.pdf'],
    ['Investor Relations', 'IR', 'Invitation: Quarterly investor call — 28 Oct', '05 Oct', 0, ['Dear Rajesh,', 'You are invited to our quarterly investor call on Wednesday, 28 Oct 2026 at 4:00 PM IST. Agenda: product demo, partnership updates, Series A timeline and Q&A.', 'The meeting link is available under Meeting Requests.', 'Investor Relations · Venture Kart']],
    ['Compliance', 'CO', 'Your KYC verification is approved', '01 Oct', 0, ['Dear Rajesh,', 'Your investor KYC and accreditation have been verified. You now have full access to the data room, including financial models and legal documents (subject to NDA).', 'Compliance · Venture Kart']]
  ];
  var MEET = [['28', 'OCT', 'Quarterly investor call', '4:00 PM IST · Video call · 60 min', 'Confirmed'], ['04', 'NOV', 'One-on-one with the CEO', '11:30 AM IST · Video call · 30 min', 'Requested']];
  var NAV = [['dashboard', 'dash', 'Dashboard'], ['company', 'building', 'Company Overview'], ['platform', 'cpu', 'Platform & Technology'], ['market', 'target', 'Market Opportunity'], ['progress', 'trend', 'Business Progress'], ['financials', 'wallet', 'Financials & Funding'], ['documents', 'file', 'Investment Documents'], ['messages', 'mail', 'Messages & Updates'], ['meetings', 'cal', 'Meeting Requests'], ['profile', 'gear', 'Profile & Settings']];
  var TITLES = { dashboard:['Investor Dashboard', 'Track progress. Review performance. Build the future.'], company:['Company Overview', 'Who we are and what we are building.'], platform:['Platform & Technology', 'Everything you need for global trade — in one place.'], market:['Market Opportunity', 'A massive and growing global trade market.'], progress:['Business Progress', 'What we have achieved and what is in progress.'], financials:['Financials & Funding', 'Transparent numbers. A clear path to growth.'], documents:['Investment Documents', 'Secure data room · 48 documents · NDA signed'], messages:['Messages & Updates', 'Announcements and messages from the Venture Kart team.'], meetings:['Meeting Requests', 'Book time with the leadership team.'], profile:['Profile & Settings', 'Your investor profile, security and notifications.'] };
  function unread(){ return MSGS.filter(function(m){ return m[4]; }).length; }

  // ---------------- shared sections ----------------
  function secOverview(full){
    return '<div class="ov"><div class="card"><div class="lbl">Company overview</div><h3 class="sec-t" style="margin:8px 0 12px">Who we are and what we are building</h3>' +
      '<p>VENTURE KART is a global B2B marketplace and logistics platform designed to simplify international trade. We connect buyers, sellers, logistics providers and service partners through one integrated digital ecosystem.</p>' +
      '<p style="margin-top:12px">From sourcing and quotations to freight booking, customs, warehousing and payments — every step of a cross-border trade happens in one place, with verified partners and real-time tracking.</p></div>' +
      '<div class="video" data-toast="Playing “Our Vision” (2:14)"><span><svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg></span><small>Watch our vision</small></div></div>' +
      '<div class="mini4">' + [['target', 'Mission', 'Simplify global trade with technology.'], ['layers', 'Business Model', 'Commission, service and subscription.'], ['zap', 'Current Stage', 'Website & app development, pilot lanes live.'], ['users', 'Leadership', 'Experienced global business leaders.']].map(function(m){ return '<div>' + ic(m[0]) + '<b>' + m[1] + '</b><small>' + m[2] + '</small></div>'; }).join('') + '</div>' +
      (full ? '<div class="card mt2"><div class="card-h">' + ic('globe') + '<div><h3>One connected ecosystem</h3><p>Every party in a cross-border trade, on one platform.</p></div></div><div class="eco">' +
        [['users', 'Buyers', 'Importers, distributors & enterprises'], ['box', 'Sellers', 'Verified exporters & manufacturers'], ['ship', 'Logistics', 'Sea, air & land carriers, forwarders'], ['shield', 'Services', 'Customs, insurance, finance & warehousing']].map(function(e){ return '<div><span class="ib">' + ic(e[0]) + '</span><b>' + e[1] + '</b><small>' + e[2] + '</small></div>'; }).join('') + '</div></div>' +
        '<div class="card mt"><div class="card-h">' + ic('users') + '<div><h3>Leadership team</h3><p>Full profiles are available in the data room.</p></div><a class="link sp" data-go="app/documents">Data room ' + ic('arrow') + '</a></div><div class="grid g4">' +
        [['CEO', 'Chairman & CEO', 'Global trade & business strategy'], ['CTO', 'Chief Technology Officer', 'Marketplace & logistics platforms'], ['LOG', 'Head of Global Logistics', 'Freight, customs & warehousing'], ['FIN', 'Head of Finance', 'Fundraising, FP&A & compliance']].map(function(l){ return '<div class="card flat" style="padding:16px"><div class="prof"><span class="av" style="width:46px;height:46px;font-size:13px">' + l[0] + '</span><div><b style="display:block;font-size:13.5px">' + l[1] + '</b><small class="mu" style="font-size:12px">' + l[2] + '</small></div></div></div>'; }).join('') + '</div></div>' : ''); }
  function secPlatform(full){
    return '<div class="feat">' + FEAT.map(function(f){ return '<div><div class="fh"><span>' + ic(f[0]) + '</span><div><b>' + f[1] + '</b><small>' + f[2] + '</small></div></div><div class="fs">' + (f[3] === 'Completed' ? '<span class="done">' + ic('check') + '</span>' : pill(f[3])) + '</div></div>'; }).join('') + '</div>' +
      (full ? '<div class="grid g2 mt2"><div class="card"><div class="card-h">' + ic('bars') + '<div><h3>Development progress</h3><p>Build status by module</p></div><span class="sp pill prog">65% overall</span></div><div class="reg">' +
        [['Buyer app', 82, 'g'], ['Seller app', 74, 'g'], ['Web platform', 65, ''], ['Logistics booking', 45, ''], ['Payments', 30, 'o'], ['AI tools', 12, 'o']].map(function(r){ return '<div><span>' + r[0] + '</span><div class="bar"><i class="' + r[2] + '" style="width:' + r[1] + '%"></i></div><b style="text-align:right">' + r[1] + '%</b></div>'; }).join('') + '</div></div>' +
        '<div class="card"><div class="card-h">' + ic('cpu') + '<div><h3>Technology stack</h3><p>Built for scale, security and speed</p></div></div><div class="stack" style="grid-template-columns:1fr 1fr">' +
        [['mobile', 'Mobile apps', 'Flutter · iOS & Android'], ['globe', 'Web platform', 'Responsive buyer & seller portals'], ['cloud', 'Cloud infrastructure', 'Auto-scaling, multi-region'], ['shield', 'Security', 'Encryption, 2FA, audit trails'], ['ai', 'AI & analytics', 'Matching, pricing, forecasting'], ['card', 'Payments', 'Escrow, multi-currency, FX']].map(function(s){ return '<div><span class="ib sq" style="width:38px;height:38px">' + ic(s[0]) + '</span><div><b>' + s[1] + '</b><small>' + s[2] + '</small></div></div>'; }).join('') + '</div></div></div>' : ''); }
  function msList(rows){ return '<div class="ms">' + rows.map(function(m){ var c = m[2] === 'Completed' ? 'c' : m[2] === 'Planned' ? 'l' : ''; return '<div><i class="' + c + '"></i><div><b>' + m[0] + '</b><small>' + m[1] + '</small></div>' + pill(m[2]) + '<em>' + m[3] + '</em></div>'; }).join('') + '</div>'; }
  function secProgress(){
    var rows = { ms:MS, part:PART, agr:AGR, cert:CERT }[ST.prog], cnt = { c:0, p:0, l:0 };
    MS.forEach(function(m){ cnt[m[2] === 'Completed' ? 'c' : m[2] === 'Planned' ? 'l' : 'p']++; });
    return '<div class="cnt3"><div class="c">' + ic('checkc') + '<div><small>Completed</small><b>' + cnt.c + '</b></div></div><div class="p">' + ic('clock') + '<div><small>In Progress</small><b>' + cnt.p + '</b></div></div><div>' + ic('cal') + '<div><small>Planned</small><b>' + cnt.l + '</b></div></div></div>' +
      '<div class="tabs">' + [['ms', 'Key Milestones'], ['part', 'Partnerships'], ['agr', 'Agreements'], ['cert', 'Certifications']].map(function(t){ return '<button data-tab="prog|' + t[0] + '" class="' + (ST.prog === t[0] ? 'on' : '') + '">' + t[1] + '</button>'; }).join('') + '</div>' + msList(rows); }
  function secMarket(full){
    return '<div class="mk3"><div><small>Total Addressable Market</small><b>$32.6 Trillion</b><small>Global trade volume (2024)</small></div><div><small>Target Countries</small><b>193</b><small>UN member states</small></div><div><small>Target Segments</small><b class="t">B2B, SMEs, Enterprises</b><small>Importers &amp; exporters</small></div></div>' +
      '<div class="lbl mt2" style="margin-bottom:12px">Key insights</div><div class="ins">' + [['trend', 'Growing demand for global supply chains'], ['zap', 'Digital trade is accelerating'], ['target', 'Strong competition but room for innovation'], ['dollar', 'High margins in logistics & services']].map(function(k){ return '<div>' + ic(k[0]) + '<span>' + k[1] + '</span></div>'; }).join('') + '</div>' +
      (full ? '<div class="grid g2 mt2"><div class="card"><div class="card-h">' + ic('globe') + '<div><h3>Regional focus</h3><p>Share of target trade lanes (Year 1–3)</p></div></div><div class="reg">' +
        [['Middle East', 28], ['Europe', 24], ['South & SE Asia', 21], ['Africa', 12], ['Americas', 10], ['Oceania', 5]].map(function(r){ return '<div><span>' + r[0] + '</span><div class="bar"><i class="o" style="width:' + r[1] * 3.2 + '%"></i></div><b style="text-align:right">' + r[1] + '%</b></div>'; }).join('') + '</div></div>' +
        '<div class="card"><div class="card-h">' + ic('layers') + '<div><h3>Market sizing</h3><p>From global trade to our first 3 years</p></div></div><div class="kf">' +
        [['TAM · global goods trade', '$32.6T'], ['SAM · digital B2B trade & logistics', '$2.1T'], ['SOM · target lanes by Year 3', '$4.8B'], ['Digital freight CAGR (2024–30)', '22%'], ['SMEs in target markets', '40M+']].map(function(k){ return '<div><span>' + k[0] + '</span><b>' + k[1] + '</b></div>'; }).join('') + '</div><p class="note">Sources: industry estimates. Figures are indicative.</p></div></div>' : ''); }
  var FIN_TABS = [['overview', 'Overview'], ['proj', 'Financial Projections'], ['use', 'Use of Funds'], ['risk', 'Risk Factors']];
  var USE = [['#4B8BF5', 'Technology & Development', '35%', 35], ['#86BDF7', 'Global Partnerships', '25%', 25], ['#E2B66B', 'Operations & Logistics', '20%', 20], ['#3CC48D', 'Marketing & Business Growth', '15%', 15], ['#8C94A1', 'Working Capital', '5%', 5]];
  function secFinancial(){
    var t = ST.fin, h = '<div class="tabs">' + FIN_TABS.map(function(x){ return '<button data-tab="fin|' + x[0] + '" class="' + (t === x[0] ? 'on' : '') + '">' + x[1] + '</button>'; }).join('') + '</div>';
    if (t === 'overview') h += '<div class="fin3"><div><div class="t">Current Funding <span class="pill ok">Verified</span></div><b>$600K</b><small>Founders + early supporters</small></div><div><div class="t">Revenue (YTD) <span class="pill prog">Actual</span></div><b>$0</b><small>Pre-revenue stage</small></div><div><div class="t">Projected Revenue (Year 3) <span class="pill plan">Projection</span></div><b>$50M</b><small>Estimated</small></div></div>' +
      '<div class="grid mt" style="grid-template-columns:1.4fr 1fr"><div class="card flat"><div class="card-h"><div><h3>Projected Revenue &amp; Profitability</h3></div><div class="lg-row sp"><span><i style="background:#4B8BF5"></i>Revenue</span><span><i style="background:#E2B66B"></i>Net profit</span></div></div>' +
      bars({ labels:['2026', '2027', '2028', '2029', '2030'], series:[{ d:[1.2, 14, 50, 92, 140], c:'url(#bBlue)', n:'Revenue' }, { d:[0, 0, 7.5, 18, 32], c:'url(#bGold)', n:'Net profit' }], max:150, ticks:[0, 50, 100, 150], fmt:function(v){ return '$' + v + 'M'; }, bw:22, h:210 }) + '</div>' +
      '<div class="card flat"><div class="card-h"><h3>Operating Costs (Year 1)</h3></div><div class="donut-w">' + donut([{ v:60, c:'#4B8BF5' }, { v:20, c:'#86BDF7' }, { v:10, c:'#E2B66B' }, { v:10, c:'#8C94A1' }], 140, 20, '<b>60%</b><small>Tech</small>') +
      legend([['#4B8BF5', 'Technology & Development', '60%'], ['#86BDF7', 'Operations & Logistics', '20%'], ['#E2B66B', 'Marketing & Growth', '10%'], ['#8C94A1', 'Team & Admin', '10%']]) + '</div></div></div>' +
      '<div class="card flat mt"><div class="card-h"><h3>Revenue Model</h3></div><div class="rm">' + [['receipt', 'Commission', 'Trade & logistics'], ['card', 'Subscription', 'Enterprise accounts'], ['ship', 'Service Fees', 'Booking & fulfilment'], ['ai', 'Value Added Services', 'AI, analytics, etc.']].map(function(r){ return '<div><span class="ib sq">' + ic(r[0]) + '</span><div><b>' + r[1] + '</b><small>' + r[2] + '</small></div></div>'; }).join('') + '</div></div>';
    if (t === 'proj') h += '<div class="card flat"><div class="card-h"><div><h3>5-year projections</h3><p>Base case · USD</p></div><button class="btn line sm sp" data-dl="Financial Model (5-year).xlsx">' + ic('dl') + 'Financial model</button></div><div class="tbl-w"><table class="tbl"><thead><tr><th>Metric</th><th>2026</th><th>2027</th><th>2028</th><th>2029</th><th>2030</th></tr></thead><tbody>' +
      [['Revenue', '$1.2M', '$14M', '$50M', '$92M', '$140M'], ['Gross margin', '18%', '24%', '29%', '31%', '33%'], ['EBITDA margin', '−175%', '−4%', '15%', '20%', '23%'], ['Net profit', '−$2.1M', '−$0.6M', '$7.5M', '$18M', '$32M'], ['Shipments / year', '1.2K', '12K', '38K', '70K', '110K'], ['Countries live', '12', '35', '70', '120', '193']].map(function(r){ return '<tr>' + r.map(function(c, i){ return '<td' + (i ? '' : ' style="color:var(--text2)"') + '>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div></div>' +
      '<div class="card flat mt"><div class="card-h"><h3>Revenue trajectory</h3><div class="lg-row sp"><span><i style="background:#E2B66B"></i>Revenue</span><span><i style="background:#4B8BF5"></i>Gross profit</span></div></div>' + line({ labels:['2026', '2027', '2028', '2029', '2030'], series:[{ d:[1.2, 14, 50, 92, 140], c:'#E2B66B', a:'aGold' }, { d:[.2, 3.4, 14.5, 28.5, 46.2], c:'#4B8BF5', a:'aBlue' }], max:150, ticks:[0, 50, 100, 150], fmt:function(v){ return '$' + v + 'M'; }, w:760, h:220 }) + '</div>';
    if (t === 'use') h += '<div class="grid" style="grid-template-columns:1fr 1.2fr"><div class="card flat"><div class="card-h"><h3>Planned use of $24M</h3></div><div class="donut-w">' + donut(USE.map(function(u){ return { v:u[3], c:u[0] }; }), 170, 28, '<b>$24M</b><small>Series A</small>') + legend(USE.map(function(u){ return [u[0], u[1], u[2], '$' + (24 * u[3] / 100).toFixed(1) + 'M']; })) + '</div></div>' +
      '<div class="card flat"><div class="card-h"><h3>What the funds unlock</h3></div><div class="struct">' + [['cpu', 'Complete platform build', 'Logistics booking, payments and AI tools live by Q2 2027'], ['globe', 'Carrier & partner network', 'Agreements with shipping lines, airlines and 200+ forwarders'], ['warehouse', 'Operations in 35 countries', 'Hubs, bonded warehouses and customs partners'], ['mega', 'Go-to-market', 'Acquire 25K verified buyers and sellers'], ['shield', 'Runway', '24 months of operating runway']].map(function(s){ return '<div>' + ic(s[0]) + '<div><b>' + s[1] + '</b><small>' + s[2] + '</small></div></div>'; }).join('') + '</div></div></div>';
    if (t === 'risk') h += '<div class="grid g2">' + [['Regulatory & compliance', 'Trade rules differ across 193 countries.', 'Local customs partners, compliance team and automated document checks.'], ['Competition', 'Established marketplaces and forwarders.', 'End-to-end trade + logistics in one platform; verified network.'], ['Execution', 'Building a multi-sided platform at global scale.', 'Phased launch by trade lane; experienced leadership.'], ['Trade cycles & FX', 'Volumes and currencies fluctuate.', 'Diversified lanes and sectors; multi-currency settlements.'], ['Partner dependency', 'Reliance on carriers and service partners.', 'Multiple partners per lane; no single partner > 20% of volume.'], ['Technology & security', 'Cyber risk and platform uptime.', 'Encryption, 2FA, audits, multi-region cloud.']].map(function(r){ return '<div class="card flat"><div class="card-h"><span class="ib sq" style="width:36px;height:36px">' + ic('alert') + '</span><h3>' + r[0] + '</h3></div><p class="mu" style="font-size:13px"><b style="color:var(--text2)">Risk:</b> ' + r[1] + '</p><p class="mu" style="font-size:13px;margin-top:6px"><b class="g">Mitigation:</b> ' + r[2] + '</p></div>'; }).join('') + '</div>';
    return h; }
  function secInvest(){
    return '<div class="grid" style="grid-template-columns:.8fr 1.1fr 1fr"><div class="card flat fund"><small class="mu">Funding Requirement</small><b>$24M</b><small class="mu">Series A</small><button class="btn gold mt2" data-dl="Venture Kart Investment Pack.pdf">' + ic('dl') + 'Request Investment Pack</button></div>' +
      '<div class="card flat"><div class="card-h"><h3>Planned Use of Funds</h3></div><div class="donut-w">' + donut(USE.map(function(u){ return { v:u[3], c:u[0] }; }), 120, 22, '') + legend(USE.map(function(u){ return [u[0], u[1], u[2]]; })) + '</div></div>' +
      '<div class="card flat"><div class="card-h"><h3>Investment Structure</h3></div><div class="struct">' + [['pie', 'Equity Share', 'Typical range 10–20%'], ['bars', 'Expected Method', 'DCF + market comparison'], ['shield', 'Eligibility', 'Accredited investors only'], ['clock', 'Expected Deal Timeline', 'Q4 2026 – Q1 2027']].map(function(s){ return '<div>' + ic(s[0]) + '<div><b>' + s[1] + '</b><small>' + s[2] + '</small></div></div>'; }).join('') + '</div></div></div>' +
      '<p class="note">Note: Financial projections are estimates and subject to market conditions, risks and assumptions.</p>'; }

  // ---------------- public site ----------------
  function landing(){
    var nav = [['top', 'Home'], ['about', 'About'], ['platform', 'Platform'], ['market', 'Market'], ['progress', 'Progress'], ['financials', 'Financials'], ['documents', 'Documents']];
    app.innerHTML = '<header class="pub-nav" id="pnav">' + logo() + '<nav>' + nav.map(function(n, i){ return '<a data-scroll="' + n[0] + '" class="' + (i ? '' : 'on') + '">' + n[1] + '</a>'; }).join('') + '</nav>' +
      '<a class="btn gold sm" data-go="login">Investor Login ' + ic('user') + '</a><button class="pub-burger" id="pub-burger" aria-label="Menu">' + ic('menu') + '</button></header>' +
      '<section class="hero" id="top"><div class="hero-bg"></div><div class="hero-in"><div class="lbl">Investor Relations</div><h1>Global Trade.<br>Greater Opportunities.</h1>' +
      '<p>VENTURE KART is building a next-generation B2B platform for global trade, logistics and supply chain — connecting buyers, sellers and logistics providers across 193 countries.</p>' +
      '<div class="hero-stats">' + [['globe', 'Global Reach', '193 Countries'], ['users', 'Trade Network', 'Verified Partners'], ['ship', 'Digital Logistics', 'Air | Sea | Land']].map(function(s){ return '<div><span class="ib">' + ic(s[0]) + '</span><div><b>' + s[1] + '</b><small>' + s[2] + '</small></div></div>'; }).join('') + '</div>' +
      '<div class="hero-cta"><button class="btn gold" data-modal="access">Request Investor Access</button><button class="btn line" data-toast="Pitch deck link sent to your email after verification">' + ic('dl') + 'Download Pitch Deck</button></div></div>' +
      '<div class="hero-globe"><div class="ring r2"></div><div class="ring"></div><div class="orb"><canvas id="globe" style="width:100%;height:100%"></canvas></div><div class="badge">VENTURE KART</div></div>' +
      '<div class="hero-tag">One Platform <i>·</i> Global Trade <i>·</i> Endless Possibilities</div></section>' +
      '<section class="light"><h2 class="sec-t">Why VENTURE KART?</h2><p class="sec-s">We are solving real problems in global trade with technology, trust and a worldwide network.</p>' +
      '<div class="why">' + [['layers', 'Single Platform', 'Buy · Sell · Ship · Track'], ['dollar', 'Cost Efficient', 'Better rates & faster delivery'], ['shield', 'Trusted Network', 'Verified buyers & sellers'], ['ai', 'AI Powered', 'Smarter decisions']].map(function(w){ return '<div><span>' + ic(w[0]) + '</span><b>' + w[1] + '</b><small>' + w[2] + '</small></div>'; }).join('') + '</div>' +
      '<h3 class="sec-t mt2" style="font-size:21px">Investment Highlights</h3><div class="hl">' + [['193', 'Countries Targeted'], ['20+', 'Trade Sectors'], ['Global', 'Partner Network'], ['$100B+', 'Market Opportunity']].map(function(h){ return '<div><b>' + h[0] + '</b><small>' + h[1] + '</small></div>'; }).join('') + '</div></section>' +
      '<section class="dark-sec" id="about">' + secOverview(false) + '</section>' +
      '<section class="dark-sec alt" id="platform"><div class="sec-head"><div><h2 class="sec-t">Platform Features</h2><p class="sec-s">Everything you need for global trade — in one place.</p></div></div>' + secPlatform(false) + '</section>' +
      '<section class="dark-sec" id="progress"><div class="sec-head"><div><h2 class="sec-t">Business Progress &amp; Partnerships</h2><p class="sec-s">What we have achieved and what is in progress.</p></div></div><div id="t-prog">' + secProgress() + '</div></section>' +
      '<section class="dark-sec alt" id="market"><div class="sec-head"><div><h2 class="sec-t">Market Opportunity</h2><p class="sec-s">A massive and growing global trade market.</p></div></div>' + secMarket(false) + '</section>' +
      '<section class="dark-sec" id="financials"><div class="sec-head"><div><h2 class="sec-t">Financial Information</h2><p class="sec-s">Transparent numbers. A clear path to growth.</p></div></div>' +
      '<div class="fin3 blur"><div><div class="t">Current Funding</div><b>$000K</b><small>Founders</small></div><div><div class="t">Revenue (YTD)</div><b>$0</b><small>Stage</small></div><div><div class="t">Projected Revenue</div><b>$00M</b><small>Estimated</small></div></div>' +
      '<div class="lock"><span class="ib">' + ic('lock') + '</span><div><b>Financials are available to verified investors</b><small>Projections, use of funds, investment structure and risk factors.</small></div><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn line sm" data-go="login">Investor Login</button><button class="btn gold sm" data-modal="access">Request Access</button></div></div></section>' +
      '<section class="dark-sec alt" id="documents"><div class="sec-head"><div><h2 class="sec-t">Investment Documents</h2><p class="sec-s">Secure data room for approved investors.</p></div></div><div class="card flat" style="padding:4px 4px">' +
      DOCS.slice(0, 5).map(docRow.bind(null, true)).join('') + '</div></section>' +
      '<section class="light"><div class="quote"><q>We are not just building a platform, we are building a global trade ecosystem.</q><p>— Chairman &amp; CEO<small>Venture Kart</small></p></div>' +
      '<div class="cta2"><div><h3>Interested in Investing?</h3><p>Join us in shaping the future of global trade.</p><button class="btn gold" data-modal="access">Request Investor Access</button></div><div><h3>Have Questions?</h3><p>Book a call with our team for a private discussion.</p><button class="btn line" data-modal="meet">Schedule a Meeting</button></div></div></section>' +
      '<footer class="pub-foot">' + logo('sm') + '<div class="mid">Global Trade <i>|</i> Stronger Partnerships <i>|</i> Sustainable Growth</div><p class="disc">This is a UI/UX design concept for investor presentation purposes only. Figures and timelines are illustrative and not a representation of completed milestones or guaranteed results.</p></footer>';
    globe(document.getElementById('globe'));
    var pn = document.getElementById('pnav');
    function onScroll(){ pn.classList.toggle('solid', window.scrollY > 30); }
    window.addEventListener('scroll', onScroll); onScroll();
    if ('IntersectionObserver' in window){ var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) pn.querySelectorAll('nav a').forEach(function(a){ a.classList.toggle('on', a.dataset.scroll === e.target.id); }); }); }, { rootMargin:'-45% 0px -50% 0px' });
      nav.forEach(function(n){ var el = document.getElementById(n[0]); if (el) io.observe(el); }); OBS.push(io); } }
  function docRow(locked, d){ var ft = d[1] === 'xlsx' ? 'x' : d[1] === 'pptx' ? 'p' : '', lk = locked || d[6];
    return '<div class="doc"><span class="ft ' + ft + '">' + d[1].toUpperCase() + '</span><div><b>' + d[0] + (d[5] && !locked ? ' <span class="pill ok" style="margin-left:6px">New</span>' : '') + '</b><small>' + d[2] + ' · ' + d[3] + ' · ' + d[4] + '</small></div><div class="acts">' +
      (lk ? (locked ? '<button class="btn line sm" data-go="login">' + ic('lock') + 'Login to view</button>' : '<button class="btn line sm" data-toast="Access requested — available after NDA countersign">' + ic('lock') + 'Request access</button>')
        : '<button class="ibtn" data-toast="Opening preview: ' + esc(d[0]) + '" title="Preview">' + ic('eye') + '</button><button class="ibtn" data-dl="' + esc(d[0]) + '.' + d[1] + '" title="Download">' + ic('dl') + '</button>') + '</div></div>'; }

  // ---------------- login ----------------
  function login(){
    app.innerHTML = '<div class="login"><div class="login-art">' + logo('lg', 'INVESTOR PORTAL') + '<div><h2>Global Trade. Global Opportunities.</h2><p>Invest in a platform that connects the world — buyers, sellers and logistics across 193 countries.</p>' +
      '<ul><li>' + ic('checkc') + 'Live progress, milestones and partnerships</li><li>' + ic('checkc') + 'Financials, projections and use of funds</li><li>' + ic('checkc') + 'Secure data room and direct access to leadership</li></ul></div><small class="mu">© 2026 Venture Kart · Confidential</small></div>' +
      '<div class="login-f"><form class="login-box" data-form="login"><a class="back-l" data-go="">' + ic('left') + 'Back to investor site</a><h1>Investor Login</h1><p>Sign in to access the investor dashboard.</p>' +
      '<label class="fld"><span>Email address</span><div class="inp">' + ic('mail') + '<input type="email" value="rajesh.kumar@example.com" required></div></label>' +
      '<label class="fld"><span>Password</span><div class="inp">' + ic('lock') + '<input type="password" value="investor123" required><button type="button" data-pw>' + ic('eye') + '</button></div></label>' +
      '<div class="row-b"><label class="chk"><input type="checkbox" checked>Remember me</label><a class="gd" data-toast="Password reset link sent to your email">Forgot password?</a></div>' +
      '<button class="btn gold w" type="submit">Sign In ' + ic('arrow') + '</button><div class="or">OR</div><button type="button" class="btn ghost w" data-toast="One-time code sent to +91 98••• ••210">' + ic('phone') + 'Sign in with one-time code</button>' +
      '<p style="text-align:center;margin-top:22px;font-size:13px;color:var(--text2)">Not an investor yet? <a class="gd" style="font-weight:600" data-modal="access">Request access</a></p>' +
      '<div class="sec-note">' + ic('shield') + '256-bit encrypted · 2FA protected</div></form></div></div>'; }

  // ---------------- portal ----------------
  function portal(page){
    if (!TITLES[page]) page = 'dashboard';
    var t = TITLES[page], u = unread();
    app.innerHTML = '<div class="portal' + (ST.navOpen ? ' nav-open' : '') + '" id="portal"><aside class="side">' + logo('', 'INVESTOR PORTAL') + '<nav class="snav">' +
      NAV.map(function(n){ return '<a data-go="app/' + n[0] + '" class="' + (n[0] === page ? 'on' : '') + '">' + ic(n[1]) + n[2] + (n[0] === 'messages' && u ? '<em>' + u + '</em>' : '') + '</a>'; }).join('') + '</nav>' +
      '<div class="promo"><h4>Global Trade<br>Global Opportunities</h4><p>Invest in a platform that connects the world.</p><button class="btn gold w sm" data-go="app/meetings">' + ic('cal') + 'Book a Meeting</button></div>' +
      '<div class="secure">' + ic('lock') + '<div><b>Secure Investor Portal</b><small>Last login: 21 Oct 2026, 10:24 AM</small><em>' + ic('checkc') + '2FA Enabled</em></div></div></aside><div class="scrim" id="scrim"></div>' +
      '<div class="main"><header class="top"><button class="burger" id="burger" aria-label="Menu">' + ic('menu') + '</button><div><h1>' + t[0] + '</h1><p>' + t[1] + '</p></div><div class="r">' +
      '<a class="bell" data-go="app/messages" title="Notifications">' + ic('bell') + (u ? '<em>' + u + '</em>' : '') + '</a><a class="who" data-go="app/profile"><span class="av">RK</span><div><b>Rajesh Kumar</b><small>' + ic('shield') + 'Verified Investor</small></div></a>' +
      '<div class="when">21 Oct 2026<br>Last updated: 10:24 AM</div></div></header><main class="content" id="content">' + PAGES[page]() + '</main>' +
      '<div class="legend-foot"><span><i style="background:var(--green)"></i>= Verified / Completed</span><span><i style="background:var(--blue)"></i>= In Progress</span><span><i style="background:var(--amber)"></i>= Projected / Planned</span><span class="tag">MORE MARKETS <i class="mu">|</i> MORE PRODUCTS <i class="mu">|</i> A STRONGER TOMORROW</span></div></div>' +
      '<nav class="bnav">' + [['dashboard', 'dash', 'Home'], ['documents', 'file', 'Documents'], ['financials', 'wallet', 'Financials'], ['messages', 'mail', 'Messages'], ['profile', 'user', 'Profile']].map(function(n){ return '<a data-go="app/' + n[0] + '" class="' + (n[0] === page ? 'on' : '') + '">' + ic(n[1]) + n[2] + (n[0] === 'messages' && u ? '<em>' + u + '</em>' : '') + '</a>'; }).join('') + '</nav></div>';
    window.scrollTo(0, 0); }

  function kpi(icn, title, chip, val, sub, up, f1, f2){
    return '<div class="card kpi"><div class="t"><span class="ib">' + ic(icn) + '</span><h4>' + title + (chip ? ' <span class="vchip">' + chip + '</span>' : '') + '</h4></div><div class="v"><div><b>' + val + '</b><span>' + sub + '</span></div><div class="upw"><span class="up">' + ic('up') + up + '</span><small>vs last month</small></div></div>' +
      '<div class="f">' + [f1, f2].map(function(f){ return '<div>' + ic(f[0], f[3]) + '<div><small>' + f[1] + '</small><b>' + f[2] + '</b></div></div>'; }).join('') + '</div></div>'; }
  function cargoChart(){ var c = CARGO[ST.cargo]; return bars({ labels:c.labels, series:[{ d:c.a, c:'url(#bGold)', n:'Total cargo' }, { d:c.b, c:'url(#bBlue)', n:'Containers' }], max:c.max, ticks:c.ticks, h:200 }); }
  function flowData(){ var a = [], b = [], n = [], l = []; for (var i = 0; i < 24; i++){ var inc = 1.1 + 1.5 * Math.abs(Math.sin(i * 1.7)) + (i % 5 === 0 ? .6 : 0), out = .5 + .9 * Math.abs(Math.cos(i * 1.3)); a.push(+inc.toFixed(2)); b.push(+out.toFixed(2)); n.push(+Math.max(0, inc - out).toFixed(2));
      var d = new Date(2026, 8, 28 + i); l.push(d.getDate() + ' ' + d.toLocaleString('en', { month:'short' })); } return { a:a, b:b, n:n, l:l }; }

  var PAGES = {
    dashboard:function(){
      var fd = flowData();
      return '<div class="grid g4 kpis">' +
        kpi('box', 'Total Cargo Completed', 'Verified', '482', 'Shipments', '12%', ['cal', 'Today', '28'], ['cal', 'This Month', '482']) +
        kpi('ship', 'Total Cargo (Weight/Volume)', '', '12,480<small>MT</small>', '(Approx.)', '18%', ['cal', 'Today', '720 MT'], ['shield', 'This Month', '12,480 MT']) +
        kpi('dollar', 'Money Flow (USD)', '', '$8,642,500', '(Total Processed)', '22%', ['file', 'This Month', '$8.64M'], ['clock', 'Pending', '$1.32M']) +
        kpi('card', 'Payment Received', '', '$6,980,000', '(77% of total)', '25%', ['check', 'Completed', '77%', 'ok'], ['clock', 'Pending', '23%']) + '</div>' +
        '<div class="dash-r2 mt"><div class="card"><div class="card-h">' + ic('ship') + '<h3>Cargo Completed</h3><div class="seg sp">' + [['daily', 'Daily'], ['monthly', 'Monthly'], ['yearly', 'Yearly']].map(function(s){ return '<button data-cargo="' + s[0] + '" class="' + (ST.cargo === s[0] ? 'on' : '') + '">' + s[1] + '</button>'; }).join('') + '</div></div>' +
        '<div class="lg-row" style="margin-bottom:8px"><span><i style="background:#D4A256"></i>Total Cargo</span><span><i style="background:#4B8BF5"></i>Container Count</span></div><div id="cargo">' + cargoChart() + '</div></div>' +
        '<div class="card"><div class="card-h">' + ic('box') + '<h3>Shipment Type Breakdown</h3></div><div class="donut-w">' + donut([{ v:52, c:'#1F5FD1' }, { v:24, c:'#86BDF7' }, { v:14, c:'#E2B66B' }, { v:7, c:'#3CC48D' }, { v:3, c:'#C9CED6' }], 150, 26, '<b>482</b><small>Total Shipments</small>') +
        legend([['#1F5FD1', 'Sea Freight', '52%'], ['#86BDF7', 'Air Freight', '24%'], ['#E2B66B', 'Land Transport', '14%'], ['#3CC48D', 'LCL (Consolidation)', '7%'], ['#C9CED6', 'Others', '3%']]) + '</div></div>' +
        '<div class="card"><div class="card-h">' + ic('card') + '<h3>Payment &amp; Collection Status</h3></div><div class="donut-w">' + donut([{ v:77, c:'#3CC48D' }, { v:23, c:'#E2B66B' }], 150, 18, '<b>77%</b><small>Received</small>', 0) +
        '<div style="flex:1">' + legend([['#3CC48D', 'Received', '77%', '$6,980,000'], ['#E2B66B', 'Pending', '23%', '$2,085,000']]) + '<div style="margin-top:16px;font-size:12px;color:var(--text2)">Total Invoice Value<b style="display:block;font-size:17px;color:#fff">$9,065,000</b></div></div></div></div></div>' +
        '<div class="dash-r3 mt"><div class="card"><div class="card-h">' + ic('globe') + '<div><h3>Global Trade Flow</h3><p>Live overview of your shipments across 193 countries</p></div></div><div class="tf"><div><div class="map">' + worldMap() + '</div>' +
        '<div class="regs">' + [['Asia', '42%', 203], ['Europe', '28%', 135], ['Middle East', '15%', 72], ['Americas', '9%', 43], ['Africa', '4%', 19], ['Oceania', '2%', 10]].map(function(r){ return '<div>' + r[0] + '<b>' + r[1] + '</b><small>' + r[2] + ' shipments</small></div>'; }).join('') + '</div></div>' +
        '<div class="tfs">' + [['box', 'Active Shipments', '67', 'In Transit'], ['receipt', 'Delivered This Month', '415', '+18%'], ['anchor', 'Ports Handled', '48', 'Global'], ['globe', 'Countries Served', '193', 'UN Member States']].map(function(s){ return '<div><span class="ib">' + ic(s[0]) + '</span><div><small>' + s[1] + '</small><b>' + s[2] + '<em>' + s[3] + '</em></b></div></div>'; }).join('') + '</div></div></div>' +
        '<div class="card"><div class="card-h">' + ic('ship') + '<h3>Recent Shipments</h3><a class="link sp" data-toast="Opening all shipments">View All ' + ic('arrow') + '</a></div><div class="tbl-w"><table class="tbl"><thead><tr><th>Shipment ID</th><th>Product</th><th>From → To</th><th>Status</th><th>Progress</th></tr></thead><tbody>' +
        SHIP.map(function(s){ var st = s[4] === 'In Transit' ? 'solid-prog' : 'solid-ok'; return '<tr><td>' + s[0] + '</td><td>' + s[1] + '</td><td>' + s[2] + ' → ' + s[3] + '</td><td><span class="pill ' + st + '">' + s[4] + '</span></td><td><div class="pg"><div class="bar"><i class="' + (s[5] === 100 ? 'g' : '') + '" style="width:' + s[5] + '%"></i></div><em>' + s[5] + '%</em></div></td></tr>'; }).join('') + '</tbody></table></div></div></div>' +
        '<div class="dash-r4 mt"><div class="card"><div class="card-h">' + ic('dollar') + '<h3>Financial Overview</h3></div><div class="grid" style="grid-template-columns:1.5fr 1fr;gap:18px;align-items:start"><div><div class="lg-row" style="margin-bottom:6px"><span><i style="background:#E2B66B"></i>Revenue</span><span><i style="background:#4B8BF5"></i>Expenses</span></div>' +
        line({ labels:['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], series:[{ d:[2.6, 3.4, 4.1, 4.6, 5.2, 5.9, 6.7], c:'#E2B66B', a:'aGold' }, { d:[2.1, 2.4, 2.8, 3.0, 3.3, 3.6, 4.1], c:'#4B8BF5', a:'aBlue' }], max:8, ticks:[0, 2, 4, 6, 8], fmt:function(v){ return '$' + v + 'M'; }, w:420, h:190 }) + '</div>' +
        '<div style="border-left:1px solid var(--line2);padding-left:16px"><b style="font-size:13px">Key Figures (YTD)</b><div class="kf" style="margin-top:6px"><div><span>Revenue</span><b>$32,480,000</b></div><div><span>Operating Cost</span><b>$21,320,000</b></div><div><span>Net Cash Flow</span><b>$11,160,000</b></div></div><div class="up" style="justify-content:flex-end">' + ic('up') + '27%</div></div></div></div>' +
        '<div class="card"><div class="card-h">' + ic('dollar') + '<h3>Money Flow <small>(Last 30 Days)</small></h3></div>' + bars({ labels:fd.l, series:[{ d:fd.a, c:'#3CC48D', n:'Incoming' }, { d:fd.b, c:'#E2B66B', n:'Outgoing' }, { d:fd.n, c:'#4B8BF5', n:'Net' }], max:3, ticks:[0, 1, 2, 3], fmt:function(v){ return '$' + v + 'M'; }, bw:4, h:190, every:5, w:460 }) +
        '<div class="lg-row" style="margin-top:8px"><span><i style="background:#3CC48D"></i>Incoming</span><span><i style="background:#E2B66B"></i>Outgoing</span><span><i style="background:#4B8BF5"></i>Net Flow</span></div></div>' +
        '<div class="card"><div class="card-h"><h3>Quick Access</h3></div><div class="qa">' + [['file', 'Download Reports', 'Financial & Shipment Reports', 'app/documents'], ['folder', 'View All Documents', 'Data Room', 'app/documents'], ['card', 'Payment Records', 'Transaction History', 'app/financials'], ['cal', 'Schedule Meeting', 'Book a Call', 'app/meetings']].map(function(q){ return '<a data-go="' + q[3] + '"><span class="ib sq" style="width:38px;height:38px">' + ic(q[0]) + '</span><div><b>' + q[1] + '</b><small>' + q[2] + '</small></div></a>'; }).join('') + '</div>' +
        '<div class="upd mt">' + MSGS.slice(0, 3).map(function(m, i){ return '<div><i></i><span>' + m[2] + '.</span><em>' + m[3] + '</em></div>'; }).join('') + '</div></div></div>'; },
    company:function(){ return secOverview(true); },
    platform:function(){ return secPlatform(true); },
    market:function(){ return secMarket(true); },
    progress:function(){ return '<div id="t-prog">' + secProgress() + '</div>'; },
    financials:function(){ return '<div id="t-fin">' + secFinancial() + '</div><h2 class="sec-t mt2" style="font-size:22px">Investment Opportunity</h2><p class="sec-s" style="margin-bottom:16px">Be part of our next growth phase.</p>' + secInvest(); },
    documents:function(){
      return '<div class="dr">' + [['folder', 'Total documents', '48'], ['file', 'New this month', '12'], ['eye', 'Viewed by you', '21'], ['shield', 'NDA status', 'Signed']].map(function(d){ return '<div class="card" style="display:flex;gap:14px;align-items:center;padding:16px"><span class="ib">' + ic(d[0]) + '</span><div><small class="mu">' + d[1] + '</small><b style="display:block;font-size:20px">' + d[2] + '</b></div></div>'; }).join('') + '</div>' +
        '<div class="card flat" style="padding:16px 16px 6px"><div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-bottom:6px"><div class="inp" style="flex:1;min-width:220px;height:42px">' + ic('search') + '<input id="docq" placeholder="Search documents…" value="' + esc(ST.docq) + '"></div><button class="btn line sm" data-dl="Venture Kart Data Room.zip">' + ic('dl') + 'Download all</button></div>' +
        '<div class="tabs" style="margin-bottom:0">' + ['all', 'Pitch', 'Financial', 'Reports', 'Legal', 'Due diligence'].map(function(c){ return '<button data-tab="doc|' + c + '" class="' + (ST.doc === c ? 'on' : '') + '">' + (c === 'all' ? 'All' : c) + '</button>'; }).join('') + '</div><div id="doclist">' + docList() + '</div></div>'; },
    messages:function(){ return '<div class="msg"><div class="card flat mlist" id="mlist">' + msgList() + '</div><div class="card flat mread" id="mread">' + msgRead() + '</div></div>'; },
    meetings:function(){
      return '<div class="grid" style="grid-template-columns:1.2fr 1fr;align-items:start" id="meetg"><form class="card" data-form="meet"><div class="card-h">' + ic('cal') + '<div><h3>Book a meeting</h3><p>Our investor relations team confirms within 24 hours.</p></div></div>' +
        '<div class="fld"><span>Meeting type</span></div><div class="opts">' + [['users', 'Meeting with CEO', '30 min · 1:1'], ['video', 'Investor call', '60 min · group'], ['building', 'Office visit', 'In person']].map(function(o, i){ return '<label><input type="radio" name="mt" value="' + o[1] + '"' + (i ? '' : ' checked') + '>' + ic(o[0]) + '<b>' + o[1] + '</b><small>' + o[2] + '</small></label>'; }).join('') + '</div>' +
        '<div class="f2"><label class="fld"><span>Preferred date</span><div class="inp">' + ic('cal') + '<input type="date" name="d" value="2026-11-04" min="2026-10-22"></div></label><label class="fld"><span>Mode</span><div class="inp">' + ic('video') + '<select name="mode"><option>Video call</option><option>Phone call</option><option>In person</option></select></div></label></div>' +
        '<div class="fld"><span>Preferred time (IST)</span><div class="slots">' + ['10:00 AM', '11:30 AM', '2:00 PM', '4:00 PM', '5:30 PM'].map(function(s){ return '<button type="button" data-slot="' + s + '" class="' + (ST.slot === s ? 'on' : '') + '">' + s + '</button>'; }).join('') + '</div></div>' +
        '<label class="fld"><span>Agenda / message</span><textarea class="inp" rows="3" name="msg" placeholder="Let us know what you would like to discuss…"></textarea></label><button class="btn gold w" type="submit">' + ic('send') + 'Send Request</button></form>' +
        '<div><div class="card"><div class="card-h">' + ic('clock') + '<h3>Upcoming</h3></div><div id="meetl">' + meetList() + '</div></div>' +
        '<div class="card mt"><div class="card-h">' + ic('checkc') + '<h3>Past meetings</h3></div><div class="mt-i"><div class="mt-d"><small>SEP</small><b>30</b></div><div><b class="t">Platform demo walkthrough</b><small class="s">Video call · Notes shared in data room</small></div>' + pill('Completed') + '</div><div class="mt-i"><div class="mt-d"><small>SEP</small><b>12</b></div><div><b class="t">Introductory call with IR team</b><small class="s">Phone call · 25 min</small></div>' + pill('Completed') + '</div></div></div></div>'; },
    profile:function(){
      return '<div class="grid" style="grid-template-columns:1fr 1fr;align-items:start"><div><div class="card"><div class="prof"><span class="av">RK</span><div><h2>Rajesh Kumar</h2><p class="mu">Angel investor · Mumbai, India</p><span class="pill ok" style="margin-top:8px">' + ic('shield') + 'Verified Investor</span></div><button class="btn line sm sp" style="margin-left:auto" data-toast="Profile editing opened">Edit</button></div></div>' +
        '<div class="card mt"><div class="card-h">' + ic('user') + '<h3>Investor details</h3></div><div class="kv">' + [['Investor ID', 'VK-INV-0218'], ['Email', 'rajesh.kumar@example.com'], ['Mobile', '+91 98••• ••210'], ['Investor type', 'Angel investor'], ['Ticket size', '$250K – $1M'], ['Interests', 'Logistics, trade tech']].map(function(k){ return '<div><span>' + k[0] + '</span><b>' + k[1] + '</b></div>'; }).join('') + '</div></div>' +
        '<div class="card mt"><div class="card-h">' + ic('shield') + '<h3>Verification</h3></div><div class="kv">' + [['KYC', 'Verified'], ['Accreditation', 'Accredited'], ['NDA', 'Signed']].map(function(k){ return '<div><span>' + k[0] + '</span>' + pill(k[1]) + '</div>'; }).join('') + '<div><span>NDA signed on</span><b>02 Oct 2026</b></div></div></div></div>' +
        '<div><div class="card"><div class="card-h">' + ic('lock') + '<h3>Security</h3></div>' + tg('Two-factor authentication', 'Code via authenticator app', 1) + tg('Login alerts', 'Email me on new sign-ins', 1) + '<div class="tg"><div><b>Password</b><small>Last changed 64 days ago</small></div><button class="btn line sm" data-toast="Password reset link sent">Change</button></div></div>' +
        '<div class="card mt"><div class="card-h">' + ic('bell') + '<h3>Notifications</h3></div>' + tg('Monthly investor updates', 'Email', 1) + tg('New documents in data room', 'Email & in-app', 1) + tg('Meeting reminders', '24 h and 1 h before', 1) + tg('SMS alerts', 'Important updates only', 0) + '</div>' +
        '<button class="btn ghost w mt" data-logout>' + ic('logout') + 'Log out</button></div></div>'; }
  };
  function tg(t, s, on){ return '<div class="tg"><div><b>' + t + '</b><small>' + s + '</small></div><label class="sw"><input type="checkbox" data-tg="' + esc(t) + '"' + (on ? ' checked' : '') + '><i></i></label></div>'; }
  function docList(){ var q = ST.docq.toLowerCase(), rows = DOCS.filter(function(d){ return (ST.doc === 'all' || d[2] === ST.doc) && (!q || d[0].toLowerCase().indexOf(q) > -1); });
    return rows.length ? rows.map(docRow.bind(null, false)).join('') : '<p class="mu" style="padding:30px;text-align:center">No documents match your search.</p>'; }
  function msgList(){ return MSGS.map(function(m, i){ return '<a data-msg="' + i + '" class="' + (i === ST.msg ? 'on ' : '') + (m[4] ? 'un' : '') + '"><span class="ib sq" style="width:38px;height:38px;font-size:12px;font-weight:800">' + m[1] + '</span><div><b>' + m[0] + '<em>' + m[3] + '</em></b><small>' + m[2] + '</small></div></a>'; }).join(''); }
  function msgRead(){ var m = MSGS[ST.msg];
    return '<div class="mh"><span class="ib">' + ic('mail') + '</span><div><b>' + m[2] + '</b><small>From ' + m[0] + ' · ' + m[3] + ' 2026</small></div></div><div class="mb">' + m[5].map(function(p){ return '<p>' + p + '</p>'; }).join('') +
      (m[6] ? '<button class="att" data-dl="' + esc(m[6]) + '">' + ic('clip') + m[6] + ic('dl') + '</button>' : '') + '</div>' +
      '<form class="reply" data-form="reply"><div class="inp">' + ic('chat') + '<input placeholder="Reply to ' + m[0] + '…" required></div><button class="btn gold" type="submit">' + ic('send') + 'Send</button></form>'; }
  function meetList(){ return MEET.map(function(m){ return '<div class="mt-i"><div class="mt-d"><small>' + m[1] + '</small><b>' + m[0] + '</b></div><div><b class="t">' + m[2] + '</b><small class="s">' + m[3] + '</small></div>' + (m[4] === 'Confirmed' ? '<button class="btn gold sm" data-toast="Opening meeting link…">Join</button>' : pill(m[4])) + '</div>'; }).join(''); }

  // ---------------- modals + toast ----------------
  function modal(kind){
    var body = kind === 'access'
      ? '<h3>Request Investor Access</h3><p>Tell us about yourself — our investor relations team will verify and share access within 2 business days.</p><form data-form="access"><div class="f2"><label class="fld"><span>Full name</span><div class="inp"><input required placeholder="Your name"></div></label><label class="fld"><span>Email</span><div class="inp"><input type="email" required placeholder="you@company.com"></div></label></div>' +
        '<div class="f2"><label class="fld"><span>Organisation</span><div class="inp"><input placeholder="Fund / family office / individual"></div></label><label class="fld"><span>Investor type</span><div class="inp"><select><option>Angel investor</option><option>Venture capital</option><option>Family office</option><option>Strategic / corporate</option></select></div></label></div>' +
        '<label class="fld"><span>Indicative ticket size</span><div class="inp"><select><option>$50K – $250K</option><option selected>$250K – $1M</option><option>$1M – $5M</option><option>$5M+</option></select></div></label><label class="chk" style="font-size:12.5px;color:var(--text2);margin-bottom:18px"><input type="checkbox" required>I confirm I am an accredited / eligible investor</label><button class="btn gold w" type="submit">Submit Request</button></form>'
      : '<h3>Schedule a Meeting</h3><p>Book a private call with our team.</p><form data-form="pubmeet"><div class="f2"><label class="fld"><span>Full name</span><div class="inp"><input required placeholder="Your name"></div></label><label class="fld"><span>Email</span><div class="inp"><input type="email" required placeholder="you@company.com"></div></label></div>' +
        '<div class="f2"><label class="fld"><span>Preferred date</span><div class="inp"><input type="date" value="2026-10-28" min="2026-10-22"></div></label><label class="fld"><span>Time (IST)</span><div class="inp"><select><option>10:00 AM</option><option>11:30 AM</option><option>2:00 PM</option><option>4:00 PM</option></select></div></label></div><label class="fld"><span>Topic</span><textarea class="inp" rows="3" placeholder="What would you like to discuss?"></textarea></label><button class="btn gold w" type="submit">Request Meeting</button></form>';
    document.body.insertAdjacentHTML('beforeend', '<div class="modal" id="modal"><div class="box"><button class="x" data-close aria-label="Close">' + ic('x') + '</button>' + body + '</div></div>'); }
  function closeModal(){ var m = document.getElementById('modal'); if (m) m.remove(); }
  var tt; function toast(s){ var t = document.getElementById('toast'); t.textContent = s; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(function(){ t.classList.remove('on'); }, 2600); }

  // ---------------- router ----------------
  function authed(){ try { return sessionStorage.getItem('vk-inv') === '1'; } catch (e){ return window.__vkInv; } }
  function setAuth(v){ window.__vkInv = v; try { v ? sessionStorage.setItem('vk-inv', '1') : sessionStorage.removeItem('vk-inv'); } catch (e){} }
  function route(){
    if (RAF) cancelAnimationFrame(RAF); RAF = null; OBS.forEach(function(o){ o.disconnect(); }); OBS = []; closeModal(); ST.navOpen = false;
    var h = location.hash.replace(/^#\/?/, '');
    if (h === 'login') login();
    else if (h.indexOf('app') === 0){ if (!authed()){ location.replace('#/login'); return; } portal(h.split('/')[1] || 'dashboard'); }
    else { landing(); }
    if (h.indexOf('app') !== 0) window.scrollTo(0, 0); }
  window.addEventListener('hashchange', route);

  // ---------------- events ----------------
  document.addEventListener('click', function(e){
    var t = e.target, x;
    if ((x = t.closest('[data-close]')) || t.id === 'modal'){ closeModal(); return; }
    if ((x = t.closest('[data-go]'))){ e.preventDefault(); var to = '#/' + x.dataset.go; if (location.hash === to || (to === '#/' && !location.hash)) route(); else location.hash = to; return; }
    if ((x = t.closest('[data-scroll]'))){ var el = document.getElementById(x.dataset.scroll); var pn = document.getElementById('pnav'); if (pn) pn.classList.remove('open'); if (el) window.scrollTo({ top:el.offsetTop - 60, behavior:'smooth' }); return; }
    if ((x = t.closest('[data-modal]'))){ closeModal(); modal(x.dataset.modal); return; }
    if ((x = t.closest('[data-dl]'))){ toast('Downloading ' + x.dataset.dl + '…'); return; }
    if ((x = t.closest('[data-toast]'))){ toast(x.dataset.toast); return; }
    if ((x = t.closest('[data-tab]'))){ var p = x.dataset.tab.split('|'); ST[p[0]] = p[1];
      if (p[0] === 'prog') document.getElementById('t-prog').innerHTML = secProgress();
      if (p[0] === 'fin') document.getElementById('t-fin').innerHTML = secFinancial();
      if (p[0] === 'doc'){ x.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('on', b === x); }); document.getElementById('doclist').innerHTML = docList(); }
      return; }
    if ((x = t.closest('[data-cargo]'))){ ST.cargo = x.dataset.cargo; x.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('on', b === x); }); document.getElementById('cargo').innerHTML = cargoChart(); return; }
    if ((x = t.closest('[data-msg]'))){ ST.msg = +x.dataset.msg; MSGS[ST.msg][4] = 0; route(); return; }
    if ((x = t.closest('[data-slot]'))){ ST.slot = x.dataset.slot; x.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('on', b === x); }); return; }
    if ((x = t.closest('[data-pw]'))){ var i = x.parentNode.querySelector('input'); i.type = i.type === 'password' ? 'text' : 'password'; return; }
    if (t.closest('[data-logout]')){ setAuth(false); toast('You have been logged out'); location.hash = '#/'; return; }
    if (t.closest('#burger')){ ST.navOpen = true; document.getElementById('portal').classList.add('nav-open'); return; }
    if (t.closest('#scrim')){ ST.navOpen = false; document.getElementById('portal').classList.remove('nav-open'); return; }
    if (t.closest('#pub-burger')){ document.getElementById('pnav').classList.toggle('open'); return; }
  });
  document.addEventListener('change', function(e){ if (e.target.dataset.tg) toast(e.target.dataset.tg + (e.target.checked ? ' turned on' : ' turned off')); });
  document.addEventListener('input', function(e){ if (e.target.id === 'docq'){ ST.docq = e.target.value; document.getElementById('doclist').innerHTML = docList(); } });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeModal(); });
  document.addEventListener('submit', function(e){
    var f = e.target, k = f.dataset.form; if (!k) return; e.preventDefault();
    if (k === 'login'){ setAuth(true); location.hash = '#/app/dashboard'; return; }
    if (k === 'access'){ closeModal(); toast('Request received — our IR team will contact you within 2 business days'); return; }
    if (k === 'pubmeet'){ closeModal(); toast('Meeting requested — you will receive a calendar invite by email'); return; }
    if (k === 'reply'){ var inp = f.querySelector('input'); toast('Reply sent to ' + MSGS[ST.msg][0]); inp.value = ''; return; }
    if (k === 'meet'){ var d = new Date(f.d.value || '2026-11-04'), type = f.querySelector('input[name=mt]:checked').value;
      MEET.push([String(d.getDate()).padStart(2, '0'), d.toLocaleString('en', { month:'short' }).toUpperCase(), type, ST.slot + ' IST · ' + f.mode.value, 'Requested']);
      document.getElementById('meetl').innerHTML = meetList(); f.msg.value = ''; toast('Meeting request sent — IR team will confirm within 24 hours'); }
  });

  route();
})();
