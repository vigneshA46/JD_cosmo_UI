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

  // ---- v6: product details interactions ----
  (function(){
    var q = document.getElementById('pd-qty'); if (!q) return;
    var TIERS = [[0,1.20],[2000,1.12],[10000,1.05]];
    function unitMT(){ var u = document.querySelector('.qty-unit .vchip.on'); return u && u.dataset.unit === 'mt'; }
    function val(){ return parseFloat((q.value || '0').replace(/,/g,'')) || 0; }
    function updateQty(){
      var kg = val() * (unitMT() ? 1000 : 1), t = 0;
      TIERS.forEach(function(x, i){ if (kg >= x[0]) t = i; });
      document.querySelectorAll('.tiers .tier').forEach(function(el, i){ el.classList.toggle('on', i === t); });
      document.getElementById('pd-total').textContent = '$' + (kg * TIERS[t][1]).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
      var h = document.getElementById('pd-qty-hint');
      if (kg < 500){ h.textContent = 'Below MOQ — minimum order is 500 kg'; h.classList.add('warn'); }
      else { h.textContent = 'Tier price $' + TIERS[t][1].toFixed(2) + '/kg applied · prices drop as quantity grows'; h.classList.remove('warn'); }
    }
    document.addEventListener('click', function(e){
      var chip = e.target.closest('[data-chipgroup] .vchip');
      if (!chip) return;
      var wasMT = chip.dataset.unit && unitMT();
      chip.parentElement.querySelectorAll('.vchip').forEach(function(c){ c.classList.remove('on'); }); chip.classList.add('on');
      if (chip.dataset.unit && wasMT !== unitMT()){
        var v = unitMT() ? val() / 1000 : val() * 1000;
        q.value = v.toLocaleString('en-US', {maximumFractionDigits:3}); updateQty();
      }
    });
    document.querySelectorAll('[data-qty-step]').forEach(function(b){
      b.addEventListener('click', function(){
        var step = unitMT() ? (parseFloat(b.dataset.qtyStep) > 0 ? 1 : -1) : parseFloat(b.dataset.qtyStep);
        var v = Math.max(0, val() + step);
        q.value = v.toLocaleString('en-US', {maximumFractionDigits:3}); updateQty();
      });
    });
    q.addEventListener('input', updateQty);
    q.addEventListener('blur', function(){ q.value = val().toLocaleString('en-US', {maximumFractionDigits:3}); });
    var n = 0, cart = document.getElementById('pd-cart'), badge = document.getElementById('pd-cart-n'), toast = document.getElementById('pd-toast');
    cart.addEventListener('click', function(){
      n++; badge.textContent = n; badge.classList.add('show');
      toast.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(function(){ toast.classList.remove('show'); }, 1600);
    });
    updateQty();
  })();

  render();

  // ---- country sheet + continent page ----
  (function(){
    var CONT = {"asia": {"name": "Asia", "list": [["in", "India", "Spices · Rice · Fruits", 1240, 420], ["vn", "Vietnam", "Cashew · Pepper · Coffee", 410, 138], ["th", "Thailand", "Rice · Durian · Tapioca", 365, 121], ["id", "Indonesia", "Coconut · Cocoa · Spices", 298, 104], ["lk", "Sri Lanka", "Tea · Cinnamon · Coconut", 212, 77], ["my", "Malaysia", "Palm oil · Durian · Pepper", 176, 58], ["ph", "Philippines", "Banana · Coconut · Mango", 158, 52], ["cn", "China", "Garlic · Ginger · Tea", 520, 190], ["bd", "Bangladesh", "Jute · Rice · Shrimp", 96, 31], ["pk", "Pakistan", "Basmati · Kinnow · Dates", 188, 66], ["jp", "Japan", "Matcha · Rice · Seafood", 84, 29], ["kr", "South Korea", "Ginseng · Kimchi · Pear", 71, 24]]}, "me": {"name": "Middle East", "list": [["ae", "UAE", "Dates · Re-export hub", 214, 88], ["sa", "Saudi Arabia", "Dates · Coffee · Honey", 122, 41], ["tr", "Türkiye", "Hazelnut · Apricot · Figs", 286, 97], ["ir", "Iran", "Saffron · Pistachio · Dates", 174, 62], ["om", "Oman", "Dates · Frankincense", 48, 17], ["il", "Israel", "Citrus · Avocado · Dates", 92, 33]]}, "af": {"name": "Africa", "list": [["eg", "Egypt", "Citrus · Onion · Potato", 232, 79], ["ke", "Kenya", "Tea · Avocado · Flowers", 196, 68], ["et", "Ethiopia", "Coffee · Sesame · Pulses", 142, 49], ["za", "South Africa", "Citrus · Grapes · Wine", 248, 86], ["ng", "Nigeria", "Sesame · Cocoa · Cashew", 118, 40], ["gh", "Ghana", "Cocoa · Shea · Cashew", 104, 36], ["tz", "Tanzania", "Cashew · Clove · Coffee", 87, 30], ["ma", "Morocco", "Citrus · Olives · Argan", 134, 45], ["ci", "Côte d’Ivoire", "Cocoa · Cashew · Rubber", 112, 38], ["ug", "Uganda", "Coffee · Vanilla · Banana", 69, 23]]}, "eu": {"name": "Europe", "list": [["es", "Spain", "Olive oil · Citrus · Almond", 268, 94], ["it", "Italy", "Pasta · Olive oil · Tomato", 254, 90], ["nl", "Netherlands", "Dairy · Onion · Potato", 186, 64], ["fr", "France", "Wheat · Dairy · Wine", 201, 70], ["gr", "Greece", "Olives · Feta · Honey", 117, 39], ["de", "Germany", "Malt · Dairy · Confectionery", 143, 51], ["pl", "Poland", "Apple · Berries · Mushroom", 109, 37]]}, "na": {"name": "North America", "list": [["us", "United States", "Almond · Soy · Corn", 388, 140], ["mx", "Mexico", "Avocado · Chilli · Lime", 224, 77], ["ca", "Canada", "Pulses · Canola · Maple", 176, 60], ["gt", "Guatemala", "Cardamom · Coffee · Banana", 73, 25]]}, "sa": {"name": "South America", "list": [["br", "Brazil", "Coffee · Sugar · Soy", 342, 118], ["cl", "Chile", "Cherry · Grapes · Walnut", 158, 54], ["pe", "Peru", "Blueberry · Quinoa · Avocado", 176, 61], ["ar", "Argentina", "Soy · Beef · Lemon", 149, 52], ["co", "Colombia", "Coffee · Banana · Flowers", 131, 45], ["ec", "Ecuador", "Banana · Cocoa · Shrimp", 112, 39]]}, "oc": {"name": "Oceania", "list": [["au", "Australia", "Wheat · Barley · Macadamia", 214, 74], ["nz", "New Zealand", "Kiwifruit · Dairy · Honey", 138, 48], ["fj", "Fiji", "Ginger · Kava · Taro", 36, 12]]}};
    var CHEV = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 6l6 6-6 6\"/></svg>";
    function flagSrc(k){ return 'assets/images/flags/' + k + '.png'; }
    function fmt(n){ return n.toLocaleString('en-US'); }
    function fillContinent(key){
      var c = CONT[key]; if (!c) return;
      var p = 0, e = 0; c.list.forEach(function(x){ p += x[3]; e += x[4]; });
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
          '<div class="ct-rb"><b>' + x[1] + '</b><small>' + x[2] + '</small><div class="ct-meta"><span>' + fmt(x[3]) + ' products</span><span>' + fmt(x[4]) + ' exporters</span></div></div>' + CHEV + '</div>';
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
