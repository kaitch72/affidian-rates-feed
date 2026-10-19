/* ==========================================================================
   Affidian Rates Box — app
   1. Pull the rates page (proxy → direct → saved copy → bundled snapshot)
   2. Parse every <table> on it, remembering the heading above each one
   3. Show the category named in the URL hash (index.html#savings)
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.RATES_CONFIG;
  var CACHE_KEY = "affidianRatesCache.v1";
  var state = { data: null, source: "" };

  /* ---------- helpers ---------------------------------------------------- */
  function $(sel) { return document.querySelector(sel); }
  function norm(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }
  function clean(s) { return String(s || "").replace(/\s+/g, " ").trim(); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function store(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  function load(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } }

  /* ---------- 1. fetch --------------------------------------------------- */
  function fetchText(url) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, 15000);
    return fetch(url, { cache: "no-store", signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) {
        clearTimeout(t);
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      });
  }

  function getRates() {
    var urls = [];
    if (CFG.proxyUrl) urls.push(CFG.proxyUrl);
    if (CFG.sourceUrl) urls.push(CFG.sourceUrl);

    function attempt(i) {
      if (i >= urls.length) return Promise.reject(new Error("all sources failed"));
      return fetchText(urls[i])
        .then(function (html) {
          var data = parsePage(html);
          if (!data.tables.length) throw new Error("no tables found");
          return data;
        })
        .catch(function (err) {
          console.warn("[rates] source failed:", urls[i], err.message);
          return attempt(i + 1);
        });
    }

    return attempt(0)
      .then(function (data) {
        data.fetchedAt = new Date().toISOString();
        store(CACHE_KEY, data);
        return { data: data, source: "live" };
      })
      .catch(function () {
        var cached = load(CACHE_KEY);
        if (cached && cached.tables && cached.tables.length) return { data: cached, source: "cached " + (cached.fetchedAt || "").slice(0, 10) };
        return { data: window.RATES_FALLBACK, source: "snapshot " + window.RATES_FALLBACK.capturedAt };
      });
  }

  /* ---------- 2. parse --------------------------------------------------- */
  function parsePage(html) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    var tables = [];
    var lastHeading = "";

    doc.querySelectorAll("h1,h2,h3,h4,h5,h6,table").forEach(function (el) {
      if (el.tagName !== "TABLE") { lastHeading = clean(el.textContent); return; }

      var trs = Array.prototype.slice.call(el.querySelectorAll("tr"));
      if (!trs.length) return;
      var cells = function (tr) {
        return Array.prototype.map.call(tr.querySelectorAll("th,td"), function (c) { return clean(c.textContent); });
      };
      var headRow = el.querySelector("thead tr") || trs[0];
      var rows = trs.filter(function (tr) { return tr !== headRow; }).map(cells)
                    .filter(function (r) { return r.length && r.join("").length; });
      var cap = el.querySelector("caption");
      tables.push({ heading: cap ? clean(cap.textContent) : lastHeading, headers: cells(headRow), rows: rows });
    });

    var text = clean(doc.body ? doc.body.textContent : "");
    var m = text.match(/rates effective as of\s+([A-Za-z]+\.? \d{1,2}(?:st|nd|rd|th)?,? \d{4})/i);
    return { effective: m ? m[1] : "", tables: tables };
  }

  /* ---------- 3. map config rows → table cells -------------------------- */
  function findRow(spec, kind) {
    var want = norm(spec.match);
    var tables = state.data.tables;
    if (spec.table) {
      var exact = tables.filter(function (t) { return norm(t.heading) === norm(spec.table); });
      tables = exact.length ? exact : tables.filter(function (t) { return norm(t.heading).indexOf(norm(spec.table)) === 0; });
    }
    var colName = norm(spec.col || (kind === "loan" ? "Terms & APR" : "APY"));

    for (var pass = 0; pass < 2; pass++) {               // pass 0: starts with, pass 1: contains
      for (var i = 0; i < tables.length; i++) {
        var t = tables[i];
        for (var j = 0; j < t.rows.length; j++) {
          var name = norm(t.rows[j][0]);
          var hit = pass === 0 ? name.indexOf(want) === 0 : name.indexOf(want) > -1;
          if (!hit) continue;
          var hdr = t.headers.map(norm);
          var ci = hdr.indexOf(colName);
          if (ci < 0) ci = hdr.findIndex(function (h) { return h.indexOf(colName) > -1; });
          if (ci < 0) ci = t.rows[j].length - 1;
          var fi = hdr.indexOf("features");
          return { raw: t.rows[j][ci] || "", features: fi > -1 ? t.rows[j][fi] : "" };
        }
      }
    }
    return null;
  }

  // Raw cell text → { pre, value, sub[], cls }
  function formatValue(raw, kind) {
    raw = clean(raw);
    var pcts = raw.match(/\d+(?:\.\d+)?%/g) || [];

    if (!pcts.length) {
      if (/view|today|call|see/i.test(raw)) return { pre: "", value: "Call or scan", sub: ["for today's rates"], cls: "is-text" };
      return { pre: "", value: raw && raw !== "N/A" ? raw : "—", sub: [], cls: "is-text" };
    }

    if (kind === "deposit") {
      if (/ to /i.test(raw) && pcts.length > 1) return { pre: "", value: pcts[0] + " – " + pcts[1], sub: ["blended APY"], cls: "is-long" };
      return { pre: "", value: pcts[0], sub: [], cls: "" };
    }

    // Credit cards: "Prime + 9%; current rate 16.00%"
    var cur = raw.match(/current rate\s*(\d+(?:\.\d+)?%)/i);
    if (cur) {
      var prime = raw.match(/prime\s*\+\s*\d+(?:\.\d+)?%/i);
      return { pre: "Current APR", value: cur[1], sub: prime ? [prime[0].replace(/prime/i, "Prime")] : [], cls: "" };
    }

    // Loans: "As Low as 4.50% (60 mo.); 5.00% (72 mo.)"
    var parts = raw.replace(/^as low as\s*/i, "").split(";").map(clean);
    var re = /(\d+(?:\.\d+)?%)\s*(?:\(([^)]*)\))?/;
    var first = parts[0].match(re);
    var sub = [];
    if (first && first[2]) sub.push(first[2]);
    parts.slice(1).forEach(function (p) {
      var m = p.match(re);
      if (m) sub.push(m[1] + (m[2] ? " · " + m[2] : ""));
    });
    return { pre: /as low as/i.test(raw) ? "As low as" : "", value: first ? first[1] : pcts[0], sub: sub, cls: "" };
  }

  /* ---------- render ----------------------------------------------------- */
  function currentCategory() {
    var id = location.hash.replace("#", "").toLowerCase();
    var byId = function (x) { return CFG.categories.filter(function (c) { return c.id === x; })[0]; };
    return byId(id) || byId(CFG.defaultCategory) || CFG.categories[0];
  }

  function render(keepScroll) {
    var cat = currentCategory();
    var rowsEl = $("#rows");
    var top = keepScroll ? rowsEl.scrollTop : 0;

    $("#panel").className = "panel c-" + cat.color;
    $("#catTitle").textContent = cat.title;
    $("#valueLabel").textContent = cat.kind === "loan" ? "APR" : "APY";
    document.title = "Affidian Rates · " + cat.title;

    var alt = false;
    rowsEl.innerHTML = cat.rows.map(function (spec) {
      if (spec.group) { alt = false; return '<div class="row-group">' + esc(spec.group) + "</div>"; }
      var hit = findRow(spec, cat.kind);
      if (!hit) console.warn("[rates] no match for", cat.id, spec.match);
      var v = hit ? formatValue(hit.raw, cat.kind) : { pre: "", value: "—", sub: [], cls: "is-text" };
      var features = spec.features && hit ? hit.features : "";
      alt = !alt;
      return '<div class="row' + (alt ? " alt" : "") + '">' +
               '<div class="row-label">' + esc(spec.label) + (features ? "<small>" + esc(features) + "</small>" : "") + "</div>" +
               '<div class="row-value">' +
                 (v.pre ? '<span class="pre">' + esc(v.pre) + "</span>" : "") +
                 '<b class="' + v.cls + '">' + esc(v.value) + "</b>" +
                 (v.sub.length ? '<span class="sub">' + v.sub.map(esc).join("<br>") + "</span>" : "") +
               "</div>" +
             "</div>";
    }).join("");
    rowsEl.scrollTop = top;

    // "Last Refreshed" = last time live rates were pulled successfully
    // (or the snapshot date if the site has never been reached)
    var stamp = state.data.fetchedAt || state.data.capturedAt || "";
    var d = stamp ? new Date(stamp) : null;
    var fmt = { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
               timeZone: CFG.timeZone || "America/Denver", timeZoneName: "short" };
    $("#refreshed").textContent = d && !isNaN(d) ? "Last Refreshed: " + d.toLocaleString("en-US", fmt) : "";

    var tag = $("#sourceTag");
    tag.hidden = !CFG.showSourceStatus;
    tag.textContent = "source: " + state.source + (state.data.effective ? " · effective " + state.data.effective : "");
  }

  function refresh() {
    return getRates().then(function (res) {
      state.data = res.data;
      state.source = res.source;
      render(true);                         // don't jump while someone is reading
      console.info("[rates] loaded from", res.source);
    });
  }

  /* ---------- boot ------------------------------------------------------- */
  var back = $("#backBtn");
  back.hidden = !CFG.showBackArrow;
  back.addEventListener("click", function () { history.back(); });
  window.addEventListener("hashchange", function () { render(false); });
  document.addEventListener("contextmenu", function (e) { e.preventDefault(); });

  // Paint instantly from the saved copy / snapshot, then swap in live data
  state.data = load(CACHE_KEY) || window.RATES_FALLBACK;
  state.source = "initial";
  render(false);
  refresh();
  if (CFG.refreshMinutes > 0) setInterval(refresh, CFG.refreshMinutes * 60000);

  window.AffidianRates = { refresh: refresh, parsePage: parsePage, state: state };
})();
