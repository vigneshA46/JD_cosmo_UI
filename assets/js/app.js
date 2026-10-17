  var stack = ['login'];

  function render(){
    var current = stack[stack.length - 1];
    document.querySelectorAll('.screen').forEach(function(s){ s.classList.remove('active'); });
    var el = document.getElementById('screen-' + current);
    if (el) el.classList.add('active');
    document.querySelectorAll('.nav-tab[data-goto]').forEach(function(n){
      n.classList.toggle('active', n.dataset.goto === current);
    });
    var scroller = el ? el.querySelector('.screen-scroll') : null;
    if (scroller) scroller.scrollTop = 0;
  }

  function goTo(id, reset){
    if (reset){ stack = [id]; } else { stack.push(id); }
    if (id === 'home'){ closeHomeSearch(); }
    render();
  }

  function goBack(){
    if (stack.length > 1){ stack.pop(); render(); }
  }

  function openHomeSearch(){
    var def = document.getElementById('home-default'); if (def) def.style.display = 'none';
    var res = document.getElementById('home-search-results'); if (res) res.style.display = 'block';
    var cancel = document.getElementById('home-search-cancel'); if (cancel) cancel.style.display = 'flex';
  }

  function closeHomeSearch(){
    var def = document.getElementById('home-default'); if (def) def.style.display = '';
    var res = document.getElementById('home-search-results'); if (res) res.style.display = 'none';
    var cancel = document.getElementById('home-search-cancel'); if (cancel) cancel.style.display = 'none';
  }

  document.addEventListener('click', function(e){
    var backBtn = e.target.closest('[data-back]');
    if (backBtn){ goBack(); return; }
    var openSearch = e.target.closest('[data-open-search]');
    if (openSearch){ openHomeSearch(); return; }
    var closeSearch = e.target.closest('[data-close-search]');
    if (closeSearch){ closeHomeSearch(); return; }
    var catEl = e.target.closest('[data-category]');
    if (catEl){
      var titleEl = document.getElementById('cat-products-title');
      if (titleEl) titleEl.textContent = catEl.dataset.category;
    }
    var gotoEl = e.target.closest('[data-goto]');
    if (gotoEl){
      goTo(gotoEl.dataset.goto, gotoEl.dataset.reset === 'true');
      if (gotoEl.dataset.selectTab){
        var preselectPill = document.querySelector('.tab-pill[data-tab-panel="' + gotoEl.dataset.selectTab + '"]');
        if (preselectPill) preselectPill.click();
      }
      return;
    }
    var selCard = e.target.closest('[data-select-card]');
    if (selCard){
      var group = selCard.parentElement;
      group.querySelectorAll('[data-select-card]').forEach(function(c){ c.classList.remove('selected'); });
      selCard.classList.add('selected');
      return;
    }
    var filterChip = e.target.closest('.filter-chip');
    if (filterChip){
      var parent = filterChip.parentElement;
      parent.querySelectorAll('.filter-chip').forEach(function(c){ c.classList.remove('active'); });
      filterChip.classList.add('active');
      return;
    }
    var tabPill = e.target.closest('.tab-pill');
    if (tabPill){
      var tp = tabPill.parentElement;
      tp.querySelectorAll('.tab-pill').forEach(function(c){ c.classList.remove('active'); });
      tabPill.classList.add('active');
      if (tabPill.dataset.tabPanel){
        var panel = document.getElementById(tabPill.dataset.tabPanel);
        if (panel && panel.parentElement){
          panel.parentElement.querySelectorAll('.tab-panel').forEach(function(p){ p.style.display = 'none'; });
          panel.style.display = 'block';
        }
      }
      return;
    }
    var selectTabEl = e.target.closest('[data-select-tab]');
    if (selectTabEl){
      var targetPill = document.querySelector('.tab-pill[data-tab-panel="' + selectTabEl.dataset.selectTab + '"]');
      if (targetPill) targetPill.click();
      return;
    }
    var toggle = e.target.closest('[data-toggle-breakdown]');
    if (toggle){
      toggle.classList.toggle('open');
      var body = toggle.nextElementSibling;
      if (body) body.classList.toggle('open');
      return;
    }
    var toggleFilter = e.target.closest('[data-toggle-panel]');
    if (toggleFilter){
      var filterPanel = document.getElementById(toggleFilter.dataset.togglePanel);
      if (filterPanel){ filterPanel.classList.toggle('open'); }
      return;
    }
  });


  // ---- rich layer interactions ----
  document.addEventListener('click', function(e){
    var h = e.target.closest('[data-heart]');
    if (h){ e.stopPropagation(); e.preventDefault(); h.classList.toggle('on'); }
  }, true);
  document.querySelectorAll('[data-carousel]').forEach(function(sc){
    var dots = document.getElementById(sc.dataset.carousel);
    sc.addEventListener('scroll', function(){
      var i = Math.round(sc.scrollLeft / (sc.firstElementChild.offsetWidth + 10));
      if (dots) Array.prototype.forEach.call(dots.children, function(d, j){ d.classList.toggle('on', j === i); });
    });
    var n = 0;
    setInterval(function(){
      if (!sc.offsetParent) return;
      n = (Math.round(sc.scrollLeft / (sc.firstElementChild.offsetWidth + 10)) + 1) % sc.children.length;
      sc.scrollTo({ left: n * (sc.firstElementChild.offsetWidth + 10), behavior: 'smooth' });
    }, 4500);
  });
  document.querySelectorAll('[data-gallery]').forEach(function(g){
    var c = document.getElementById(g.dataset.gallery);
    g.addEventListener('scroll', function(){ if (c) c.textContent = (Math.round(g.scrollLeft / g.offsetWidth) + 1) + ' / ' + g.children.length; });
  });
  (function(){
    var t = document.getElementById('deal-timer'); if (!t) return;
    var s = 5*3600 + 42*60 + 18;
    setInterval(function(){ s = s > 0 ? s - 1 : 0; var h = Math.floor(s/3600), m = Math.floor(s%3600/60), x = s%60;
      t.textContent = [h,m,x].map(function(v){ return (v<10?'0':'') + v; }).join(':'); }, 1000);
  })();


  // ---- v5: collapse the home header on scroll (Flipkart-style) ----
  (function(){
    var sc = document.getElementById('home-scroll'), hd = document.getElementById('home-head');
    if (!sc || !hd) return;
    sc.addEventListener('scroll', function(){
      if (sc.scrollTop > 40) hd.classList.add('collapsed');
      else if (sc.scrollTop < 8) hd.classList.remove('collapsed');
    });
  })();

  // ---- product details: variety, origin, quantity, packaging and live price ----
  (function(){
    var root = document.getElementById('screen-product-details');
    var q = document.getElementById('pd-qty'); if (!root || !q) return;

    var VARS = {"alphonso": {"label": "Alphonso (Hapus)", "short": "Alphonso", "price": 1.2, "was": 1.36, "imgs": ["assets/images/mango.jpg", "assets/images/mango2.jpg", "assets/images/orchard.jpg", "assets/images/mango3.jpg"], "desc": "The 'King of Mangoes' from Ratnagiri and Devgad. Saffron-coloured, fibreless pulp with a rich, honeyed aroma and thin skin. GI-tagged, naturally ripened and hot-water treated to meet EU, UAE and US import norms — 10–12 days shelf life in cold chain."}, "kesar": {"label": "Kesar", "short": "Kesar", "price": 1.05, "was": 1.18, "imgs": ["assets/images/mango_kesar2.jpg", "assets/images/mango_kesar1.jpg", "assets/images/mango_kesar3.jpg"], "desc": "Grown at the foothills of Gir in Gujarat, Kesar is named after its saffron-hued pulp. Sweet, mildly tangy and very aromatic with excellent keeping quality — ideal for fresh retail and pulp processing. GI-tagged; 12–14 days shelf life in cold chain."}, "totapuri": {"label": "Totapuri", "short": "Totapuri", "price": 0.62, "was": 0.7, "imgs": ["assets/images/mango_totapuri3.jpg", "assets/images/mango_totapuri1.jpg", "assets/images/orchard.jpg"], "desc": "Recognisable by its parrot-beak tip, Totapuri is a firm, tangy-sweet mango from South India. High pulp yield and long shelf life make it the first choice for juice, pulp and dried-fruit manufacturers worldwide. Available April to July."}, "banganapalli": {"label": "Banganapalli", "short": "Banganapalli", "price": 0.85, "was": 0.96, "imgs": ["assets/images/mango_banganapalli1.jpg", "assets/images/mango_banganapalli3.jpg", "assets/images/mango_banganapalli2.jpg"], "desc": "Andhra Pradesh's large, golden-yellow mango with smooth, fibreless flesh and a mild sweetness. Thin skin and a small stone give a high edible portion. GI-tagged and popular across the Gulf and Southeast Asia; 10–12 days shelf life."}, "dasheri": {"label": "Dasheri", "short": "Dasheri", "price": 0.78, "was": 0.88, "imgs": ["assets/images/mango_dasheri1.jpg", "assets/images/mango_dasheri3.jpg", "assets/images/mango_dasheri2.jpg"], "desc": "A classic North Indian mango from Malihabad, Lucknow. Elongated fruit with green-yellow skin and very sweet, aromatic, fibreless pulp. Best for premium fresh-fruit retail; harvested June to July and best shipped by air for peak freshness."}, "himsagar": {"label": "Himsagar", "short": "Himsagar", "price": 0.92, "was": 1.04, "imgs": ["assets/images/mango_himsagar1.jpg", "assets/images/mango_himsagar2.jpg", "assets/images/mango_himsagar3.jpg"], "desc": "West Bengal's prized mango — medium-sized fruit with deep-yellow, fibreless pulp and an intensely sweet flavour. A short May–June season makes it a sought-after specialty for buyers in Bangladesh, the UK and the Middle East. GI-tagged."}};
    var COUNTRIES = [{"code": "in", "name": "India", "f": 1.0, "markets": [["Ratnagiri APMC", "Maharashtra", 1.0], ["Vashi APMC, Navi Mumbai", "Maharashtra", 1.04], ["Devgad Market", "Maharashtra", 1.06], ["Salem Market", "Tamil Nadu", 0.93], ["Krishnagiri Market", "Tamil Nadu", 0.91], ["Banganapalle Market", "Andhra Pradesh", 0.94], ["Chittoor Market", "Andhra Pradesh", 0.92], ["Malihabad Mandi, Lucknow", "Uttar Pradesh", 0.95]]}, {"code": "pk", "name": "Pakistan", "f": 0.92, "markets": [["Multan Fruit Mandi", "Punjab", 1.0], ["Mirpur Khas Market", "Sindh", 0.97], ["Hyderabad Sabzi Mandi", "Sindh", 0.98]]}, {"code": "th", "name": "Thailand", "f": 1.08, "markets": [["Talaad Thai Market", "Bangkok", 1.0], ["Chachoengsao Market", "Chachoengsao", 0.96]]}, {"code": "ph", "name": "Philippines", "f": 1.12, "markets": [["Guimaras Trading Post", "Western Visayas", 1.03], ["Pangasinan Market", "Ilocos", 0.98]]}, {"code": "mx", "name": "Mexico", "f": 1.05, "markets": [["Central de Abasto", "Mexico City", 1.04], ["Sinaloa Market", "Sinaloa", 0.98], ["Michoacán Market", "Michoacán", 0.97]]}, {"code": "br", "name": "Brazil", "f": 0.98, "markets": [["Petrolina Market", "Pernambuco", 1.0], ["CEAGESP", "São Paulo", 1.06]]}, {"code": "pe", "name": "Peru", "f": 1.03, "markets": [["Piura Market", "Piura", 0.99], ["Lambayeque Market", "Lambayeque", 1.0]]}, {"code": "eg", "name": "Egypt", "f": 0.88, "markets": [["Obour Market", "Cairo", 1.0], ["Ismailia Market", "Ismailia", 0.96]]}, {"code": "ke", "name": "Kenya", "f": 0.85, "markets": [["Makueni Market", "Makueni", 0.98], ["Kilifi Market", "Kilifi", 1.0]]}];
    var PACKS = {"carton": {"name": "Carton Boxes", "short": "Cartons", "unit": "cartons", "one": "carton", "sizes": [5, 10, 20], "base": 0.4, "def_sub": 5, "def_size": 2, "subs": ["Single Wall", "Double Wall", "Triple Wall", "Rigid Box", "Die-Cut Box", "Heavy Duty Export Carton"], "hint": "Corrugated boxes, ventilated for fresh produce"}, "pallet": {"name": "Pallets", "short": "Pallets", "unit": "pallets", "one": "pallet", "sizes": [500, 1000, 1500], "base": 12, "def_sub": 0, "def_size": 1, "subs": ["Wooden Pallet", "Plastic Pallet", "Metal Pallet", "Plywood Pallet", "Euro Pallet", "Two-Way Pallet", "Four-Way Pallet"], "hint": "Stretch-wrapped with corner boards"}, "bags": {"name": "Bags & Sacks", "short": "Bags", "unit": "bags", "one": "bag", "sizes": [10, 25, 50], "base": 0.22, "def_sub": 0, "def_size": 1, "subs": ["PP Woven Bag", "HDPE Bag", "LDPE Bag", "Jute Bag", "Paper Bag", "Multiwall Paper Sack", "Laminated Bag", "BOPP Bag"], "hint": "Breathable bags and sacks for bulk produce"}, "fibc": {"name": "Jumbo Bags (FIBC)", "short": "Jumbo Bags", "unit": "jumbo bags", "one": "jumbo bag", "sizes": [500, 1000, 1500], "base": 6.5, "def_sub": 0, "def_size": 1, "subs": ["U-Panel", "Circular", "Four-Panel", "Baffle", "Ventilated", "Conductive"], "hint": "Flexible intermediate bulk containers"}, "wood": {"name": "Wooden Packaging", "short": "Wooden", "unit": "boxes", "one": "box", "sizes": [50, 100, 250], "base": 6, "def_sub": 1, "def_size": 1, "subs": ["Wooden Box", "Wooden Crate", "Plywood Box", "Plywood Crate", "Wooden Case", "Machinery Crate"], "hint": "ISPM-15 heat-treated timber"}, "drum": {"name": "Drums & Barrels", "short": "Drums", "unit": "drums", "one": "drum", "sizes": [50, 100, 200], "base": 9, "def_sub": 0, "def_size": 2, "subs": ["Plastic Drum", "Steel Drum", "Fibre Drum", "Open Top", "Closed Top", "HDPE Drum"], "hint": "For pulp, puree and liquids"}, "bottle": {"name": "Bottles & Containers", "short": "Bottles", "unit": "containers", "one": "container", "sizes": [1, 5, 20], "base": 0.35, "def_sub": 2, "def_size": 1, "subs": ["Plastic Bottle", "Glass Bottle", "HDPE Container", "PET Container", "Jerry Can", "Metal Can", "Tin Container"], "hint": "Retail and food-service containers"}, "bulk": {"name": "Bulk Containers", "short": "Bulk", "unit": "units", "one": "unit", "sizes": [1000, 5000, 20000], "base": 95, "def_sub": 0, "def_size": 0, "subs": ["IBC Tank", "Flexitank", "ISO Tank Container", "Bulk Container Liner", "Collapsible IBC"], "hint": "Large-volume liquid and pulp transport"}, "pouch": {"name": "Pouches & Flexible Packaging", "short": "Pouches", "unit": "pouches", "one": "pouch", "sizes": [0.5, 1, 5], "base": 0.08, "def_sub": 0, "def_size": 1, "subs": ["Stand-Up Pouch", "Flat Pouch", "Vacuum Pouch", "Zipper Pouch", "Aluminium Foil Pouch", "Retort Pouch", "Spout Pouch"], "hint": "Consumer-ready flexible packs"}, "wrap": {"name": "Wrapping & Film", "short": "Wraps & Film", "unit": "rolls", "one": "roll", "sizes": [250, 500, 1000], "base": 4.5, "def_sub": 0, "def_size": 1, "subs": ["Stretch Film", "Shrink Film", "Bubble Wrap", "Cling Film", "PE Film", "VCI Film", "Pallet Wrap"], "hint": "Roll coverage shown per roll"}, "protect": {"name": "Protective Packaging", "short": "Protective", "unit": "packs", "one": "pack", "sizes": [10, 25, 50], "base": 0.4, "def_sub": 2, "def_size": 1, "subs": ["Foam", "EPS / Thermocol", "EPE Foam", "Air Bubble Cushion", "Air Pillow", "Honeycomb Paper", "Edge Protector"], "hint": "Cushioning to prevent bruising in transit"}, "crate": {"name": "Trays & Crates", "short": "Trays & Crates", "unit": "crates", "one": "crate", "sizes": [5, 10, 20], "base": 0.7, "def_sub": 1, "def_size": 1, "subs": ["Plastic Crate", "Fruit Crate", "Vegetable Crate", "Corrugated Tray", "Plastic Tray", "Wooden Tray", "Stackable Crate"], "hint": "Stackable crates and trays for fresh fruit"}, "insul": {"name": "Insulated Packaging", "short": "Insulated", "unit": "boxes", "one": "box", "sizes": [5, 10, 20], "base": 1.6, "def_sub": 3, "def_size": 1, "subs": ["Insulated Box", "EPS Cooler Box", "Thermal Bag", "Cold Chain Box", "Gel Pack Packaging"], "hint": "Keeps produce cool on long journeys"}, "metal": {"name": "Metal Packaging", "short": "Metal", "unit": "containers", "one": "container", "sizes": [10, 25, 50], "base": 2.4, "def_sub": 0, "def_size": 1, "subs": ["Tin Box", "Metal Box", "Steel Container", "Aluminium Container", "Metal Crate", "Steel Cage"], "hint": "Rigid, tamper-proof metal packs"}, "paper": {"name": "Paper-Based Packaging", "short": "Paper-based", "unit": "packs", "one": "pack", "sizes": [5, 10, 25], "base": 0.3, "def_sub": 2, "def_size": 1, "subs": ["Kraft Paper Wrap", "Honeycomb Paper Wrap", "Paperboard Box", "Paper Tube", "Paper Sleeve", "Moulded Pulp"], "hint": "Recyclable, plastic-free options"}, "special": {"name": "Specialized Export Packaging", "short": "Specialized", "unit": "packs", "one": "pack", "sizes": [10, 25, 50], "base": 0.9, "def_sub": 1, "def_size": 1, "subs": ["Vacuum-Sealed", "Moisture Barrier", "Anti-Static", "VCI Anti-Rust", "Desiccant", "UN-Certified Dangerous Goods"], "hint": "Compliance-grade export protection"}, "custom": {"name": "Customized Packaging", "short": "Customized", "unit": "packs", "one": "pack", "sizes": [1, 5, 10], "base": 0.2, "def_sub": 0, "def_size": 1, "subs": ["Private Label", "Retail Pack", "Mixed Assortment"], "hint": "Tell the supplier exactly how you want it packed"}};
    var UNITS = { kg: 1, mt: 1000, lb: 0.453592 };
    var TIER_AT = [0, 2000, 10000], TIER_RATIO = [1, 0.9333, 0.875];

    var st = { variety: 'alphonso', country: 'in', market: 0, unit: 'kg', packs: { carton: { sub: 5, size: 2 } } };

    function $(id){ return document.getElementById(id); }
    function money(v){ return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
    function fmt(v, d){ return v.toLocaleString('en-US', { maximumFractionDigits: d || 0 }); }
    function country(){ return COUNTRIES.filter(function(c){ return c.code === st.country; })[0]; }
    function countryPrice(c){ return VARS[st.variety].price * c.f; }
    function marketPrice(c, i){ return Math.round(countryPrice(c) * c.markets[i][2] * 100) / 100; }
    function unitPrice(){ return marketPrice(country(), st.market); }
    function qtyVal(){ return parseFloat((q.value || '0').replace(/,/g, '')) || 0; }
    function kg(){ return qtyVal() * UNITS[st.unit]; }
    function tierIndex(k){ var t = 0; TIER_AT.forEach(function(x, i){ if (k >= x) t = i; }); return t; }
    function tierPrice(i){ return Math.round(unitPrice() * TIER_RATIO[i] * 100) / 100; }
    function sizeLabel(v){ return v < 1 ? (v * 1000) + ' g' : fmt(v) + ' kg'; }
    function needFor(type, size){ return Math.max(1, Math.ceil(kg() / PACKS[type].sizes[size])); }
    // sample cost model: bigger packs cost more each (but less per kg); premium sub-types cost a little more
    function costFor(type, sub, size){
      var p = PACKS[type], each = p.base * Math.pow(p.sizes[size] / p.sizes[0], 0.75) * (1 + 0.06 * sub);
      return Math.round(each * needFor(type, size) * 100) / 100;
    }
    function packCost(type){ var s = st.packs[type]; return costFor(type, s.sub, s.size); }

    // ---------- render ----------
    function update(){
      var c = country(), up = unitPrice(), v = VARS[st.variety], k = kg(), t = tierIndex(k);
      // header price
      var was = up * v.was / v.price;
      root.querySelector('.pd-price b').textContent = money(up);
      root.querySelector('.pd-price .strike').textContent = money(was);
      root.querySelector('.pd-price .off').textContent = Math.round((1 - up / was) * 100) + '% off';
      // origin rows
      $('pd-country-flag').src = 'assets/images/flags/' + c.code + '.png';
      $('pd-country').textContent = c.name;
      $('pd-country-price').textContent = 'avg ' + money(countryPrice(c)) + '/kg';
      $('pd-market').textContent = c.markets[st.market][0];
      $('pd-market-sub').textContent = c.markets[st.market][1];
      $('pd-market-price').textContent = 'avg ' + money(up) + '/kg';
      // quantity
      $('pd-qty-unit').textContent = st.unit.toUpperCase();
      var h = $('pd-qty-hint');
      if (k < 500){ h.textContent = 'Below MOQ — minimum order is 500 kg'; h.classList.add('warn'); }
      else { h.textContent = '≈ ' + fmt(k) + ' kg · tier price ' + money(tierPrice(t)) + '/kg applied'; h.classList.remove('warn'); }
      root.querySelectorAll('.tiers .tier').forEach(function(el, i){
        el.classList.toggle('on', i === t);
        el.querySelector('.tp').textContent = money(tierPrice(i));
      });
      // packaging tiles
      var packTotal = 0;
      root.querySelectorAll('.pk-tile').forEach(function(el){
        var type = el.dataset.pack, s = st.packs[type], sub = el.querySelector('small');
        el.classList.toggle('on', !!s);
        if (!s){ sub.textContent = 'Tap to add'; return; }
        sub.textContent = fmt(needFor(type, s.size)) + ' × ' + sizeLabel(PACKS[type].sizes[s.size]);
        packTotal += packCost(type);
      });
      // breakdown + CTA
      var goods = k * tierPrice(t), total = goods + packTotal;
      $('pb-goods-l').textContent = 'Product (' + fmt(k) + ' kg × ' + money(tierPrice(t)) + ')';
      $('pb-goods').textContent = money(goods);
      $('pb-pack').textContent = packTotal ? money(packTotal) : '—';
      $('pb-total').textContent = money(total);
      $('pd-total').textContent = money(total);
    }

    function setVariety(key){
      var v = VARS[key]; if (!v) return;
      st.variety = key;
      root.querySelectorAll('.vtile').forEach(function(t){ t.classList.toggle('on', t.dataset.variety === key); });
      $('pd-var-name').textContent = v.label;
      $('pd-desc').textContent = v.desc;
      var g = root.querySelector('.pd-gs');
      g.innerHTML = v.imgs.map(function(src){ return '<img src="' + src + '" alt="">'; }).join('');
      g.scrollLeft = 0; g.classList.remove('swap'); void g.offsetWidth; g.classList.add('swap');
      $('pd-count').textContent = '1 / ' + v.imgs.length;
      var nm = root.querySelector('.pd-name');
      nm.textContent = nm.textContent.replace(/^[^—]*?Mango/, v.short + ' Mango');
      update();
    }

    // ---------- bottom sheets ----------
    var pick = $('pd-pick'), pack = $('pd-pack');
    function openSheet(el){ el.classList.add('open'); }
    function closeSheet(el){ el.classList.remove('open'); }
    var CHECK = '<svg class="pk-check" viewBox="0 0 24 24" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>';
    var PIN = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>';

    function openPicker(kind){
      var c = country(), rows;
      if (kind === 'country'){
        $('pk-title').textContent = 'Select country';
        $('pk-sub').textContent = 'Average ' + VARS[st.variety].short + ' price by origin';
        rows = COUNTRIES.map(function(x){
          return '<div class="pk-row' + (x.code === st.country ? ' on' : '') + '" data-pick-country="' + x.code + '"><span class="pk-flag"><img src="assets/images/flags/' + x.code + '.png" alt=""></span>' +
            '<div class="pk-b"><b>' + x.name + '</b><small>' + x.markets.length + ' markets</small></div><div class="pk-p"><b>' + money(countryPrice(x)) + '</b><small>avg / kg</small></div>' + CHECK + '</div>';
        });
      } else {
        $('pk-title').textContent = 'Select market';
        $('pk-sub').textContent = 'Average ' + VARS[st.variety].short + ' price in ' + c.name;
        rows = c.markets.map(function(m, i){
          return '<div class="pk-row' + (i === st.market ? ' on' : '') + '" data-pick-market="' + i + '"><span class="pk-pin">' + PIN + '</span>' +
            '<div class="pk-b"><b>' + m[0] + '</b><small>' + m[1] + '</small></div><div class="pk-p"><b>' + money(marketPrice(c, i)) + '</b><small>avg / kg</small></div>' + CHECK + '</div>';
        });
      }
      $('pk-list').innerHTML = rows.join('');
      openSheet(pick);
    }

    var draft = null;
    function openPack(type){
      var p = PACKS[type], cur = st.packs[type];
      draft = { type: type, sub: cur ? cur.sub : p.def_sub, size: cur ? cur.size : p.def_size };
      $('pp-title').textContent = p.name;
      $('pp-sub').textContent = p.hint;
      $('pp-remove').style.display = cur ? '' : 'none';
      $('pp-notes-wrap').style.display = type === 'custom' ? '' : 'none';
      $('pp-sum-ic').innerHTML = root.querySelector('.pk-tile[data-pack="' + type + '"] .pk-ic').innerHTML;
      renderPack();
      openSheet(pack);
    }
    function renderPack(){
      var p = PACKS[draft.type], need = needFor(draft.type, draft.size);
      $('pp-subs').innerHTML = p.subs.map(function(x, i){
        return '<span class="pp-chip' + (i === draft.sub ? ' on' : '') + '" data-pp-sub="' + i + '">' + x + '</span>';
      }).join('');
      $('pp-size-l').textContent = 'Quantity per ' + p.one;
      $('pp-sizes').innerHTML = p.sizes.map(function(x, i){
        return '<div class="pp-size' + (i === draft.size ? ' on' : '') + '" data-pp-size="' + i + '"><b>' + sizeLabel(x) + '</b><small>per ' + p.one + '</small></div>';
      }).join('');
      $('pp-need-l').textContent = p.unit.charAt(0).toUpperCase() + p.unit.slice(1) + ' needed';
      $('pp-need').textContent = fmt(need) + ' ' + p.unit;
      $('pp-need-hint').textContent = 'Auto-calculated · ' + fmt(kg()) + ' kg ÷ ' + sizeLabel(p.sizes[draft.size]) + ' per ' + p.one;
      $('pp-cost').textContent = money(costFor(draft.type, draft.sub, draft.size));
    }

    // ---------- events ----------
    root.addEventListener('click', function(e){
      var t;
      if ((t = e.target.closest('.vtile'))) { if (!t.classList.contains('on')) setVariety(t.dataset.variety); return; }
      if ((t = e.target.closest('[data-open-picker]'))) { openPicker(t.dataset.openPicker); return; }
      if ((t = e.target.closest('[data-pick-country]'))) { st.country = t.dataset.pickCountry; st.market = 0; closeSheet(pick); update(); return; }
      if ((t = e.target.closest('[data-pick-market]'))) { st.market = +t.dataset.pickMarket; closeSheet(pick); update(); return; }
      if ((t = e.target.closest('[data-close-sheet]'))) { closeSheet($(t.dataset.closeSheet)); return; }
      if ((t = e.target.closest('.unit-chip'))) {
        if (t.dataset.unit === st.unit) return;
        var k0 = kg(); st.unit = t.dataset.unit;
        root.querySelectorAll('.unit-chip').forEach(function(u){ u.classList.toggle('on', u === t); });
        q.value = fmt(k0 / UNITS[st.unit], 3); update(); return;
      }
      if ((t = e.target.closest('.pk-tile'))) { openPack(t.dataset.pack); return; }
      if ((t = e.target.closest('[data-pp-sub]'))) { draft.sub = +t.dataset.ppSub; renderPack(); return; }
      if ((t = e.target.closest('[data-pp-size]'))) { draft.size = +t.dataset.ppSize; renderPack(); return; }
      if (e.target.closest('#pp-apply')) { st.packs[draft.type] = { sub: draft.sub, size: draft.size }; closeSheet(pack); update(); return; }
      if (e.target.closest('#pp-remove')) { delete st.packs[draft.type]; closeSheet(pack); update(); return; }
    });
    q.addEventListener('input', update);
    q.addEventListener('blur', function(){ q.value = fmt(qtyVal(), 3); });

    var n = 0, cart = $('pd-cart'), badge = $('pd-cart-n'), toast = $('pd-toast');
    cart.addEventListener('click', function(){
      n++; badge.textContent = n; badge.classList.add('show');
      toast.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(function(){ toast.classList.remove('show'); }, 1600);
    });
    // summary used by the request-quote flow
    window.pdSummary = function(){
      var c = country(), k = kg(), t = tierIndex(k), packTotal = 0, txt = [];
      Object.keys(st.packs).forEach(function(type){
        var s = st.packs[type], p = PACKS[type];
        packTotal += packCost(type); txt.push(fmt(needFor(type, s.size)) + ' × ' + sizeLabel(p.sizes[s.size]) + ' ' + p.subs[s.sub].toLowerCase());
      });
      return { name: root.querySelector('.pd-name').textContent, variety: VARS[st.variety].label, img: VARS[st.variety].imgs[0],
        country: c.name, countryCode: c.code, market: c.markets[st.market][0], kg: k, unitPrice: tierPrice(t),
        goods: k * tierPrice(t), packCost: packTotal, packText: txt.join(' + ') };
    };
    update();
  })();
  render();

  // ---- country sheet + continent page ----
  (function(){
    var CONT = {"asia": {"name": "Asia", "list": [["in", "India", "Spices · Rice · Fruits", 1240, 420], ["vn", "Vietnam", "Cashew · Pepper · Coffee", 410, 138], ["th", "Thailand", "Rice · Durian · Tapioca", 365, 121], ["id", "Indonesia", "Coconut · Cocoa · Spices", 298, 104], ["lk", "Sri Lanka", "Tea · Cinnamon · Coconut", 212, 77], ["my", "Malaysia", "Palm oil · Durian · Pepper", 176, 58], ["ph", "Philippines", "Banana · Coconut · Mango", 158, 52], ["cn", "China", "Garlic · Ginger · Tea", 520, 190], ["bd", "Bangladesh", "Jute · Rice · Shrimp", 96, 31], ["pk", "Pakistan", "Basmati · Kinnow · Dates", 188, 66], ["jp", "Japan", "Matcha · Rice · Seafood", 84, 29], ["kr", "South Korea", "Ginseng · Kimchi · Pear", 71, 24]]}, "me": {"name": "Middle East", "list": [["ae", "UAE", "Dates · Re-export hub", 214, 88], ["sa", "Saudi Arabia", "Dates · Coffee · Honey", 122, 41], ["tr", "Türkiye", "Hazelnut · Apricot · Figs", 286, 97], ["ir", "Iran", "Saffron · Pistachio · Dates", 174, 62], ["om", "Oman", "Dates · Frankincense", 48, 17], ["il", "Israel", "Citrus · Avocado · Dates", 92, 33]]}, "af": {"name": "Africa", "list": [["eg", "Egypt", "Citrus · Onion · Potato", 232, 79], ["ke", "Kenya", "Tea · Avocado · Flowers", 196, 68], ["et", "Ethiopia", "Coffee · Sesame · Pulses", 142, 49], ["za", "South Africa", "Citrus · Grapes · Wine", 248, 86], ["ng", "Nigeria", "Sesame · Cocoa · Cashew", 118, 40], ["gh", "Ghana", "Cocoa · Shea · Cashew", 104, 36], ["tz", "Tanzania", "Cashew · Clove · Coffee", 87, 30], ["ma", "Morocco", "Citrus · Olives · Argan", 134, 45], ["ci", "Côte d’Ivoire", "Cocoa · Cashew · Rubber", 112, 38], ["ug", "Uganda", "Coffee · Vanilla · Banana", 69, 23]]}, "eu": {"name": "Europe", "list": [["es", "Spain", "Olive oil · Citrus · Almond", 268, 94], ["it", "Italy", "Pasta · Olive oil · Tomato", 254, 90], ["nl", "Netherlands", "Dairy · Onion · Potato", 186, 64], ["fr", "France", "Wheat · Dairy · Wine", 201, 70], ["gr", "Greece", "Olives · Feta · Honey", 117, 39], ["de", "Germany", "Malt · Dairy · Confectionery", 143, 51], ["pl", "Poland", "Apple · Berries · Mushroom", 109, 37]]}, "na": {"name": "North America", "list": [["us", "United States", "Almond · Soy · Corn", 388, 140], ["mx", "Mexico", "Avocado · Chilli · Lime", 224, 77], ["ca", "Canada", "Pulses · Canola · Maple", 176, 60], ["gt", "Guatemala", "Cardamom · Coffee · Banana", 73, 25]]}, "sa": {"name": "South America", "list": [["br", "Brazil", "Coffee · Sugar · Soy", 342, 118], ["cl", "Chile", "Cherry · Grapes · Walnut", 158, 54], ["pe", "Peru", "Blueberry · Quinoa · Avocado", 176, 61], ["ar", "Argentina", "Soy · Beef · Lemon", 149, 52], ["co", "Colombia", "Coffee · Banana · Flowers", 131, 45], ["ec", "Ecuador", "Banana · Cocoa · Shrimp", 112, 39]]}, "oc": {"name": "Oceania", "list": [["au", "Australia", "Wheat · Barley · Macadamia", 214, 74], ["nz", "New Zealand", "Kiwifruit · Dairy · Honey", 138, 48], ["fj", "Fiji", "Ginger · Kava · Taro", 36, 12]]}};
    var CHEV = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 6l6 6-6 6\"/></svg>";
    function flagSrc(k){ return 'assets/images/flags/' + k + '.png'; }
    function fmt(n){ return n.toLocaleString('en-US'); }
    // sectors a country exports in (Spices, Fruits, Grains...) — sample figures scaled from its product count
    function sectors(products){ return Math.max(3, Math.min(12, Math.round(products / 45))); }
    function fillContinent(key){
      var c = CONT[key]; if (!c) return;
      var p = 0, e = 0; c.list.forEach(function(x){ p += x[3]; e = Math.max(e, sectors(x[3])); });
      e = Math.min(14, e + 2);
      document.getElementById('ct-title').textContent = c.name;
      document.getElementById('ct-name').textContent = c.name;
      document.getElementById('ct-n').textContent = c.list.length;
      document.getElementById('ct-p').textContent = fmt(p);
      document.getElementById('ct-e').textContent = fmt(e);
      var fl = c.list.slice(0, 6).map(function(x){ return '<span><img src="' + flagSrc(x[0]) + '" alt=""></span>'; }).join('');
      if (c.list.length > 6) fl += '<em>+' + (c.list.length - 6) + ' more</em>';
      document.getElementById('ct-flags').innerHTML = fl;
      document.getElementById('ct-list').innerHTML = c.list.map(function(x){
        return '<div class="ct-row" data-goto="category-products" data-category="' + x[1] + '"><span class="cf"><img src="' + flagSrc(x[0]) + '" alt=""></span>' +
          '<div class="ct-rb"><b>' + x[1] + '</b><small>' + x[2] + '</small><div class="ct-meta"><span>' + fmt(x[3]) + ' products</span><span>' + sectors(x[3]) + ' sectors</span></div></div>' + CHEV + '</div>';
      }).join('');
    }
    document.addEventListener('click', function(e){
      var ch = e.target.closest('[data-continent]');
      if (ch) fillContinent(ch.dataset.continent);
      var sheet = document.getElementById('country-sheet');
      if (sheet && sheet.classList.contains('open') && e.target.closest('#country-sheet [data-goto]')) sheet.classList.remove('open');
    });
    var q = document.getElementById('cs-q');
    if (q) q.addEventListener('input', function(){
      var v = q.value.trim().toLowerCase(), any = false;
      document.querySelectorAll('#country-sheet .cs-sec').forEach(function(sec){
        var shown = 0;
        sec.querySelectorAll('.cs-c').forEach(function(c){ var ok = !v || c.dataset.q.indexOf(v) > -1; c.style.display = ok ? '' : 'none'; if (ok) shown++; });
        sec.style.display = shown ? '' : 'none'; if (shown) any = true;
      });
      document.getElementById('cs-empty').style.display = any ? 'none' : 'block';
    });
  })();

  // ---- request quote flow: shipping + delivery address -> port/airport -> liner/airline -> warehouse (optional) -> review -> sent ----
  // "Let Venture Karts handle this delivery" jumps from step 1 straight to the review.
  (function(){
    if (!document.getElementById('screen-rq-ship')) return;
    var D = {"icons": {"ship": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2 20c2 1 4 1 6 0s4-1 6 0 4 1 6 0\"/><path d=\"M4 18l-1-5h18l-2 5\"/><path d=\"M12 4v9M7 13V8h10v5\"/></svg>", "plane": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z\"/></svg>"}, "portImgs": ["port.jpg", "ship.jpg", "container.jpg", "aircargo.jpg", "aircargo.jpg", "truck.jpg"], "origins": {"in": {"sea": ["INNSA", "Nhava Sheva (JNPT)", "Mumbai, India"], "air": ["BOM", "Chhatrapati Shivaji Intl", "Mumbai, India"]}, "pk": {"sea": ["PKKHI", "Port of Karachi", "Karachi, Pakistan"], "air": ["KHI", "Jinnah International", "Karachi, Pakistan"]}, "th": {"sea": ["THLCH", "Laem Chabang Port", "Chonburi, Thailand"], "air": ["BKK", "Suvarnabhumi Airport", "Bangkok, Thailand"]}, "ph": {"sea": ["PHMNL", "Port of Manila", "Manila, Philippines"], "air": ["MNL", "Ninoy Aquino Intl", "Manila, Philippines"]}, "mx": {"sea": ["MXZLO", "Port of Manzanillo", "Colima, Mexico"], "air": ["MEX", "Mexico City Intl", "Mexico City, Mexico"]}, "br": {"sea": ["BRSSZ", "Port of Santos", "São Paulo, Brazil"], "air": ["GRU", "Guarulhos Intl", "São Paulo, Brazil"]}, "pe": {"sea": ["PECLL", "Port of Callao", "Lima, Peru"], "air": ["LIM", "Jorge Chávez Intl", "Lima, Peru"]}, "eg": {"sea": ["EGALY", "Port of Alexandria", "Alexandria, Egypt"], "air": ["CAI", "Cairo International", "Cairo, Egypt"]}, "ke": {"sea": ["KEMBA", "Port of Mombasa", "Mombasa, Kenya"], "air": ["NBO", "Jomo Kenyatta Intl", "Nairobi, Kenya"]}}, "dests": [{"code": "ae", "name": "United Arab Emirates", "seaF": 1.0, "airF": 1.0, "ports": [["AEJEA", "Port of Jebel Ali", "Dubai"], ["AEKHL", "Khalifa Port", "Abu Dhabi"], ["AESHJ", "Port Khalid", "Sharjah"]], "airports": [["DXB", "Dubai International", "Dubai"], ["DWC", "Al Maktoum International", "Dubai"], ["AUH", "Zayed International", "Abu Dhabi"]]}, {"code": "sa", "name": "Saudi Arabia", "seaF": 1.15, "airF": 1.08, "ports": [["SAJED", "Jeddah Islamic Port", "Jeddah"], ["SADMM", "King Abdulaziz Port", "Dammam"]], "airports": [["JED", "King Abdulaziz Intl", "Jeddah"], ["RUH", "King Khalid Intl", "Riyadh"], ["DMM", "King Fahd Intl", "Dammam"]]}, {"code": "qa", "name": "Qatar", "seaF": 1.1, "airF": 1.05, "ports": [["QAHMD", "Hamad Port", "Doha"]], "airports": [["DOH", "Hamad International", "Doha"]]}, {"code": "sg", "name": "Singapore", "seaF": 1.25, "airF": 1.2, "ports": [["SGSIN", "Port of Singapore", "Singapore"]], "airports": [["SIN", "Changi Airport", "Singapore"]]}, {"code": "nl", "name": "Netherlands", "seaF": 1.9, "airF": 1.7, "ports": [["NLRTM", "Port of Rotterdam", "Rotterdam"]], "airports": [["AMS", "Amsterdam Schiphol", "Amsterdam"]]}, {"code": "de", "name": "Germany", "seaF": 1.95, "airF": 1.75, "ports": [["DEHAM", "Port of Hamburg", "Hamburg"], ["DEBRV", "Port of Bremerhaven", "Bremerhaven"]], "airports": [["FRA", "Frankfurt Airport", "Frankfurt"], ["MUC", "Munich Airport", "Munich"]]}, {"code": "gb", "name": "United Kingdom", "seaF": 2.0, "airF": 1.8, "ports": [["GBFXT", "Port of Felixstowe", "Felixstowe"], ["GBSOU", "Port of Southampton", "Southampton"], ["GBLGP", "London Gateway", "London"]], "airports": [["LHR", "Heathrow Airport", "London"], ["MAN", "Manchester Airport", "Manchester"]]}, {"code": "us", "name": "United States", "seaF": 2.6, "airF": 2.3, "ports": [["USNYC", "Port of New York & New Jersey", "New York"], ["USLAX", "Port of Los Angeles", "Los Angeles"], ["USSAV", "Port of Savannah", "Savannah"]], "airports": [["JFK", "John F. Kennedy Intl", "New York"], ["LAX", "Los Angeles Intl", "Los Angeles"], ["ORD", "O'Hare International", "Chicago"]]}], "seaLoads": [{"name": "LCL", "short": "LCL (shared)", "note": "Shared container", "perKg": 0.16}, {"name": "20 ft Reefer", "short": "20' Reefer", "note": "Up to 20 t · 2–8 °C", "cap": 20000, "rate": 1650}, {"name": "40 ft Reefer", "short": "40' Reefer HC", "note": "Up to 26 t · 2–8 °C", "cap": 26000, "rate": 2450}], "airLoads": [{"name": "General", "short": "General cargo", "note": "Standard handling", "perKg": 0.95}, {"name": "Perishable", "short": "Perishable (PER)", "note": "Cool chain 2–8 °C", "perKg": 1.25}, {"name": "Express", "short": "Express priority", "note": "Next flight out", "perKg": 1.6}], "liners": [{"code": "MSK", "name": "Maersk", "bg": "#42B0D5", "fg": "#fff", "f": 1.0, "tt": 6, "direct": true, "tag": "Best seller"}, {"code": "MSC", "name": "MSC", "bg": "#1B1B1B", "fg": "#F2C200", "f": 0.94, "tt": 8, "direct": false, "via": "Salalah"}, {"code": "ONE", "name": "Ocean Network Express", "bg": "#E4007F", "fg": "#fff", "f": 0.97, "tt": 7, "direct": true}, {"code": "CMA", "name": "CMA CGM", "bg": "#0F2A5A", "fg": "#fff", "f": 1.05, "tt": 6, "direct": true, "tag": "Fastest"}, {"code": "HLC", "name": "Hapag-Lloyd", "bg": "#F26722", "fg": "#fff", "f": 1.08, "tt": 9, "direct": false, "via": "Khalifa"}, {"code": "EMC", "name": "Evergreen", "bg": "#0B7B3E", "fg": "#fff", "f": 0.91, "tt": 10, "direct": false, "via": "Colombo", "tag": "Lowest price"}], "airlines": [{"code": "EK", "name": "Emirates SkyCargo", "bg": "#D71921", "fg": "#fff", "f": 1.0, "tt": 1, "direct": true, "tag": "Best seller"}, {"code": "QR", "name": "Qatar Airways Cargo", "bg": "#5C0632", "fg": "#fff", "f": 0.96, "tt": 2, "direct": false, "via": "Doha"}, {"code": "AI", "name": "Air India Cargo", "bg": "#C8102E", "fg": "#FFD200", "f": 0.92, "tt": 1, "direct": true, "tag": "Lowest price"}, {"code": "SQ", "name": "Singapore Airlines Cargo", "bg": "#1D2F6F", "fg": "#F0B323", "f": 1.06, "tt": 2, "direct": false, "via": "Singapore"}, {"code": "EY", "name": "Etihad Cargo", "bg": "#BD8B13", "fg": "#fff", "f": 0.98, "tt": 2, "direct": false, "via": "Abu Dhabi"}, {"code": "LH", "name": "Lufthansa Cargo", "bg": "#05164D", "fg": "#FFAD00", "f": 1.12, "tt": 1, "direct": true, "tag": "Fastest"}], "warehouses": {"ae": [{"name": "JD Cold Hub — Jebel Ali", "area": "JAFZA South, Dubai", "km": 4, "tags": ["Cold 2–8 °C", "Bonded", "24/7"], "rate": 18, "rating": 4.8, "img": "warehouse.jpg"}, {"name": "Gulf Agri Store", "area": "Al Quoz Industrial, Dubai", "km": 19, "tags": ["Cold 2–8 °C", "Ripening rooms"], "rate": 15, "rating": 4.6, "img": "container.jpg"}, {"name": "Emirates Dry Port Warehouse", "area": "KEZAD, Abu Dhabi", "km": 9, "tags": ["Ambient", "Bonded"], "rate": 11, "rating": 4.4, "img": "warehouse.jpg"}], "sa": [{"name": "Red Sea Cold Chain", "area": "Jeddah Industrial City", "km": 7, "tags": ["Cold 2–8 °C", "Bonded"], "rate": 17, "rating": 4.7, "img": "warehouse.jpg"}, {"name": "Eastern Logistics Park", "area": "Dammam 2nd Industrial", "km": 12, "tags": ["Ambient", "24/7"], "rate": 12, "rating": 4.5, "img": "container.jpg"}], "qa": [{"name": "Doha Fresh Logistics", "area": "Birkat Al Awamer, Doha", "km": 8, "tags": ["Cold 2–8 °C", "Bonded"], "rate": 19, "rating": 4.6, "img": "warehouse.jpg"}], "sg": [{"name": "Jurong Cold Store", "area": "Jurong Port, Singapore", "km": 3, "tags": ["Cold 2–8 °C", "Bonded", "24/7"], "rate": 22, "rating": 4.8, "img": "warehouse.jpg"}], "nl": [{"name": "Rotterdam Fresh Port", "area": "Maasvlakte, Rotterdam", "km": 5, "tags": ["Cold 2–8 °C", "Ripening rooms"], "rate": 24, "rating": 4.7, "img": "warehouse.jpg"}], "de": [{"name": "Hamburg Cool Terminal", "area": "Altenwerder, Hamburg", "km": 6, "tags": ["Cold 2–8 °C", "Bonded"], "rate": 25, "rating": 4.6, "img": "warehouse.jpg"}], "gb": [{"name": "Felixstowe Cold Store", "area": "Port of Felixstowe", "km": 2, "tags": ["Cold 2–8 °C", "Bonded", "24/7"], "rate": 26, "rating": 4.7, "img": "warehouse.jpg"}, {"name": "London Gateway Logistics", "area": "Thurrock, Essex", "km": 8, "tags": ["Ambient", "Bonded"], "rate": 18, "rating": 4.5, "img": "container.jpg"}], "us": [{"name": "NJ Port Cold Storage", "area": "Elizabeth, New Jersey", "km": 6, "tags": ["Cold 2–8 °C", "FDA-registered"], "rate": 28, "rating": 4.6, "img": "warehouse.jpg"}, {"name": "LA Harbor Fresh", "area": "Wilmington, California", "km": 4, "tags": ["Cold 2–8 °C", "Bonded"], "rate": 30, "rating": 4.5, "img": "container.jpg"}]}, "regions": {"ae": "gulf", "sa": "gulf", "qa": "gulf", "sg": "asia", "nl": "eu", "de": "eu", "gb": "eu", "us": "us"}, "popular": {"sea": ["AEJEA", "NLRTM", "SGSIN", "DEHAM", "GBFXT", "USLAX", "SAJED", "QAHMD", "USNYC"], "air": ["DXB", "LHR", "SIN", "FRA", "JFK", "DOH", "AMS", "JED", "LAX"]}, "recent": {"sea": [["AEJEA", "12 Sep 2026"], ["NLRTM", "28 Aug 2026"], ["SAJED", "02 Aug 2026"]], "air": [["DXB", "18 Sep 2026"], ["LHR", "30 Aug 2026"]]}, "saved": [{"label": "Warehouse — Jebel Ali", "name": "Ahmed Al Fahim", "phone": "+971 4 880 1200", "line": "Plot S30210, Jebel Ali Free Zone South", "city": "Dubai", "zip": "17000", "country": "ae", "state": "Dubai", "district": "Jebel Ali"}, {"label": "Head Office", "name": "Procurement Desk", "phone": "+971 4 295 4410", "line": "Office 1204, Al Ghurair Centre, Deira", "city": "Dubai", "zip": "8455", "country": "ae", "state": "Dubai", "district": "Deira"}]};
    var rq = { side: 'out', sides: { 'in': { wh: null, plan: null, truck: null, tdate: null, trip: 'one' }, out: { wh: null, plan: null, truck: null, tdate: null, trip: 'one' } }, truck: null, trip: 'one', tdate: null, plan: null, mode: 'sea', dest: 'ae', load: 1, ready: '2026-10-25', port: null, portC: null, carrier: null, tt: 0, day: 0, sort: 'price', direct: false, wh: null, managed: false, saved: 0, addr: null };
    rq.addr = JSON.parse(JSON.stringify(D.saved[0]));

    function $(id){ return document.getElementById(id); }
    function money(v, d){ return '$' + v.toLocaleString('en-US', { minimumFractionDigits: d == null ? 2 : d, maximumFractionDigits: d == null ? 2 : d }); }
    function usd(v){ return 'USD ' + Math.round(v).toLocaleString('en-US'); }
    function fmt(v){ return v.toLocaleString('en-US', { maximumFractionDigits: 0 }); }
    function esc(v){ return String(v).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function pd(){ if (rq.svc) return svcCargo(); return window.pdSummary ? window.pdSummary() : null; }
    function destBy(code){ return D.dests.filter(function(x){ return x.code === code; })[0]; }
    function dest(){ return destBy(rq.dest); }
    function portDest(){ return destBy(rq.portC || rq.dest); }
    function sea(){ return rq.mode === 'sea'; }
    function origin(){ if (rq.svc && sv.from) return sv.from; var p = pd(), o = D.origins[p ? p.countryCode : 'in'] || D.origins['in']; return sea() ? o.sea : o.air; }
    function loads(){ return sea() ? D.seaLoads : D.airLoads; }
    // container / cargo type is picked automatically from the order weight
    function load(){ if (rq.svc && rq.svc !== 'wh') return svLoad(); var p = pd(), kg = p ? p.kg : 5000; return sea() ? (kg < 8000 ? loads()[0] : kg <= 20000 ? loads()[1] : loads()[2]) : loads()[1]; }
    function carriers(){ return sea() ? D.liners : D.airlines; }
    function addDays(iso, n){ var d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + n); return d; }
    function plusDays(d, n){ var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
    // carrier filters (reference: air cargo filter sheet)
    var DEP = { EK: '18:40', QR: '22:10', AI: '10:30', SQ: '13:20', EY: '06:15', LH: '09:15', MSK: '08:00', MSC: '14:00', ONE: '11:00', CMA: '06:00', HLC: '16:00', EMC: '20:00' };
    var SVC = { EK: ['gen', 'temp', 'dg', 'live', 'val'], QR: ['gen', 'temp', 'dg', 'val'], AI: ['gen', 'temp'], SQ: ['gen', 'temp', 'val'], EY: ['gen', 'temp', 'dg'], LH: ['gen', 'temp', 'dg', 'live'] };
    var SVC_L = [['gen', 'General Cargo'], ['temp', 'Temperature Controlled'], ['dg', 'Dangerous Goods (DG)'], ['live', 'Live Animals'], ['val', 'Valuable Cargo']];
    var flt = { min: null, max: null, car: [], stops: [], dep: 'any', svc: [], arr: null };
    function perKg(price){ var p = pd(); return price / Math.max(p ? p.kg : 5000, 1); }
    function fltCount(){ return (flt.min != null ? 1 : 0) + flt.car.length + flt.stops.length + (flt.dep !== 'any' ? 1 : 0) + flt.svc.length + (flt.arr ? 1 : 0); }
    var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    function dfmt(d){ return d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear(); }
    function dshort(d){ return d.getDate() + ' ' + MON[d.getMonth()]; }
    var CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';
    var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>';
    var PIN = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>';
    var PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>';
    var TRUCK = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="15" height="12" rx="1.5"/><path d="M16 10h4l3 3v5h-7z"/><circle cx="6" cy="19.5" r="1.6"/><circle cx="18.5" cy="19.5" r="1.6"/></svg>';

    // ---------- pricing (sample model) ----------
    function freight(c, d){
      var p = pd(), kg = p ? p.kg : 5000, l = load(), f = (d || portDest())[sea() ? 'seaF' : 'airF'] * c.f;
      if (sea()){
        if (l.perKg) return Math.max(350, kg * l.perKg * f);
        return Math.ceil(kg / l.cap) * l.rate * f;
      }
      return Math.max(kg, 100) * l.perKg * f * (rq.svc ? DAYF[rq.day] || 1 : 1);
    }
    // door-to-door: best carrier rate + customs clearance + last-mile delivery
    function managedPrice(){
      var d = dest(), best = Math.min.apply(null, carriers().map(function(c){ return freight(c, d); }));
      return Math.round(best * 1.05 + (sea() ? 260 : 140) + (sea() ? 220 : 110));
    }
    function managedDays(){ var fast = Math.min.apply(null, carriers().map(function(c){ return c.tt; })); return fast + (sea() ? 6 : 2); }
    function units(){
      var p = pd(), kg = p ? p.kg : 5000, l = load();
      if (sea() && !l.perKg) return Math.ceil(kg / l.cap) + ' × ' + l.short;
      return l.short;
    }
    function addrShort(){ var a = rq.addr; return [a.line, a.district, a.city, a.state !== a.city ? a.state : '', dest().name].filter(Boolean).join(', '); }

    // ---- independent service requests (home header) ----
    D.seaLoads = D.seaLoads.concat([{ name: '20 ft Standard', short: "20' Standard", note: 'Dry · up to 28 t', cap: 28000, rate: 1250 }, { name: '40 ft Standard', short: "40' Standard", note: 'Dry · up to 26.5 t', cap: 26500, rate: 1900 }, { name: '40 ft High Cube', short: "40' HC", note: 'Dry · extra height', cap: 26500, rate: 2000 }]);
    D.airLoads = D.airLoads.concat([{ name: 'Dangerous Goods', short: 'DG cargo', note: 'IATA DGR handling', perKg: 2.1 }]);
    var ORIG_N = { 'in': 'India', pk: 'Pakistan', th: 'Thailand', ph: 'Philippines', mx: 'Mexico', br: 'Brazil', pe: 'Peru', eg: 'Egypt', ke: 'Kenya' };
    var SV_POP = { from: { sea: ['INNSA', 'SGSIN', 'AEJEA', 'NLRTM', 'THLCH', 'DEHAM', 'USLAX', 'PKKHI', 'EGALY'], air: ['BOM', 'SIN', 'DXB', 'LHR', 'BKK', 'FRA', 'JFK', 'KHI', 'CAI'] } };
    var SV_REC = { from: { sea: [['INNSA', '12 Sep 2026'], ['SGSIN', '30 Aug 2026']], air: [['BOM', '18 Sep 2026'], ['DXB', '02 Sep 2026']] } };
    var sv = { mode: 'sea', from: null, fromC: null, to: null, toC: null, load: 3, kg: 5000, cbm: 12, desc: '', pick: 'to' };
    function svcCargo(){ return { kg: rq.svc === 'wh' ? sv.whKg : sv.kg, name: sv.desc || 'General cargo', img: 'assets/images/container.jpg', goods: 0, packCost: 0, packText: '', variety: '', unitPrice: 0, country: '', countryCode: 'in', market: '' }; }
    function svcOn(kind){ rq.svc = kind; document.body.classList.toggle('svc-mode', !!kind); }
    function freshSides(){ rq.side = 'out'; rq.sides = { 'in': { wh: null, plan: null, truck: null, tdate: null, trip: 'one' }, out: { wh: null, plan: null, truck: null, tdate: null, trip: 'one' } }; rq.wh = rq.plan = rq.truck = rq.tdate = null; rq.trip = 'one'; rq.carrier = null; }
    function svPorts(forWhat){
      var key = sv.mode === 'sea' ? 'ports' : 'airports', out = {};
      D.dests.forEach(function(c){ c[key].forEach(function(x){ out[x[0]] = [x, c]; }); });
      if (forWhat === 'from') Object.keys(D.origins).forEach(function(k){ var x = D.origins[k][sv.mode]; out[x[0]] = [x, { code: k, name: '' , origin: true }]; });
      return out;
    }
    function svPortList(){
      var all = svPorts(sv.pick), m = sv.mode, q = ($('rq-port-q').value || '').trim().toLowerCase(), list = [];
      if (portTab === 'popular') list = (sv.pick === 'from' ? SV_POP.from[m] : D.popular[m]).map(function(c){ return all[c] && all[c].concat(['Popular']); });
      else if (portTab === 'recent') list = (sv.pick === 'from' ? SV_REC.from[m] : D.recent[m]).map(function(r){ return all[r[0]] && all[r[0]].concat([null, 'Last used ' + r[1]]); });
      else if (sv.pick === 'from') list = Object.keys(all).filter(function(c){ return all[c][1].origin; }).map(function(c, i){ return all[c].concat([i === 0 ? 'Nearest' : null]); });
      else { var reg = D.regions[sv.toC || 'ae']; list = Object.keys(all).filter(function(c){ return D.regions[all[c][1].code] === reg; }).map(function(c, i){ return all[c].concat([i === 0 ? 'Nearest' : null]); }); }
      var rows = list.filter(Boolean).filter(function(r){ var hay = (r[0][0] + ' ' + r[0][1] + ' ' + r[0][2] + ' ' + r[1].name).toLowerCase(); return !q || hay.indexOf(q) > -1; }).map(function(r, i){
        var x = r[0], c = r[1], cur = (sv.pick === 'from' ? sv.from : sv.to);
        return '<div class="rq-port' + (cur && cur[0] === x[0] ? ' on' : '') + '" data-sv-port="' + x[0] + '"><span class="rqo-img"><img src="assets/images/' + D.portImgs[(m === 'sea' ? 0 : 3) + (i % 3)] + '" alt=""></span>' +
          '<div class="rqo-b"><b>' + x[0] + (r[2] ? '<em>' + r[2] + '</em>' : '') + '</b><span>' + x[1] + '</span><small>' + x[2] + (c.name ? ', ' + c.name : '') + (r[3] ? ' · <i>' + r[3] + '</i>' : '') + '</small></div>' + CHEV + '</div>';
      });
      $('rq-ports').innerHTML = rows.join('') || '<div class="rq-empty">No ' + (m === 'sea' ? 'ports' : 'airports') + ' match your search</div>';
    }
    function svLoad(){ return loads()[sv.load] || loads()[0]; }
    function renderSvFreight(){
      var sea_ = sv.mode === 'sea', L = (sea_ ? D.seaLoads : D.airLoads);
      if ($('sv-title')) $('sv-title').textContent = sea_ ? 'Sea Freight' : 'Air Freight';
      $('sv-hero').src = sea_ ? 'assets/images/hero_sea.jpg' : 'assets/images/hero_air.jpg';
      $('sv-hero-t').textContent = sea_ ? 'Ship anything, anywhere' : 'Fly cargo, faster';
      $('sv-hero-s').textContent = sea_ ? 'Compare live rates from trusted shipping lines' : 'Compare live rates from trusted cargo airlines';
      $('sx-eyebrow').textContent = sea_ ? 'Ocean freight · FCL & LCL' : 'Air freight · General, perishable & DG';
      $('sx-mode-ic').innerHTML = sea_ ? D.icons.ship : D.icons.plane;
      $('sx-st1').textContent = sea_ ? D.liners.length : D.airlines.length; $('sx-st1l').textContent = sea_ ? 'Shipping lines' : 'Cargo airlines';
      document.querySelectorAll('[data-sv-mode]').forEach(function(m){ m.classList.toggle('on', m.dataset.svMode === sv.mode); });
      var noun = sea_ ? 'port' : 'airport';
      $('sv-from').textContent = sv.from ? sv.from[0] : '—'; $('sv-from-s').textContent = sv.from ? sv.from[1] : 'Origin ' + noun;
      $('sv-to').textContent = sv.to ? sv.to[0] : '—'; $('sv-to-s').textContent = sv.to ? sv.to[1] : 'Destination ' + noun; sxExtras();
      $('sv-load-l').textContent = sea_ ? 'Container' : 'Cargo type';
      var order = sea_ ? [3, 4, 5, 1, 2, 0] : [0, 1, 2, 3];
      $('sv-load-sel').innerHTML = order.map(function(i){ var l = L[i]; return '<option value="' + i + '"' + (i === sv.load ? ' selected' : '') + '>' + l.name + ' — ' + l.note + '</option>'; }).join('');
      $('sv-err').textContent = '';
      svhSetPh();
    }
    function renderSvWh(){
      sxWh(); svhSetPh();
      $('sw-country').innerHTML = D.dests.map(function(d){ return '<option value="' + d.code + '"' + (d.code === (sv.whC || 'ae') ? ' selected' : '') + '>' + d.name + '</option>'; }).join('');
    }
    function startWhSearch(type){
      sv.whC = $('sw-country').value; sv.whKg = parseFloat($('sw-kg').value) || 5000;
      if (type) $('sw-type').value = type;
      whf = { type: $('sw-type').value === 'any' ? [] : [$('sw-type').value], temp: $('sw-temp').value, dist: $('sw-dist').value, dur: $('sw-dur').value, unit: $('sw-unit').value };
      freshSides(); setSide('in'); rq.dest = sv.whC; rq.portC = sv.whC; rq.port = destBy(sv.whC).ports[0]; rq.ready = '2026-10-25'; rq.tt = 0; rq.day = 0;
      whTab = 'popular'; renderWh(); goTo('rq-warehouse');
    }
    // review / sent for service requests
    function svReview(){
      var t = svTotals(), body = '';
      ['rv-prod', 'rv-wh', 'rv-tr'].forEach(function(id){ $(id).parentElement.style.display = 'none'; });
      $('rv-ship').parentElement.style.display = '';
      if (rq.svc === 'wh'){
        $('rv-wh').parentElement.style.display = '';
        var x = rq.sides['in'];
        $('rv-wh').innerHTML = kv('Warehouse', x.wh.name) + kv('Location', x.wh.area + ', ' + destBy(rq.dest).name) + kv('Space', fmt(x.plan.pallets) + ' sq.ft · ' + x.plan.days + ' days') +
          kv('Dates', dshort(new Date(x.plan.start + 'T00:00:00')) + ' – ' + dfmt(addDays(x.plan.start, x.plan.days))) + kv('Services', x.plan.svcs.length ? x.plan.svcs.map(function(k){ return WSVC.filter(function(v){ return v[0] === k; })[0][1]; }).join(', ') : 'None') + kv('Cargo weight', fmt(sv.whKg) + ' kg');
        $('rv-ship').parentElement.style.display = 'none';
        $('rv-cost').innerHTML = kv('Storage (est.)', money(t.wh)) + '<div class="kv-row rv-tot"><span class="k">Total (est.)</span><span class="v">' + money(t.total) + '</span></div>';
      } else {
        var dep = addDays(rq.ready, rq.day * (sea() ? 2 : 1)), arr = plusDays(dep, rq.tt);
        body = '<div class="sv-route"><div><b>' + sv.from[0] + '</b><small>' + sv.from[1] + '</small></div><span class="rv-arrow">' + (sea() ? D.icons.ship : D.icons.plane) + '</span><div style="text-align:right"><b>' + sv.to[0] + '</b><small>' + sv.to[1] + '</small></div></div>' +
          kv('Mode', sea() ? 'Sea Freight' : 'Air Freight') + kv(sea() ? 'Shipping line' : 'Airline', rq.carrier.name) + kv(sea() ? 'Container' : 'Cargo type', units()) +
          kv('Cargo', esc(sv.desc || 'General cargo')) + kv('Gross weight', fmt(sv.kg) + ' kg') + kv('Volume', sv.cbm + ' CBM') +
          kv('Departs', dfmt(dep)) + kv('Arrives (est.)', dfmt(arr)) + kv('Transit', rq.tt + (rq.tt === 1 ? ' day' : ' days') + ' · ' + (rq.carrier.direct ? 'Direct' : '1 transshipment'));
        $('rv-ship').innerHTML = body;
        $('rv-cost').innerHTML = kv((sea() ? 'Ocean' : 'Air') + ' freight (est.)', money(t.fr)) + '<div class="kv-row rv-tot"><span class="k">Total (est.)</span><span class="v">' + money(t.total) + '</span></div>';
      }
      $('rv-total').textContent = money(t.total);
      var links = document.querySelectorAll('#screen-rq-review .rv-h a');
      links[1].dataset.goto = 'svc-freight'; links[2].dataset.goto = 'rq-warehouse';
    }
    function svTotals(){ syncSide(); var fr = rq.svc === 'wh' ? 0 : freight(rq.carrier), x = rq.sides['in'], wh = rq.svc === 'wh' && x.wh && x.plan ? planCost(x.wh, x.plan) : 0; return { fr: fr, wh: wh, total: fr + wh }; }
    function svSent(){
      var t = svTotals();
      $('rs-id').textContent = 'SR-20261016-' + (1000 + Math.floor(t.total) % 9000);
      if (rq.svc === 'wh'){
        var x = rq.sides['in'];
        $('rs-card').innerHTML = '<div class="rv-ph"><span class="rqp-img"><img src="assets/images/' + x.wh.img + '" alt=""></span><div class="rqp-b"><b>' + x.wh.name + '</b><small>' + fmt(x.plan.pallets) + ' sq.ft · ' + x.plan.days + ' days</small></div></div>' +
          kv('Location', x.wh.area + ', ' + destBy(rq.dest).name) + kv('From', dfmt(new Date(x.plan.start + 'T00:00:00'))) + '<div class="kv-row rv-tot"><span class="k">Total (est.)</span><span class="v">' + money(t.total) + '</span></div>';
      } else {
        $('rs-card').innerHTML = '<div class="sv-route"><div><b>' + sv.from[0] + '</b><small>' + sv.from[2] + '</small></div><span class="rv-arrow">' + (sea() ? D.icons.ship : D.icons.plane) + '</span><div style="text-align:right"><b>' + sv.to[0] + '</b><small>' + sv.to[2] + '</small></div></div>' +
          kv(sea() ? 'Shipping line' : 'Airline', rq.carrier.name) + kv('Cargo', fmt(sv.kg) + ' kg · ' + esc(sv.desc || 'General cargo')) + '<div class="kv-row rv-tot"><span class="k">Total (est.)</span><span class="v">' + money(t.total) + '</span></div>';
      }
    }

    // ---- modern start pages: recent searches, popular routes, featured warehouses, parallax ----
    var SX_RECENT = { sea: [['INNSA', 'AEJEA'], ['INNSA', 'NLRTM'], ['SGSIN', 'USLAX']], air: [['BOM', 'DXB'], ['BOM', 'LHR'], ['SIN', 'JFK']] };
    var SX_ROUTES = { sea: [['INNSA', 'AEJEA', 'USD 1,250', '6 days', 'hero_sea.jpg'], ['INNSA', 'NLRTM', 'USD 2,900', '24 days', 'port.jpg'], ['SGSIN', 'USLAX', 'USD 2,400', '18 days', 'ship.jpg'], ['THLCH', 'DEHAM', 'USD 2,650', '28 days', 'container.jpg']],
                      air: [['BOM', 'DXB', 'USD 1.15/kg', '1 day', 'hero_air.jpg'], ['BOM', 'LHR', 'USD 2.10/kg', '1 day', 'aircargo.jpg'], ['SIN', 'JFK', 'USD 2.60/kg', '2 days', 'hero_air.jpg'], ['BKK', 'FRA', 'USD 2.25/kg', '1 day', 'aircargo.jpg']] };
    function sxFind(code, forWhat){ var r = svPorts(forWhat)[code]; return r; }
    function sxFill(from, to){
      var f = sxFind(from, 'from'), t = sxFind(to, 'to'); if (!f || !t) return;
      sv.from = f[0]; sv.fromC = f[1].code; sv.to = t[0]; sv.toC = t[1].code; renderSvFreight();
      var c = document.querySelector('#screen-svc-freight .sx-card'); c.classList.remove('pulse'); void c.offsetWidth; c.classList.add('pulse');
    }
    function sxExtras(){
      var m = sv.mode;
      $('sx-recent').innerHTML = SX_RECENT[m].map(function(r){ return '<span class="sx-chip" data-sx-fill="' + r[0] + '|' + r[1] + '">' + CLOCKI + r[0] + ' → ' + r[1] + '</span>'; }).join('');
      $('sx-routes').innerHTML = SX_ROUTES[m].map(function(r){
        return '<div class="sx-rt" data-sx-fill="' + r[0] + '|' + r[1] + '"><img src="assets/images/' + r[4] + '" alt=""><div><b>' + r[0] + ' <i>→</i> ' + r[1] + '</b><small>' + r[3] + ' · from</small><em>' + r[2] + '</em></div></div>';
      }).join('');
    }
    var CLOCKI = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 2"/><circle cx="12" cy="12" r="9"/></svg>';
    function sxWh(){
      var all = allWh().filter(function(x){ return x.c !== 'out'; });
      document.querySelectorAll('[data-sx-count]').forEach(function(e){ var n = all.filter(function(x){ return prof(x.w).type === e.dataset.sxCount; }).length; e.textContent = n + (n === 1 ? ' place' : ' places'); });
      $('sx-feats').innerHTML = all.slice().sort(function(a, b){ return b.w.rating - a.w.rating; }).slice(0, 5).map(function(x){
        return '<div class="sx-ft" data-sx-feat="' + esc(x.w.name) + '"><div class="sx-ft-img"><img src="assets/images/' + x.w.img + '" alt=""><span class="star">' + x.w.rating + '</span></div><b>' + x.w.name + '</b><small>' + x.w.area.split(',').pop().trim() + ', ' + destBy(x.c).name + '</small><em>' + money(sqRate(x.w)) + ' <i>/ sq.ft / wk</i></em></div>';
      }).join('');
    }
    function sxParallax(scrollId, heroId, topId){
      var h = $(heroId), sc = h.closest('.screen-scroll'), top = null, img = h.querySelector('img'), txt = h.querySelector('.sx-hero-t');
      sc.addEventListener('scroll', function(){
        var y = Math.max(0, sc.scrollTop), k = Math.min(y / 220, 1);
        img.style.transform = 'translateY(' + (y * 0.45) + 'px) scale(' + (1.08 - k * 0.12) + ')';
        txt.style.opacity = String(1 - k * 1.2); txt.style.transform = 'translateY(' + (-k * 24) + 'px) scale(' + (1 - k * 0.08) + ')';
      });
    }

    // ---- header search on the service pages: opens the real search page with a bottom-to-top slide ----
    var SLID = {};   // screens opened by sliding up; they slide back down on back
    function slideTo(id){
      var el = $('screen-' + id), prev = document.querySelector('.screen.active'); SLID[id] = true;
      el.classList.remove('sl-down'); el.classList.add('sl-up');
      if (prev) prev.classList.add('sl-under');                        // the page stays put while the search slides over it
      goTo(id);
      setTimeout(function(){ el.classList.remove('sl-up'); if (prev) prev.classList.remove('sl-under'); }, 420);
    }
    function slideBack(){
      var cur = document.querySelector('.screen.active'), id = cur.id.replace('screen-', '');
      if (!SLID[id]) { goBack(); return; }
      delete SLID[id];
      var prev = $('screen-' + stack[stack.length - 2]);
      if (prev) prev.classList.add('sl-under');                       // keep the previous page visible underneath
      cur.classList.add('sl-down');
      setTimeout(function(){ cur.classList.remove('sl-down'); if (prev) prev.classList.remove('sl-under'); goBack(); }, 300);
    }
    function svhOpen(scr){
      if (scr.id === 'screen-svc-wh'){ startWhSearchSlide(); return; }
      sv.pick = 'from'; rq.mode = sv.mode; portTab = 'popular'; $('rq-port-q').value = ''; renderPort();
      slideTo('rq-port');
      setTimeout(function(){ $('rq-port-q').focus(); }, 380);
    }
    function startWhSearchSlide(){
      sv.whC = $('sw-country').value; sv.whKg = parseFloat($('sw-kg').value) || 5000;
      whf = { type: [], temp: 'any', dist: 'any', dur: 'any', unit: 'any' };
      freshSides(); setSide('in'); rq.dest = sv.whC; rq.portC = sv.whC; rq.port = destBy(sv.whC).ports[0]; rq.ready = '2026-10-25'; rq.tt = 0; rq.day = 0;
      whTab = 'popular'; $('wh-q').value = ''; renderWh(); slideTo('rq-warehouse');
      setTimeout(function(){ $('wh-q').focus(); }, 380);
    }
    function svhSetPh(){
      var f = document.querySelector('#screen-svc-freight .svh-in'), w = document.querySelector('#screen-svc-wh .svh-in');
      if (f) f.placeholder = sv.mode === 'sea' ? 'Search ports, cities or countries' : 'Search airports, cities or countries';
      if (w) w.placeholder = 'Search warehouses, cities or types';
    }
    function svhClick(e){
      var t = e.target.closest('.svh');
      if (t){ svhOpen(t.closest('.screen')); return true; }
      return false;
    }
    // back from a slid-up page slides it down (capture phase, before the normal back handler)
    document.addEventListener('click', function(e){
      var b = e.target.closest('[data-back]'); if (!b) return;
      var cur = document.querySelector('.screen.active'); if (!cur || !SLID[cur.id.replace('screen-', '')]) return;
      e.stopPropagation(); e.preventDefault(); slideBack();
    }, true);

    // ======================= warehouse floor map (BookMyShow-style space selection) =======================
    var SP_ROWS = 'ABCDEFGH', SP_COLS = 10, SP_BAY = 20;   // each bay = 20 sq.ft
    var SP_ZONE = function(r){ return r < 3 ? { k: 'cold', n: 'Cold zone · 2–8 °C', m: 1.25 } : r < 6 ? { k: 'std', n: 'Standard zone', m: 1 } : { k: 'amb', n: 'Ambient zone', m: 0.8 }; };
    function spBooked(w, r, c){ var h = 0, s = w.name + r + '-' + c; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997; return h % 10 < 3; }
    function spMul(bays){ if (!bays.length) return 1; return bays.reduce(function(a, b){ return a + SP_ZONE(SP_ROWS.indexOf(b[0])).m; }, 0) / bays.length; }
    function spAuto(w, n){
      // best block: free bays in one row, cold rows first for chilled warehouses
      var order = prof(w).temp === 'chilled' ? [0, 1, 2, 3, 4, 5, 6, 7] : [3, 4, 5, 6, 7, 0, 1, 2], pick = [];
      order.some(function(r){
        for (var c = 1; c <= SP_COLS && pick.length < n; c++) if (!spBooked(w, r, c)) pick.push(SP_ROWS[r] + c);
        return pick.length >= n;
      });
      return pick;
    }
    var spW = null, spSel = [];
    function openSpace(){
      spW = planW; spSel = (plan.bays || []).slice();
      $('sp-wh').textContent = spW.name + ' · ' + dshort(new Date(plan.start + 'T00:00:00')) + ' – ' + dshort(addDays(plan.start, plan.days));
      drawSpace(); goTo('wh-space');
    }
    function drawSpace(){
      var out = '', cur = null;
      for (var r = 0; r < SP_ROWS.length; r++){
        var z = SP_ZONE(r);
        if (!cur || cur.k !== z.k){ cur = z; out += '<div class="sp-zone ' + z.k + '"><span>' + z.n + '</span><em>' + money(sqRate(spW) * z.m) + ' / sq.ft / wk</em></div>'; }
        out += '<div class="sp-row"><i>' + SP_ROWS[r] + '</i>';
        for (var c = 1; c <= SP_COLS; c++){
          var id = SP_ROWS[r] + c, bk_ = spBooked(spW, r, c), on = spSel.indexOf(id) > -1;
          out += '<span class="sp-bay ' + z.k + (bk_ ? ' booked' : on ? ' sel' : '') + '"' + (bk_ ? '' : ' data-sp="' + id + '"') + '>' + (on ? c : '') + '</span>';
          if (c === 5) out += '<b class="sp-aisle"></b>';
        }
        out += '<i>' + SP_ROWS[r] + '</i></div>';
      }
      $('sp-grid').innerHTML = out;
      var sq = spSel.length * SP_BAY, min = prof(spW).min, cost = Math.round(sq * sqRate(spW) * spMul(spSel) / 7 * plan.days);
      $('sp-sum').innerHTML = '<b>' + spSel.length + ' bay' + (spSel.length === 1 ? '' : 's') + ' · ' + fmt(sq) + ' sq.ft</b><small>' + (spSel.length ? spSel.slice().sort().join(', ') : 'Tap bays to select') + '</small>';
      $('sp-cost').textContent = money(cost, 0);
      $('sp-ok').disabled = sq < min;
      $('sp-ok').textContent = sq < min ? 'Min. ' + min + ' sq.ft' : 'Confirm space';
    }

    // ======================= air results, ixigo-style =======================
    var DAYF = [1, 0.94, 1.06, 0.97, 1.12, 0.91, 1.03];
    var DUR = { EK: [3, 10], QR: [7, 25], AI: [3, 20], SQ: [9, 50], EY: [6, 40], LH: [3, 35] };
    var FARES = [['saver', 'Saver', 1, 'Standard handling · Cancellation fee applies'], ['flexi', 'Flexi', 1.12, 'Free date change · Priority uplift'], ['prio', 'Priority', 1.25, 'Guaranteed space · First off-load']];
    var ixOpen = null, ixSort = 'price';
    function hm(t){ return ('0' + t[0]).slice(-2) + ':' + ('0' + t[1]).slice(-2); }
    function arrOf(code){ var d = DEP[code].split(':').map(Number), u = DUR[code], m = d[0] * 60 + d[1] + u[0] * 60 + u[1]; return { t: hm([Math.floor(m / 60) % 24, m % 60]), plus: Math.floor(m / 1440) }; }
    function renderAirIx(){
      document.body.classList.add('ix');
      $('rq-car-title').textContent = 'Select Airline';
      var all = carriers().map(function(c){ return { c: c, price: freight(c), tt: c.tt }; });
      // date strip with the lowest fare of each day
      var days = '', base = Math.min.apply(null, all.map(function(x){ return perKg(x.price) / DAYF[rq.day]; }));
      for (var i = 0; i < 7; i++){ var d = addDays(rq.ready, i); days += '<div class="ix-day' + (i === rq.day ? ' on' : '') + '" data-rq-day="' + i + '"><small>' + ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()] + ', ' + d.getDate() + ' ' + MON[d.getMonth()] + '</small><b>$' + (base * DAYF[i]).toFixed(2) + '</b></div>'; }
      $('rq-days').innerHTML = days;
      var list = all.filter(function(x){
        var c = x.c, k = perKg(x.price), h = parseInt(DEP[c.code], 10);
        if (flt.min != null && (k < flt.min || k > flt.max)) return false;
        if (flt.car.length && flt.car.indexOf(c.code) < 0) return false;
        if (flt.stops.length && flt.stops.indexOf(c.direct ? '0' : '1') < 0) return false;
        if (flt.dep === 'am' && h >= 12 || flt.dep === 'pm' && h < 12) return false;
        if (flt.svc.some(function(v){ return (SVC[c.code] || []).indexOf(v) < 0; })) return false;
        return true;
      });
      var dur = function(c){ return DUR[c.code][0] * 60 + DUR[c.code][1]; };
      list.sort(function(a, b){ return ixSort === 'fast' ? dur(a.c) - dur(b.c) : ixSort === 'early' ? DEP[a.c.code].localeCompare(DEP[b.c.code]) : a.price - b.price; });
      var cheapest = list.length && list.reduce(function(m, x){ return x.price < m.price ? x : m; }), fastest = list.length && list.reduce(function(m, x){ return dur(x.c) < dur(m.c) ? x : m; });
      $('rq-cars').innerHTML = list.map(function(x){
        var c = x.c, a = arrOf(c.code), open = ixOpen === c.code, u = DUR[c.code];
        return '<div class="ix-card' + (open ? ' open' : '') + '" data-ix="' + c.code + '">' +
          '<div class="ix-top"><span class="rqc-logo" style="background:' + c.bg + ';color:' + c.fg + '">' + c.code + '</span><div class="ix-n"><b>' + c.name + '</b><small>' + CX[c.code][0] + ' · ' + CX[c.code][1] + '</small></div>' + '<button class="cart-add" data-cart-add="c|' + c.code + '|' + x.tt + '" title="Add to cart">' + I_ADD + '</button>' +
          (x === cheapest ? '<span class="ix-tag green">Cheapest</span>' : x === fastest ? '<span class="ix-tag">Fastest</span>' : '') + '</div>' +
          '<div class="ix-mid"><div><b>' + DEP[c.code] + '</b><small>' + sv.from[0] + '</small></div><div class="ix-line"><small>' + u[0] + 'h ' + u[1] + 'm</small><i></i><small>' + (c.direct ? 'Non-stop' : '1 stop · ' + c.via) + '</small></div><div style="text-align:right"><b>' + a.t + (a.plus ? '<sup>+' + a.plus + '</sup>' : '') + '</b><small>' + sv.to[0] + '</small></div>' +
          '<div class="ix-p"><b>$' + perKg(x.price).toFixed(2) + '</b><small>/kg · ' + usd(x.price) + '</small></div></div>' +
          '<div class="ix-perks">' + ((SVC[c.code] || []).indexOf('temp') > -1 ? '<span>❄ Cool chain</span>' : '') + (c.direct ? '<span>✓ Free reschedule</span>' : '<span>Transit via ' + c.via + '</span>') + '<span class="ix-more">' + (open ? 'Hide fares ▲' : 'View fares ▼') + '</span></div>' +
          (open ? '<div class="ix-fares">' + FARES.map(function(f){ return '<div class="ix-fare"><div><b>' + f[1] + '</b><small>' + f[3] + '</small></div><div class="ix-fp"><b>' + usd(x.price * f[2]) + '</b><button data-ix-book="' + c.code + '|' + f[0] + '|' + x.tt + '">Book</button></div></div>'; }).join('') + '</div>' : '') +
          '</div>';
      }).join('') || '<div class="rq-empty">No flights match — try another date or clear the filters</div>';
      $('ix-sort').textContent = { price: 'Cheapest', fast: 'Fastest', early: 'Earliest' }[ixSort];
      $('ix-ns').classList.toggle('on', flt.stops.length === 1 && flt.stops[0] === '0');
      $('ix-fc').textContent = fltCount() || '';
    }

    // ======================= full-screen intros (Sea / Air / Warehouse) + Venture Kart splash =======================
    function playIntro(kind){
      var host = $('appBody'), el = document.createElement('div'), title = { sea: 'Sea Freight', air: 'Air Freight', wh: 'Warehousing' }[kind], tag = { sea: 'Oceans of possibility', air: 'Faster than ever', wh: 'Space, perfectly placed' }[kind], art = '';
      if (kind === 'sea') art = '<div class="in-sun"></div><svg class="in-ship" viewBox="0 0 200 80"><g fill="#FFC45C"><rect x="40" y="18" width="16" height="14" rx="1"/><rect x="58" y="18" width="16" height="14" rx="1" fill="#B87D2D"/><rect x="76" y="18" width="16" height="14" rx="1"/><rect x="94" y="18" width="16" height="14" rx="1" fill="#E9D3AE"/><rect x="112" y="18" width="16" height="14" rx="1" fill="#B87D2D"/><rect x="58" y="4" width="16" height="14" rx="1" fill="#E9D3AE"/><rect x="94" y="4" width="16" height="14" rx="1"/><rect x="140" y="6" width="14" height="26" rx="2" fill="#fff"/></g><path d="M20 34h164l-16 26H38z" fill="#fff"/><path d="M28 44h150" stroke="#B87D2D" stroke-width="3"/></svg>' +
        '<div class="in-waves"><svg viewBox="0 0 400 60" preserveAspectRatio="none"><path d="M0 30 Q50 10 100 30 T200 30 T300 30 T400 30 V60 H0Z"/></svg><svg viewBox="0 0 400 60" preserveAspectRatio="none"><path d="M0 30 Q50 50 100 30 T200 30 T300 30 T400 30 V60 H0Z"/></svg></div>';
      if (kind === 'air') art = '<i class="in-cloud c1"></i><i class="in-cloud c2"></i><i class="in-cloud c3"></i><svg class="in-trail" viewBox="0 0 400 400"><path d="M-20 380 Q140 300 420 40"/></svg><svg class="in-plane" viewBox="0 0 24 24"><path fill="#FFC45C" d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>';
      if (kind === 'wh'){ var bx = ''; for (var i = 0; i < 12; i++) bx += '<i style="animation-delay:' + (0.05 * i).toFixed(2) + 's"></i>'; art = '<div class="in-boxes">' + bx + '</div><div class="in-door"></div>'; }
      el.className = 'intro in-' + kind;
      el.innerHTML = art + '<div class="in-t"><small>VENTURE KART</small><b>' + title + '</b><span>' + tag + '</span></div>';
      host.appendChild(el);
      setTimeout(function(){ el.classList.add('out'); }, 1700);
      setTimeout(function(){ el.remove(); }, 2250);
    }
    function playSplash(short){
      var host = $('appBody'), el = document.createElement('div'), word = 'VENTURE KART'.split('').map(function(ch, i){ return '<span style="animation-delay:' + (0.9 + i * 0.05).toFixed(2) + 's">' + (ch === ' ' ? '&nbsp;' : ch) + '</span>'; }).join('');
      el.className = 'splash' + (short ? ' short' : '');
      el.innerHTML = '<div class="sp-glow"></div><svg class="sp-ring" viewBox="0 0 120 120"><circle cx="60" cy="60" r="54"/></svg>' +
        '<div class="sp-logo"><svg viewBox="0 0 64 40" class="sp-crown"><path d="M4 34L10 8l14 14L32 4l8 18L54 8l6 26z"/></svg><b>VK</b></div>' +
        '<div class="sp-word">' + word + '</div><div class="sp-tag">Global B2B trade, simplified</div>';
      host.appendChild(el);
      setTimeout(function(){ el.classList.add('out'); }, short ? 1500 : 2600);
      setTimeout(function(){ el.remove(); }, short ? 2050 : 3150);
    }

    // ---- service bottom nav: Booking · Cart · Chat · Search ----
    var CART = { sea: [], air: [], wh: [] };
    var CHATS = {};
    var I_ADD = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.7 12.4a2 2 0 002 1.6h8.6a2 2 0 002-1.6L22 7H6.2"/><path d="M13 9.5h5M15.5 7v5"/></svg>';
    function navTo(id){
      var cur = document.querySelector('.screen.active').id.replace('screen-', '');
      if (cur === id) return;
      var tabs = ['svc-cart', 'svc-chat', 'svc-bookings'];
      if (tabs.indexOf(cur) > -1 && tabs.indexOf(id) > -1){ stack[stack.length - 1] = id; render(); }   // switch tabs without piling up history
      else goTo(id);
    }
    function navBooking(){
      var st = svStart(), i = stack.lastIndexOf(st);
      if (i > -1){ stack.splice(i + 1); render(); } else goTo(st);
    }
    function cartBadge(){
      var n = CART[svKind()].length;
      document.querySelectorAll('.sv-cartn').forEach(function(e){ e.textContent = n || ''; });
    }
    function toast(msg){
      document.querySelectorAll('.vk-toast').forEach(function(x){ x.remove(); });
      var t = document.createElement('div'); t.className = 'vk-toast'; t.innerHTML = msg; $('appBody').appendChild(t);
      setTimeout(function(){ t.classList.add('out'); }, 1500); setTimeout(function(){ t.remove(); }, 1900);
    }
    function addCarrierToCart(code, tt){
      var k = sv.mode, c = carrierBy(code);
      if (CART[k].some(function(x){ return x.c === code && x.from === sv.from[0] && x.to === sv.to[0] && x.day === rq.day; })){ toast('Already in your cart'); return; }
      CART[k].push({ c: code, tt: tt, from: sv.from[0], to: sv.to[0], fromP: sv.from, toP: sv.to, fromC: sv.fromC, toC: sv.toC, ready: rq.ready, day: rq.day, load: sv.load, kg: sv.kg, cbm: sv.cbm, desc: sv.desc,
        price: freight(c), dep: dfmt(addDays(rq.ready, rq.day * (sea() ? 2 : 1))) });
      cartBadge(); toast(I_ADD + ' Added to cart · ' + c.name);
    }
    function addWhToCart(name){
      var x = whByName(name);
      if (CART.wh.some(function(i){ return i.name === name; })){ toast('Already in your cart'); return; }
      CART.wh.push({ name: name, c: x.c, img: x.w.img, area: x.w.area, rate: sqRate(x.w), type: prof(x.w).type });
      cartBadge(); toast(I_ADD + ' Added to cart · ' + name);
    }
    function renderCart(){
      var k = svKind(), list = CART[k];
      $('cart-kind').textContent = k === 'sea' ? 'Sea freight' : k === 'air' ? 'Air freight' : 'Warehouse';
      $('cart-list').innerHTML = list.map(function(it, i){
        if (k === 'wh') return '<div class="cart-it"><span class="bkl-img"><img src="assets/images/' + it.img + '" alt=""></span><div class="cart-b"><b>' + it.name + '</b><small>' + it.area + ', ' + destBy(it.c).name + ' · ' + it.type + '</small><em>' + money(it.rate) + ' / sq.ft / week</em></div>' +
          '<div class="cart-act"><button class="whc-btn ghost" data-cart-rm="' + i + '">Remove</button><button class="whc-btn" data-cart-book="' + i + '">Book</button></div></div>';
        var c = carrierBy(it.c);
        return '<div class="cart-it"><span class="rqc-logo" style="background:' + c.bg + ';color:' + c.fg + '">' + c.code + '</span><div class="cart-b"><b>' + it.from + ' → ' + it.to + '</b><small>' + c.name + ' · ' + it.dep + ' · ' + it.tt + (it.tt === 1 ? ' day' : ' days') + '</small><em>' + usd(it.price) + '</em></div>' +
          '<div class="cart-act"><button class="whc-btn ghost" data-cart-rm="' + i + '">Remove</button><button class="whc-btn" data-cart-book="' + i + '">Book</button></div></div>';
      }).join('') || '<div class="cart-empty">' + I_ADD + '<b>Your cart is empty</b><small>Tap the cart icon on any ' + (k === 'wh' ? 'warehouse' : k === 'sea' ? 'shipping line' : 'flight') + ' to save it here</small><button class="whc-btn" data-svnav="booking">Start a search</button></div>';
      $('cart-total').innerHTML = list.length && k !== 'wh' ? '<span>' + list.length + ' option' + (list.length === 1 ? '' : 's') + ' saved</span><b>' + usd(list.reduce(function(a, x){ return a + x.price; }, 0)) + '</b>' : '';
      cartBadge();
    }
    function bookFromCart(i){
      var k = svKind(), it = CART[k][i];
      if (k === 'wh'){ $('sw-country').value = it.c; startWhSearch(); openPlan(whByName(it.name).w); return; }
      sv.from = it.fromP; sv.to = it.toP; sv.fromC = it.fromC; sv.toC = it.toC; sv.load = it.load; sv.kg = it.kg; sv.cbm = it.cbm; sv.desc = it.desc;
      rq.mode = sv.mode; rq.ready = it.ready; rq.day = it.day; rq.port = sv.to; rq.portC = sv.toC; rq.dest = sv.toC; rq.fare = 1; rq.fareN = '';
      pickCarrier(it.c, it.tt);
    }
    var CH_SEED = {
      sea: ['Hi! Welcome to the Venture Karts sea freight desk 🚢 How can we help with your shipment today?'],
      air: ['Hi! Welcome to the Venture Karts air cargo desk ✈️ Need help with a flight booking or tracking?'],
      wh: ['Hi! Welcome to the Venture Karts warehousing desk 🏬 Ask us about space, rates or availability.']
    };
    var CH_QUICK = { sea: ['Track my container', 'Change sailing date', 'Reefer requirements', 'Talk to an agent'], air: ['Track my cargo', 'Dangerous goods help', 'Change flight', 'Talk to an agent'], wh: ['Check availability', 'Cold storage rates', 'Extend my storage', 'Talk to an agent'] };
    function renderChat(){
      var k = svKind();
      if (!CHATS[k]) CHATS[k] = CH_SEED[k].map(function(t){ return { me: false, t: t, at: '09:41' }; });
      $('chat-title').textContent = k === 'sea' ? 'Sea freight desk' : k === 'air' ? 'Air cargo desk' : 'Warehousing desk';
      $('chat-body').innerHTML = '<div class="ch-day">Today</div>' + CHATS[k].map(function(m){ return '<div class="ch-m' + (m.me ? ' me' : '') + '"><p>' + esc(m.t) + '</p><small>' + m.at + (m.me ? ' ✓✓' : '') + '</small></div>'; }).join('') + (CHATS[k].typing ? '<div class="ch-m ch-typing"><p><i></i><i></i><i></i></p></div>' : '');
      $('chat-quick').innerHTML = CH_QUICK[k].map(function(q){ return '<span data-chat-q="' + q + '">' + q + '</span>'; }).join('');
      var sc = $('chat-scroll'); sc.scrollTop = sc.scrollHeight;
    }
    function sendChat(text){
      text = (text || '').trim(); if (!text) return;
      var k = svKind(), now = new Date(), at = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
      CHATS[k].push({ me: true, t: text, at: at }); CHATS[k].typing = true; $('chat-in').value = ''; renderChat();
      setTimeout(function(){
        CHATS[k].typing = false;
        var r = /agent/i.test(text) ? 'Connecting you to an agent — Priya from our ' + (k === 'wh' ? 'warehousing' : k) + ' team will join in a moment.' :
          /track/i.test(text) ? 'Sure! Please share your booking ID (it starts with ' + (k === 'wh' ? 'WB' : 'BK') + ') and we\'ll pull up the latest status.' :
          'Thanks for your message! Our team is looking into it and will reply here shortly.';
        CHATS[k].push({ me: false, t: r, at: at }); if (document.querySelector('.screen.active').id === 'screen-svc-chat') renderChat();
      }, 1100);
    }

    // ---- service bookings: Search / Bookings bar, My Bookings, booking flow (Shipment -> Parties -> Review -> Confirmed) ----
    function svKind(){ return rq.svc === 'wh' ? 'wh' : sv.mode; }
    function svStart(){ return rq.svc === 'wh' ? 'svc-wh' : 'svc-freight'; }
    function carrierBy(code){ return D.liners.concat(D.airlines).filter(function(c){ return c.code === code; })[0]; }
    var BOOKINGS = {
      sea: [
        { id: 'BK20261115001', c: 'MSK', from: 'INNSA', to: 'AEJEA', dep: '18 Nov 2026', arr: '24 Nov 2026', units: "2 × 40' HC · FCL", price: 2450, st: 'confirmed' },
        { id: 'BK20261108012', c: 'MSC', from: 'SGSIN', to: 'DEHAM', dep: '20 Nov 2026', arr: '10 Dec 2026', units: "1 × 20' Standard · FCL", price: 1850, st: 'pending' },
        { id: 'BK20261025008', c: 'CMA', from: 'INNSA', to: 'AEJEA', dep: '12 Nov 2026', arr: '18 Nov 2026', units: "1 × 40' HC · FCL", price: 2150, st: 'sent' },
        { id: 'BK20260930004', c: 'HLC', from: 'PKKHI', to: 'NLRTM', dep: '02 Oct 2026', arr: '27 Oct 2026', units: "1 × 40' Standard · FCL", price: 3900, st: 'cancelled' }],
      air: [
        { id: 'BK20261115021', c: 'EK', from: 'BOM', to: 'DXB', dep: '15 Nov 2026', arr: '15 Nov 2026', units: '100 kg · 1.0 CBM', price: 363, st: 'confirmed' },
        { id: 'BK20261102017', c: 'QR', from: 'BOM', to: 'LHR', dep: '04 Nov 2026', arr: '05 Nov 2026', units: '450 kg · 2.6 CBM', price: 1290, st: 'pending' },
        { id: 'BK20261020009', c: 'SQ', from: 'BOM', to: 'SIN', dep: '22 Oct 2026', arr: '23 Oct 2026', units: '220 kg · 1.4 CBM', price: 640, st: 'cancelled' }],
      wh: [
        { id: 'WB20261110006', w: 'JD Cold Hub — Jebel Ali', img: 'warehouse.jpg', loc: 'JAFZA South, Dubai', dep: '10 Nov 2026', arr: '24 Nov 2026', units: '120 sq.ft · 14 days', price: 360, st: 'confirmed' },
        { id: 'WB20261028003', w: 'Rotterdam Fresh Port', img: 'container.jpg', loc: 'Maasvlakte, Rotterdam', dep: '01 Nov 2026', arr: '30 Nov 2026', units: '240 sq.ft · 30 days', price: 2057, st: 'sent' },
        { id: 'WB20260915002', w: 'Gulf Agri Store', img: 'container.jpg', loc: 'Al Quoz Industrial, Dubai', dep: '15 Sep 2026', arr: '22 Sep 2026', units: '60 sq.ft · 7 days', price: 75, st: 'cancelled' }]
    };
    var ST_L = { confirmed: 'Confirmed', pending: 'Pending', sent: 'Request Sent', cancelled: 'Cancelled' }, bklTab = 'all';
    function renderBookings(){
      var k = svKind(), list = BOOKINGS[k].filter(function(b){ return bklTab === 'all' || b.st === bklTab || (bklTab === 'pending' && b.st === 'sent'); });
      $('bkl-kind').textContent = k === 'sea' ? 'Sea freight' : k === 'air' ? 'Air freight' : 'Warehouse';
      document.querySelectorAll('[data-bkl]').forEach(function(t){ t.classList.toggle('on', t.dataset.bkl === bklTab); });
      $('bkl-list').innerHTML = list.map(function(b){
        var c = b.c && carrierBy(b.c), head = c ? '<span class="rqc-logo" style="background:' + c.bg + ';color:' + c.fg + '">' + c.code + '</span>' : '<span class="bkl-img"><img src="assets/images/' + b.img + '" alt=""></span>';
        return '<div class="bkl">' + head + '<div class="bkl-b"><div class="bkl-top"><small>' + b.id + '</small><span class="bkl-st ' + b.st + '">' + ST_L[b.st] + '</span></div>' +
          '<div class="bkl-r">' + (c ? b.from + ' → ' + b.to : '<span style="font-family:Inter,sans-serif;font-size:13.5px">' + b.w + '</span>') + '</div>' +
          (c ? '' : '<div class="bkl-d"><span>' + b.loc + '</span></div>') +
          '<div class="bkl-d"><span>' + (c ? 'Dep ' : 'From ') + b.dep + '</span><span>' + (c ? 'Arr ' : 'To ') + b.arr + '</span></div>' +
          '<div class="bkl-f"><span>' + b.units + '</span><b>USD ' + fmt(b.price) + '</b></div></div></div>';
      }).join('') || '<div class="rq-empty">No bookings here yet</div>';
    }

    // ---- booking form state ----
    var bk = null;
    var PARTY0 = { company: 'Al Fahim Trading LLC', address: 'Plot S30210, Jebel Ali Free Zone South, Dubai, UAE', contact: 'Ahmed Al Fahim', email: 'ahmed@alfahimtrading.ae', code: '+971', phone: '4 880 1200' };
    var WCARGO = ['General cargo', 'Fresh produce (chilled)', 'Frozen goods', 'Pharmaceuticals', 'Hazardous / DG'];
    function bkStart(){
      var k = svKind(), l = load();
      bk = { kind: k, load: sv.load, desc: sv.desc || 'General cargo', kg: k === 'wh' ? sv.whKg : sv.kg, cbm: sv.cbm, spec: '', L: 100, W: 60, H: 60,
        qty: k === 'sea' ? (l.perKg ? 1 : Math.max(1, Math.ceil(sv.kg / l.cap))) : k === 'air' ? Math.max(1, Math.ceil(sv.kg / 50)) : Math.max(1, Math.ceil(sv.whKg / 1000)),
        wcargo: 1, shipper: JSON.parse(JSON.stringify(PARTY0)), same: true, cons: { company: '', address: '', contact: '', email: '', code: '+971', phone: '' } };
      var wh = k === 'wh';
      document.querySelectorAll('.bk-title').forEach(function(t, i){ t.textContent = i === 2 ? 'Review Booking' : wh ? 'Book Storage' : 'Book Shipment'; });
      document.querySelectorAll('[data-bk-l="1"]').forEach(function(e){ e.textContent = wh ? 'Storage' : 'Shipment'; });
      document.querySelectorAll('[data-bk-l="2"]').forEach(function(e){ e.textContent = wh ? 'Customer' : 'Parties'; });
      renderBk1(); goTo('bk-1');
    }
    function fld(id, label, val, type, extra){ return '<label class="bk-f" id="' + id + '-row"><small>' + label + '</small><input id="' + id + '" type="' + (type || 'text') + '" value="' + esc(val == null ? '' : val) + '"' + (extra || '') + '></label>'; }
    function renderBk1(){
      var k = bk.kind, out = '';
      if (k === 'wh'){
        var x = rq.sides['in'];
        out = '<div class="bk-h">Storage Details</div><div class="bk-rv" style="box-shadow:none;background:var(--bg);padding:8px 12px">' + kv('Warehouse', x.wh.name) + kv('Space', fmt(x.plan.pallets) + ' sq.ft') + kv('Dates', dshort(new Date(x.plan.start + 'T00:00:00')) + ' – ' + dfmt(addDays(x.plan.start, x.plan.days)) + ' · ' + x.plan.days + ' days') + '</div>' +
          '<label class="bk-f"><small>Cargo type</small><select id="bk-wcargo">' + WCARGO.map(function(c, i){ return '<option value="' + i + '"' + (i === bk.wcargo ? ' selected' : '') + '>' + c + '</option>'; }).join('') + '</select></label>' +
          '<div class="bk-2c">' + qtyField('Packages / pallets') + fld('bk-kg', 'Total weight (kg)', bk.kg, 'number') + '</div>' +
          '<label class="bk-f" id="bk-desc-row"><small>Cargo description</small><textarea id="bk-desc">' + esc(bk.desc) + '</textarea></label>' +
          fld('bk-spec', 'Special handling (optional)', bk.spec, 'text', ' placeholder="e.g. Keep at 2–8 °C, stack max 2 high"');
      } else {
        var L = k === 'sea' ? D.seaLoads : D.airLoads, order = k === 'sea' ? [3, 4, 5, 1, 2, 0] : [0, 1, 2, 3];
        out = '<div class="bk-h">Shipment Details</div><label class="bk-f"><small>' + (k === 'sea' ? 'Container type' : 'Cargo type') + '</small><select id="bk-load">' + order.map(function(i){ return '<option value="' + i + '"' + (i === bk.load ? ' selected' : '') + '>' + L[i].name + '</option>'; }).join('') + '</select></label>';
        if (k === 'sea') out += qtyField('Quantity (containers)') + '<label class="bk-f" id="bk-desc-row"><small>Cargo description</small><textarea id="bk-desc">' + esc(bk.desc) + '</textarea></label>' +
          '<div class="bk-2c">' + fld('bk-kg', 'Total gross weight (kg)', bk.kg, 'number') + fld('bk-cbm', 'Total volume (CBM)', bk.cbm, 'number') + '</div>';
        else out += '<div class="bk-2c">' + qtyField('Pieces') + fld('bk-kg', 'Total weight (kg)', bk.kg, 'number') + '</div>' + fld('bk-cbm', 'Total volume (CBM)', bk.cbm, 'number') +
          '<small class="bk-sub">Dimensions per piece (cm)</small><div class="bk-3c">' + fld('bk-L', 'Length', bk.L, 'number') + fld('bk-W', 'Width', bk.W, 'number') + fld('bk-H', 'Height', bk.H, 'number') + '</div>' +
          fld('bk-desc', 'Cargo description', bk.desc);
        out += fld('bk-spec', 'Special requirements (optional)', bk.spec, 'text', ' placeholder="e.g. Reefer, dangerous goods, stackable"');
      }
      $('bk1-body').innerHTML = out;
    }
    function qtyField(label){ return '<div class="bk-f"><small>' + label + '</small><div class="pp-step bk-step"><button data-bk-step="-1">−</button><input id="bk-qty" class="num" inputmode="numeric" value="' + bk.qty + '"><button data-bk-step="1">+</button></div></div>'; }
    function readBk1(){
      var v = function(id){ var e = $(id); return e ? e.value : null; };
      if ($('bk-load')) bk.load = +v('bk-load');
      if ($('bk-wcargo')) bk.wcargo = +v('bk-wcargo');
      bk.qty = Math.max(1, parseInt(v('bk-qty'), 10) || 1);
      bk.kg = parseFloat(v('bk-kg')) || 0; if ($('bk-cbm')) bk.cbm = parseFloat(v('bk-cbm')) || 0;
      bk.desc = (v('bk-desc') || '').trim(); bk.spec = (v('bk-spec') || '').trim();
      if ($('bk-L')){ bk.L = +v('bk-L'); bk.W = +v('bk-W'); bk.H = +v('bk-H'); }
      $('bk-kg-row').classList.toggle('err', bk.kg <= 0); $('bk-desc-row').classList.toggle('err', !bk.desc);
      return bk.kg > 0 && !!bk.desc;
    }
    function partyFields(p, pre){
      return fld(pre + 'company', 'Company name', p.company) + fld(pre + 'address', 'Address', p.address) + fld(pre + 'contact', 'Contact person', p.contact) + fld(pre + 'email', 'Email', p.email, 'email') +
        '<div class="bk-f" id="' + pre + 'phone-row"><small>Phone</small><div class="bk-ph"><select id="' + pre + 'code">' + ['+971', '+966', '+974', '+65', '+31', '+49', '+44', '+1', '+91'].map(function(c){ return '<option' + (c === p.code ? ' selected' : '') + '>' + c + '</option>'; }).join('') + '</select><input id="' + pre + 'phone" type="tel" value="' + esc(p.phone) + '"></div></div>';
    }
    function renderBk2(){
      var wh = bk.kind === 'wh';
      $('bk2-body').innerHTML = '<div class="bk-h">' + (wh ? 'Customer Details' : 'Shipper Details') + '</div>' + partyFields(bk.shipper, 'bs-') +
        '<div class="bk-h">' + (wh ? 'Release / Receiving Contact' : 'Consignee Details') + '</div><label class="bk-same"><input type="checkbox" id="bk-same"' + (bk.same ? ' checked' : '') + '>Same as ' + (wh ? 'customer' : 'shipper') + '</label>' +
        '<div id="bk-cons" style="display:' + (bk.same ? 'none' : '') + '">' + partyFields(bk.cons, 'bc-') + '</div>';
    }
    function readParty(pre){ var g = function(f){ return ($(pre + f).value || '').trim(); }; return { company: g('company'), address: g('address'), contact: g('contact'), email: g('email'), code: $(pre + 'code').value, phone: g('phone') }; }
    function readBk2(){
      bk.shipper = readParty('bs-'); bk.same = $('bk-same').checked; if (!bk.same) bk.cons = readParty('bc-');
      var ok = true;
      [['bs-', bk.shipper]].concat(bk.same ? [] : [['bc-', bk.cons]]).forEach(function(x){
        ['company', 'contact', 'phone'].forEach(function(f){ var bad = !x[1][f]; $(x[0] + f + '-row').classList.toggle('err', bad); if (bad) ok = false; });
      });
      return ok;
    }
    function bkCost(){
      if (bk.kind === 'wh'){
        var x = rq.sides['in'], all = planCost(x.wh, x.plan), base = Math.round(x.plan.pallets * sqRate(x.wh) / 7 * x.plan.days);
        return { a: base, b: all - base, total: all, al: 'Storage (' + fmt(x.plan.pallets) + ' sq.ft × ' + x.plan.days + ' days)', bl: 'Handling & services' };
      }
      var c = rq.carrier, l = (bk.kind === 'sea' ? D.seaLoads : D.airLoads)[bk.load], f = portDest()[bk.kind === 'sea' ? 'seaF' : 'airF'] * c.f, fr;
      if (bk.kind === 'sea') fr = l.perKg ? Math.max(350, bk.kg * l.perKg * f) : bk.qty * l.rate * f; else fr = Math.max(bk.kg, 100) * l.perKg * f * (DAYF[rq.day] || 1) * (rq.fare || 1);
      fr = Math.round(fr); var sur = Math.round(fr * (bk.kind === 'sea' ? 0.18 : 0.27));
      return { a: fr, b: sur, total: fr + sur, al: (bk.kind === 'sea' ? 'Ocean freight' : 'Freight charge') + (bk.kind === 'air' ? ' (' + fmt(bk.kg) + ' kg)' : ' (' + bk.qty + ' × ' + l.short + ')'), bl: 'Surcharges & fees' };
    }
    function rvCard(title, edit, body){ return '<div class="bk-rv"><div class="rv-h">' + title + (edit ? ' <a data-goto="' + edit + '">Edit</a>' : '') + '</div>' + body + '</div>'; }
    function renderBk3(){
      var k = bk.kind, c = bkCost(), out = '', party = kv(k === 'wh' ? 'Customer' : 'Shipper', esc(bk.shipper.company)) + kv(k === 'wh' ? 'Release contact' : 'Consignee', esc(bk.same ? bk.shipper.company : bk.cons.company)) + kv('Contact', esc(bk.shipper.contact + ' · ' + bk.shipper.code + ' ' + bk.shipper.phone));
      if (k === 'wh'){
        var x = rq.sides['in'];
        out = rvCard('Warehouse &amp; Dates', 'rq-warehouse', '<div class="bk-car"><span class="rqp-img" style="width:42px;height:42px"><img src="assets/images/' + x.wh.img + '" alt=""></span><b>' + x.wh.name + '</b><em>USD ' + fmt(c.total) + '</em></div>' +
            kv('Location', x.wh.area + ', ' + destBy(rq.dest).name) + kv('From', dfmt(new Date(x.plan.start + 'T00:00:00'))) + kv('To', dfmt(addDays(x.plan.start, x.plan.days))) + kv('Space', fmt(x.plan.pallets) + ' sq.ft') + (x.plan.bays ? kv('Bays', x.plan.bays.slice().sort().join(', ')) : '')) +
          rvCard('Storage Details', 'bk-1', kv('Cargo type', WCARGO[bk.wcargo]) + kv('Packages', bk.qty) + kv('Total weight', fmt(bk.kg) + ' kg') + kv('Description', esc(bk.desc)) + (bk.spec ? kv('Special handling', esc(bk.spec)) : '')) +
          rvCard('Customer', 'bk-2', party);
      } else {
        var r = rq.carrier, dep = addDays(rq.ready, rq.day * (sea() ? 2 : 1)), arr = plusDays(dep, rq.tt), l = (k === 'sea' ? D.seaLoads : D.airLoads)[bk.load];
        out = rvCard('Route &amp; Schedule', 'rq-carrier', '<div class="bk-car"><span class="rqc-logo" style="background:' + r.bg + ';color:' + r.fg + '">' + r.code + '</span><b>' + r.name + '</b><em>USD ' + fmt(c.total) + '</em></div>' +
            '<div class="sv-route"><div><b>' + sv.from[0] + '</b><small>' + sv.from[2] + '</small></div><span class="rv-arrow">' + (sea() ? D.icons.ship : D.icons.plane) + '</span><div style="text-align:right"><b>' + sv.to[0] + '</b><small>' + sv.to[2] + '</small></div></div>' +
            kv('Departs', dfmt(dep) + (sea() ? '' : ' · ' + DEP[r.code])) + kv('Arrives (est.)', dfmt(arr)) + kv('Transit', rq.tt + (rq.tt === 1 ? ' day' : ' days')) + kv('Service', r.direct ? 'Direct' : '1 stop' + (r.via ? ' (' + r.via + ')' : '')) + (rq.fareN ? kv('Fare', rq.fareN) : '')) +
          rvCard('Shipment Details', 'bk-1', (k === 'sea' ? kv('Container', l.perKg ? 'LCL (shared)' : bk.qty + ' × ' + l.short) : kv('Cargo type', l.name) + kv('Total pieces', bk.qty)) +
            kv('Gross weight', fmt(bk.kg) + ' kg') + kv('Volume', bk.cbm + ' CBM') + (k === 'air' ? kv('Dimensions / piece', bk.L + ' × ' + bk.W + ' × ' + bk.H + ' cm') : '') + kv('Description', esc(bk.desc)) + (bk.spec ? kv('Special requirements', esc(bk.spec)) : '')) +
          rvCard('Parties', 'bk-2', party);
      }
      out += rvCard('Cost Summary', '', kv(c.al, 'USD ' + fmt(c.a)) + kv(c.bl, 'USD ' + fmt(c.b)) + '<div class="kv-row rv-tot"><span class="k">Total (est.)</span><span class="v">USD ' + fmt(c.total) + '</span></div>');
      $('bk3-body').innerHTML = out;
      $('bk-agree').checked = false;
    }
    function confirmBk(){
      var k = bk.kind, c = bkCost(), id = (k === 'wh' ? 'WB' : 'BK') + '20261017' + String(100 + BOOKINGS[k].length * 7).slice(-3), rec;
      if (k === 'wh'){
        var x = rq.sides['in'];
        rec = { id: id, w: x.wh.name, img: x.wh.img, loc: x.wh.area, dep: dfmt(new Date(x.plan.start + 'T00:00:00')), arr: dfmt(addDays(x.plan.start, x.plan.days)), units: fmt(x.plan.pallets) + ' sq.ft · ' + x.plan.days + ' days', price: c.total, st: 'pending' };
      } else {
        var dep = addDays(rq.ready, rq.day * (sea() ? 2 : 1)), l = (k === 'sea' ? D.seaLoads : D.airLoads)[bk.load];
        rec = { id: id, c: rq.carrier.code, from: sv.from[0], to: sv.to[0], dep: dfmt(dep), arr: dfmt(plusDays(dep, rq.tt)), units: k === 'sea' ? (l.perKg ? bk.cbm + ' CBM · LCL' : bk.qty + ' × ' + l.short + ' · FCL') : fmt(bk.kg) + ' kg · ' + bk.cbm + ' CBM', price: c.total, st: 'pending' };
      }
      BOOKINGS[k].unshift(rec);
      var head = rec.c ? (function(r){ return '<span class="rqc-logo" style="background:' + r.bg + ';color:' + r.fg + '">' + r.code + '</span><b>' + r.name + '</b>'; })(carrierBy(rec.c)) : '<span class="rqp-img" style="width:42px;height:42px"><img src="assets/images/' + rec.img + '" alt=""></span><b>' + rec.w + '</b>';
      $('bk4-msg').textContent = k === 'wh' ? 'Your storage booking request has been submitted successfully.' : 'Your shipment booking request has been submitted successfully.';
      $('bk4-card').innerHTML = '<div class="rs-meta" style="box-shadow:none;padding:0 0 10px 0;margin:0"><div><small>Booking ID</small><b>' + rec.id + '</b></div><span class="rs-pill">Pending Confirmation</span></div>' +
        '<div class="bk-car">' + head + '</div>' +
        (rec.c ? '<div class="sv-route"><div><b>' + rec.from + '</b><small>' + rec.dep + '</small></div><span class="rv-arrow">' + (sea() ? D.icons.ship : D.icons.plane) + '</span><div style="text-align:right"><b>' + rec.to + '</b><small>' + rec.arr + '</small></div></div>' : kv('Location', rec.loc) + kv('Dates', rec.dep + ' – ' + rec.arr)) +
        kv(rec.c ? 'Cargo' : 'Space', rec.units) + '<div class="kv-row rv-tot"><span class="k">Total (est.)</span><span class="v">USD ' + fmt(rec.price) + '</span></div>';
      $('bk4-note').textContent = 'You will receive an email notification once the ' + (k === 'wh' ? 'warehouse' : k === 'sea' ? 'shipping line' : 'airline') + ' confirms the booking.';
      goTo('bk-4', true);
    }
    // handles clicks for the booking flow; returns true when it did
    function bkClick(e){
      var t;
      if (e.target.closest('[data-svnav-bookings]')) { bklTab = 'all'; renderBookings(); navTo('svc-bookings'); return true; }
      if ((t = e.target.closest('[data-svnav]'))) {
        var v = t.dataset.svnav;
        if (v === 'booking') navBooking();
        else if (v === 'cart'){ renderCart(); navTo('svc-cart'); }
        else if (v === 'chat'){ renderChat(); navTo('svc-chat'); }
        else if (v === 'search'){ svhOpen($('screen-' + svStart())); }
        else if (v === 'bookings'){ bklTab = 'all'; renderBookings(); navTo('svc-bookings'); }
        return true;
      }
      if ((t = e.target.closest('[data-cart-add]'))) { e.stopPropagation(); var pa = t.dataset.cartAdd.split('|'); if (pa[0] === 'wh') addWhToCart(pa[1]); else addCarrierToCart(pa[1], +pa[2]); return true; }
      if ((t = e.target.closest('[data-cart-rm]'))) { CART[svKind()].splice(+t.dataset.cartRm, 1); renderCart(); return true; }
      if ((t = e.target.closest('[data-cart-book]'))) { bookFromCart(+t.dataset.cartBook); return true; }
      if ((t = e.target.closest('[data-chat-q]'))) { sendChat(t.dataset.chatQ); return true; }
      if (e.target.closest('#chat-send')) { sendChat($('chat-in').value); return true; }
      if ((t = e.target.closest('[data-bkl]'))) { bklTab = t.dataset.bkl; renderBookings(); return true; }
      if ((t = e.target.closest('[data-bk-step]'))) { var q = $('bk-qty'); q.value = Math.max(1, (parseInt(q.value, 10) || 1) + (+t.dataset.bkStep)); return true; }
      if (e.target.closest('#bk1-next')) { if (readBk1()){ if (bk.kind !== 'wh'){ sv.kg = bk.kg; sv.load = bk.load; } renderBk2(); goTo('bk-2'); } return true; }
      if (e.target.closest('#bk2-next')) { if (readBk2()){ renderBk3(); goTo('bk-3'); } return true; }
      if (e.target.closest('#bk-confirm')) {
        if (!$('bk-agree').checked){ $('bk-agree-row').classList.add('shake'); setTimeout(function(){ $('bk-agree-row').classList.remove('shake'); }, 500); return true; }
        confirmBk(); return true;
      }
      if (e.target.closest('#bk4-view')) { stack = ['home', svStart()]; bklTab = 'all'; renderBookings(); goTo('svc-bookings'); return true; }
      return false;
    }
    function bkInit(){
      // static active tab per screen
      document.querySelectorAll('#screen-svc-freight [data-svnav="booking"], #screen-svc-wh [data-svnav="booking"], #screen-svc-bookings [data-svnav="booking"], #screen-svc-cart [data-svnav="cart"], #screen-svc-chat [data-svnav="chat"]').forEach(function(x){ x.classList.add('on'); });
      $('chat-in').addEventListener('keydown', function(e){ if (e.key === 'Enter') sendChat(this.value); });
      // big hero shrinks as the page scrolls
      ['sv-hero-box', 'sw-hero-box'].forEach(function(id){
        var h = $(id), sc = h && h.closest('.screen-scroll'); if (!sc) return;
        sc.addEventListener('scroll', function(){ if (sc.scrollTop > 60) h.classList.add('mini'); else if (sc.scrollTop < 12) h.classList.remove('mini'); });
      });
      document.addEventListener('change', function(e){ if (e.target.id === 'bk-same'){ $('bk-cons').style.display = e.target.checked ? 'none' : ''; } });
    }

    // ---------- step 1: shipping + delivery address ----------
    function renderSaved(){
      $('rq-saved').innerHTML = D.saved.map(function(a, i){
        return '<span class="rq-sv' + (rq.saved === i ? ' on' : '') + '" data-rq-saved="' + i + '">' + PIN + esc(a.label) + '</span>';
      }).join('') + '<span class="rq-sv' + (rq.saved === -1 ? ' on' : '') + '" data-rq-saved="-1">' + PLUS + 'New address</span>';
    }
    function fillForm(){
      var a = rq.addr, d = dest();
      $('rq-a-flag').src = 'assets/images/flags/' + d.code + '.png';
      $('rq-a-country').textContent = d.name;
      $('rq-a-name').value = a.name || ''; $('rq-a-phone').value = a.phone || ''; $('rq-a-line').value = a.line || '';
      $('rq-a-city').value = a.city || ''; $('rq-a-zip').value = a.zip || ''; $('rq-a-state').value = a.state || ''; $('rq-a-district').value = a.district || '';
      ['rq-a-line-row', 'rq-a-city-row'].forEach(function(id){ $(id).classList.remove('err'); });
    }
    function renderVK(){
      $('rq-vk').classList.toggle('on', rq.managed);
      $('rq-vk-in').checked = rq.managed;
      $('rq-vk-p').textContent = money(managedPrice(), 0);
      $('rq-vk-s').textContent = 'Door-to-door ' + (sea() ? 'by sea' : 'by air') + ' · freight, customs clearance & delivery to ' + (rq.addr.city || 'your address') + ' in ~' + managedDays() + ' days';
      $('rq-next-1').textContent = rq.managed ? 'Review quotation' : (sea() ? 'Select destination port' : 'Select destination airport');
    }
    function renderShip(){
      var p = pd();
      if (p){
        $('rq-prod').innerHTML = '<span class="rqp-img"><img src="' + p.img + '" alt=""></span><div class="rqp-b"><b>' + p.name + '</b><small>' + fmt(p.kg) + ' kg · ' + (p.packText || 'No packaging') + '</small></div><div class="rqp-p"><b>' + money(p.goods + p.packCost) + '</b><small>product + packing</small></div>';
      }
      document.querySelectorAll('.rq-mode').forEach(function(m){ m.classList.toggle('on', m.dataset.mode === rq.mode); });
      $('rq-hero').src = sea() ? 'assets/images/ship.jpg' : 'assets/images/aircargo.jpg';
      $('rq-hero-t').textContent = sea() ? 'Sea Freight' : 'Air Freight';
      $('rq-hero-s').textContent = sea() ? 'Most economical for bulk orders · 12–30 days' : 'Fastest for perishables · 1–3 days';
      renderSaved(); fillForm();
      renderVK();
    }
    function readForm(){
      rq.addr.name = $('rq-a-name').value.trim(); rq.addr.phone = $('rq-a-phone').value.trim();
      rq.addr.line = $('rq-a-line').value.trim(); rq.addr.city = $('rq-a-city').value.trim(); rq.addr.zip = $('rq-a-zip').value.trim(); rq.addr.state = $('rq-a-state').value.trim(); rq.addr.district = $('rq-a-district').value.trim();
    }
    function validAddr(){
      readForm();
      var bad = [];
      if (!rq.addr.line) bad.push('rq-a-line-row');
      if (!rq.addr.city) bad.push('rq-a-city-row');
      ['rq-a-line-row', 'rq-a-city-row'].forEach(function(id){ $(id).classList.toggle('err', bad.indexOf(id) > -1); });
      if (bad.length){ $(bad[0]).scrollIntoView({ behavior: 'smooth', block: 'center' }); $(bad[0]).querySelector('input').focus(); }
      return !bad.length;
    }

    // ---------- step 2: port / airport (Popular · Nearby · Recent) ----------
    var portTab = 'popular';
    function allPorts(){
      var key = sea() ? 'ports' : 'airports', out = {};
      D.dests.forEach(function(c){ c[key].forEach(function(x){ out[x[0]] = [x, c]; }); });
      return out;
    }
    function portList(){
      if (rq.svc) return svPortList();
      var all = allPorts(), mode = sea() ? 'sea' : 'air', q = ($('rq-port-q').value || '').trim().toLowerCase(), list = [];
      if (portTab === 'popular') list = D.popular[mode].map(function(code){ return all[code] && all[code].concat(['Popular']); });
      else if (portTab === 'recent') list = D.recent[mode].map(function(r){ return all[r[0]] && all[r[0]].concat([null, 'Last used ' + r[1]]); });
      else {
        var region = D.regions[rq.dest];
        Object.keys(all).forEach(function(code){ var r = all[code]; if (r[1].code === rq.dest) list.push(r.concat([null, null])); });
        if (list.length) list[0][2] = 'Nearest';
        Object.keys(all).forEach(function(code){ var r = all[code]; if (r[1].code !== rq.dest && D.regions[r[1].code] === region) list.push(r.concat([null, 'Same region'])); });
      }
      var rows = [];
      list.filter(Boolean).forEach(function(r, i){
        var x = r[0], c = r[1], hay = (x[0] + ' ' + x[1] + ' ' + x[2] + ' ' + c.name).toLowerCase();
        if (q && hay.indexOf(q) < 0) return;
        rows.push('<div class="rq-port' + (rq.port && rq.port[0] === x[0] ? ' on' : '') + '" data-rq-port="' + x[0] + '" data-rq-pc="' + c.code + '"><span class="rqo-img"><img src="assets/images/' + D.portImgs[(sea() ? 0 : 3) + (i % 3)] + '" alt=""></span>' +
          '<div class="rqo-b"><b>' + x[0] + (r[2] ? '<em>' + r[2] + '</em>' : '') + '</b><span>' + x[1] + '</span><small>' + x[2] + ', ' + c.name + (r[3] ? ' · <i>' + r[3] + '</i>' : '') + '</small></div>' + CHEV + '</div>');
      });
      $('rq-ports').innerHTML = rows.join('') || '<div class="rq-empty">' + (portTab === 'recent' && !q ? 'No recent ' + (sea() ? 'ports' : 'airports') + ' yet' : 'No ' + (sea() ? 'ports' : 'airports') + ' match your search') + '</div>';
    }
    function renderPort(){
      $('rq-port-title').textContent = (rq.svc && sv.pick === 'from' ? 'Select Origin ' : 'Select Destination ') + (sea() ? 'Port' : 'Airport');
      $('rq-port-q').placeholder = sea() ? 'Search port, city or country' : 'Search airport, city or country';
      document.querySelectorAll('[data-rq-ptab]').forEach(function(t){ t.classList.toggle('on', t.dataset.rqPtab === portTab); });
      portList();
    }

    // ---------- step 3: liner / airline ----------
    function renderCarrier(){
      if (rq.svc && !sea()) return renderAirIx();
      document.body.classList.remove('ix');
      var list = carriers().slice();
      $('rq-car-title').textContent = sea() ? 'Select Shipping Line' : 'Select Airline';
      var days = '';
      for (var i = 0; i < 5; i++){ var d = addDays(rq.ready, i * (sea() ? 2 : 1)); days += '<div class="rq-day' + (i === rq.day ? ' on' : '') + '" data-rq-day="' + i + '"><b>' + d.getDate() + '</b><small>' + MON[d.getMonth()] + '</small></div>'; }
      $('rq-days').innerHTML = days;
      document.querySelectorAll('[data-rq-sort]').forEach(function(s){ s.classList.toggle('on', s.dataset.rqSort === rq.sort); });
      $('rq-sort-name').textContent = sea() ? 'Shipping line' : 'Airline';
      list = list.map(function(c){ return { c: c, price: freight(c), tt: c.tt + (rq.day % 2 && !c.direct ? 1 : 0) }; });
      list = list.filter(function(x){
        var c = x.c, k = perKg(x.price), h = parseInt(DEP[c.code], 10);
        if (flt.min != null && (k < flt.min || k > flt.max)) return false;
        if (flt.car.length && flt.car.indexOf(c.code) < 0) return false;
        if (!sea() && flt.stops.length && flt.stops.indexOf(c.direct ? '0' : '1') < 0) return false;
        if (sea() && flt.arr && plusDays(addDays(rq.ready, rq.day * 2), x.tt) > new Date(flt.arr + 'T23:59:59')) return false;
        if (flt.dep === 'am' && h >= 12 || flt.dep === 'pm' && h < 12) return false;
        if (!sea() && flt.svc.some(function(v){ return (SVC[c.code] || []).indexOf(v) < 0; })) return false;
        return true;
      });
      list.sort(function(a, b){ return rq.sort === 'fast' ? a.tt - b.tt : rq.sort === 'name' ? a.c.name.localeCompare(b.c.name) : a.price - b.price; });
      $('rq-fcount').textContent = fltCount() || ''; $('rq-fbtn').classList.toggle('on', fltCount() > 0);
      var dep = addDays(rq.ready, rq.day * (sea() ? 2 : 1));
      $('rq-cars').innerHTML = list.map(function(x){
        var c = x.c, arr = plusDays(dep, x.tt);
        return '<div class="rq-car' + (rq.carrier && rq.carrier.code === c.code ? ' on' : '') + '">' +
          '<div class="rqc-top"><span class="rqc-logo" style="background:' + c.bg + ';color:' + c.fg + '">' + c.code + '</span><div class="rqc-n"><b>' + c.name + '</b><small>' + (c.direct ? 'Direct' : '1 transshipment' + (c.via ? ' · via ' + c.via : '')) + '</small></div>' +
          '<div class="rqc-p"><b>' + (sea() ? usd(x.price) : 'USD ' + perKg(x.price).toFixed(2)) + '</b><small>' + (sea() ? 'Freight (est.)' : 'per kg (est.) · ' + usd(x.price)) + '</small></div></div>' +
          '<div class="rqc-mid"><div><small>Departs</small><b>' + dshort(dep) + (sea() ? '' : ' ' + DEP[c.code]) + '</b></div><div class="rqc-line"><span></span><em>' + x.tt + (x.tt === 1 ? ' day' : ' days') + '</em><span></span></div><div><small>Arrives</small><b>' + dshort(arr) + '</b></div></div>' +
          '<div class="rqc-foot">' + (rq.svc ? '<button class="cart-add" data-cart-add="c|' + c.code + '|' + x.tt + '" title="Add to cart">' + I_ADD + '</button>' : '') + (c.tag ? '<span class="rqc-tag gold">' + c.tag + '</span>' : '') + '<button class="rqc-sel ghost" data-rq-cdetail="' + c.code + '" data-rq-tt="' + x.tt + '">Details</button><button class="rqc-sel" data-rq-carrier="' + c.code + '" data-rq-tt="' + x.tt + '">' + (rq.svc ? 'Book' : 'Select') + '</button></div></div>';
      }).join('') || '<div class="rq-empty">No services match' + (fltCount() ? ' your filters — try another date or reset the filters' : ' on this date — try another day') + '</div>';
    }

    // ---------- filter sheet ----------
    var fd = null, RANGE = [0, 1];
    function openFilter(){
      var ks = carriers().map(function(c){ return perKg(freight(c)); });
      RANGE = [Math.floor(Math.min.apply(null, ks) * 20) / 20, Math.ceil(Math.max.apply(null, ks) * 20) / 20];
      fd = JSON.parse(JSON.stringify(flt));
      drawFilter(); $('rq-filter').classList.add('open');
    }
    function chk(group, val, label, on){ return '<label class="fchk"><input type="checkbox" data-fg="' + group + '" value="' + val + '"' + (on ? ' checked' : '') + '><span></span>' + label + '</label>'; }
    function drawFilter(){
      var lo = fd.min != null ? fd.min : RANGE[0], hi = fd.max != null ? fd.max : RANGE[1];
      $('rq-f-carl').textContent = sea() ? 'Shipping lines' : 'Airlines';
      $('rq-f-range').innerHTML = '<div class="frng"><input type="range" id="rq-f-lo" min="' + RANGE[0] + '" max="' + RANGE[1] + '" step="0.01" value="' + lo + '"><input type="range" id="rq-f-hi" min="' + RANGE[0] + '" max="' + RANGE[1] + '" step="0.01" value="' + hi + '"></div><div class="frng-v"><span id="rq-f-lov">' + lo.toFixed(2) + '</span><span id="rq-f-hiv">' + hi.toFixed(2) + '</span></div>';
      $('rq-f-car').innerHTML = carriers().map(function(c){ return chk('car', c.code, c.name, fd.car.indexOf(c.code) > -1); }).join('');
      $('rq-f-stops').innerHTML = [['0', 'Direct'], ['1', '1 Stop'], ['2', '2+ Stops']].map(function(x){ return chk('stops', x[0], x[1], fd.stops.indexOf(x[0]) > -1); }).join('');
      document.querySelectorAll('[data-fdep]').forEach(function(b){ b.classList.toggle('on', b.dataset.fdep === fd.dep); });
      $('rq-f-svc').innerHTML = SVC_L.map(function(x){ return chk('svc', x[0], x[1], fd.svc.indexOf(x[0]) > -1); }).join('');
      $('rq-f-aironly').style.display = sea() ? 'none' : '';
      $('rq-f-stopwrap').style.display = sea() ? 'none' : '';
      $('rq-f-seaonly').style.display = sea() ? '' : 'none';
      $('rq-f-arr').min = rq.ready; $('rq-f-arr').value = fd.arr || '';
      ['rq-f-lo', 'rq-f-hi'].forEach(function(id){ $(id).addEventListener('input', function(){
        var a = +$('rq-f-lo').value, b = +$('rq-f-hi').value;
        if (a > b){ if (id === 'rq-f-lo') $('rq-f-lo').value = a = b; else $('rq-f-hi').value = b = a; }
        $('rq-f-lov').textContent = a.toFixed(2); $('rq-f-hiv').textContent = b.toFixed(2);
      }); });
    }
    function readFilter(){
      var a = +$('rq-f-lo').value, b = +$('rq-f-hi').value;
      fd.min = a > RANGE[0] || b < RANGE[1] ? a : null; fd.max = fd.min != null ? b : null;
      fd.arr = sea() ? ($('rq-f-arr').value || null) : null;
      ['car', 'stops', 'svc'].forEach(function(g){ fd[g] = [].slice.call(document.querySelectorAll('[data-fg="' + g + '"]:checked')).map(function(i){ return i.value; }); });
    }

    function pickCarrier(code, tt){
      rq.carrier = carriers().filter(function(x){ return x.code === code; })[0]; rq.tt = tt;
      if (rq.svc){ bkStart(); return; }
      whTab = 'popular'; setSide('in'); if (rq.wh && rq.plan) rq.plan.start = rq.plan.start < arrivalIso() ? arrivalIso() : rq.plan.start; setSide('out'); renderWh(); goTo('rq-warehouse');
    }
    // ---------- carrier company profiles ----------
    var CN = { ae:'UAE', sa:'Saudi Arabia', qa:'Qatar', om:'Oman', sg:'Singapore', nl:'Netherlands', de:'Germany', gb:'United Kingdom', us:'United States', in:'India', cn:'China', jp:'Japan', kr:'South Korea', br:'Brazil', mx:'Mexico', za:'South Africa', eg:'Egypt', ke:'Kenya', es:'Spain', fr:'France', it:'Italy', tr:'Türkiye', au:'Australia', lk:'Sri Lanka', my:'Malaysia', vn:'Vietnam', th:'Thailand', id:'Indonesia', pk:'Pakistan', bd:'Bangladesh', ma:'Morocco', ng:'Nigeria', gh:'Ghana', cl:'Chile', pe:'Peru', co:'Colombia', ca:'Canada', nz:'New Zealand', gr:'Greece', pl:'Poland' };
    var CPORT = { ae:['Jebel Ali','Khalifa'], sa:['Jeddah','Dammam'], qa:['Hamad'], om:['Salalah','Sohar'], sg:['Singapore'], nl:['Rotterdam'], de:['Hamburg','Bremerhaven'], gb:['Felixstowe','London Gateway','Southampton'], us:['New York','Los Angeles','Savannah','Houston'], in:['Nhava Sheva','Mundra','Chennai'], cn:['Shanghai','Ningbo','Shenzhen'], jp:['Tokyo','Yokohama'], kr:['Busan'], br:['Santos'], mx:['Manzanillo'], za:['Durban'], eg:['Port Said'], ke:['Mombasa'], es:['Valencia','Algeciras'], fr:['Le Havre'], it:['Genoa'], tr:['Mersin'], au:['Melbourne','Sydney'], lk:['Colombo'], my:['Port Klang','Tanjung Pelepas'], vn:['Cai Mep'], th:['Laem Chabang'], id:['Tanjung Priok'], pk:['Karachi'], bd:['Chittagong'], ma:['Tanger Med'], ng:['Lagos'], gh:['Tema'], cl:['San Antonio'], pe:['Callao'], co:['Cartagena'], ca:['Vancouver','Montreal'], nz:['Auckland'], gr:['Piraeus'], pl:['Gdańsk'] };
    var CAIR = { ae:['DXB','DWC','AUH'], sa:['JED','RUH','DMM'], qa:['DOH'], om:['MCT'], sg:['SIN'], nl:['AMS'], de:['FRA','MUC','LEJ'], gb:['LHR','MAN'], us:['JFK','LAX','ORD','MIA'], in:['BOM','DEL','BLR','MAA'], cn:['PVG','CAN','PEK'], jp:['NRT','KIX'], kr:['ICN'], br:['GRU','VCP'], mx:['MEX'], za:['JNB'], eg:['CAI'], ke:['NBO'], es:['MAD'], fr:['CDG'], it:['MXP'], tr:['IST'], au:['SYD','MEL'], lk:['CMB'], my:['KUL'], vn:['SGN','HAN'], th:['BKK'], id:['CGK'], pk:['KHI','LHE'], bd:['DAC'], ma:['CMN'], ng:['LOS'], gh:['ACC'], cl:['SCL'], pe:['LIM'], co:['BOG'], ca:['YYZ','YVR'], nz:['AKL'], gr:['ATH'], pl:['WAW'] };
    var ALLC = Object.keys(CN);
    function pickC(home, n, seed){ var o = [home], i = seed; while (o.length < n){ var k = ALLC[i % ALLC.length]; if (o.indexOf(k) < 0) o.push(k); i += 7; } return o; }
    var CO = {
      MSK:{ hq:'dk', hqN:'Copenhagen, Denmark', yr:1904, fleet:'670+ vessels', cap:'4.3M TEU', about:'Integrated container logistics company connecting ports, terminals and inland transport across 130 countries.', vs:['Mærsk Mc-Kinney Møller','Madrid Mærsk','Maersk Eindhoven','Gerd Mærsk','Ane Mærsk','Maersk Hangzhou','Sealand Michigan','Maersk Kampala','Laura Mærsk','Maersk Line Vigo'], nc:36, ok:97.8, cl:14 },
      MSC:{ hq:'ch', hqN:'Geneva, Switzerland', yr:1970, fleet:'850+ vessels', cap:'6.4M TEU', about:'The world\'s largest container shipping line by capacity, serving 520 ports on 300 trade routes.', vs:['MSC Irina','MSC Loreto','MSC Gülsün','MSC Tessa','MSC Aurora','MSC Mia','MSC Sixin','MSC Paloma','MSC Nela','MSC Celestino'], nc:40, ok:95.2, cl:18 },
      ONE:{ hq:'sg', hqN:'Singapore', yr:2017, fleet:'240+ vessels', cap:'1.9M TEU', about:'Joint venture of NYK, MOL and K Line offering global container services with a modern magenta fleet.', vs:['ONE Innovation','ONE Infinity','ONE Harmony','ONE Triumph','ONE Apus','ONE Olympus','ONE Stork','ONE Minato'], nc:30, ok:96.4, cl:15 },
      CMA:{ hq:'fr', hqN:'Marseille, France', yr:1978, fleet:'650+ vessels', cap:'3.7M TEU', about:'Global shipping and logistics group running LNG-powered mega-ships and 420 port calls worldwide.', vs:['CMA CGM Jacques Saadé','CMA CGM Palais Royal','CMA CGM Tage','CMA CGM Trocadéro','CMA CGM Antoine de Saint Exupéry','CMA CGM Marco Polo','APL Raffles','CMA CGM Louvre','CMA CGM Rivoli'], nc:38, ok:96.9, cl:16 },
      HLC:{ hq:'de', hqN:'Hamburg, Germany', yr:1847, fleet:'290+ vessels', cap:'2.1M TEU', about:'German liner known for reefer expertise and quality ratings, operating 130+ liner services.', vs:['Berlin Express','Hamburg Express','Al Zubara','Sajir','Tsingtao Express','Barzan','Kiel Express','Leverkusen Express'], nc:32, ok:97.1, cl:12 },
      EMC:{ hq:'tw', hqN:'Taipei, Taiwan', yr:1968, fleet:'210+ vessels', cap:'1.7M TEU', about:'Taiwan-based carrier with a young, green fleet covering Asia, Europe, the Americas and the Middle East.', vs:['Ever Ace','Ever Given','Ever Lunar','Ever Alot','Ever Golden','Ever Greet','Ever Lasting','Ever Apex'], nc:28, ok:94.6, cl:20 },
      EK:{ hq:'ae', hqN:'Dubai, UAE', yr:1985, fleet:'11 freighters + 250 bellies', cap:'2.2M t/yr', hub:'DXB', about:'Cargo division of Emirates, flying to 140+ destinations via the Dubai hub with dedicated cool-chain handling.', nc:38, ok:98.1, cl:10, frag:true, mx:'3,000 kg/piece' },
      QR:{ hq:'qa', hqN:'Doha, Qatar', yr:2003, fleet:'30+ freighters', cap:'2.5M t/yr', hub:'DOH', about:'One of the largest cargo airlines, connecting 170+ destinations through Hamad International.', nc:40, ok:97.6, cl:12, frag:true, mx:'4,000 kg/piece' },
      AI:{ hq:'in', hqN:'Mumbai, India', yr:1932, fleet:'120+ bellies', cap:'0.4M t/yr', hub:'BOM', about:'India\'s flag carrier cargo arm, strong on perishables and pharma out of Mumbai and Delhi.', nc:24, ok:93.9, cl:21, frag:false, mx:'1,500 kg/piece' },
      SQ:{ hq:'sg', hqN:'Singapore', yr:2001, fleet:'7 freighters + 180 bellies', cap:'1.2M t/yr', hub:'SIN', about:'Singapore Airlines\' cargo arm with IATA CEIV-certified pharma and fresh produce handling.', nc:30, ok:97.9, cl:9, frag:true, mx:'3,500 kg/piece' },
      EY:{ hq:'ae', hqN:'Abu Dhabi, UAE', yr:2004, fleet:'5 freighters + 80 bellies', cap:'0.7M t/yr', hub:'AUH', about:'Abu Dhabi-based cargo airline with specialist products for fresh, pharma and valuables.', nc:26, ok:96.2, cl:14, frag:true, mx:'2,500 kg/piece' },
      LH:{ hq:'de', hqN:'Frankfurt, Germany', yr:1994, fleet:'17 freighters + 300 bellies', cap:'1.6M t/yr', hub:'FRA', about:'Europe\'s leading cargo airline, operating the Frankfurt Cool Center and Live Animal Lounge.', nc:34, ok:97.3, cl:11, frag:true, mx:'4,500 kg/piece' }
    };
    var VTYPE = ['ULCV · 24,000 TEU', 'Neo-Panamax · 15,000 TEU', 'Post-Panamax · 10,000 TEU', 'Reefer-ready · 8,500 TEU', 'Feeder · 2,500 TEU'];
    function flagI(k){ return ['dk','ch','tw'].indexOf(k) > -1 ? '<span class="cx-nf">' + k.toUpperCase() + '</span>' : '<img src="assets/images/flags/' + k + '.png" alt="">'; }
    function cxSec(t, body, n){ return '<div class="cx-sec' + (n ? ' cx-lim' : '') + '"><h5>' + t + '</h5>' + body + (n ? '<button class="cx-more" data-cx-more>View more (' + n + ')</button>' : '') + '</div>'; }
    function cxChips(a){ return '<div class="cx-chips">' + a.map(function(x){ return '<span>' + x + '</span>'; }).join('') + '</div>'; }
    function cxRing(p, lbl, sub){ return '<div class="cx-ring"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.9" fill="none" stroke="#EEE6D8" stroke-width="3.4"/><circle cx="18" cy="18" r="15.9" fill="none" stroke="#B87D2D" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="' + p + ' 100" transform="rotate(-90 18 18)"/></svg><b>' + p + '%</b></div><div class="cx-rt"><b>' + lbl + '</b><small>' + sub + '</small></div>'; }
    function drawCompany(c){
      var o = CO[c.code], isSea = sea(), seed = c.code.charCodeAt(0) + c.code.charCodeAt(1), cs = pickC({ dk:'nl', ch:'it', tw:'sg' }[o.hq] || o.hq, o.nc, seed), out = '';
      out += '<div class="cx-ov"><p>' + o.about + '</p><div class="cx-stats"><span><b>' + o.yr + '</b><small>Founded</small></span><span><b>' + o.fleet.split(' ')[0] + '</b><small>' + (isSea ? 'Vessels' : 'Fleet') + '</small></span><span><b>' + o.cap.split(' ')[0] + '</b><small>' + (isSea ? 'TEU capacity' : 'Tonnes / yr') + '</small></span><span><b>' + o.nc + '</b><small>Countries</small></span></div>' +
        '<div class="cx-hq">' + flagI(o.hq) + '<div><small>Headquarters</small><b>' + o.hqN + '</b></div></div></div>';
      var ok = cxRing(o.ok, 'Average success rate', (isSea ? 'Shipments delivered on schedule & damage-free' : 'On-time, damage-free deliveries') + ' · last 12 months');
      var ins = '<div class="cx-ins">' + [['Basic carrier liability', isSea ? 'Up to USD 2 per kg (Hague-Visby)' : 'Up to 22 SDR per kg (Montreal Conv.)', 'Included'], ['All-risk cargo cover', 'Full invoice value + 10%', '0.25% of value'], [isSea ? 'Reefer breakdown cover' : 'Temperature excursion cover', 'Spoilage from equipment failure', '0.12% of value']].map(function(x){ return '<div><span><b>' + x[0] + '</b><small>' + x[1] + '</small></span><em>' + x[2] + '</em></div>'; }).join('') +
        '</div><div class="cx-claim"><span><b>' + (isSea ? '7 days' : '14 days') + '</b><small>Notice window</small></span><span><b>' + o.cl + ' days</b><small>Avg. settlement</small></span><span><b>Online</b><small>Claim filing</small></span></div>';
      var ctry = '<div class="cx-ctry">' + cs.map(function(k){ var p = (isSea ? CPORT : CAIR)[k] || []; return '<div>' + flagI(k) + '<span><b>' + CN[k] + '</b><small>' + p.join(' · ') + '</small></span><em>' + p.length + '</em></div>'; }).join('') + '</div>';
      if (isSea){
        out += cxSec('Fleet · vessels', '<div class="cx-vs">' + o.vs.map(function(v, i){ return '<div><span class="cx-vi">' + D.icons.ship + '</span><span><b>' + v + '</b><small>' + VTYPE[i % VTYPE.length] + ' · IMO 9' + (seed * 7919 + i * 131) % 1000000 + '</small></span></div>'; }).join('') + '</div>', Math.max(0, o.vs.length - 4));
        out += cxSec('Ports & countries · ' + cs.length + ' countries', ctry, cs.length - 5);
        out += cxSec('Types of ships', cxChips(['Ultra Large Container Vessels', 'Neo-Panamax', 'Post-Panamax', 'Reefer vessels', 'Feeder ships', 'Con-Ro']));
        out += cxSec('Types of cargo handled', cxChips(['Dry / general', 'Reefer & perishables', 'Dangerous goods (IMDG)', 'Out-of-gauge', 'Breakbulk', 'Project cargo', 'Liquid bulk (flexitank)']));
        out += cxSec('Container types', '<div class="cx-ctn">' + [['20\' Dry','33 m³'],['40\' Dry','67 m³'],['40\' High Cube','76 m³'],['20\' Reefer','28 m³'],['40\' Reefer HC','67 m³'],['Open Top','20\' / 40\''],['Flat Rack','20\' / 40\''],['ISO Tank','21–26 k L']].map(function(x){ return '<span><b>' + x[0] + '</b><small>' + x[1] + '</small></span>'; }).join('') + '</div>', 4);
      } else {
        out += cxSec('Origin', '<div class="cx-hq">' + flagI(o.hq) + '<div><small>Home country · main hub</small><b>' + CN[o.hq] + ' · ' + o.hub + '</b></div></div>' + kv('Network type', 'Hub-and-spoke via ' + o.hub) + kv('Fleet', o.fleet) + kv('Max piece weight', o.mx));
        out += cxSec('Fragile cargo', '<div class="cx-frag ' + (o.frag ? 'y' : 'n') + '"><span class="cx-fi"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2h8l-1 7a3 3 0 01-6 0z"/><path d="M12 12v8M8 22h8M11 4l1 2-1 2"/></svg></span><span><b>' + (o.frag ? 'Fragile goods covered' : 'Fragile goods not covered') + '</b><small>' + (o.frag ? 'Special handling labels, manual loading and fragile-risk cover available.' : 'Carried at shipper\'s risk — add all-risk cover or choose another airline.') + '</small></span><em>' + (o.frag ? '✓' : '✕') + '</em></div>');
        out += cxSec('Restrictions', '<ul class="cx-res">' + ['Lithium batteries (UN3480) — cargo aircraft only', 'Dangerous goods need DGR declaration 48 h before departure', 'Perishables must be pre-cooled to 2–8 °C at acceptance', 'Max piece weight ' + o.mx + ', height 160 cm on main deck', 'Live animals & human remains by prior approval', 'Embargo on cargo to sanctioned destinations', 'Wet cargo must be in leak-proof packaging', 'Valuables require escort booking'].map(function(x){ return '<li>' + x + '</li>'; }).join('') + '</ul>', 4);
        out += cxSec('Countries & airports · ' + cs.length + ' countries', ctry, cs.length - 5);
      }
      out += cxSec('Insurance claim options', ins);
      out += cxSec('Performance', '<div class="cx-perf">' + ok + '</div>');
      return out;
    }
    // ---------- carrier details ----------
    var CX = {
      MSK: ['Maersk Eindhoven', '628W', 4.8, 1240], MSC: ['MSC Aurora', '441E', 4.5, 980], ONE: ['ONE Harmony', '105W', 4.6, 712], CMA: ['CMA CGM Tage', '0FT3E', 4.6, 865], HLC: ['Berlin Express', '22W', 4.5, 640], EMC: ['Ever Lunar', '1123-W', 4.4, 590],
      EK: ['EK 9341', 'Boeing 777F', 4.8, 1520], QR: ['QR 8721', 'Boeing 777F', 4.7, 1180], AI: ['AI 983', 'Boeing 787', 4.4, 640], SQ: ['SQ 7323', 'Boeing 747-400F', 4.7, 910], EY: ['EY 9612', 'Boeing 777F', 4.5, 520], LH: ['LH 8452', 'Boeing 777F', 4.6, 760]
    };
    var cdC = null, cdTT = 0, cdTab = 'ov';
    function openCarrier(code, tt){
      cdC = carriers().filter(function(x){ return x.code === code; })[0]; cdTT = tt; cdTab = 'ov';
      var c = cdC, x = CX[c.code];
      $('cd-img').src = sea() ? 'assets/images/ship.jpg' : 'assets/images/aircargo.jpg';
      $('cd-logo').textContent = c.code; $('cd-logo').style.background = c.bg; $('cd-logo').style.color = c.fg;
      $('cd-name').textContent = c.name;
      document.querySelector('[data-cd-tab="sv"]').textContent = sea() ? 'This sailing' : 'This flight';
      $('cd-sub').innerHTML = CO[c.code].hqN + ' · Since ' + CO[c.code].yr + ' · <span class="star">' + x[2] + '</span> <small>(' + fmt(x[3]) + ' reviews)</small>';
      $('cd-price').textContent = usd(freight(c));
      $('cd-select').textContent = rq.svc ? 'Book Now' : 'Select';
      drawCarrier(); goTo('rq-car-detail');
    }
    function drawCarrier(){
      var c = cdC, x = CX[c.code], price = freight(c), dep = addDays(rq.ready, rq.day * (sea() ? 2 : 1)), arr = plusDays(dep, cdTT), out = '';
      document.querySelectorAll('[data-cd-tab]').forEach(function(t){ t.classList.toggle('on', t.dataset.cdTab === cdTab); });
      if (cdTab === 'ov') out = drawCompany(c);
      else if (cdTab === 'sv'){
        out = '<div class="rv-route"><span class="rv-arrow">' + (sea() ? D.icons.ship : D.icons.plane) + '</span><div style="flex:1;min-width:0"><small>' + (sea() ? 'Sea freight to' : 'Air freight to') + '</small><b>' + rq.port[0] + '</b><small>' + rq.port[1] + '</small></div></div>' +
          kv(sea() ? 'Vessel / voyage' : 'Flight', x[0] + ' · ' + x[1]) + kv('Departs', dfmt(dep) + (sea() ? '' : ' · ' + DEP[c.code])) + kv('Arrives (est.)', dfmt(arr)) +
          kv('Transit time', cdTT + (cdTT === 1 ? ' day' : ' days')) + kv('Service', c.direct ? 'Direct' : '1 transshipment' + (c.via ? ' via ' + c.via : '')) +
          kv('Frequency', sea() ? 'Weekly' : 'Daily') + kv(sea() ? 'Cargo cut-off' : 'Cargo acceptance', dfmt(plusDays(dep, sea() ? -2 : -1)));
      } else if (cdTab === 'ch'){
        var f = Math.round(price * 0.76), o = Math.round(price * 0.07), d = Math.round(price * 0.13), doc = Math.round(price) - f - o - d;
        out = kv((sea() ? 'Ocean' : 'Air') + ' freight', usd(f)) + kv('Origination charges', usd(o)) + kv('Destination charges', usd(d)) + kv('Documentation fee', usd(doc)) +
          '<div class="kv-row rv-tot"><span class="k">Total (est.)</span><span class="v">' + usd(price) + '</span></div>' +
          '<p class="rq-note" style="margin-top:10px">Rates are indicative and valid until ' + dfmt(addDays(rq.ready, 14)) + '.</p>';
      } else {
        out = '<ul class="cd-terms"><li>Rates are subject to space and equipment availability at the time of booking.</li><li>' + (sea() ? 'Free time at destination: 7 days for containers, then demurrage applies.' : 'Storage at the destination terminal is free for 48 hours.') + '</li>' +
          '<li>Fuel and security surcharges may change before departure.</li><li>Dangerous goods and oversized cargo need prior approval.</li><li>Cancellation within 48 hours of the cut-off may be charged.</li></ul>';
      }
      $('cd-body').innerHTML = out;
    }

    // ---------- step 4: warehouse ----------
    // ---- warehouse profiles (sample data derived per warehouse) ----
    var SQFT = 12; // ≈ floor space per tonne / pallet position
    function autoPallets(){ var p = pd(); return Math.max(1, Math.ceil((p ? p.kg : 5000) / 1000)) * SQFT; }
    function sqRate(w){ return w.rate / SQFT; }
    var WSVC = [['load', 'Loading / Unloading', 20, 'order'], ['label', 'Labelling', 15, 'order'], ['repack', 'Repacking & sorting', 40, 'order'], ['customs', 'Customs support', 45, 'order']];
    function prof(w){
      if (w._p) return w._p;
      var n = w.name.length, cold = w.tags.some(function(t){ return /Cold/.test(t); }), ripen = w.tags.indexOf('Ripening rooms') > -1, bonded = w.tags.indexOf('Bonded') > -1;
      var total = 6000 + (n * 397) % 9000, free = Math.round(total * (0.3 + (n % 5) * 0.08) / 100) * 100;
      return (w._p = {
        type: ripen ? 'Agricultural / Perishable' : cold ? 'Cold Storage' : bonded ? 'Bonded' : 'Ambient',
        temp: cold ? 'chilled' : 'ambient', tempL: cold ? '−130 °C to 36 °C' : 'Ambient 18–25 °C', hum: cold ? '60–90% RH' : '45–65% RH',
        total: total * SQFT, free: free * SQFT, reviews: 40 + (n * 13) % 110, min: 5 * SQFT,
        periods: cold ? ['daily', 'weekly', 'monthly'] : ['weekly', 'monthly', 'long'], units: cold ? ['pallets', 'cbm'] : ['pallets', 'sqm', 'cont'],
        svcs: cold ? ['load', 'label', 'repack', 'customs'] : ['load', 'label', 'customs'],
        feats: cold ? ['Loading/Unloading', 'Refrigeration', 'Customs Support'] : ['Forklifts', 'Labelling', 'Security'],
        hours: w.tags.indexOf('24/7') > -1 || n % 3 === 0 ? '24/7 · all days' : n % 3 === 1 ? 'Mon – Sat · 08:00 – 18:00' : 'Sun – Thu · 07:00 – 22:00', sec: '24/7 CCTV & security guards', ins: 'Available on request',
        cargo: cold ? ['Food & Beverages', 'Fresh produce', 'Pharmaceuticals'] : ['General cargo', 'Textiles & apparel', 'Electronics'],
        certs: cold ? ['HACCP', 'ISO 22000'] : ['ISO 9001']
      });
    }
    function planCost(w, pl){
      var c = pl.pallets * sqRate(w) * (pl.mul || 1) / 7 * pl.days;
      pl.svcs.forEach(function(k){ var v = WSVC.filter(function(x){ return x[0] === k; })[0]; c += v[3] === 'order' ? v[2] : v[2] * pl.pallets; });
      return Math.round(c);
    }
    function whCost(w){ return { pallets: rq.plan ? rq.plan.pallets : autoPallets(), cost: rq.plan ? planCost(w, rq.plan) : 0 }; }
    function arrivalIso(){ var d = plusDays(addDays(rq.ready, rq.day * (sea() ? 2 : 1)), rq.tt || 0); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
    // ---- outbound (exporting country) / inbound (importing country) ----
    function isOut(){ return rq.side === 'out'; }
    function syncSide(){ var x = rq.sides[rq.side]; x.wh = rq.wh; x.plan = rq.plan; x.truck = rq.truck; x.tdate = rq.tdate; x.trip = rq.trip; }
    function setSide(sd){ syncSide(); rq.side = sd; var x = rq.sides[sd]; rq.wh = x.wh; rq.plan = x.plan; rq.truck = x.truck; rq.tdate = x.tdate; rq.trip = x.trip || 'one'; }
    function resetIn(){ syncSide(); rq.sides['in'] = { wh: null, plan: null, truck: null, tdate: null, trip: 'one' }; if (!isOut()){ rq.wh = rq.plan = rq.truck = rq.tdate = null; rq.trip = 'one'; } }
    function depIso(){ return isoOf(addDays(rq.ready, rq.day * (sea() ? 2 : 1))); }
    // origin-side facilities are shown without naming the city or country (the buyer never sees the source)
    var WH_OUT = [
      { name: 'Export Cold Hub', area: 'Port free zone', km: 3, tags: ['Cold 2–8 °C', 'Bonded', '24/7'], rate: 12, rating: 4.7, img: 'warehouse.jpg' },
      { name: 'Agri Export Packhouse', area: 'Agri export zone', km: 14, tags: ['Cold 2–8 °C', 'Ripening rooms'], rate: 10, rating: 4.6, img: 'container.jpg' },
      { name: 'Port CFS Warehouse', area: 'Container freight station', km: 6, tags: ['Ambient', 'Bonded'], rate: 8, rating: 4.4, img: 'warehouse.jpg' },
      { name: 'Pre-cooling & Pack Centre', area: 'Near supplier cluster', km: 38, tags: ['Cold 2–8 °C', 'Pre-cooling'], rate: 9, rating: 4.5, img: 'container.jpg' }
    ];
    function ioStatus(kind){
      syncSide();
      var root = $(kind === 'tr' ? 'screen-rq-transport' : 'screen-rq-warehouse');
      root.querySelectorAll('[data-io]').forEach(function(t){ t.classList.toggle('on', t.dataset.io === rq.side); });
      root.querySelectorAll('[data-io-st]').forEach(function(e){
        var x = rq.sides[e.dataset.ioSt], v = kind === 'tr' ? x.truck && x.truck.name : x.wh && x.wh.name;
        e.textContent = v ? '✓ ' + v : 'Not needed'; e.classList.toggle('set', !!v);
      });
    }
    // tabs: Popular (top rated in the region) · Nearby (closest to the chosen port) · Recent (used before)
    var whTab = 'popular';
    var WH_RECENT = [['JD Cold Hub — Jebel Ali', '12 Sep 2026'], ['Rotterdam Fresh Port', '28 Aug 2026'], ['Red Sea Cold Chain', '02 Aug 2026']];
    function allWh(){ var out = WH_OUT.map(function(w){ return { w: w, c: 'out' }; }); Object.keys(D.warehouses).forEach(function(k){ D.warehouses[k].forEach(function(w){ out.push({ w: w, c: k }); }); }); return out; }
    function whWhere(x){ return x.c === 'out' ? x.w.km + ' km from origin port' : x.c === portDest().code ? x.w.km + ' km from port' : destBy(x.c).name; }
    function whByName(n){ return allWh().filter(function(x){ return x.w.name === n; })[0]; }
    function whList(){
      if (isOut()){
        var o = allWh().filter(function(x){ return x.c === 'out'; });
        if (whTab === 'nearby') return o.sort(function(a, b){ return a.w.km - b.w.km; }).map(function(x, i){ return { w: x.w, c: x.c, badge: i === 0 ? 'Nearest' : null }; });
        if (whTab === 'recent') return o.slice(0, 2).map(function(x, i){ return { w: x.w, c: x.c, note: 'Last used ' + ['04 Sep 2026', '19 Aug 2026'][i] }; });
        return o.sort(function(a, b){ return b.w.rating - a.w.rating; }).map(function(x, i){ return { w: x.w, c: x.c, badge: i < 2 ? 'Popular' : null }; });
      }
      var pc = portDest().code, region = D.regions[pc];
      if (whTab === 'nearby') return allWh().filter(function(x){ return x.c === pc; }).sort(function(a, b){ return a.w.km - b.w.km; })
        .map(function(x, i){ return { w: x.w, c: x.c, badge: i === 0 ? 'Nearest' : null }; });
      if (whTab === 'recent') return WH_RECENT.map(function(r){ var x = whByName(r[0]); return x && { w: x.w, c: x.c, note: 'Last used ' + r[1] }; }).filter(Boolean);
      return allWh().filter(function(x){ return D.regions[x.c] === region; }).sort(function(a, b){ return b.w.rating - a.w.rating; })
        .map(function(x, i){ return { w: x.w, c: x.c, badge: i < 2 ? 'Popular' : null }; });
    }
    // ---- warehouse filters ----
    var whf = { type: [], temp: 'any', dist: 'any', dur: 'any', unit: 'any' }, whfd = null;
    var WF = {
      type: [['Cold Storage', 'Cold Storage'], ['Agricultural / Perishable', 'Agricultural / Perishable'], ['Ambient', 'Ambient / General'], ['Bonded', 'Bonded customs']],
      temp: [['any', 'Any temperature'], ['chilled', 'Chilled 2–8 °C'], ['ref', 'Refrigerated'], ['frozen', 'Frozen −18 °C or below']],
      dist: [['5', 'Within 5 km'], ['25', 'Within 25 km'], ['50', 'Within 50 km'], ['any', 'Any distance']],
      dur: [['daily', 'Daily'], ['weekly', 'Weekly'], ['monthly', 'Monthly'], ['long', 'Long-term'], ['any', 'Any']],
      unit: [['pallets', 'Pallets'], ['sqm', 'Square feet / m²'], ['cbm', 'CBM'], ['cont', 'Containers'], ['any', 'Any']]
    };
    function whfCount(f){ return f.type.length + ['temp', 'dist', 'dur', 'unit'].filter(function(k){ return f[k] !== 'any'; }).length; }
    function whPass(x){
      var p = prof(x.w), pc = portDest().code;
      if (whf.type.length && whf.type.indexOf(p.type) < 0) return false;
      if (whf.temp !== 'any' && (whf.temp === 'chilled' || whf.temp === 'ref' ? p.temp !== 'chilled' : true)) return false;
      if (whf.dist !== 'any' && ((x.c !== pc && x.c !== 'out') || x.w.km > +whf.dist)) return false;
      if (whf.dur !== 'any' && p.periods.indexOf(whf.dur) < 0) return false;
      if (whf.unit !== 'any' && p.units.indexOf(whf.unit) < 0) return false;
      return true;
    }
    function drawWhFilter(){
      var f = whfd, out = '<div class="fl">Facility type</div>' + WF.type.map(function(o){ return '<label class="fchk"><input type="checkbox" data-whf="type" value="' + o[0] + '"' + (f.type.indexOf(o[0]) > -1 ? ' checked' : '') + '><span></span>' + o[1] + '</label>'; }).join('');
      [['temp', 'Temperature requirement'], ['dist', 'Distance from port'], ['dur', 'Storage duration'], ['unit', 'Cargo measurement']].forEach(function(g){
        out += '<div class="fl">' + g[1] + '</div><div class="wf-chips">' + WF[g[0]].map(function(o){ return '<span class="wf-chip' + (f[g[0]] === o[0] ? ' on' : '') + '" data-whf-r="' + g[0] + '" data-v="' + o[0] + '">' + o[1] + '</span>'; }).join('') + '</div>';
      });
      $('wh-f-body').innerHTML = out;
    }

    // ---- storage plan sheet ----
    var plan = null, planW = null;
    function openPlan(w){
      if (rq.svc === 'wh'){ var xw = whByName(w.name); if (xw.c !== 'out' && xw.c !== rq.dest){ rq.dest = rq.portC = xw.c; rq.port = destBy(xw.c).ports[0]; } }
      planW = w;
      var cur = rq.wh && rq.wh.name === w.name && rq.plan ? rq.plan : null;
      plan = cur ? JSON.parse(JSON.stringify(cur)) : { start: isOut() ? isoOf(addDays(depIso(), -7)) : arrivalIso(), days: isOut() ? 7 : 14, pallets: Math.max(prof(w).min, autoPallets()), svcs: ['load'] };
      if (!plan.bays){ plan.bays = spAuto(w, Math.ceil(plan.pallets / SP_BAY)); plan.pallets = plan.bays.length * SP_BAY; plan.mul = spMul(plan.bays); }
      $('wp-wh').innerHTML = '<span class="rqp-img"><img src="assets/images/' + w.img + '" alt=""></span><div class="rqp-b"><b>' + w.name + '</b><small>' + (isOut() ? '' : w.area + ' · ') + money(sqRate(w)) + ' / sq.ft / week</small></div>';
      $('wp-start').min = isOut() ? isoOf(addDays(depIso(), -60)) : arrivalIso(); $('wp-start').value = plan.start;
      $('wp-start-h').textContent = isOut() ? 'Your shipment departs on ' + dfmt(new Date(depIso() + 'T00:00:00')) + ' — storage should end by then' : 'Your cargo is expected at the port on ' + dfmt(new Date(arrivalIso() + 'T00:00:00'));
      // the sheet is shared by the list and the details page: show it on whichever screen is open
      document.querySelector('.screen.active').appendChild($('wh-plan'));
      drawPlan(); $('wh-plan').classList.add('open');
    }
    function drawPlan(){
      var p = prof(planW), preset = [7, 14, 30].indexOf(plan.days) > -1;
      $('wp-days').innerHTML = [7, 14, 30].map(function(d){ return '<span class="wf-chip' + (plan.days === d ? ' on' : '') + '" data-wp-days="' + d + '">' + d + ' days</span>'; }).join('') +
        '<span class="wf-chip' + (!preset ? ' on' : '') + '" data-wp-days="custom">Custom</span>';
      $('wp-custom').style.display = preset ? 'none' : '';
      if (!preset) $('wp-ndays').value = plan.days;
      var end = addDays(plan.start, plan.days);
      $('wp-end-h').textContent = 'Until ' + dfmt(end) + ' · ' + plan.days + (plan.days === 1 ? ' day' : ' days');
      $('wp-space-t').textContent = (plan.bays || []).length + ' bays · ' + fmt(plan.pallets) + ' sq.ft'; $('wp-space-s').textContent = (plan.bays || []).slice().sort().join(', ');
      $('wp-pal-h').textContent = 'Best bays picked for ' + fmt(pd() ? pd().kg : 5000) + ' kg · minimum ' + p.min + ' sq.ft · tap to change on the floor map';
      $('wp-svcs').innerHTML = WSVC.filter(function(v){ return p.svcs.indexOf(v[0]) > -1; }).map(function(v){
        return '<label class="fchk wp-svc"><input type="checkbox" data-wp-svc="' + v[0] + '"' + (plan.svcs.indexOf(v[0]) > -1 ? ' checked' : '') + '><span></span>' + v[1] + '<em>' + money(v[2], 0) + ' / ' + v[3] + '</em></label>';
      }).join('');
      $('wp-cost').textContent = money(planCost(planW, plan), 0);
    }

    // ---- details page ----
    var whdW = null, whdTab = 'ov';
    function openDetail(w){
      if (rq.svc === 'wh'){ var xw = whByName(w.name); if (xw.c !== 'out' && xw.c !== rq.dest){ rq.dest = rq.portC = xw.c; rq.port = destBy(xw.c).ports[0]; } }
      whdW = w; whdTab = 'ov';
      var p = prof(w), x = whByName(w.name), where = whWhere(x);
      $('whd-img').src = 'assets/images/' + w.img;
      $('whd-name').textContent = w.name;
      $('whd-sub').innerHTML = (x.c === 'out' ? '' : w.area + ' · ' + where + ' · ') + '<span class="star">' + w.rating + '</span> <small>(' + p.reviews + ' reviews)</small>';
      $('whd-pills').innerHTML = [p.type, 'Sq.ft'].concat(w.tags).map(function(t){ return '<span>' + t + '</span>'; }).join('');
      $('whd-price').textContent = money(sqRate(w));
      drawDetail(); goTo('rq-wh-detail');
    }
    function cap(p){ return '<div class="wh-cap"><div><small>Total capacity</small><b>' + fmt(p.total) + ' sq.ft</b></div><div style="text-align:right"><small>Available</small><b>' + fmt(p.free) + ' sq.ft</b></div><i><u style="width:' + Math.round(p.free / p.total * 100) + '%"></u></i></div>'; }
    function drawDetail(){
      var w = whdW, p = prof(w), out = '';
      document.querySelectorAll('[data-whd-tab]').forEach(function(t){ t.classList.toggle('on', t.dataset.whdTab === whdTab); });
      if (whdTab === 'ov'){
        out = cap(p) + kv('Temperature', p.tempL) + kv('Humidity', p.hum) + kv('Operating hours', p.hours) + kv('Security', p.sec) + kv('Insurance', p.ins) +
          '<div class="fl">Permitted cargo</div><div class="whd-list">' + p.cargo.map(function(c){ return '<span>' + c + '</span>'; }).join('') + '</div>' +
          '<div class="fl">Certifications</div><div class="whd-list gold">' + p.certs.map(function(c){ return '<span>' + c + '</span>'; }).join('') + '</div>';
      } else if (whdTab === 'fs'){
        out = '<div class="fl" style="margin-top:4px">Facilities</div><div class="whd-list">' + p.feats.concat(w.tags).map(function(c){ return '<span>' + c + '</span>'; }).join('') + '</div>' +
          '<div class="fl">Services</div>' + WSVC.filter(function(v){ return p.svcs.indexOf(v[0]) > -1; }).map(function(v){ return kv(v[1], money(v[2], 0) + ' / ' + v[3]); }).join('');
      } else {
        out = kv('Storage', money(sqRate(w)) + ' / sq.ft / week') + kv('Daily rate', money(sqRate(w) / 7) + ' / sq.ft / day') + kv('Minimum', p.min + ' sq.ft · 1 week') +
          WSVC.filter(function(v){ return p.svcs.indexOf(v[0]) > -1; }).map(function(v){ return kv(v[1], money(v[2], 0) + ' / ' + v[3]); }).join('') +
          '<p class="rq-note" style="margin-top:10px">Prices are estimates. Final rates may vary with taxes, minimum charges and peak-season surcharges.</p>';
      }
      $('whd-body').innerHTML = out;
    }

    function renderWh(){
      var pc = portDest().code;
      $('wh-fcount').textContent = whfCount(whf) || ''; $('wh-fbtn').classList.toggle('on', whfCount(whf) > 0);
      ioStatus('wh');
      $('rq-wh-next').disabled = rq.svc === 'wh' && !rq.wh;
      $('rq-wh-s').textContent = isOut() ? 'Need storage in the exporting country before shipping? Pick one below — otherwise leave empty.' : 'Store your cargo near ' + rq.port[1] + ' before final delivery. Leave empty if not needed.';
      document.querySelectorAll('[data-rq-whtab]').forEach(function(t){ t.classList.toggle('on', t.dataset.rqWhtab === whTab); });
      var wq = rq.svc === 'wh' ? ($('wh-q').value || '').trim().toLowerCase() : '';
      // typing searches every warehouse, not just the current tab
      var base = wq ? allWh().filter(function(x){ return x.c !== 'out'; }).map(function(x){ return { w: x.w, c: x.c }; }) : whList();
      $('rq-whs').innerHTML = base.filter(whPass).filter(function(x){ return !wq || (x.w.name + ' ' + x.w.area + ' ' + prof(x.w).type + ' ' + (x.c === 'out' ? '' : destBy(x.c).name)).toLowerCase().indexOf(wq) > -1; }).map(function(x){
        var w = x.w, p = prof(w), on = rq.wh && rq.wh.name === w.name, where = whWhere(x);
        return '<div class="whc' + (on ? ' on' : '') + '"><div class="whc-top"><span class="rqw-img"><img src="assets/images/' + w.img + '" alt=""></span>' +
          '<div class="whc-b"><div class="whc-n"><b>' + w.name + '</b><span class="whd-ver sm">Verified</span></div>' +
          (x.c === 'out' ? '' : '<small>' + w.area + ' · ' + where + '</small>') + (x.badge ? '<em class="rqw-badge">' + x.badge + '</em>' : '') + (x.note ? '<small class="rqw-note">' + x.note + '</small>' : '') +
          '<div class="whc-pills"><span>' + p.type + '</span><span>Sq.ft</span></div>' +
          '<div class="whc-r"><span class="star">' + w.rating + '</span> <small>(' + p.reviews + ' reviews)</small></div></div></div>' +
          cap(p) +
          '<div class="whc-feats">' + p.feats.map(function(f){ return '<span>' + f + '</span>'; }).join('') + '</div>' +
          (on && rq.plan ? '<div class="whc-plan">' + fmt(rq.plan.pallets) + ' sq.ft · ' + rq.plan.days + ' days from ' + dshort(new Date(rq.plan.start + 'T00:00:00')) + ' · <b>' + money(planCost(w, rq.plan), 0) + '</b></div>' : '') +
          '<div class="whc-foot"><div class="whc-p"><b>' + money(sqRate(w)) + '</b> / week / sq.ft<small>Min. ' + p.min + ' sq.ft · 1 week</small></div>' + (rq.svc === 'wh' ? '<button class="cart-add" data-cart-add="wh|' + esc(w.name) + '" title="Add to cart">' + I_ADD + '</button>' : '') +
          (on ? '<button class="whc-btn ghost" data-wh-remove>Remove</button>' : '<button class="whc-btn ghost" data-wh-detail="' + esc(w.name) + '">View Details</button>') + '<button class="whc-btn" data-wh-pick="' + esc(w.name) + '">' + (on ? 'Edit plan' : 'Select') + '</button></div></div>';
      }).join('') || '<div class="rq-empty">No warehouses match' + (whfCount(whf) ? ' your filters — reset the filters or try another tab' : ' here — try another tab or skip this step') + '</div>';
    }

    // ---------- step 5: transport (trucking from port / warehouse to the delivery address) ----------
    // code, name, capacity (t), size, body, special, category, base $, $/km, rating, reviews, ready in (h), features
    var TRUCKS = [
      ['mini', 'Mini Truck', 1.5, '8 ft', 'Closed', null, 'Mini', 22, 0.85, 4.6, 324, 1, ['GPS Tracking', 'Driver Included']],
      ['pickup', 'Pickup', 1.5, '7 ft', 'Open', null, 'Pickup', 20, 0.8, 4.4, 211, 1, ['GPS Tracking', 'Driver Included']],
      ['t14', '14 ft Truck', 5, '14 ft', 'Closed', null, 'Medium', 35, 1.2, 4.7, 618, 2, ['GPS Tracking', 'Driver Included', 'Loading/Unloading']],
      ['reefer', 'Refrigerated Truck', 5, '14 ft', 'Closed', 'Refrigerated', 'Medium', 55, 1.8, 4.7, 402, 2, ['GPS Tracking', 'Driver Included', 'Loading/Unloading', 'Temperature log']],
      ['t17', '17 ft Truck', 8, '17 ft', 'Closed', null, 'Heavy', 45, 1.45, 4.5, 287, 3, ['GPS Tracking', 'Driver Included', 'Helper']],
      ['flatbed', 'Flatbed', 10, '22 ft', 'Open', 'Flatbed', 'Heavy', 50, 1.6, 4.3, 154, 4, ['GPS Tracking', 'Driver Included']],
      ['c32', '32 ft Container', 15, '32 ft', 'Container', null, 'Container', 70, 2.1, 4.6, 239, 4, ['GPS Tracking', 'Driver Included', 'Loading/Unloading', 'Insurance']]
    ].map(function(t){ return { code: t[0], name: t[1], cap: t[2], size: t[3], body: t[4], special: t[5], cat: t[6], base: t[7], km: t[8], rating: t[9], reviews: t[10], ready: t[11], feats: t[12], img: t[6] === 'Container' ? 'container.jpg' : 'truck.jpg' }; });
    var TRF = {
      cat: [['Mini', 'Mini Truck'], ['Pickup', 'Pickup'], ['Medium', 'Medium'], ['Heavy', 'Heavy'], ['Container', 'Container']],
      special: [['Refrigerated', 'Refrigerated'], ['Flatbed', 'Flatbed']],
      load: [['0-1', '<1 T'], ['1-3', '1–3 T'], ['3-7', '3–7 T'], ['7-15', '7–15 T'], ['15-99', '15 T+']],
      body: [['Open', 'Open'], ['Closed', 'Closed'], ['Container', 'Container']],
      avail: [['any', 'Any'], ['now', 'Now (≤ 2 hrs)'], ['sched', 'Schedule']],
      feat: [['GPS Tracking', 'GPS Tracking'], ['Driver Included', 'Driver Included'], ['Loading/Unloading', 'Loading/Unloading'], ['Helper', 'Helper'], ['Insurance', 'Insurance']]
    };
    var trf = { cat: [], special: [], load: [], body: [], avail: 'any', feat: [] }, trfd = null, trSort = 'best';
    function cargoT(){ var p = pd(); return (p ? p.kg : 5000) / 1000; }
    function trKm(sd, x){ x = x || rq; return sd === 'out' || (!sd && isOut()) ? (x.wh ? 58 - x.wh.km : 64) : (x.wh ? x.wh.km + 16 : 22 + ((rq.addr.city || '').length * 3) % 18); }
    function trFrom(sd, x){ x = x || rq; return sd === 'out' || (!sd && isOut()) ? 'Supplier pickup point' : (x.wh ? x.wh.name : (rq.port ? rq.port[1] : 'Port')); }
    function trTo(sd, x){ x = x || rq; return sd === 'out' || (!sd && isOut()) ? (x.wh ? x.wh.name : 'Origin port') : addrShort(); }
    function trStartIso(){ if (isOut()) return rq.wh && rq.plan ? rq.plan.start : isoOf(addDays(depIso(), -2)); return rq.wh && rq.plan ? isoOf(addDays(rq.plan.start, rq.plan.days)) : arrivalIso(); }
    function isoOf(d){ return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
    function trPrice(t, sd, x){
      x = x || rq; var km = trKm(sd, x), trips = Math.max(1, Math.ceil(cargoT() / t.cap)), round = x.trip === 'round' ? 1.8 : 1;
      var dist = t.km * km * round, toll = Math.round(km * 0.12 * round), load = t.feats.indexOf('Loading/Unloading') > -1 ? 15 : 0;
      var sub = (t.base + dist + toll + load) * trips, tax = sub * 0.05;
      return { trips: trips, base: t.base * trips, dist: dist * trips, toll: toll * trips, load: load * trips, tax: tax, total: Math.round(sub + tax), perKm: t.km, km: km };
    }
    function recommended(){ var need = cargoT(), ok = TRUCKS.filter(function(t){ return t.cap >= need; }); var r = ok.filter(function(t){ return t.special === 'Refrigerated'; })[0]; return (r || ok[0] || TRUCKS[TRUCKS.length - 1]).code; }
    function trCount(f){ return f.cat.length + f.special.length + f.load.length + f.body.length + f.feat.length + (f.avail !== 'any' ? 1 : 0); }
    function trPass(t){
      if (trf.cat.length && trf.cat.indexOf(t.cat) < 0) return false;
      if (trf.special.length && trf.special.indexOf(t.special) < 0) return false;
      if (trf.load.length && !trf.load.some(function(r){ var a = r.split('-'); return t.cap > +a[0] && t.cap <= +a[1]; })) return false;
      if (trf.body.length && trf.body.indexOf(t.body) < 0) return false;
      if (trf.avail === 'now' && t.ready > 2) return false;
      if (trf.feat.some(function(f){ return t.feats.indexOf(f) < 0; })) return false;
      return true;
    }
    function renderTransport(){
      ioStatus('tr');
      $('tr-note').textContent = isOut() ? 'Need a truck in the exporting country? Pick one below — otherwise leave empty.' : 'Truck from the port (or inbound warehouse) to your delivery address. Leave empty if not needed.';
      $('tr-route').style.display = isOut() ? 'none' : '';
      $('tr-from').textContent = trFrom();
      $('tr-to').textContent = trTo();
      $('tr-km').textContent = '≈ ' + trKm() + ' km · ' + fmt(cargoT() * 1000) + ' kg';
      $('tr-date').min = isOut() ? isoOf(addDays(depIso(), -60)) : arrivalIso(); $('tr-date').max = isOut() ? depIso() : ''; if (!rq.tdate || rq.tdate < $('tr-date').min || (isOut() && rq.tdate > depIso())) rq.tdate = trStartIso(); $('tr-date').value = rq.tdate;
      document.querySelectorAll('[data-tr-trip]').forEach(function(c){ c.classList.toggle('on', c.dataset.trTrip === (rq.trip || 'one')); });
      document.querySelectorAll('[data-tr-sort]').forEach(function(c){ c.classList.toggle('on', c.dataset.trSort === trSort); });
      $('tr-fcount').textContent = trCount(trf) || ''; $('tr-fbtn').classList.toggle('on', trCount(trf) > 0);
      var rec = recommended(), list = TRUCKS.filter(trPass).map(function(t){ return { t: t, p: trPrice(t) }; });
      list.sort(function(a, b){ return trSort === 'price' ? a.p.total - b.p.total : trSort === 'near' ? a.t.ready - b.t.ready : (b.t.code === rec) - (a.t.code === rec) || a.p.total - b.p.total; });
      $('tr-list').innerHTML = list.map(function(x){
        var t = x.t, p = x.p, on = rq.truck && rq.truck.code === t.code;
        return '<div class="trc' + (on ? ' on' : '') + '"><span class="trc-img"><img src="assets/images/' + t.img + '" alt=""></span><div class="trc-b">' +
          '<div class="trc-n"><b>' + t.name + '</b>' + (t.code === rec ? '<em class="rqw-badge">Recommended</em>' : '') + '</div>' +
          '<small>' + t.cap + ' Ton · ' + t.size + ' · ' + (t.special || t.body) + '</small>' +
          '<div class="trc-p"><b>' + money(p.total, 0) + '</b> <small>(' + money(p.perKm) + '/km' + (p.trips > 1 ? ' · ' + p.trips + ' trips' : '') + ')</small></div>' +
          '<div class="trc-f"><span class="star">' + t.rating + '</span> <small>(' + t.reviews + ')</small><small>· Within ' + t.ready + (t.ready === 1 ? ' hour' : ' hours') + '</small></div>' +
          '<div class="trc-btns"><button class="whc-btn ghost" ' + (on ? 'data-tr-remove>Remove' : 'data-tr-detail="' + t.code + '">Details') + '</button><button class="whc-btn" data-tr-pick="' + t.code + '">' + (on ? 'Selected ✓' : 'Select') + '</button></div></div></div>';
      }).join('') || '<div class="rq-empty">No trucks match your filters — reset the filters</div>';
    }
    function drawTrFilter(){
      var f = trfd, out = '';
      [['cat', 'Vehicle category', 1], ['special', 'Special truck type', 1], ['load', 'Load capacity', 1], ['body', 'Truck body', 1], ['avail', 'Availability', 0], ['feat', 'Vehicle features', 1]].forEach(function(g){
        out += '<div class="fl">' + g[1] + '</div><div class="wf-chips">' + TRF[g[0]].map(function(o){
          var on = g[2] ? f[g[0]].indexOf(o[0]) > -1 : f[g[0]] === o[0];
          return '<span class="wf-chip' + (on ? ' on' : '') + '" data-trf="' + g[0] + '" data-multi="' + g[2] + '" data-v="' + o[0] + '">' + o[1] + '</span>';
        }).join('') + '</div>';
      });
      $('tr-f-body').innerHTML = out;
    }
    var trdT = null;
    function openTruck(code){
      var t = TRUCKS.filter(function(x){ return x.code === code; })[0], p = trPrice(t); trdT = t;
      $('trd-img').src = 'assets/images/' + t.img;
      $('trd-name').textContent = t.name;
      $('trd-sub').innerHTML = t.cap + ' Ton · ' + t.size + ' · ' + t.body + ' body · <span class="star">' + t.rating + '</span> <small>(' + t.reviews + ' reviews)</small>';
      $('trd-pills').innerHTML = [t.special || 'General Cargo', 'Driver Included', 'Ready within ' + t.ready + 'h'].map(function(x){ return '<span>' + x + '</span>'; }).join('');
      $('trd-price').innerHTML = kv('Base fare' + (p.trips > 1 ? ' (' + p.trips + ' trips)' : ''), money(p.base)) + kv('Distance (' + p.km + ' km × ' + money(p.perKm) + (rq.trip === 'round' ? ', round trip' : '') + ')', money(p.dist)) +
        kv('Tolls & permits (est.)', money(p.toll)) + kv('Loading / unloading', p.load ? money(p.load) : '—') + kv('Tax (5%)', money(p.tax)) +
        '<div class="kv-row rv-tot"><span class="k">Total estimated fare</span><span class="v">' + money(p.total, 0) + '</span></div>';
      $('trd-feats').innerHTML = t.feats.map(function(f){ return '<span>' + f + '</span>'; }).join('');
      $('trd-total').textContent = money(p.total, 0);
      goTo('rq-truck');
    }
    function toTransport(){ setSide('out'); trSort = 'best'; renderTransport(); goTo('rq-transport'); }

    // ---------- review + sent ----------
    function totals(){
      syncSide();
      var p = pd(), fr = rq.managed ? managedPrice() : freight(rq.carrier), o = { whO: 0, whI: 0, trO: 0, trI: 0 };
      if (!rq.managed) ['out', 'in'].forEach(function(sd){ var x = rq.sides[sd], K = sd === 'out' ? 'O' : 'I';
        if (x.wh && x.plan) o['wh' + K] = planCost(x.wh, x.plan); if (x.truck) o['tr' + K] = trPrice(x.truck, sd, x).total; });
      o.p = p; o.fr = fr; o.wh = o.whO + o.whI; o.tr = o.trO + o.trI; o.total = p.goods + p.packCost + fr + o.wh + o.tr;
      return o;
    }
    function kv(k, v){ return '<div class="kv-row"><span class="k">' + k + '</span><span class="v">' + v + '</span></div>'; }
    function routeBar(rightCode, rightName){
      return '<div class="rv-route"><span class="rv-arrow">' + (sea() ? D.icons.ship : D.icons.plane) + '</span><div style="flex:1;min-width:0"><small>' + (sea() ? 'Sea freight to' : 'Air freight to') + '</small><b>' + rightCode + '</b><small>' + rightName + '</small></div></div>';
    }
    // steps 2-4 are skipped when Venture Karts handles the delivery
    function markSteps(){
      document.querySelectorAll('#screen-rq-review .rqs').forEach(function(el, i){
        if (i < 1 || i > 4) return;
        el.classList.toggle('skip', rq.managed); el.classList.toggle('done', !rq.managed);
        el.querySelector('span').innerHTML = rq.managed ? '–' : CHECK;
      });
    }
    function renderReview(){
      if (rq.svc) return svReview();
      ['rv-prod', 'rv-ship'].forEach(function(id){ $(id).parentElement.style.display = ''; });
      var lk = document.querySelectorAll('#screen-rq-review .rv-h a'); lk[1].dataset.goto = 'rq-ship'; lk[2].dataset.goto = 'rq-warehouse';
      markSteps();
      var t = totals(), p = t.p;
      $('rv-prod').innerHTML = '<div class="rv-ph"><span class="rqp-img"><img src="' + p.img + '" alt=""></span><div class="rqp-b"><b>' + p.name + '</b><small>' + p.variety + '</small></div></div>' +
        kv('Quantity', fmt(p.kg) + ' kg') + kv('Unit price', money(p.unitPrice) + ' / kg') + kv('Packaging', p.packText || 'None');
      var to = kv('Deliver to', esc(addrShort())) + (rq.addr.name ? kv('Contact', esc(rq.addr.name) + (rq.addr.phone ? ' · ' + esc(rq.addr.phone) : '')) : '');
      if (rq.managed){
        var eta = addDays(rq.ready, managedDays());
        $('rv-ship').innerHTML = '<div class="rv-vk">' + TRUCK + 'Handled by Venture Karts · door-to-door</div>' + routeBar(esc(rq.addr.city || dest().name), 'Door delivery') +
          kv('Mode', sea() ? 'Sea Freight' : 'Air Freight') + kv(sea() ? 'Container' : 'Cargo type', units()) + kv('Includes', 'Freight · customs · last mile') +
          kv('Delivered by (est.)', dfmt(eta)) + to;
      } else {
        var dep = addDays(rq.ready, rq.day * (sea() ? 2 : 1)), arr = plusDays(dep, rq.tt);
        $('rv-ship').innerHTML = routeBar(rq.port[0], rq.port[1]) +
          kv('Mode', sea() ? 'Sea Freight' : 'Air Freight') + kv(sea() ? 'Shipping line' : 'Airline', rq.carrier.name) + kv(sea() ? 'Container' : 'Cargo type', units()) +
          kv('Departs', dfmt(dep)) + kv('Arrives (est.)', dfmt(arr)) + kv('Transit', rq.tt + (rq.tt === 1 ? ' day' : ' days') + ' · ' + (rq.carrier.direct ? 'Direct' : '1 transshipment')) + to;
      }
      $('rv-wh').parentElement.style.display = rq.managed ? 'none' : '';
      $('rv-tr').parentElement.style.display = rq.managed ? 'none' : '';
      syncSide();
      var SIDE_L = { out: 'Outbound · exporting country', 'in': 'Inbound · importing country' };
      $('rv-wh').innerHTML = ['out', 'in'].map(function(sd){
        var x = rq.sides[sd];
        return '<div class="rv-io">' + SIDE_L[sd] + '</div>' + (x.wh && x.plan ? kv('Warehouse', x.wh.name) + (sd === 'out' ? '' : kv('Location', x.wh.area)) + kv('Storage', fmt(x.plan.pallets) + ' sq.ft · ' + x.plan.days + ' days') +
          kv('Dates', dshort(new Date(x.plan.start + 'T00:00:00')) + ' – ' + dfmt(addDays(x.plan.start, x.plan.days))) +
          kv('Services', x.plan.svcs.length ? x.plan.svcs.map(function(k){ return WSVC.filter(function(v){ return v[0] === k; })[0][1]; }).join(', ') : 'None') :
          '<div class="rv-none">Not needed</div>');
      }).join('');
      $('rv-tr').innerHTML = ['out', 'in'].map(function(sd){
        var x = rq.sides[sd];
        return '<div class="rv-io">' + SIDE_L[sd] + '</div>' + (x.truck ? kv('Truck', x.truck.name + ' · ' + x.truck.cap + ' T') + (sd === 'out' ? '' : kv('Route', esc(trFrom(sd, x)) + ' → ' + esc(sd === 'out' ? trTo(sd, x) : (rq.addr.city || dest().name))) +
          kv('Date', dfmt(new Date(x.tdate + 'T00:00:00')) + ' · ' + (x.trip === 'round' ? 'Round trip' : 'One way')) + kv('Distance', '≈ ' + trKm(sd, x) + ' km')) :
          '<div class="rv-none">Not needed</div>');
      }).join('');
      $('rv-cost').innerHTML = kv('Product', money(p.goods)) + kv('Packaging', money(p.packCost)) +
        (rq.managed ? kv('Door-to-door delivery', money(t.fr)) : kv((sea() ? 'Ocean' : 'Air') + ' freight (est.)', money(t.fr)) + (t.whO ? kv('Warehouse · outbound', money(t.whO)) : '') + (t.whI ? kv('Warehouse · inbound', money(t.whI)) : '') + (t.trO ? kv('Transport · outbound', money(t.trO)) : '') + (t.trI ? kv('Transport · inbound', money(t.trI)) : '')) +
        '<div class="kv-row rv-tot"><span class="k">Total (est.)</span><span class="v">' + money(t.total) + '</span></div>';
      $('rv-total').textContent = money(t.total);
    }
    function renderSent(){
      if (rq.svc) return svSent();
      var t = totals();
      $('rs-id').textContent = 'RQ-20261016-' + (1000 + Math.floor(t.total) % 9000);
      var right = rq.managed ? [esc(rq.addr.city || dest().name), 'Door delivery'] : [rq.port[0], rq.port[2]];
      $('rs-card').innerHTML = '<div class="rv-ph"><span class="rqp-img"><img src="' + t.p.img + '" alt=""></span><div class="rqp-b"><b>' + t.p.name + '</b><small>' + fmt(t.p.kg) + ' kg · ' + (rq.managed ? 'Venture Karts door-to-door' : rq.carrier.name) + '</small></div></div>' +
        routeBar(right[0], right[1]) + kv('Deliver to', esc(addrShort())) + (rq.managed ? '' : kv('Warehouse', [rq.sides.out.wh, rq.sides['in'].wh].filter(Boolean).map(function(w){ return w.name; }).join(' + ') || 'Not required') + kv('Transport', [rq.sides.out.truck, rq.sides['in'].truck].filter(Boolean).map(function(w){ return w.name; }).join(' + ') || 'Not required')) +
        '<div class="kv-row rv-tot"><span class="k">Total (est.)</span><span class="v">' + money(t.total) + '</span></div>';
    }

    // ---------- country sheet (delivery address) ----------
    function openDest(){
      $('rq-dest-list').innerHTML = D.dests.map(function(d){
        return '<div class="pk-row' + (d.code === rq.dest ? ' on' : '') + '" data-rq-dest="' + d.code + '"><span class="pk-flag"><img src="assets/images/flags/' + d.code + '.png" alt=""></span><div class="pk-b"><b>' + d.name + '</b><small>' + d.ports.length + ' ports · ' + d.airports.length + ' airports</small></div><svg class="pk-check" viewBox="0 0 24 24" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg></div>';
      }).join('');
      $('rq-dest-sheet').classList.add('open');
    }

    // ---------- events ----------
    document.addEventListener('click', function(e){
      var t;
      if ((t = e.target.closest('[data-goto="rq-ship"]'))) { if (rq.svc){ svcOn(null); freshSides(); } setTimeout(renderShip, 0); return; }
      if ((t = e.target.closest('[data-svc]'))) {
        var k = t.dataset.svc;
        playIntro(k);
        setTimeout(cartBadge, 0);
        // header tabs: highlight the current service; switching from a service page doesn't stack screens
        document.querySelectorAll('.svc-head .as').forEach(function(a){ a.classList.toggle('on', a.dataset.svc === k); });
        if (t.closest('.svc-head')) stack.splice(0, stack.length, 'home', k === 'wh' ? 'svc-wh' : 'svc-freight');
        if (k === 'wh'){ svcOn('wh'); renderSvWh(); }
        else { svcOn('freight'); if (sv.mode !== k){ sv.from = sv.to = null; sv.load = k === 'sea' ? 3 : 0; } sv.mode = k; rq.mode = k; freshSides(); renderSvFreight(); }
        return;
      }
      if ((t = e.target.closest('[data-sv-mode]'))) { if (sv.mode !== t.dataset.svMode){ sv.mode = rq.mode = t.dataset.svMode; sv.from = sv.to = null; sv.load = sv.mode === 'sea' ? 3 : 0; } renderSvFreight(); return; }
      if ((t = e.target.closest('[data-sv-load]'))) { sv.load = +t.dataset.svLoad; renderSvFreight(); return; }
      if ((t = e.target.closest('[data-sv-pick]'))) { sv.pick = t.dataset.svPick; rq.mode = sv.mode; portTab = 'popular'; $('rq-port-q').value = ''; renderPort(); goTo('rq-port'); return; }
      if ((t = e.target.closest('[data-sv-port]'))) {
        var all = svPorts(sv.pick), r = all[t.dataset.svPort];
        if (sv.pick === 'from'){ sv.from = r[0]; sv.fromC = r[1].code; } else { sv.to = r[0]; sv.toC = r[1].code; }
        renderSvFreight(); slideBack(); return;
      }
      if (e.target.closest('#screen-login [data-goto="home"]')) playSplash(true);
      if (bkClick(e)) return;
      if (e.target.closest('#wp-space')) { openSpace(); return; }
      if ((t = e.target.closest('[data-sp]'))) { var id = t.dataset.sp, k = spSel.indexOf(id); if (k > -1) spSel.splice(k, 1); else spSel.push(id); drawSpace(); return; }
      if (e.target.closest('#sp-auto')) { spSel = spAuto(spW, Math.max(Math.ceil(prof(spW).min / SP_BAY), Math.ceil(autoPallets() / SP_BAY))); drawSpace(); return; }
      if (e.target.closest('#sp-ok')) { plan.bays = spSel.slice(); plan.pallets = spSel.length * SP_BAY; plan.mul = spMul(spSel); goBack(); drawPlan(); return; }
      if ((t = e.target.closest('[data-ix-book]'))) { var pr = t.dataset.ixBook.split('|'), f = FARES.filter(function(x){ return x[0] === pr[1]; })[0]; rq.fare = f[2]; rq.fareN = f[1]; pickCarrier(pr[0], +pr[2]); return; }
      if ((t = e.target.closest('[data-ix]'))) { ixOpen = ixOpen === t.dataset.ix ? null : t.dataset.ix; renderAirIx(); return; }
      if (e.target.closest('#ix-sort-b')) { ixSort = { price: 'fast', fast: 'early', early: 'price' }[ixSort]; renderAirIx(); return; }
      if (e.target.closest('#ix-ns')) { flt.stops = flt.stops.length === 1 && flt.stops[0] === '0' ? [] : ['0']; renderAirIx(); return; }
      if (e.target.closest('#ix-filter')) { openFilter(); return; }
      if (svhClick(e)) return;
      if ((t = e.target.closest('[data-sx-fill]'))) { var pr = t.dataset.sxFill.split('|'); sxFill(pr[0], pr[1]); return; }
      if (e.target.closest('[data-sv-swap]')) {
        var tb = e.target.closest('[data-sv-swap]'); tb.classList.remove('spin'); void tb.offsetWidth; tb.classList.add('spin');
        if (sv.from && sv.to){ var nt = sxFind(sv.from[0], 'to'); if (!nt){ $('sv-err').textContent = sv.from[0] + ' is not available as a destination yet'; return; } var nf = sxFind(sv.to[0], 'from'); sv.from = nf[0]; sv.fromC = nf[1].code; sv.to = nt[0]; sv.toC = nt[1].code; renderSvFreight(); }
        return;
      }
      if ((t = e.target.closest('[data-sw-dur]'))) { $('sw-dur').value = t.dataset.swDur; document.querySelectorAll('[data-sw-dur]').forEach(function(d){ d.classList.toggle('on', d === t); }); return; }
      if ((t = e.target.closest('[data-sx-feat]'))) { var fx = whByName(t.dataset.sxFeat); $('sw-country').value = fx.c; startWhSearch(); openDetail(fx.w); return; }      if (e.target.closest('#sv-search')) {
        sv.kg = parseFloat($('sv-kg').value) || 0; sv.cbm = parseFloat($('sv-cbm').value) || 0; sv.desc = $('sv-desc').value.trim();
        var miss = !sv.from ? 'Select the origin ' + (sv.mode === 'sea' ? 'port' : 'airport') : !sv.to ? 'Select the destination ' + (sv.mode === 'sea' ? 'port' : 'airport') : sv.kg <= 0 ? 'Enter the cargo weight' : '';
        $('sv-kg-row').classList.toggle('err', sv.kg <= 0);
        if (miss){ $('sv-err').textContent = miss; return; }
        rq.mode = sv.mode; rq.ready = $('sv-date').value || '2026-10-25'; rq.port = sv.to; rq.portC = sv.toC; rq.dest = sv.toC; rq.day = 0;
        renderCarrier(); goTo('rq-carrier'); return;
      }
      if ((t = e.target.closest('[data-sv-wtype]'))) { startWhSearch(t.dataset.svWtype); return; }
      if (e.target.closest('#sw-search')) { startWhSearch(); return; }
      if ((t = e.target.closest('.rq-mode'))) { readForm(); if (rq.mode !== t.dataset.mode){ rq.mode = t.dataset.mode; rq.load = 1; rq.port = null; rq.portC = null; rq.carrier = null; } renderShip(); return; }
      if ((t = e.target.closest('[data-rq-saved]'))) {
        var i = +t.dataset.rqSaved; rq.saved = i;
        if (i >= 0){ rq.addr = JSON.parse(JSON.stringify(D.saved[i])); rq.dest = rq.addr.country; }
        else { rq.addr = { label: 'New address', name: '', phone: '', line: '', city: '', zip: '', state: '', district: '', country: rq.dest }; }
        rq.port = null; rq.portC = null; resetIn();
        renderSaved(); fillForm(); renderVK(); if (i < 0) $('rq-a-line').focus(); return;
      }
      if (e.target.closest('#rq-a-country-row')) { readForm(); openDest(); return; }
      if ((t = e.target.closest('[data-rq-dest]'))) {
        if (rq.dest !== t.dataset.rqDest){ rq.dest = t.dataset.rqDest; rq.addr.country = rq.dest; rq.port = null; rq.portC = null; resetIn(); rq.saved = -1; }
        $('rq-dest-sheet').classList.remove('open'); renderSaved(); fillForm(); renderVK(); return;
      }
      if ((t = e.target.closest('[data-rq-close]'))) { $(t.dataset.rqClose).classList.remove('open'); return; }
      if (e.target.closest('#rq-next-1')) {
        if (!validAddr()) return;
        if (rq.managed){ renderReview(); goTo('rq-review'); return; }
        portTab = 'popular'; $('rq-port-q').value = ''; renderPort(); goTo('rq-port'); return;
      }
      if ((t = e.target.closest('[data-rq-ptab]'))) { portTab = t.dataset.rqPtab; renderPort(); return; }
      if ((t = e.target.closest('[data-rq-port]'))) {
        var c = destBy(t.dataset.rqPc);
        if (rq.portC !== c.code) resetIn();
        rq.portC = c.code;
        rq.port = c[sea() ? 'ports' : 'airports'].filter(function(x){ return x[0] === t.dataset.rqPort; })[0];
        rq.day = 0; renderCarrier(); goTo('rq-carrier'); return;
      }
      if ((t = e.target.closest('[data-rq-day]'))) { rq.day = +t.dataset.rqDay; renderCarrier(); return; }
      if ((t = e.target.closest('[data-rq-sort]'))) { rq.sort = t.dataset.rqSort; renderCarrier(); return; }
      if (e.target.closest('#rq-fbtn')) { openFilter(); return; }
      if ((t = e.target.closest('[data-fdep]'))) { readFilter(); fd.dep = t.dataset.fdep; document.querySelectorAll('[data-fdep]').forEach(function(b){ b.classList.toggle('on', b === t); }); return; }
      if (e.target.closest('#rq-f-reset')) { fd = { min: null, max: null, car: [], stops: [], dep: 'any', svc: [], arr: null }; drawFilter(); return; }
      if (e.target.closest('#rq-f-apply')) { readFilter(); flt = fd; $('rq-filter').classList.remove('open'); renderCarrier(); return; }
      if (e.target.closest('#cd-select')) { pickCarrier(cdC.code, cdTT); return; }
      if ((t = e.target.closest('[data-rq-cdetail]'))) { openCarrier(t.dataset.rqCdetail, +t.dataset.rqTt); return; }
      if ((t = e.target.closest('[data-cx-more]'))) { var sec = t.parentNode; if (!t.dataset.l) t.dataset.l = t.textContent; sec.classList.toggle('open'); t.textContent = sec.classList.contains('open') ? 'View less' : t.dataset.l; return; }
      if ((t = e.target.closest('[data-cd-tab]'))) { cdTab = t.dataset.cdTab; drawCarrier(); return; }
      if ((t = e.target.closest('[data-rq-carrier]'))) { rq.fare = 1; rq.fareN = ''; pickCarrier(t.dataset.rqCarrier, +t.dataset.rqTt); return; }
      if ((t = e.target.closest('[data-rq-whtab]'))) { whTab = t.dataset.rqWhtab; renderWh(); return; }
      if ((t = e.target.closest('[data-wh-detail]'))) { openDetail(whByName(t.dataset.whDetail).w); return; }
      if ((t = e.target.closest('[data-wh-pick]'))) { openPlan(whByName(t.dataset.whPick).w); return; }
      if (e.target.closest('#whd-select')) { openPlan(whdW); return; }
      if ((t = e.target.closest('[data-whd-tab]'))) { whdTab = t.dataset.whdTab; drawDetail(); return; }
      if (e.target.closest('#wh-fbtn')) { whfd = JSON.parse(JSON.stringify(whf)); drawWhFilter(); $('wh-filter').classList.add('open'); return; }
      if ((t = e.target.closest('[data-whf-r]'))) { whfd[t.dataset.whfR] = t.dataset.v; t.parentElement.querySelectorAll('.wf-chip').forEach(function(c){ c.classList.toggle('on', c === t); }); return; }
      if (e.target.closest('#wh-f-reset')) { whfd = { type: [], temp: 'any', dist: 'any', dur: 'any', unit: 'any' }; drawWhFilter(); return; }
      if (e.target.closest('#wh-f-apply')) { whfd.type = [].slice.call(document.querySelectorAll('[data-whf="type"]:checked')).map(function(i){ return i.value; }); whf = whfd; $('wh-filter').classList.remove('open'); renderWh(); return; }
      if ((t = e.target.closest('[data-wp-days]'))) { plan.days = t.dataset.wpDays === 'custom' ? (plan.days && [7, 14, 30].indexOf(plan.days) < 0 ? plan.days : 21) : +t.dataset.wpDays; drawPlan(); if (t.dataset.wpDays === 'custom') $('wp-ndays').focus(); return; }
      if ((t = e.target.closest('[data-wp-step]'))) { plan.pallets = Math.max(prof(planW).min, plan.pallets + 10 * (+t.dataset.wpStep)); drawPlan(); return; }
      if (e.target.closest('#wp-confirm')) {
        rq.wh = planW; rq.plan = plan; $('wh-plan').classList.remove('open');
        if (document.querySelector('.screen.active').id === 'screen-rq-wh-detail') goBack();
        renderWh(); return;
      }
      if ((t = e.target.closest('[data-io]'))) { setSide(t.dataset.io); if (t.closest('#screen-rq-transport')) renderTransport(); else renderWh(); return; }
      if (e.target.closest('[data-wh-remove]')) { rq.wh = null; rq.plan = null; renderWh(); return; }
      if (e.target.closest('[data-tr-remove]')) { rq.truck = null; renderTransport(); return; }
      if (e.target.closest('[data-rq-skip]')) { rq.wh = rq.plan = null; setSide(isOut() ? 'in' : 'out'); rq.wh = rq.plan = null; setSide('out'); toTransport(); return; }
      if (e.target.closest('[data-tr-skip]')) { rq.truck = null; setSide(isOut() ? 'in' : 'out'); rq.truck = null; setSide('out'); renderReview(); goTo('rq-review'); return; }
      if (e.target.closest('#tr-next')) { renderReview(); goTo('rq-review'); return; }
      if ((t = e.target.closest('[data-tr-trip]'))) { rq.trip = t.dataset.trTrip; renderTransport(); return; }
      if ((t = e.target.closest('[data-tr-sort]'))) { trSort = t.dataset.trSort; renderTransport(); return; }
      if ((t = e.target.closest('[data-tr-pick]'))) { var tk = TRUCKS.filter(function(x){ return x.code === t.dataset.trPick; })[0]; rq.truck = rq.truck && rq.truck.code === tk.code ? null : tk; renderTransport(); return; }
      if ((t = e.target.closest('[data-tr-detail]'))) { openTruck(t.dataset.trDetail); return; }
      if (e.target.closest('#trd-select')) { rq.truck = trdT; goBack(); renderTransport(); return; }
      if (e.target.closest('#tr-fbtn')) { trfd = JSON.parse(JSON.stringify(trf)); drawTrFilter(); $('tr-filter').classList.add('open'); return; }
      if ((t = e.target.closest('[data-trf]'))) {
        var g = t.dataset.trf;
        if (t.dataset.multi === '1'){ var i = trfd[g].indexOf(t.dataset.v); if (i > -1) trfd[g].splice(i, 1); else trfd[g].push(t.dataset.v); t.classList.toggle('on'); }
        else { trfd[g] = t.dataset.v; t.parentElement.querySelectorAll('.wf-chip').forEach(function(c){ c.classList.toggle('on', c === t); }); }
        return;
      }
      if (e.target.closest('#tr-f-reset')) { trfd = { cat: [], special: [], load: [], body: [], avail: 'any', feat: [] }; drawTrFilter(); return; }
      if (e.target.closest('#tr-f-apply')) { trf = trfd; $('tr-filter').classList.remove('open'); renderTransport(); return; }
      if (e.target.closest('[data-goto="rq-transport"]')) { setTimeout(renderTransport, 0); return; }
      if (e.target.closest('#rq-wh-next')) { if (rq.svc === 'wh'){ if (!rq.wh) return; bkStart(); return; } setSide('out'); toTransport(); return; }
      if (e.target.closest('[data-goto="rq-warehouse"]')) { setTimeout(renderWh, 0); return; }
      if (e.target.closest('#rv-send') && rq.svc) { if (!$('rv-agree').checked){ $('rv-agree-row').classList.add('shake'); setTimeout(function(){ $('rv-agree-row').classList.remove('shake'); }, 500); return; } svSent(); goTo('rq-sent', true); return; }
      if (e.target.closest('#rv-send')) {
        if (!$('rv-agree').checked){ $('rv-agree-row').classList.add('shake'); setTimeout(function(){ $('rv-agree-row').classList.remove('shake'); }, 500); return; }
        renderSent(); goTo('rq-sent', true); return;
      }
    });
    $('rq-vk-in').addEventListener('change', function(){ rq.managed = this.checked; renderVK(); });
    ['rq-a-name', 'rq-a-phone', 'rq-a-line', 'rq-a-state', 'rq-a-district', 'rq-a-city', 'rq-a-zip'].forEach(function(id){
      $(id).addEventListener('input', function(){
        if (rq.saved !== -1){ rq.saved = -1; renderSaved(); }
        this.closest('.rq-in').classList.remove('err');
        if (id === 'rq-a-city'){ rq.addr.city = this.value.trim(); renderVK(); }
      });
    });
    $('rq-port-q').addEventListener('input', portList);
    $('sv-load-sel').addEventListener('change', function(){ sv.load = +this.value; });
    bkInit();
    playSplash(false);
    $('wh-q').addEventListener('input', renderWh);
    sxParallax(null, 'sv-hero-box'); sxParallax(null, 'sw-hero-box');
    $('tr-date').addEventListener('change', function(){ if (this.value) rq.tdate = this.value < this.min ? this.min : this.value; });
    $('wp-start').addEventListener('change', function(){ if (this.value) { plan.start = this.value < this.min ? this.min : this.value; drawPlan(); } });
    $('wp-ndays').addEventListener('input', function(){ var v = parseInt(this.value, 10); if (v > 0){ plan.days = Math.min(v, 365); $('wp-end-h').textContent = 'Until ' + dfmt(addDays(plan.start, plan.days)) + ' · ' + plan.days + ' days'; $('wp-cost').textContent = money(planCost(planW, plan), 0); } });
    document.addEventListener('change', function(e){
      var c = e.target.closest('[data-wp-svc]'); if (!c) return;
      var k = c.dataset.wpSvc, i = plan.svcs.indexOf(k);
      if (c.checked && i < 0) plan.svcs.push(k); if (!c.checked && i > -1) plan.svcs.splice(i, 1);
      $('wp-cost').textContent = money(planCost(planW, plan), 0);
    });
    renderShip();
  })();

  // ---------- Categories (redesign) ----------
  (function(){
    var root = document.getElementById('screen-all-categories'); if (!root) return;
    function I(n){ return 'assets/images/' + n + '.jpg'; }
    var CATS = [
      { k:'Fruits', img:'mango', ban:'orchard', tag:'Fresh & export-grade', n:180, c:14, from:'1.05', unit:'kg', o:['in','ph','th','mx','br','eg','pe','za'],
        subs:[['Mango','mango'],['Grapes','grapes'],['Pomegranate','pomegranate'],['Banana','banana'],['Citrus','lemon'],['Coconut','coconut']],
        p:[['Alphonso Mango — Organic','mango','in','Ratnagiri',1.20,1.36,4.6,'500 kg'],['Thompson Seedless Grapes','grapes','in','Nashik',1.95,2.20,4.5,'300 kg'],['Bhagwa Pomegranate','pomegranate','in','Solapur',1.60,1.80,4.4,'400 kg'],['Cavendish Banana','banana','ph','Davao',0.62,0.70,4.3,'1 MT']] },
      { k:'Grains', img:'rice', ban:'rice', tag:'Rice, wheat & millets', n:140, c:11, from:'0.48', unit:'kg', o:['in','th','vn','pk','us','br'],
        subs:[['Basmati Rice','rice'],['Non-Basmati','rice'],['Wheat','🌾'],['Maize','🌽'],['Millets','🌾'],['Barley','🌾']],
        p:[['1121 Basmati Rice — Sella','rice','in','Karnal',1.10,1.25,4.7,'1 MT'],['Jasmine Rice Hom Mali','rice','th','Ubon',0.95,1.05,4.5,'1 MT'],['Sona Masoori Raw Rice','rice','in','Raichur',0.72,0.80,4.4,'1 MT']] },
      { k:'Spices', img:'chilli', ban:'spicemarket', tag:'Whole, ground & blends', n:220, c:12, from:'2.10', unit:'kg', o:['in','vn','id','lk','tr','ma'],
        subs:[['Chilli','chilli'],['Turmeric','turmeric'],['Cumin','cumin'],['Cardamom','cardamom'],['Black Pepper','pepper'],['Coriander','🌿']],
        p:[['Green Cardamom 8mm Bold','cardamom','in','Idukki',28.0,30.5,4.8,'50 kg'],['Teja S17 Dry Chilli','chilli','in','Guntur',2.80,3.10,4.5,'500 kg'],['Salem Turmeric Finger','turmeric','in','Erode',2.10,2.35,4.4,'500 kg'],['Malabar Black Pepper','pepper','in','Kochi',6.40,7.00,4.6,'200 kg']] },
      { k:'Nuts', img:'cashew', ban:'cashew', tag:'Kernels & dry fruits', n:95, c:9, from:'4.20', unit:'kg', o:['in','vn','ci','us','tr','gh'],
        subs:[['Cashew','cashew'],['Almond','almond'],['Coconut','coconut'],['Walnut','🌰'],['Pistachio','🥜'],['Peanut','🥜']],
        p:[['Cashew Kernels W240','cashew','in','Kollam',7.80,8.40,4.7,'200 kg'],['California Almonds NPS','almond','us','Fresno',6.20,6.70,4.6,'500 kg'],['Desiccated Coconut','coconut','lk','Kurunegala',2.40,2.70,4.3,'1 MT']] },
      { k:'Pulses', img:'chickpea', ban:'chickpea', tag:'Lentils, beans & gram', n:80, c:10, from:'0.85', unit:'kg', o:['in','ca','au','tr','et','mx'],
        subs:[['Chickpea','chickpea'],['Lentils','🫘'],['Pigeon Pea','🫘'],['Mung Bean','🫛'],['Kidney Bean','🫘'],['Black Gram','🫘']],
        p:[['Kabuli Chickpea 12mm','chickpea','in','Indore',1.25,1.40,4.5,'1 MT'],['Red Lentils — Football','chickpea','ca','Saskatoon',0.92,1.02,4.4,'1 MT']] },
      { k:'Oilseeds', img:'sesame', ban:'sesame', tag:'Seeds for oil & food', n:60, c:8, from:'1.15', unit:'kg', o:['in','et','ng','tz','cn','ar'],
        subs:[['Sesame','sesame'],['Groundnut','🥜'],['Mustard','🌼'],['Sunflower','🌻'],['Flaxseed','🌾'],['Soybean','🫘']],
        p:[['Hulled White Sesame 99.95%','sesame','in','Gujarat',1.85,2.05,4.6,'1 MT'],['Natural Sesame Seeds','sesame','et','Humera',1.40,1.55,4.3,'1 MT']] },
      { k:'Beverages', img:'tea', ban:'tea', tag:'Tea, coffee & cocoa', n:70, c:9, from:'3.20', unit:'kg', o:['in','lk','ke','vn','co','br'],
        subs:[['Tea','tea'],['Coffee','coffee'],['Cocoa','🍫'],['Herbal Tea','🌿']],
        p:[['Assam CTC Tea BOP','tea','in','Dibrugarh',3.20,3.55,4.5,'100 kg'],['Arabica Coffee Plantation A','coffee','in','Chikmagalur',6.90,7.40,4.7,'300 kg'],['Ceylon Orange Pekoe','tea','lk','Nuwara Eliya',5.40,5.90,4.6,'100 kg']] },
      { k:'Vegetables', img:'onion', ban:'onion', tag:'Fresh & dehydrated', n:110, c:10, from:'0.30', unit:'kg', o:['in','eg','nl','cn','mx','pk'],
        subs:[['Onion','onion'],['Green Chilli','chilli'],['Potato','🥔'],['Garlic','🧄'],['Tomato','🍅'],['Ginger','🫚']],
        p:[['Nashik Red Onion 55mm+','onion','in','Lasalgaon',0.32,0.36,4.4,'5 MT'],['Fresh Green Chilli G4','chilli','in','Guntur',1.10,1.25,4.2,'1 MT']] },
      { k:'Textiles', img:'cotton', ban:'cotton', tag:'Fibre, yarn & fabric', n:75, c:8, from:'1.60', unit:'kg', o:['in','us','bd','pk','eg','tr'],
        subs:[['Raw Cotton','cotton'],['Cotton Yarn','🧵'],['Jute','🧺'],['Silk','🧣'],['Fabric','👕']],
        p:[['Shankar-6 Raw Cotton','cotton','in','Rajkot',1.60,1.75,4.5,'10 MT'],['Giza 86 Long Staple Cotton','cotton','eg','Delta',2.90,3.15,4.6,'5 MT']] },
      { k:'Minerals', img:'granite', ban:'granite', tag:'Stone, slabs & ores', n:50, c:7, from:'38', unit:'m²', o:['in','br','it','cn','tr','gr'],
        subs:[['Granite','granite'],['Marble','🪨'],['Quartz','💎'],['Sandstone','🧱'],['Slate','🪨']],
        p:[['Black Galaxy Granite Slab','granite','in','Ongole',48,54,4.6,'200 m²'],['Absolute Black Granite','granite','in','Chamarajanagar',38,42,4.5,'200 m²']] }
    ];
    var CNM = { in:'India', ph:'Philippines', th:'Thailand', mx:'Mexico', br:'Brazil', eg:'Egypt', pe:'Peru', za:'South Africa', vn:'Vietnam', pk:'Pakistan', us:'USA', id:'Indonesia', lk:'Sri Lanka', tr:'Türkiye', ma:'Morocco', ci:'Côte d’Ivoire', gh:'Ghana', ca:'Canada', au:'Australia', et:'Ethiopia', ng:'Nigeria', tz:'Tanzania', cn:'China', ar:'Argentina', ke:'Kenya', co:'Colombia', nl:'Netherlands', bd:'Bangladesh', it:'Italy', gr:'Greece' };
    var cur = 0, q = '';
    var SHIP = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20c2 1 4 1 6 0s4-1 6 0 4 1 6 0"/><path d="M4 18l-1-5h18l-2 5"/><path d="M12 4v9M7 13V8h10v5"/></svg>';
    var ARR = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    var STAR = '<svg viewBox="0 0 24 24"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>';
    function thumb(v){ return v.length > 3 ? '<img src="' + I(v) + '" alt="" loading="lazy">' : '<i>' + v + '</i>'; }
    function sub(s){ return '<div class="c2-sub" data-goto="category-products" data-category="' + s[0] + '"><span class="c2-st' + (s[1].length > 3 ? '' : ' em') + '">' + thumb(s[1]) + '</span><b>' + s[0] + '</b></div>'; }
    function prod(p, cat){ var off = Math.round((1 - p[4] / p[5]) * 100), u = cat ? cat.unit : 'kg';
      return '<div class="c2-p" data-goto="product-details"><div class="c2-pi"><img src="' + I(p[1]) + '" alt="" loading="lazy"><span class="c2-off">' + off + '% off</span><span class="c2-rt">' + STAR + p[6] + '</span></div>' +
        '<div class="c2-pb"><b>' + p[0] + '</b><small><img src="assets/images/flags/' + p[2] + '.png" alt="">' + p[3] + '</small><div class="c2-pr"><em>$' + (p[4] < 10 ? p[4].toFixed(2) : p[4]) + '</em><span>/' + u + '</span><s>$' + (p[5] < 10 ? p[5].toFixed(2) : p[5]) + '</s></div><div class="c2-moq">MOQ ' + p[7] + '</div><div class="c2-incl">' + SHIP + 'Incl. Freight &amp; Shipping</div></div></div>'; }
    function rail(){
      $c('c2-chips').innerHTML = CATS.map(function(c, i){ return '<span class="' + (i === cur && !q ? 'on' : '') + '" data-c2="' + i + '"><img src="' + I(c.img) + '" alt="">' + c.k + '</span>'; }).join('');
      $c('c2-rail').innerHTML = CATS.map(function(c, i){ return '<div class="c2-ri' + (i === cur && !q ? ' on' : '') + '" data-c2="' + i + '"><span><img src="' + I(c.img) + '" alt="" loading="lazy"></span><b>' + c.k + '</b></div>'; }).join('');
    }
    function panel(anim){
      var c = CATS[cur], el = $c('c2-panel'), h;
      if (q){
        var ql = q.toLowerCase(), subs = [], ps = [];
        CATS.forEach(function(x){ x.subs.forEach(function(s){ if ((s[0] + ' ' + x.k).toLowerCase().indexOf(ql) > -1) subs.push(s); }); x.p.forEach(function(p){ if ((p[0] + ' ' + x.k + ' ' + p[3]).toLowerCase().indexOf(ql) > -1) ps.push([p, x]); }); });
        h = '<div class="c2-sh">Results for “' + q.replace(/</g, '&lt;') + '”</div>' +
          (subs.length ? '<div class="c2-h"><b>Types</b><small>' + subs.length + '</small></div><div class="c2-subs">' + subs.map(sub).join('') + '</div>' : '') +
          (ps.length ? '<div class="c2-h"><b>Products</b><small>' + ps.length + '</small></div><div class="c2-ps">' + ps.map(function(x){ return prod(x[0], x[1]); }).join('') + '</div>' : '') +
          (!subs.length && !ps.length ? '<div class="c2-empty"><i>🔍</i><b>No matches</b><small>Try “mango”, “rice” or “pepper”</small></div>' : '');
      } else {
        h = '<div class="c2-hero"><img src="' + I(c.ban) + '" alt=""><div class="c2-hc"><span class="c2-tag">' + c.tag + '</span><h2>' + c.k + '</h2>' +
            '<div class="c2-stats"><span><b>' + c.n + '+</b>products</span><span><b>' + c.c + '</b>countries</span><span><b>$' + c.from + '</b>from /' + c.unit + '</span></div>' +
            '</div><button class="c2-all" data-goto="category-products" data-category="' + c.k + '">Explore all ' + ARR + '</button></div>' +
          '<div class="c2-h"><b>Shop by type</b><small>' + c.subs.length + ' types</small></div><div class="c2-subs">' + c.subs.map(sub).join('') + '</div>' +
          '<div class="c2-h"><b>Top origins</b></div><div class="c2-orig">' + c.o.map(function(k){ return '<span data-goto="category-products" data-category="' + c.k + ' · ' + CNM[k] + '"><img src="assets/images/flags/' + k + '.png" alt="">' + CNM[k] + '</span>'; }).join('') + '</div>' +
          '<div class="c2-h"><b>Trending in ' + c.k + '</b><a data-goto="category-products" data-category="' + c.k + '">See all</a></div><div class="c2-ps">' + c.p.map(function(p){ return prod(p, c); }).join('') + '</div>';
      }
      el.innerHTML = '<div class="c2-in' + (anim ? ' anim' : '') + '">' + h + '</div>'; el.scrollTop = 0;
    }
    function $c(id){ return document.getElementById(id); }
    rail(); panel(false);
    var wrap = $c('c2-wrap');
    function setRail(open){ wrap.classList.toggle('closed', !open); try { localStorage.setItem('c2rail', open ? '1' : '0'); } catch (er) {} }
    try { if (localStorage.getItem('c2rail') === '0') wrap.classList.add('closed'); } catch (er) {}
    // swipe left to close the rail, swipe right to open it
    var sx = null, sy = 0;
    wrap.addEventListener('pointerdown', function(e){ sx = e.clientX; sy = e.clientY; });
    wrap.addEventListener('pointerup', function(e){
      if (sx == null) return; var dx = e.clientX - sx, dy = e.clientY - sy, x0 = sx - wrap.getBoundingClientRect().left; sx = null;
      if (Math.abs(dx) < 45 || Math.abs(dy) > Math.abs(dx) * 0.7) return;
      var closed = wrap.classList.contains('closed');
      if (dx < 0 && !closed && x0 < 140) setRail(false);
      else if (dx > 0 && closed && x0 < 120) setRail(true);
    });
    wrap.addEventListener('pointercancel', function(){ sx = null; });
    root.addEventListener('click', function(e){
      var t = e.target.closest('[data-c2]');
      if (t){ cur = +t.dataset.c2; q = ''; $c('c2-q').value = ''; root.classList.remove('c2-searching'); rail(); panel(true); root.querySelectorAll('.c2-ri.on, #c2-chips .on').forEach(function(x){ x.scrollIntoView({ block:'nearest', inline:'center', behavior:'smooth' }); }); return; }
      if (e.target.closest('#c2-tog')){ setRail(wrap.classList.contains('closed')); return; }
      if (e.target.closest('#c2-x')){ q = ''; $c('c2-q').value = ''; root.classList.remove('c2-searching'); rail(); panel(true); }
    });
    $c('c2-q').addEventListener('input', function(){ q = this.value.trim(); root.classList.toggle('c2-searching', !!q); rail(); panel(false); });
  })();
