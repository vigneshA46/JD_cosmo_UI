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
