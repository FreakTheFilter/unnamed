/* U.N.N.A.M.E.D. exported 23 August 2026 */
/* ============================================================
   U.N.N.A.M.E.D. — THE SHARED SURFACE
   unnamed.js · extracted 10 August 2026

   The chrome's behaviour, once, for every page: the environment flags,
   the type gauge, the scramble, the clocks, the wordmark's habit, the
   colour engine, and the three floating objects (the picker, the
   asterisk, Ask).

   HOW A PAGE USES IT
     <link rel="stylesheet" href="unnamed.css">
     ... markup ...
     <script src="unnamed.js"></script>
     <script>  // the page's own script, after this one
       window.UN_NOTES = { general: [...] };     // the asterisk's material
       UN.start({ sections: [[id, label], ...],  // for the nav and the notes
                  reveal: ".rv, .rvb" });        // what fades in on this page
     </script>

   WHY THE ORDER MATTERS: this file's top-level declarations (pad,
   clamp01, easeOut, charWidth, scrambleInto, paint, setBg, reduced,
   SMALL, phone) become globals the page's script then uses, so this
   script has to come FIRST. Everything that needs the page's own data
   waits for UN.start().

   THE LINE BETWEEN THE TWO FILES: behaviour lives here, CONTENT lives in
   the page. The asterisk's maxims and the nav's section list are content.
   The way the asterisk breathes and the way the nav locks its width are
   not.
   ============================================================ */

/* ---------- UNDER SAFARI'S BARS: ON AN IPHONE THE PAGE SCROLLS IN <body> ----------
   (6 Oct, iOS 26; the why is under the same heading in unnamed.css.) The
   document is held a spill's height down and <body> is the scroller, so the
   window's scroll is handed to <body> here, once, before any script asks for
   it: scrollY, pageYOffset, scrollTo / scroll / scrollBy and the `scroll`
   event all answer for <body>. The pages' own scripts still talk to `window`
   and are not touched. The test is the stylesheet's own, so the two can never
   disagree about which phone this is.

   NOT IN THE PARALLAX PROTOTYPE (8 Oct, at Kir's direction: "use the parallax
   principle we used on my portfolio: we know the screen height and the
   animation the block should play, we adapt the fragment to the screen
   height, we scroll, and the content goes under the bars top and bottom; the
   toolbar should fold into the pill"). Kir's device test the same day:
   <body>'s throws were cut dead in one frame (7 of 11), the document's flew.
   A page whose <head> has put `px` on the root (nike-diamond.html, THE
   PARALLAX PROTOTYPE) scrolls the document itself on an iPhone, so there is
   no hold, no hand-over of the window, no restore from sessionStorage, and no
   one-pixel step (LOOK stays a no-op): Safari sees the document move and
   tints its bars from it. Its scenes ride the page instead of pinning, and
   come to rest on their calm (A SCENE'S CALM IS A SEAM, below). Every page
   without `px` is untouched. */
const PX = document.documentElement.classList.contains("px");
const SPILL = !PX && CSS.supports("-webkit-touch-callout", "none") && CSS.supports("height", "100lvh")
           && matchMedia("screen and (hover: none) and (pointer: coarse) and (max-device-width: 500px)").matches;
let SPILL_PX = 0;   /* how far past the glass, at each end; 0 everywhere else */
let FLOOR_PX = 0;   /* how much of a pinned frame lies under the toolbar (--floor) */
let LANDING = false; /* a touch screen's chapter landing is running (ON A TOUCH SCREEN THE PAGE LANDS) */
let LOOK = () => {};  /* Safari is told the page has moved (AND SAFARI IS TOLD), only at rest (NOTHING WRITES A SCROLL) */
if (SPILL) {
  const root = document.documentElement, body = document.body;
  /* --floor is a length in viewport units, so it is read back off a probe */
  const probe = document.createElement("i");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText = "position:absolute;left:0;top:0;width:0;height:var(--floor);visibility:hidden;pointer-events:none";
  body.appendChild(probe);
  const measure = () => {
    SPILL_PX = parseFloat(getComputedStyle(root).getPropertyValue("--spill")) || 0;
    FLOOR_PX = probe.offsetHeight;
  };
  /* the document only moves when something moves it on purpose (a tap on
     the clock, a jump to an anchor); it is put straight back */
  const hold = () => { if (Math.abs(root.scrollTop - SPILL_PX) > 0.5) root.scrollTop = SPILL_PX; };
  for (const k of ["scrollY", "pageYOffset"])
    Object.defineProperty(window, k, { configurable:true, get:() => body.scrollTop });
  const pass = fn => (a, b) => (a !== null && typeof a === "object") ? body[fn](a) : body[fn](+a || 0, +b || 0);
  window.scrollTo = window.scroll = pass("scrollTo");
  window.scrollBy = pass("scrollBy");
  body.addEventListener("scroll", () => dispatchEvent(new Event("scroll")), { passive:true });
  /* the document's own scroll events (the hold, the nudge) are put back and
     stopped here, so the pages' scroll handlers hear only <body>'s scroll */
  addEventListener("scroll", e => {
    if (e.target === document) { hold(); e.stopImmediatePropagation(); }
  }, { capture:true, passive:true });
  /* AND SAFARI IS TOLD THE PAGE HAS MOVED. What goes under the bars (the page
     drawn through, or one colour sampled off the edge where the edge is one
     colour) is chosen again only when the DOCUMENT scrolls, and here it never
     does: the toolbar kept whatever it chose last, so the dark opening left a
     dark band under it all the way down the light chapters. A one-pixel step
     and back makes Safari look again. Measured: a device pixel is not enough to be
     noticed, a CSS pixel is.

     ONLY ONCE THE PAGE HAS STOPPED (8 Oct, at Kir's report from the phone:
     "something stops me abruptly ... as if the inertia disappears on a stretch
     of the site"). The step is a write to the document's scroll, and WebKit
     answers a script's scroll write by stopping the scroll view it lands on.
     It used to fire 150ms after the last scroll event, and in mid-throw when
     the ground under a bar changed colour (7 Oct). On the busy stretches (a
     wall dealing its pictures, a film starting) the scroll events pause for
     longer than that while the page is still flying, so the step could land in
     the middle of a throw (measured in Chromium: 12 throws in 48, 11 of them
     at the Overview wall). Whether a stop on the document reaches <body>'s
     throw is not known, so it is not risked: the step waits for a scroll that
     has really ended (NOTHING WRITES A SCROLL WHILE ONE IS MOVING, below). The
     bars take the new colour when the page stops, not while the ground passes
     under them. */
  LOOK = () => {
    if (LANDING) return;              /* a chapter landing is still moving; its rest looks again */
    root.scrollTop = SPILL_PX + 1;
    requestAnimationFrame(hold);
  };
  addEventListener("resize", () => { measure(); hold(); });
  addEventListener("pageshow", hold);
  measure(); hold();
  /* AND IT LANDS WHERE THE WINDOW WOULD HAVE: on the #section in the address,
     or back where it was after a reload or a step back (which wins over the
     #section, as it does for the window), unless the page has asked to open
     at the top. `window.history`: this file's own `history` is Ask's transcript. */
  const KEY = "un-y:" + location.pathname;
  /* and not under a finger: `load` waits for every picture, and a write to
     <body> under a moving finger stops it dead (NOTHING WRITES A SCROLL) */
  let fingers = 0;
  addEventListener("touchstart", e => { fingers = e.touches.length; }, { passive:true, capture:true });
  for (const t of ["touchend", "touchcancel"])
    addEventListener(t, e => { fingers = e.touches.length; }, { passive:true, capture:true });
  addEventListener("pagehide", () => { try { sessionStorage.setItem(KEY, body.scrollTop); } catch (e) {} });
  addEventListener("load", () => {
    measure(); hold();
    /* a reader who is already scrolling is not yanked anywhere */
    if (fingers || body.scrollTop > 2) return;
    const how = (performance.getEntriesByType("navigation")[0] || {}).type;
    let y = null;
    try { y = sessionStorage.getItem(KEY); } catch (e) {}
    let at = null;
    try { at = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (e) {}
    if (y !== null && (how === "reload" || how === "back_forward") && window.history.scrollRestoration !== "manual")
      body.scrollTo({ top:+y, behavior:"instant" });
    else if (at) at.scrollIntoView({ block:"start", behavior:"instant" });
    hold();
  });
}
/* where an element starts in the page's own scroll. offsetTop is that only
   while <body> has no padding, and on an iPhone it carries the spill. */
const docTop = el => SPILL ? el.getBoundingClientRect().top + scrollY : el.offsetTop;

/* ---------- ON A TOUCH SCREEN THE PAGE LANDS ON A CHAPTER, IT IS NOT CAUGHT ----------
   (7 Oct, at Kir's direction: "the scroll on the phone is slow, uneven, low
   inertia, different on every block ... keep Manny's idea, just make it smooth".)

   THE CATCH COST THE THROW. On an iPhone, any snap area at all switches the
   scroller to UIKit's FAST deceleration (WebKit sets decelerationRate Fast
   whenever snap offsets exist, proximity or mandatory alike): a flick on a case
   page coasted about a fifth of the same flick on the index, which has none.
   And `scroll-snap-stop: always` on every chapter stopped any throw that would
   cross a seam (measured: half the flicks on a case page ended on one). So on a
   touch screen the CSS snap is off (unnamed.css, ON A TOUCH SCREEN THE CATCH IS
   SCRIPTED, NOT SNAPPED), the throw keeps the platform's own inertia, and the
   pacing figure is kept by this: once a scroll the reader's finger moved has
   come to rest, the block it stopped in draws the page the rest of the way.

   IT MEASURES THE WAY CSS SNAP DOES. The same snap areas the pages declare,
   aligned by their own scroll-margin (the 16:9 panels land at the bar's edge,
   not under it), and every target clamped to the scroll range, so the footer's
   end seam is the bottom of the page. A page already on a seam stays. An area
   inside a sticky frame is not a seam: its box does not move with the scroll.

   A SCENE'S CALM IS A SEAM (8 Oct, at Kir's direction: "we know the block's
   height and what happens in the block per unit of scroll, so we can also
   ease and centre the block onto its calm default state: what we see when the
   block is fully open"). In the parallax prototype (`px`, top of this file)
   nothing pins: each scene rides the page and plays off its own scroll
   timeline, and it marks where it is fully open with a snap area of its own
   (a 1px `.px-calm`, or its seam's scroll-margin). This reads it like any
   chapter seam: the same reach, the same rules, only after `scrollend`. In
   portrait nothing is sticky there, so no stage holds the page; in landscape
   the walls still pin, and still hold it.

   IT FLIES, THEN IT EASES ONTO THE BLOCK IT STOPPED IN (8 Oct, at Kir's
   direction: "don't stop it hard, let it fly on, and if it came to rest on a
   block only partly in view, ease it onto the block we are on"). The block
   that holds the larger part of the glass is the one being read:
   - along the throw, reading down, the next seam is landed once it has climbed
     into the upper half of the glass (never more than half a glass of travel);
     reading up, the seam above is landed within 30% of the glass;
   - back against the throw, only a seam this scroll crossed and overshot by
     12% of the glass or less: the chapter's head went under the bar, and it
     is brought back. Never the seam the scroll set off from, so a slow drag
     away from a chapter is not drawn back onto it;
   - a seam within 8% of the glass beyond the first one ahead is the same
     landing, at the further one (the Close and the footer: the page lands at
     its true end).

   A PINNED STAGE IS A PLACE TO STOP, ANYWHERE ALONG IT (8 Oct, with the phone
   stages shortened at Kir's direction). A stage whose frame is pinned (the
   opening vignette, the quote and film panels, the picture walls) is taller
   than the glass, and CSS snap lets a reader rest anywhere while it covers the
   glass. The old catch drew the page back to the stage's top, where the panel
   is still opening and the quote is not yet set. So while a pinned frame holds
   the glass and no seam is in view, the page stays.

   ---------- AND NOTHING WRITES A SCROLL WHILE ONE IS MOVING ----------
   (8 Oct, at Kir's report from the phone: "when I scroll, something stops me
   abruptly, and then it's hard to move further ... as if the inertia
   disappears on a stretch of the site". His recording shows three throws at
   about 2,000px/s cut dead in one frame, all on the Overview wall and the
   film after it.)

   Safari on an iPhone answers a script's write to a scroller by stopping that
   scroller first (WebKit, ScrollingTreeScrollingNode, every Safari 26 build):
   a write in mid-throw ends the throw on the spot. The two writes this file
   makes after a scroll, the landing and the toolbar's one-pixel step (LOOK,
   AND SAFARI IS TOLD), now wait for a scroll that has really ended:
   - ONLY `scrollend` STARTS A LANDING. The browser fires it from the scroller
     itself once the finger is off and the momentum is spent, however busy the
     page is (Safari 26.2 on, Chrome). The old test, no scroll event for 140ms
     and two still frames, was fooled exactly where the page is busiest: at the
     Overview wall the events pause for 300-400ms while the page is still
     flying (measured in Chromium, 11 throws in 12 entering the wall). Where
     there is no `scrollend` (every Safari before 26.2), the throw is free and
     there is no landing.
   - THE STEP waits for a second of stillness when no `scrollend` comes, as
     after a throw a finger caught (iOS shows the page no touch for a catch).
   - A SCROLL THAT STOPPED WHILE FAST WAS STOPPED, NOT SPENT, and stays where
     it stopped: a finger that catches a throw means "here". That is the catch
     iOS does not show the page; a finger the page does see starts a new
     gesture, and only its own drag lands.
   - A TOUCH CANCELS A LANDING WITHOUT A WRITE OF ITS OWN on iOS and iPadOS
     (WebKit): the finger catches the ease the way it catches a throw. The old
     cancel wrote the position back, which there stopped the very drag that
     touch began.
   Reduced motion has no landing; it still rests, for the step. */
const GLIDE = matchMedia("(hover: none) and (pointer: coarse)").matches
           && !matchMedia("(prefers-reduced-motion: reduce)").matches;   /* a touch screen that lands */
if (SPILL || GLIDE) (() => {
  const sc = SPILL ? document.body : document.scrollingElement;
  const evt = SPILL ? document.body : window;
  const WEBKIT = CSS.supports("-webkit-touch-callout", "none");
  /* QUIET: ms without a scroll event before stillness is measured; STILL: ms it
     must then hold, with three frames. CAUGHT, in px/ms: a scroll going faster
     than this when it stopped was stopped, not spent (UIKit lets a throw go at
     about 0.15; the recorded stops came at 1.8 to 2.5). AHEAD, UP, BACK, SNUG:
     shares of the glass (IT FLIES, above). */
  const QUIET = 150, STILL = 1000, CAUGHT = 0.6;
  const AHEAD = 0.5, UP = 0.3, BACK = 0.12, SNUG = 0.08;
  let touching = false, dragged = false, moved = false, pending = false, owed = false, from = null;
  let lastY = sc.scrollTop, lastT = 0, speed = 0, dir = 0, restT = 0, gen = 0, list = null;
  const px = v => parseFloat(v) || 0;
  /* the page's own snap areas (not inside a scroller of their own, not inside
     a sticky frame), and every stage that pins a frame holding the glass (a
     lead voice or a sticky picture is not a frame: at most about three
     quarters of it). The frames are built from the small viewport (100svh),
     so the glass is measured the same way: once a phone's toolbar hides,
     innerHeight is the large one, and the frames would stop counting. */
  const read = () => {
    const seams = [], stages = [];
    const probe = document.body.appendChild(document.createElement("i"));
    probe.style.cssText = "position:absolute;left:0;top:0;width:0;height:100svh;visibility:hidden;pointer-events:none";
    const small = probe.offsetHeight || innerHeight;
    probe.remove();
    const glass = Math.min(innerHeight, small) - (document.querySelector("header") || { offsetHeight: 0 }).offsetHeight;
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (cs.position === "sticky" && el.parentElement !== document.body && el.offsetHeight >= glass * 0.9)
        stages.push(el.parentElement);
      if (!cs.scrollSnapAlign || cs.scrollSnapAlign === "none") continue;
      let free = true;
      for (let p = el; p && p !== document.body; p = p.parentElement) {
        const ps = p === el ? cs : getComputedStyle(p);
        if (ps.position === "sticky" || (p !== el && /(auto|scroll)/.test(ps.overflowY))) { free = false; break; }
      }
      if (free) seams.push({ el, end: cs.scrollSnapAlign.split(" ").pop() === "end",
                             mt: px(cs.scrollMarginTop), mb: px(cs.scrollMarginBottom) });
    }
    return { seams, stages, small };
  };
  addEventListener("load", () => { list = null; });
  addEventListener("resize", () => { list = null; });
  /* how far to move, or null to stay; `start` is where this scroll set off */
  const land = start => {
    list = list || read();
    const y = sc.scrollTop, max = sc.scrollHeight - sc.clientHeight, vh = innerHeight;
    /* the reach is a share of the SMALL glass, so the same stop lands the same
       way whether a document-scrolling phone's toolbar is folded or not (the
       end seams still meet the visible bottom, vh) */
    const g = Math.min(vh, list.small || vh);
    const bar = (document.querySelector("header") || { offsetHeight: 0 }).offsetHeight;
    const way = dir < 0 ? -1 : 1, reach = (way > 0 ? AHEAD : UP) * g;
    const went = (y - start) * way;                            /* how far this scroll went along its way */
    if (went < 2) return null;
    const ahead = [];
    let back = null, shown = false;
    for (const a of list.seams) {
      const r = a.el.getBoundingClientRect();
      if (!r.height) continue;
      /* the distance to the seam, counted along the throw */
      const d = (Math.min(max, Math.max(0, y + (a.end ? r.bottom + a.mb - vh : r.top - a.mt))) - y) * way;
      if (Math.abs(d) <= 2) return null;                       /* on a seam */
      if (r.top > bar && r.top < vh) shown = true;             /* a seam on the glass */
      if (d > 0 && d <= reach) ahead.push(d);
      else if (d < 0 && d >= -BACK * g && went + d > SNUG * g && (back === null || d > back)) back = d;   /* crossed, not set off from */
    }
    /* A PINNED STAGE IS A PLACE TO STOP: one holds the glass and no seam is on it */
    if (!shown && list.stages.some(s => { const r = s.getBoundingClientRect(); return r.top <= 2 && r.bottom >= vh - 2; }))
      return null;
    if (!ahead.length) return back === null ? null : back * way;
    ahead.sort((p, q) => p - q);
    let go = ahead[0];
    for (const d of ahead) if (d - ahead[0] <= SNUG * g) go = d;
    return go * way;
  };
  const settle = start => {
    const d = GLIDE ? land(start) : null;
    if (d === null) return false;
    LANDING = true;
    sc.scrollTo({ top: sc.scrollTop + d, behavior: "smooth" });
    return true;
  };
  /* the scroll has ended: `ended` when the browser said so, else it held still */
  const rest = ended => {
    if (touching) { if (ended) owed = true; return; }        /* a finger is down; its lift settles it */
    clearTimeout(restT); gen++;
    const start = from === null ? sc.scrollTop : from;
    pending = owed = false; from = null;
    const m = moved, caught = speed > CAUGHT;
    moved = dragged = false;
    if (LANDING) { LANDING = false; LOOK(); return; }        /* a landing has arrived */
    if (ended && m && !caught && settle(start)) return;      /* its own rest looks again */
    LOOK();
  };
  /* still means the position has held for three drawn frames and STILL ms; a
     scroll event or a finger in the meantime starts it over */
  const still = () => {
    if (touching) return;
    const g = ++gen, y = sc.scrollTop, t0 = performance.now(), seen = lastT;
    let frames = 0;
    const frame = () => {
      if (g !== gen || touching || lastT !== seen || sc.scrollTop !== y) return;
      if (++frames < 3 || performance.now() - t0 < STILL) return void requestAnimationFrame(frame);
      rest(false);
    };
    requestAnimationFrame(frame);
  };
  const arm = () => { clearTimeout(restT); restT = setTimeout(still, QUIET); };
  /* the speed is read over the last 50ms or more, not one event: after a hitch
     the events come in bunches, and a bunch is not a throw. The way is the net
     travel since the scroll began, so a slow drag back, or the last sub-pixel
     settle, reads the way it went. */
  const trail = [];
  evt.addEventListener("scroll", () => {
    const y = sc.scrollTop, now = performance.now();
    trail.push([now, y]);
    if (trail.length > 8) trail.shift();
    if (y !== lastY && !LANDING) {
      if (from === null) from = lastY;
      if (Math.abs(y - from) >= 2) dir = Math.sign(y - from);
      owed = false;                                          /* a new scroll: its own end will come */
      let k = trail.length - 2;
      while (k > 0 && now - trail[k][0] < 50) k--;
      speed = k < 0 ? 0 : Math.abs(y - trail[k][1]) / Math.max(8, now - trail[k][0]);
    }
    lastY = y; lastT = now;
    if (dragged && !LANDING) moved = true;                   /* the finger's drag, or the throw it let go */
    pending = true;
    arm();
  }, { passive: true });
  if ("onscrollend" in window) evt.addEventListener("scrollend", () => rest(true), { passive: true });
  /* what lands is a scroll the reader's finger moved: a touch that only stops
     the page leaves it where it was caught */
  addEventListener("touchstart", e => {
    touching = true;
    if (e.touches.length === 1) { dragged = moved = false; from = null; }   /* a second finger is the same gesture */
    if (LANDING) {
      LANDING = false;
      /* elsewhere the browser's ease runs on under a still finger, so it is stopped where it is */
      if (!WEBKIT) sc.scrollTo({ top: sc.scrollTop, behavior: "instant" });
    }
  }, { passive: true, capture: true });
  addEventListener("touchmove", () => { if (touching) dragged = true; }, { passive: true, capture: true });
  const lift = e => {
    touching = e.touches.length > 0;
    if (touching) return;
    speed = 0;                                               /* a throw the finger lets go reads its own speed again */
    /* an end owed to the finger is settled two frames on, and only if nothing
       has moved since: on a busy page the throw it let go may not have reached
       the page yet */
    if (owed) { const seen = lastT; requestAnimationFrame(() => requestAnimationFrame(() => { if (!touching && owed && lastT === seen) rest(true); })); }
    if (pending) arm();
  };
  addEventListener("touchend", lift, { passive: true, capture: true });
  addEventListener("touchcancel", lift, { passive: true, capture: true });
  /* an iPad's trackpad scrolls without touches, and the CSS catch is off for it too */
  addEventListener("wheel", () => { moved = true; }, { passive: true, capture: true });
})();

/* ---------- shared machinery, from the index ---------- */
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
/* the small-glass switch: one query, read live, so the figures that
   cost the most on a phone gpu (per-tile blur, the size of the wall)
   can stand down without duplicating the breakpoint in a dozen
   places. it follows a rotation, not just the first paint. */
/* A PHONE ON ITS SIDE IS STILL A PHONE. The query was width-only, so a handset
   in landscape (844x390) read as neither small nor tablet and was served the
   desktop budget: measured, fifteen films at once on a 390px-tall glass. The
   second clause catches it by the one dimension that gives it away — a short
   viewport with a touch pointer. */
const SMALLQ = matchMedia("(max-width:600px), (pointer: coarse) and (max-height:520px)");
let SMALL = SMALLQ.matches;
SMALLQ.addEventListener("change", e => { SMALL = e.matches; });
const phone = matchMedia("(max-width:600px)").matches || matchMedia("(hover:none)").matches;
/* ---------- THE TABLET SWITCH, and THE DATA SWITCH ----------
   `TABLET` is the band between the phone rules and the desktop grid, read live
   like SMALL so a rotation is honoured. The ceiling is 1024 and not 960 because
   an iPad Pro in portrait is exactly 1024 wide and is a tablet by every measure
   that matters here — a touch pointer, a battery, and one decoder budget. Both pages share these so a mobile
   decision is made once (Manny, mobile pass: "ensure they share the same
   tokens").

   `LOWDATA` is the reader telling us to stand down: Chromium browsers expose a
   data saver through `navigator.connection.saveData`, and `prefers-reduced-data`
   is the media feature for the same intent. On a page whose figures are films,
   honouring it is not a nicety — it is the difference between a page that loads
   on a train and one that does not. Films are the first thing to go.
   NOT ON AN IPHONE (7 Oct, memory plan item 4). This used to say iOS exposes Low
   Data Mode through `saveData`. It does not: Safari implements neither
   `navigator.connection` nor `prefers-reduced-data`, so an iPhone in Low Data
   Mode is not detected here and is served every film. Nor has Chrome shipped
   the media feature: it parses it only with
   chrome://flags/#enable-experimental-web-platform-features on, and only then
   can DevTools (Rendering) emulate it. That is the way to see what this switch
   does; `matchMedia("(prefers-reduced-data)").media` reads "not all" until
   the flag is on. */
/* AND A TABLET IN LANDSCAPE IS STILL A TABLET — 1180x820 on an iPad Air, 1366
   wide on a Pro. Width alone cannot see that, so the test is either the portrait
   width band OR any touch pointer that is not a phone. A desktop is untouched:
   it has a fine pointer. */
const TABLETQ = matchMedia("(min-width:601px) and (max-width:1024px)");
const COARSEQ = matchMedia("(pointer: coarse)");
let TABLET = (TABLETQ.matches || COARSEQ.matches) && !SMALL;
const tabletSync = () => { TABLET = (TABLETQ.matches || COARSEQ.matches) && !SMALL; };
TABLETQ.addEventListener("change", tabletSync);
COARSEQ.addEventListener("change", tabletSync);
SMALLQ.addEventListener("change", tabletSync);
const LOWDATA = !!(navigator.connection && navigator.connection.saveData) ||
                matchMedia("(prefers-reduced-data: reduce)").matches;

/* ============================================================
   THE KIT — WHAT EACH DEVICE ACTUALLY GETS, IN ONE PLACE
   (16 Aug, at Manny's direction, after asking whether a scaled-back mobile
   version is good practice.)

   THE ANSWER WAS THAT HE ALREADY BUILT ONE. Counted on the day: Glome alone
   carried 15 `SMALL` branches, 5 `TABLET`, 8 `LOWDATA`, 31 `phone`, 30
   `reduced` and 21 media queries. The phone was already getting half the wall,
   no films, a nine-pixel focus pull instead of sixteen, no coda blur, and every
   pinned stage unpinned. That is a mobile version. It was just never DESIGNED —
   it accreted, one subtraction at a time, each decided the day something looked
   wrong on a phone, and no two pages had to agree.

   THIS BLOCK IS THAT VERSION WRITTEN DOWN. Nothing here changes what a device
   gets today; every number below is lifted from the branch it replaces, so this
   is a statement of the current behaviour and not a new opinion about it. What
   it buys is that the behaviour can now be READ, argued with, and changed in
   one edit rather than discovered in six files.

   IT IS FUNCTIONS, NOT VALUES, because `SMALL` and `TABLET` are live: a rotation
   or a window drag re-reads them, and a snapshot taken at boot would hand a
   phone budget to a desktop that was resized. Never destructure this.

   THE ONE PLACE TWO PAGES DISAGREED IS KEPT, AND NAMED. index's wall allows six
   films on a phone; a case study's wall allows none. That looks like drift and
   it is not: index's wall is the only film consumer on its page and it IS the
   body of work, while a case study's wall is texture behind an argument and
   shares its decoder budget with a hero film and a case player. Two surfaces,
   two jobs, two numbers, on purpose. `films` is index's, `reels` is theirs. */
const KIT = {
  /* which reader this is, for anything that wants to branch by name */
  cls: () => LOWDATA ? "lean" : SMALL ? "phone" : TABLET ? "tablet" : "desk",

  /* THE WALLS, in tiles. index runs eight rows either way (six columns on a
     desktop, three on a phone); a case study runs six, and drops to twelve on
     small glass because 24 tiles in a phone-height frame packs to 31px, which
     is a texture rather than a shelf. */
  wall:   () => SMALL ? 24 : 48,
  /* AND THIS ONE WAS WRONG THE FIRST TIME IT WAS WRITTEN DOWN, which is the
     argument for writing it down. It was declared as 12 from a comment that
     said "small glass keeps 12 (3x4)". The packer does not do that: it hides
     every other tile, so a phone gets EIGHTEEN. The comment had outlived the
     code and nobody could see it because the number lived in a `forEach` and
     the claim lived in a paragraph two hundred lines away. `mosaicScale` reads
     this now, so there is one number and it is this one. */
  mosaic: () => SMALL ? 18 : 36,

  /* THE DECODERS. iOS serves black frames somewhere around a dozen at once, so
     these are a hardware ceiling rather than a taste. Low Data Mode and reduced
     motion both mean zero: the reader has asked. */
  films: () => (LOWDATA || reduced) ? 0 : SMALL ? 6 : TABLET ? 10 : 20,
  reels: () => (LOWDATA || SMALL || reduced) ? 0 : TABLET ? 1 : 8,

  /* THE BLUR CEILINGS, in pixels. `blur` is the arrival focus pull on a dressed
     box; `drift` is the wall's own blur as it assembles. A phone gets a shorter
     pull and no drift blur at all, because a blurred surface being scaled every
     frame is the most expensive thing on the page and the least visible on the
     smallest one. */
  blur:  () => SMALL ? 9 : 16,
  drift: () => SMALL ? 0 : 9,

  /* ---------- HOW A WALL TILE CHANGES ITS MIND: IT DOESN'T FADE ----------
     ZERO, which is the hard cut. Every wall on the site reads this one number,
     which is the whole reason it lives here rather than in the wall.

     TRIED, AND TAKEN BACK OUT, 17 Aug. Manny asked to see crossfades ("instead
     of hard cuts, can you do crossfades, I want to see how it looks"), approved
     them on index, adopted them site-wide, and then called it: "just bring back
     the hard cuts, I'm realizing it's better if it doesn't cross fade."

     HE IS RIGHT, AND THE REASON IS WORTH KEEPING. A wall of forty-eight tiles
     turning on three clocks is a metronome, and a cut is the beat landing. A
     dissolve softens the beat into a swell, so instead of a wall that ticks you
     get a wall that breathes, and the harder edge is the one that reads as
     deliberate rather than decorative. It also cost something real: a fading
     tile carries two full-size layers, and there is no frame in which the hard
     cut is not the cheaper picture.

     THE MECHANISM IS LEFT STANDING and costs nothing while this is 0: `xfadeTo`
     hands straight to `land` without touching the plate, so `--nx` is never set
     and the pseudo-element paints `none` at zero opacity. Put 420 back here and
     the dissolve returns on all six pages at once, correct as of the fix below.
     Anything above zero and the reasoning in `xfadeTo` applies again in full. */
  xfade: () => 0,

  /* ---------- THE ROTATION, FOR EVERY WALL ON THE SITE ----------
     (16 Aug, at Manny's direction — "adjust the intervals to be 3, 4, 5".)
     Seconds a tile waits before it is due. THREE periods now, not four: the two
     was the shortest and the first to read as frantic once the beat was fixed
     and the cuts actually landed at the rate they claimed.

     THE COUNT MATTERS AS MUCH AS THE VALUES, and dropping from four to three
     cost a guarantee. The lay steps 2 per row, so a below-neighbour differs by
     2 lanes; the jitter shifts a tile by 0 or +1. MODULO 4 that difference can
     never be cancelled and a below pair was IMMUNE. Modulo 3 it can: when the
     upper tile does not jitter and the lower one does, the two land on the same
     period. Measured on Glome's 36: nine of thirty below pairs, which is the
     0.35 x 0.65 the jitter predicts.

     THIS IS ACCEPTED RATHER THAN OVERLOOKED. There is no lay that keeps the
     rule with three values and a one-step jitter: duplicating a value to get
     four lanes puts the repeat back at exactly the pairs the diagonal separates,
     and dropping the jitter makes the diagonal itself readable, which is what
     it was added to prevent. The phase is what carries it now: every tile's
     first cut is offset by its own hash, so two neighbours on the same period
     still start apart and stay apart. A shared period is not a shared beat.

     The lay is taken modulo the LENGTH of this array. Add or remove a period
     here and it follows; hard-code a number anywhere and it silently stops
     being a diagonal at all. */
  beats: () => [3000, 4000, 5000],

  /* WHETHER SCROLL DRIVES THE FIGURE. Pinned stages are a desktop instrument:
     on a touch screen the thumb owns the scroll and a pin is a fight with the
     reader's momentum. Off below 1024, which is what the stylesheets already do
     at that breakpoint. */
  pins: () => !SMALL && !TABLET,

  /* ---------- AND THE ONE THAT IS A DECISION RATHER THAN A RECORD ----------
     DESKTOP RICHNESS HERE IS BOUGHT WITH SCROLL. Every large move on this site
     spends the reader's scroll to buy motion: the pan, the pin, the focus pull,
     the wall's assembly. On a phone scroll is the most expensive thing there is
     — it is jittery, it is the thumb's, and a cut that lands mid-scroll is both
     unaffordable and invisible.

     But a phone is very good at motion while the reader is STILL, and this site
     already owns the best example of it: the walls turning on their own clocks.
     So on a phone the trade is scroll-driven for clock-driven. The wall goes
     quiet while the reader moves and turns while they rest, which is the same
     claim the desktop parallax makes, made with the instrument a phone is
     actually good at. It also costs nothing: it is a gate, so it saves work. */
  restful: () => SMALL
};

/* ---------- ONE PICTURE, ONCE PER SCREEN, ANYWHERE ON THE WALL ----------
   (9 Oct, at Manny's direction, on a screenshot of the Deeds wall with one
   photograph six times and one film four times on a single screen: "avoid
   this level of repetition - that's a global rule i want to fix".)

   THE OLD GUARD ASKED THE WRONG QUESTION. Every cut refused a picture that
   was already ON THE GLASS, and checked it at the moment of the cut. But a
   wall rides: it pans as the page scrolls, and nothing cuts while the reader
   is moving. So the tiles below the fold, dealt with no regard for each
   other, rode into view together and brought their repeats with them.
   Measured on the live Deeds wall at 1440x900, sweeping it as a reader
   does: up to eleven of twenty-four tiles on the glass were repeats, six of
   them films. Parked in one place and given time, the cuts cleared it, which
   is why the earlier measurement passed.

   SO THE RULE IS SPATIAL NOW, AND HOLDS WHEREVER THE GLASS IS. A picture may
   not appear twice within one screen's worth of rows, anywhere on the wall,
   so no scroll position can ever show it twice. A film and its own poster
   count as the same picture. Where a project ships too few pictures for a
   whole screen, the reach shrinks to what the pool can pay for, so the rule
   spaces repeats as far apart as they can go rather than freezing the wall.
   Every case page calls this one function from its cuts and its repair pass,
   which is what makes it global. */
/* ---------- A 4:5 IS A PIECE MADE AT 4:5, NEVER A CUT OF ANOTHER SHAPE ----------
   (12 Oct, at Manny's direction, on four screenshots of Tamber: "some 4x5
   assets are getting cropped... ensure you're only using 4x5 correctly".)
   27 square and 3:2 plates were cut down the middle to 4:5 for the walls the
   same day (Tamber 60 to 74, Deeds 54 to 60, Belong 40 to 44). A cut loses
   whatever the design set near its edges, a card's last letters, a panel's
   margin. They are deleted, with Manny's yes ("you can remove the 27
   cut-down files"). Do not make more: a wall that needs pieces needs plates
   made at 4:5. */
/* ---------- ONE PIECE AT SEVERAL SHAPES IS STILL ONE PIECE ----------
   (10 Oct, at Manny's direction, on a screenshot of the Deeds overview with
   the symbol film playing at 4:5 and at 3:2 side by side: "ensure there
   aren't moments where the same video plays (i recognize they're different
   aspect ratios) but still".)

   The library ships many pieces at two to four shapes, and nothing in a
   file's name says so: `deeds-1x1-1200-27` and `deeds-3x2-2048-22` are the
   same film. A signature cannot catch it either, because each shape is laid
   out again rather than cropped. So the twins are listed by eye, here, once
   for every page, and every rule that asks "is this already showing" asks
   it of the piece, not the file: `alike` on every page, the dealers' memory,
   and `WALLNEAR`. A film and its own poster are matched by name already.

   ADD A PROJECT'S TWINS WHEN ITS MEDIA LANDS. Names are the file names
   without `unnamed-` and without the extension. Deeds was read off contact
   sheets of all 67 of its films on 10 Oct; the stills-only packaging renders
   are not paired yet. */
const UN_TWINS = (() => {
  const fams = {
    deeds: [
      /* the symbol turning flat to chrome to colour */
      ["16x9-2560-29", "3x2-2048-22", "1x1-1200-27", "4x5-1080-53"],
      /* the wordmark building, on black and on white: one piece */
      ["16x9-2560-27", "3x2-2048-20", "1x1-1200-25", "4x5-1080-51",
       "16x9-2560-28", "3x2-2048-21", "1x1-1200-26", "4x5-1080-52"],
      /* the construction drawing */
      ["16x9-2560-08", "1x1-1200-09", "4x5-1080-38"],
      /* the curve closing into the symbol */
      ["1x1-1200-12", "3x2-2048-11"],
      /* the ring of halves */
      ["1x1-1200-13", "3x2-2048-07", "4x5-1080-37"],
      /* the bead turning through its surfaces */
      ["1x1-1200-19", "3x2-2048-08", "4x5-1080-25", "4x5-1080-40"],
      /* the ring of beads */
      ["16x9-2560-11", "3x2-2048-16", "4x5-1080-35"],
      /* the grid of bead halves */
      ["16x9-2560-20", "1x1-1200-20", "4x5-1080-44"],
      /* the scattered beads */
      ["16x9-2560-14", "3x2-2048-09"],
      /* the friends ring (LUC BLAIR) */
      ["16x9-2560-05", "1x1-1200-07", "4x5-1080-42", "4x5-1080-45"],
      /* the METAL SPIKEY DEED page */
      ["16x9-2560-07", "3x2-2048-06", "4x5-1080-33"],
      /* the position dial */
      ["16x9-2560-09", "4x5-1080-34"],
      /* the colour ring on a phone */
      ["1x1-1200-08", "4x5-1080-41"],
      /* the three phones */
      ["16x9-2560-17", "1x1-1200-14", "3x2-2048-12"],
      /* ENERGY MADE VISIBLE */
      ["16x9-2560-18", "4x5-1080-43"],
      /* EVERY PLATE THAT SHOWS THE COLOUR WHEEL OR THE HANNAH SEND SCREEN
         (10 Oct, at Manny's direction, on the three-phone composite beside the
         colour wheel film: "don't repeat the color wheel on the right"). A
         piece that contains another piece's screen is the same picture to a
         reader, so these count as one: the composites, the ring on a phone,
         the ring alone, the settings plate and the HANNAH carousel. This group
         overlaps the colour-ring pair above, and the two are joined. */
      ["16x9-2560-17", "1x1-1200-14", "3x2-2048-12", "1x1-1200-08",
       "4x5-1080-41", "1x1-1200-16", "16x9-2560-16", "16x9-2560-04"],
      /* the four scenes in the world */
      ["16x9-2560-24", "1x1-1200-21", "4x5-1080-50", "3x2-2048-17"],
      ["16x9-2560-26", "1x1-1200-22", "4x5-1080-47", "3x2-2048-18"],
      ["16x9-2560-25", "1x1-1200-23", "4x5-1080-48", "3x2-2048-19"],
      ["16x9-2560-23", "1x1-1200-24", "4x5-1080-49"],
      ["1x1-1200-05", "3x2-2048-02"],
      ["1x1-1200-06", "3x2-2048-01", "wide-3x2-2048-01"]
    ],
    /* Tamber's plate set of 11 Oct, read off contact sheets of all 88 plates
       (posters and two frames of every film). Colourways of one piece count as
       one piece, as the Deeds wordmark on black and on white does. */
    tamber: [
      /* the mark riding the square wave, in every colourway, AND the mark
         building, which ends on that same frame (11 Oct, at Manny's
         direction, on the System chapter holding the build and the wave
         mark side by side: "ensure this doesn't happen") */
      ["16x9-2560-33", "1x1-1200-29", "3x2-2048-33",
       "16x9-2560-45", "3x2-2048-35", "3x2-2048-46", "1x1-1200-31", "1x1-1200-37",
       "1x1-1200-45", "4x5-1080-34", "4x5-1080-53"],
      /* the TAMBER wordmark, in every colourway */
      ["16x9-2560-34", "16x9-2560-48", "1x1-1200-36", "1x1-1200-46", "4x5-1080-32", "4x5-1080-42"],
      /* the letters' construction: peak, arch, bowl */
      ["16x9-2560-35", "1x1-1200-39", "4x5-1080-31"],
      /* T, M, E in the dotted type */
      ["16x9-2560-54", "4x5-1080-47"],
      /* the face, smiling */
      ["16x9-2560-52", "1x1-1200-32", "4x5-1080-36", "4x5-1080-43", "4x5-1080-51"],
      /* the face, listening */
      ["1x1-1200-47", "3x2-2048-48"],
      /* DISCOVERY IS THE POINT, typed */
      ["3x2-2048-37", "4x5-1080-40"],
      /* the icon stacks, and the icon cards */
      ["1x1-1200-34", "4x5-1080-33", "4x5-1080-46"],
      ["3x2-2048-39", "4x5-1080-37"],
      /* the globe; the pads */
      ["16x9-2560-51", "1x1-1200-33", "4x5-1080-54"],
      ["1x1-1200-49", "4x5-1080-58"],
      /* the timeline, grey and green */
      ["3x2-2048-34", "3x2-2048-36"],
      /* one photograph, wherever it appears: on its own or inside a screen */
      ["3x2-2048-42", "1x1-1200-41", "4x5-1080-59"],
      ["16x9-2560-49", "1x1-1200-50"],
      ["16x9-2560-47", "4x5-1080-50", "4x5-1080-39"],
      ["3x2-2048-47", "4x5-1080-49"],
      ["3x2-2048-45", "4x5-1080-55"],
      ["1x1-1200-43", "16x9-2560-36"],
      ["16x9-2560-39", "4x5-1080-52"],
      ["3x2-2048-31", "1x1-1200-30", "3x2-2048-32"],
      ["1x1-1200-44", "16x9-2560-41", "3x2-2048-41"]
    ],
    /* BELONG, as its films arrive (12 Oct, at Manny's direction: "add these
       videos to the existing content... DO NOT delete the existing assets").
       Each film is listed with the stills that show the same piece. */
    belong: [
      /* the mark, the B of four tiles, moving and still */
      ["16x9-2560-20", "1x1-1200-15", "3x2-2048-16", "4x5-1080-36",
       "16x9-1920-05", "1x1-1200-01", "3x2-2048-06", "4x5-1080-01", "logo-4x5-1080-01"],
      /* the mark cropped close, its tiles to the edge */
      ["16x9-1920-01", "3x2-2048-01", "3x2-2048-12", "1x1-1200-05", "4x5-1080-09"],
      /* the flare, black, green and white */
      ["16x9-2560-21", "16x9-2560-22", "1x1-1200-13", "4x5-1080-39"],
      /* the spark grid, black and white */
      ["16x9-1920-02", "16x9-1920-03", "1x1-1200-06", "1x1-1200-07", "3x2-2048-10", "4x5-1080-13", "4x5-1080-15"],
      /* the stacked rings; the cube */
      ["16x9-1920-04", "1x1-1200-08", "4x5-1080-14"],
      ["3x2-2048-08", "4x5-1080-11"],
      /* the light, "Exposure Never Fades." */
      ["16x9-1920-12", "3x2-2048-03", "3x2-2048-14", "1x1-1200-11", "4x5-1080-05", "4x5-1080-28"],
      /* "Hey Mara, I picked this one up.." */
      ["1x1-1200-14", "1x1-1200-16", "4x5-1080-37", "4x5-1080-19", "4x5-1080-31", "4x5-1080-35"],
      /* the card and its balance */
      ["16x9-1920-13", "16x9-2560-18", "4x5-1080-32"],
      ["16x9-1920-14", "4x5-1080-33"],
      ["16x9-2560-17", "16x9-2560-19"],
      /* the vinyl drop; the photoshoot post; the hoodie drop */
      ["16x9-1920-07", "1x1-1200-03", "3x2-2048-09", "4x5-1080-10"],
      ["1x1-1200-02", "3x2-2048-04", "4x5-1080-17"],
      ["4x5-1080-16", "4x5-1080-34"],
      /* one photograph, wherever it appears */
      ["16x9-1920-09", "4x5-1080-24"],
      ["1x1-1200-04", "4x5-1080-26"],
      ["16x9-1920-06", "1x1-1200-10", "4x5-1080-23"],
      ["16x9-1920-10", "4x5-1080-04"],
      ["16x9-1920-11", "4x5-1080-29"],
      ["1x1-1200-12", "4x5-1080-27"],
      ["3x2-2048-07", "4x5-1080-03"]
    ],
    /* (16 Oct, the Case Study Builder's package, docs/CASE-PUBLISH.md step 5.)
       Each plate's still and its loop, named by the plate. A still that was
       its loop's own first frame was not written: the loop's poster is it. */
    /* (16 Oct, at Manny's direction: "for the future.unnamed.xyz thematic
       can you replace SOOT with ROOT".) The Future page reads only its own
       library, so ROOT's pictures for it are copies there under new numbers;
       each copy is the same piece as its studio original, for ROOT's walls. */
    root: [
      ["1x1-1200-03", "1x1-1200-22"],
      ["1x1-1200-01", "1x1-1200-23"],
      ["1x1-1200-15", "1x1-1200-24"],
      ["3x2-2048-06", "3x2-2048-18"],
      ["16x9-2560-15", "16x9-2560-21"],
      ["16x9-2560-12", "16x9-2560-22"],
      ["1x1-1200-10", "1x1-1200-25"],
      ["3x2-2048-11", "3x2-2048-16"],
      ["3x2-2048-14", "3x2-2048-17"],
      ["4x5-1080-13", "4x5-1080-15"],
      ["4x5-1080-11", "4x5-1080-16"],
      ["4x5-1080-01", "4x5-1080-17"],
      ["4x5-1080-02", "4x5-1080-18"],
      ["4x5-1080-04", "4x5-1080-19"]
    ],
    backchannel: [
      /* 16x9 01 · Logotype */
      ["16x9-2560-01", "16x9-2560-02"],
      /* 16x9 02 · Pattern */
      ["16x9-2560-03", "16x9-2560-04"],
      /* 16x9 03 · Statement */
      ["16x9-2560-05", "16x9-2560-06"],
      /* 16x9 04 · Symbol */
      ["16x9-2560-07", "16x9-2560-08"],
      /* 16x9 06 · Anatomy */
      ["16x9-2560-10", "16x9-2560-11"],
      /* 16x9 07 · Pattern */
      ["16x9-2560-12", "16x9-2560-13"],
      /* 3x2 01 · Logotype */
      ["3x2-2048-01", "3x2-2048-02"],
      /* 3x2 04 · Pattern */
      ["3x2-2048-05", "3x2-2048-06"],
      /* 3x2 05 · Statement */
      ["3x2-2048-07", "3x2-2048-08"],
      /* 3x2 07 · Color logotype */
      ["3x2-2048-10", "3x2-2048-11"],
      /* 3x2 08 · From the back to the front */
      ["3x2-2048-12", "3x2-2048-13"],
      /* 3x2 09 · Pattern */
      ["3x2-2048-14", "3x2-2048-15"],
      /* 3x2 10 · Symbol */
      ["3x2-2048-16", "3x2-2048-17"],
      /* 4x5 01 · Template */
      ["4x5-1080-01", "4x5-1080-02"],
      /* 4x5 02 · Template, responsive */
      ["4x5-1080-03", "4x5-1080-04"],
      /* 4x5 03 · Logotype */
      ["4x5-1080-05", "4x5-1080-06"],
      /* 4x5 04 · Pattern */
      ["4x5-1080-07", "4x5-1080-08"],
      /* 4x5 06 · Anatomy */
      ["4x5-1080-10", "4x5-1080-11"],
      /* 1x1 01 · Symbol */
      ["1x1-1200-01", "1x1-1200-02"],
      /* 1x1 02 · Pattern */
      ["1x1-1200-03", "1x1-1200-04"],
      /* 1x1 05 · Symbol, close */
      ["1x1-1200-07", "1x1-1200-08"],
      /* 1x1 07 · Color logotype */
      ["1x1-1200-10", "1x1-1200-11"],
      /* 1x1 08 · Pattern */
      ["1x1-1200-12", "1x1-1200-13"],
      /* 1x1 09 · Claims diagram */
      ["1x1-1200-14", "1x1-1200-15"]
    ],
    biohub: [
      /* 16x9 01 · Symbol */
      ["16x9-2560-01", "16x9-2560-02"],
      /* 16x9 06 · The bracket */
      ["16x9-2560-07", "16x9-2560-08"],
      /* 16x9 13 · Construction */
      ["16x9-2560-15", "16x9-2560-16"],
      /* 16x9 14 · Lock-up */
      ["16x9-2560-17", "16x9-2560-18"],
      /* 3x2 04 · Framing */
      ["3x2-2048-07", "3x2-2048-08"],
      /* 3x2 05 · Photograph */
      ["3x2-2048-09", "3x2-2048-10"],
      /* 3x2 07 · The bracket */
      ["3x2-2048-12", "3x2-2048-13"],
      /* 3x2 13 · Photograph */
      ["3x2-2048-19", "3x2-2048-20"],
      /* 4x5 01 · Logotype */
      ["4x5-1080-04", "4x5-1080-05"],
      /* 4x5 03 · Photograph */
      ["4x5-1080-07", "4x5-1080-08"],
      /* 4x5 04 · Program */
      ["4x5-1080-09", "4x5-1080-10"],
      /* 4x5 05 · Framing */
      ["4x5-1080-11", "4x5-1080-12"],
      /* 4x5 06 · Symbol */
      ["4x5-1080-13", "4x5-1080-14"],
      /* 4x5 08 · Construction */
      ["4x5-1080-16", "4x5-1080-17"],
      /* 4x5 14 · Release */
      ["4x5-1080-23", "4x5-1080-24"],
      /* 4x5 15 · Event */
      ["4x5-1080-25", "4x5-1080-26"],
      /* 1x1 02 · Program */
      ["1x1-1200-07", "1x1-1200-08"],
      /* 1x1 04 · Symbol */
      ["1x1-1200-10", "1x1-1200-11"],
      /* 1x1 11 · Photograph */
      ["1x1-1200-18", "1x1-1200-19"]
    ],
    rivian: [
      /* 16x9 05 · Maps + Routes */
      ["16x9-2560-05", "16x9-2560-06"],
      /* 3x2 02 · Maps + Routes */
      ["3x2-2048-04", "3x2-2048-05"],
      /* 3x2 15 · Maps + Routes */
      ["3x2-2048-18", "3x2-2048-19"],
      /* 4x5 06 · Maps + Routes */
      ["4x5-1080-12", "4x5-1080-13"],
      /* 4x5 07 · Maps + Routes */
      ["4x5-1080-14", "4x5-1080-15"],
      /* 1x1 02 · Maps + Routes */
      ["1x1-1200-08", "1x1-1200-09"],
      /* 1x1 05 · Full bleed */
      ["1x1-1200-12", "1x1-1200-13"],
      /* 1x1 06 · Maps + Routes */
      ["1x1-1200-14", "1x1-1200-15"],
      /* app board 01, its film and its still */
      ["16x9-1920-16", "3x2-2048-22"],
      /* app board 02, its film and its still */
      ["16x9-1920-17", "3x2-2048-23"],
      /* app board 03, its film and its still */
      ["16x9-1920-18", "3x2-2048-24"],
      /* app board 04, its film and its still */
      ["16x9-1920-19", "3x2-2048-25"],
      /* app board 05, its film and its still */
      ["16x9-1920-20", "3x2-2048-26"],
      /* app board 06, its film and its still */
      ["16x9-1920-21", "3x2-2048-27"],
      /* app board 07, its film and its still */
      ["16x9-1920-22", "3x2-2048-28"],
      /* app board 08, its film and its still */
      ["16x9-1920-23", "3x2-2048-29"],
      /* app board 09, its film and its still */
      ["16x9-1920-24", "3x2-2048-30"],
      /* app board 10, its film and its still */
      ["16x9-1920-25", "3x2-2048-31"]
    ],
    glassworks: [
      /* 16x9 · Opt Art */
      ["16x9-2560-01", "16x9-2560-02"],
      /* 16x9 · the wordmark */
      ["16x9-2560-03", "16x9-2560-04"],
      /* 16x9 · The Library: pink plaster ceiling, pendant lights, the long counter */
      ["16x9-2560-16", "16x9-2560-17"],
      /* 3x2 · A woman in round sunglasses outside the shop */
      ["3x2-2048-05", "3x2-2048-06"],
      /* 3x2 · Opt Art */
      ["3x2-2048-07", "3x2-2048-08"],
      /* 3x2 · A frame on a plinth in the shelf, sun cutting across */
      ["3x2-2048-10", "3x2-2048-11"],
      /* 3x2 · The Library: pink plaster ceiling, pendant lights, the long counter */
      ["3x2-2048-12", "3x2-2048-13"],
      /* 4x5 · Opt Art */
      ["4x5-1080-04", "4x5-1080-05"],
      /* 4x5 · Red-lensed frame on a pink plaster plinth in hard sun */
      ["4x5-1080-06", "4x5-1080-07"],
      /* 4x5 · Portrait in black acetate frames, straight on */
      ["4x5-1080-09", "4x5-1080-10"],
      /* 4x5 · The Library: pink plaster ceiling, pendant lights, the long counter */
      ["4x5-1080-12", "4x5-1080-13"],
      /* 4x5 · The Library: pink plaster ceiling, pendant lights, the long counter */
      ["4x5-1080-15", "4x5-1080-16"],
      /* 4x5 · The Library: pink plaster ceiling, pendant lights, the long counter */
      ["4x5-1080-17", "4x5-1080-18"],
      /* 4x5 · The Library: pink plaster ceiling, pendant lights, the long counter */
      ["4x5-1080-19", "4x5-1080-20"],
      /* 4x5 · the app on a phone */
      ["4x5-1080-26", "4x5-1080-27"],
      /* 4x5 · The slit lamp on a maple table */
      ["4x5-1080-28", "4x5-1080-29"],
      /* 1x1 · Nahalat Binyamin 41: three doors, the wordmark on the glass, read from the street */
      ["1x1-1200-08", "1x1-1200-09"]
    ]
  };
  const base = s => String(s || "").split("/").pop().replace(/\?.*$/, "")
    .replace(/\.(mp4|webm|webp|jpe?g|png)$/i, "").replace(/^unnamed-/, "");
  /* GROUPS MAY OVERLAP, and overlapping groups are one piece: a file listed
     in two groups joins them (a union, so the result never depends on the
     order the groups are written in). */
  const up = new Map();
  const root = n => { while (up.has(n) && up.get(n) !== n) n = up.get(n); return n; };
  for (const c of Object.keys(fams))
    for (const f of fams[c]) {
      const names = f.map(n => c + "-" + n);
      for (const n of names) if (!up.has(n)) up.set(n, n);
      for (const n of names.slice(1)) { const a = root(names[0]), b = root(n); if (a !== b) up.set(b, a); }
    }
  /* the piece a file belongs to: its group, or the file itself */
  const of = s => { const b = base(s); return up.has(b) ? "#" + root(b) : b; };
  return { of, same: (a, b) => !!a && !!b && of(a) === of(b) };
})();

/* ---------- NO TWO FILMS ON ONE BEAT ----------
   (10 Oct, at Manny's direction, on two films beside each other switching
   their pictures at the same moment: "a video with a different time clock -
   so the images don't swap at the same time.. make that universal rule".)

   Films of one length that start together loop together for as long as the
   page is open, so every hand-off inside them lands at the same instant and
   reads as one machine. Each looping film now starts after its own short
   hold, spread by the golden ratio so neighbours never draw the same one,
   and keeps that offset from then on. It starts from its first frame, so a
   logo still builds from the beginning. The rotators already run on clocks
   of their own; this is the same rule for film. Every case page calls it
   where a berth or a wall tile mounts a film. */
const UN_OFFBEAT = (() => {
  let k = 0;
  return v => {
    const frac = (++k * 0.6180339887) % 1;
    v.autoplay = false; v.removeAttribute("autoplay");
    const go = () => {
      const d = isFinite(v.duration) && v.duration > 0 ? v.duration : 4;
      clearTimeout(v._ob);
      v._ob = setTimeout(() => { if (v.isConnected) v.play().catch(() => {}); }, Math.round(frac * Math.min(2400, d * 500)));
    };
    if (v.readyState >= 1) go(); else v.addEventListener("loadedmetadata", go, { once: true });
  };
})();

/* ---------- THE FLOOR: ONE PIECE NEVER TOUCHES ITSELF ----------
   (11 Oct, at Manny's direction, on two of the same packaging render side by
   side on the Deeds wall: "avoid this type of duplication side by side... the
   logic works well, but there's tiny moments like this".)

   `WALLNEAR` spaces a picture by screens and gives way where the pool cannot
   pay for it, and the wall's fallbacks (the relaxed cut, the bare-tile fill,
   the opening deal's repeat) then repeat whatever comes next. One of those
   landed a still beside itself. So below every preference there is a floor
   that never gives way: a piece may not sit in any of the eight tiles around
   itself. `WALLTOUCH` asks it of a candidate; `WALLUNTANGLE` repairs a wall
   that breaks it by SWAPPING tiles, which never changes how many of each
   picture the wall wears, so it always has an answer while the pool holds
   more than nine pieces. */
const WALLTOUCH = (M, i, src, skip) => {
  if (!src || !M || !M.tiles || !M.shown) return false;
  const c = M.cols || 6, col = i % c, me = UN_TWINS.of(src);
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
    if (!dr && !dc) continue;
    const jc = col + dc, j = i + dr * c + dc;
    if (jc < 0 || jc >= c || j < 0 || j >= M.tiles.length || j === skip) continue;
    if (M.shown[j] && UN_TWINS.of(M.shown[j]) === me) return true;
  }
  return false;
};
const WALLUNTANGLE = (M, paint, isFilm) => {
  if (!M || !M.tiles || !M.shown) return 0;
  const n = M.tiles.length, film = s => !!isFilm(s);
  let fixed = 0;
  for (let i = 0; i < n; i++) {
    const mine = M.shown[i];
    if (!mine || !WALLTOUCH(M, i, mine)) continue;
    for (let j = 0; j < n; j++) {
      const theirs = M.shown[j];
      if (j === i || !theirs || film(theirs) !== film(mine)) continue;
      if (UN_TWINS.of(theirs) === UN_TWINS.of(mine)) continue;
      /* both ends must be clean after the swap, each ignoring the other */
      M.shown[i] = theirs; M.shown[j] = mine;
      const ok = !WALLTOUCH(M, i, theirs) && !WALLTOUCH(M, j, mine);
      M.shown[i] = mine; M.shown[j] = theirs;
      if (!ok) continue;
      paint(i, theirs); paint(j, mine); fixed++;
      break;
    }
  }
  return fixed;
};

const WALLNEAR = (() => {
  const base = s => UN_TWINS.of(s);
  /* how many rows the rule reaches: every row a screen can touch, slivers
     at its edges included, capped by what the pool can pay for. A wall with
     fewer pictures than tiles has to repeat somewhere, and the repeats need
     room to land: with a reach of every row the pool covers, the Deeds wall
     (36 tiles, about 30 pictures) could only satisfy it by copying its first
     row into its last, which no greedy cut finds, so its last repeats landed
     anywhere. One row less gives them that room. Measured both ways, 9 Oct. */
  const reach = (M, pool, films) => {
    const c = M.cols || 6, n = M.tiles.length;
    const key = [c, n, innerHeight, pool.length, films].join(":");
    if (M._nearKey === key) return M._near;
    let pitch = n > c ? M.tiles[c].offsetTop - M.tiles[0].offsetTop : 0;
    if (!(pitch > 0)) pitch = (M.tileW || 200) * 1.25;
    const rows = Math.ceil(innerHeight / pitch) + 1;
    const stills = new Set(), reels = new Set();
    for (const s of pool) (/\.mp4(\?|$)/i.test(s) ? reels : stills).add(base(s));
    for (const r of reels) stills.delete(r);   /* a poster is its film */
    const distinct = stills.size + Math.min(reels.size, films);
    M._nearKey = key;
    M._near = Math.min(rows, Math.floor(distinct / c) - (distinct < n ? 1 : 0));
    return M._near;
  };
  /* true when `src` placed at tile `i` would sit within reach of itself.
     `skip` is a tile to ignore: the partner of a trade, which is about to
     give its picture away. */
  return (M, i, src, pool, films, skip) => {
    if (!src || !M || !M.tiles || !M.shown) return false;
    if (/[?&]space=0\b/.test(location.search)) return false;   /* the old rule, to compare on the preview */
    const c = M.cols || 6, K = reach(M, pool || [], films || 0);
    if (K < 2) return false;   /* nearer than that is likeNear's job, already done */
    const me = base(src), row = Math.floor(i / c);
    const lo = Math.max(0, (row - K + 1) * c), hi = Math.min(M.tiles.length, (row + K) * c);
    for (let j = lo; j < hi; j++)
      if (j !== i && j !== skip && base(M.shown[j]) === me) return true;
    return false;
  };
})();

/* ---------- THE DISSOLVE ----------
   (16 Aug. Tested on index's wall, then "let's adopt this style across all
   pages", so it moved here rather than being copied to five of them.)

   A `background-image` cannot be transitioned, so a dissolve needs two layers.
   The site already owned that pattern: `#amb i` is two stacked plates and the
   wash has crossfaded between them from the beginning. This is the same idea
   for a tile, and the second layer is a PSEUDO-ELEMENT rather than a child,
   because more than one wall reaches for `firstElementChild` to find a mounted
   video and a real plate would have handed it a div.

   THE ELEMENT TAKES THE INCOMING PICTURE FIRST AND THE PLATE FADES OFF IT. The
   plate is loaded with the picture that is LEAVING, at full opacity, with its
   transition suppressed for one frame. `land` then writes the incoming picture
   to the element underneath it, and the plate is faded away to nothing. So the
   element alone is the truth from the first frame of every dissolve, which is
   what keeps the film budgets, the dressing bookkeeping and the stale-halo guard
   all still true, and the plate is already transparent by the time it goes.

   IT USED TO RUN THE OTHER WAY ROUND, and that was the bug Manny reported on 16
   Aug: "the very last frame of the cross fade is making the image jump or zoom
   out for a millisec". A plate that fades IN has to be told what size to paint
   at, and it was told `--cov`, the site's 4px overscan, while `fitOne` paints a
   ratio-true tile at an exact `100% 100%`. Measured on Glome: three cuts in five
   ran a plate at `calc(100% + 4px)` over a base at `100% 100%`, so the last
   frame of each of those dissolves dropped the picture by 4px on a 216px tile.
   1.9%, one frame, on the way out. A zoom-out that lasts a millisecond.

   SO THE PLATE DOES NOT GUESS A SIZE ANY MORE. It carries the picture that is
   leaving, which means the size it must paint at is the size the element is
   painting at right now, and that is copied straight off the element into
   `--nxs` on the way past. Nothing is recomputed and nothing can disagree.
   Fading out rather than in also means the plate sits at zero opacity when its
   compositing layer is destroyed, which puts the whole class of last-frame
   handover artifacts out of reach instead of making one of them smaller.

   `land` DOES THE REAL WORK and differs per caller: index sets a background and
   re-arms a filter, a project wall also sets a ground colour and refits. It is
   called exactly once either way, under an opaque plate or immediately when
   there is nothing to fade from. */
const xfadeTo = (el, url, ms, land) => {
  const prev = el.style.backgroundImage;
  /* nothing to fade FROM, or a mounted film standing where the plate would go:
     both are hard cuts. A background plate cannot dissolve a playing video. */
  if (!ms || !prev || el.firstElementChild) { land(); return; }
  clearTimeout(el._xf);
  el.style.setProperty("--nx", prev);
  const size = el.style.backgroundSize;         /* whatever `fitOne` decided */
  if (size) el.style.setProperty("--nxs", size);
  else el.style.removeProperty("--nxs");        /* falls back to the page default */
  el.style.setProperty("--xfd", "0ms");
  el.classList.add("xf");
  void el.offsetWidth;                          /* the plate is up, and opaque */
  el.style.removeProperty("--xfd");             /* the way back down is timed */
  land();                                       /* the swap happens out of sight */
  void el.offsetWidth;
  el.classList.remove("xf");
  el._xf = setTimeout(() => {
    el.style.removeProperty("--nx");            /* nothing stays painted twice */
    el.style.removeProperty("--nxs");
  }, ms + 60);
};
const pad = n => String(n).padStart(2, "0");
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const easeOut = t => 1 - Math.pow(1 - t, 3);
const AZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const LETTERS = ["U","N","N","A","M","E","D"];

/* character widths, measured so reels and scrambles set like normal text */
let gauge = null;
try { gauge = document.createElement("canvas").getContext("2d"); } catch (e) { gauge = null; }
let ruler = null;
const widths = new Map();
function charWidth(el, ch) {
  const cs = getComputedStyle(el);
  const size = parseFloat(cs.fontSize) || 30;
  const track = size * -0.02;
  const key = ch + "|" + size;
  if (widths.has(key)) return widths.get(key);
  let w;
  if (gauge) {
    gauge.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    w = gauge.measureText(ch).width;
  } else {
    if (!ruler) {
      ruler = document.createElement("span");
      ruler.style.cssText = "position:absolute;visibility:hidden;white-space:pre;left:-9999px;top:0";
      document.body.appendChild(ruler);
    }
    ruler.style.font = cs.font || `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    ruler.textContent = ch;
    w = ruler.getBoundingClientRect().width || size * 0.6;
  }
  const out = Math.max(0, w + track);
  widths.set(key, out);
  return out;
}

/* ---------- clocks: header reel + footer seconds ---------- */
const CITYAB = [
  ["NYC","America/New_York"],
  ["STHLM","Europe/Stockholm"],
  ["LA","America/Los_Angeles"],
  ["PDX","America/Los_Angeles"],
  ["BOS","America/New_York"]
];
const fmts = {};
const timeIn = tz => {
  fmts[tz] ||= new Intl.DateTimeFormat("en-GB", { timeZone:tz, hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false });
  return fmts[tz].format(new Date());
};
const clockEls = [...document.querySelectorAll("[data-clock]")];
function tick() { for (const el of clockEls) el.textContent = timeIn(el.dataset.clock); }
tick();
setInterval(tick, 1000);

const ccCity = document.getElementById("cc-city");
const ccTime = document.getElementById("cc-time");
const DIGITS = "0123456789";
const AZC = AZ.replace("W", "");
let ci = 0;

function rollInto(el, target, pool, instant) {
  const prev = el.dataset.cur || "";
  el.dataset.cur = target;
  el.textContent = "";
  [...target].forEach((ch, i) => {
    const win = document.createElement("span");
    win.className = "cw";
    win.style.width = charWidth(el, ch) + "px";
    const reel = document.createElement("span");
    reel.className = "reel";
    win.appendChild(reel);
    el.appendChild(win);
    const line = t => {
      const d = document.createElement("span");
      d.className = "rl";
      d.textContent = t;
      reel.appendChild(d);
    };
    const old = prev[i] || " ";
    if (instant || reduced || old === ch) { line(ch); return; }
    const room = charWidth(el, ch) + 0.5;
    const fit = [...pool].filter(c => charWidth(el, c) <= room);
    const pick = () => (fit.length ? fit[Math.floor(Math.random() * fit.length)] : ch);
    line(charWidth(el, old) <= room ? old : pick());
    line(pick());
    line(pick());
    line(ch);
    reel.style.transitionDelay = (i * 55) + "ms";
    requestAnimationFrame(() => requestAnimationFrame(() => {
      reel.style.transform = "translateY(calc(var(--reel) * -3))";
    }));
  });
}

function showCity(animate) {
  const [ab, tz] = CITYAB[ci];
  const instant = !animate || reduced;
  rollInto(ccCity, ab, AZC, instant);
  rollInto(ccTime, timeIn(tz), DIGITS, instant);
}
function lockClock() {
  const widest = (el, s) => [...s].reduce((sum, ch) => sum + charWidth(el, ch), 0);
  let city = 0;
  for (const [ab] of CITYAB) city = Math.max(city, widest(ccCity, ab));
  ccCity.style.width = Math.ceil(city) + "px";
  ccTime.style.width = Math.ceil(widest(ccTime, "00:00:00")) + "px";
}
lockClock();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(lockClock);

showCity(false);
setInterval(() => { ci = (ci + 1) % CITYAB.length; showCity(true); }, 4200);
setInterval(() => {
  if (document.hidden) return;
  rollInto(ccTime, timeIn(CITYAB[ci][1]), DIGITS, reduced);
}, 1000);

/* ---------- the wordmark keeps its habit ---------- */
const mark = document.getElementById("mark");
const markWrap = document.createElement("span");
markWrap.setAttribute("aria-hidden", "true");
for (const ch of "UNNAMED") {
  if (ch === ".") { markWrap.appendChild(document.createTextNode(".")); continue; }
  const sp = document.createElement("span");
  sp.textContent = ch;
  markWrap.appendChild(sp);
}
mark.textContent = "";
markWrap.insertBefore(document.createTextNode("SOOT x "), markWrap.firstChild);
mark.appendChild(markWrap);
const markLetters = markWrap.querySelectorAll("span");
function lockMark() {
  mark.style.minWidth = "0px";
  mark.style.minWidth = Math.ceil(mark.getBoundingClientRect().width) + "px";
}
lockMark();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(lockMark);
function cycleMark() {
  if (reduced) return;
  markLetters.forEach((sp, i) => {
    let frames = 3 + i;
    const iv = setInterval(() => {
      if (frames-- > 0) {
        sp.textContent = Math.random() < 0.25 ? " " : AZ[Math.floor(Math.random() * 26)];
      } else {
        clearInterval(iv);
        sp.textContent = LETTERS[i];
      }
    }, 55);
  });
}
if (!reduced) setInterval(() => { if (!document.hidden) cycleMark(); }, 9000);

/* the wordmark's scramble, on any string. letters only, in slots measured
   to the glyphs they land on, so nothing reflows while it churns.
   TRAP: the slots are PIXEL widths and the type is viewport-sized —
   every scrambled element must be re-set when the window changes, or
   the old slots compress the new glyphs (SCRAMBLED + the relock). */
const SCRAMBLED = new Set();
function scrambleInto(el, text, instant) {
  el._scrText = text;              /* remembered so a resize can re-set the slots */
  SCRAMBLED.add(el);
  el.textContent = "";
  const cells = [];
  text.split(" ").forEach((word, w, all) => {
    const wrap = document.createElement("span");
    wrap.className = "scw";
    for (const ch of word) {
      const sp = document.createElement("span");
      sp.className = "sc";
      sp.style.width = charWidth(el, ch) + "px";
      sp.textContent = ch;
      wrap.appendChild(sp);
      cells.push([sp, ch]);
    }
    el.appendChild(wrap);
    if (w < all.length - 1) el.appendChild(document.createTextNode(" "));
  });
  if (reduced || instant) return;
  cells.forEach(([sp, ch], i) => {
    const lower = ch >= "a" && ch <= "z";
    const upper = ch >= "A" && ch <= "Z";
    if (!lower && !upper) return;
    const room = charWidth(el, ch) + 0.5;
    const pool = [...(lower ? LOWER : AZ)].filter(c => charWidth(el, c) <= room);
    if (pool.length < 3) return;
    let frames = 2 + (i % 6);
    const iv = setInterval(() => {
      if (frames-- > 0) sp.textContent = pool[Math.floor(Math.random() * pool.length)];
      else { clearInterval(iv); sp.textContent = ch; }
    }, 55);
  });
}


function navInit(SECTIONS) {
/* ---------- single-word nav: which chapter you are in ---------- */
/* THE SECTION LIST IS THE PAGE'S, the behaviour is everyone's. A page
   calls UN.nav([[id, label], ...]) once it knows its own sections. */
const navEl = document.getElementById("navword");
let navCurrent = "Opening";

/* THE WORD'S SLOT IS THE SITE'S, NOT THE PAGE'S (at Manny's direction — "in
   index.html the word Studio sits further right than Opening does in future.html;
   I want future.html to be the example, Studio in the same spot as Opening").

   The header reserves a fixed width for the chapter word so the clock beside it
   never jumps as the word changes. That reservation was measured from the page's
   OWN section list, and the two pages have different longest labels — "Machine
   Intelligence" against "Collaboration" — so the slot was 284px on one page and
   186px on the other. Both are right-aligned inside the header, so the word's left
   edge landed 98px apart and the header appeared to shift when you moved between
   pages.

   The roster below is every label any page's header shows. The slot is measured
   from all of them, so it is identical on every page and the header holds still
   across the whole site. A NEW PAGE ADDS ITS LABELS HERE — that is the price of a
   stable header, and it is a cheaper price than a header that moves. */
const NAV_SLOT = [
  /* index.html */   "Studio", "Ventures", "Industry", "Capabilities", "Work",
  /* future.html */  "Opening", "Overview", "Spaces", "Machine Intelligence",
                     "Human Performance", "Shared World", "Close"
];
function lockNav() {
  const probe = navEl.firstElementChild;
  const held = probe.textContent;
  navEl.style.width = "auto";
  let max = 0;
  for (const name of [...SECTIONS.map(s => s[1]), ...NAV_SLOT]) {
    probe.textContent = name;
    max = Math.max(max, probe.getBoundingClientRect().width);
  }
  probe.textContent = held;
  navEl.style.width = Math.ceil(max) + "px";
}
  lockNav();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(lockNav);

function setNavWord(label, href) {
  if (label === navCurrent) return;
  navCurrent = label;
  const a = navEl.firstElementChild;
  a.textContent = label;
  a.setAttribute("href", href);
  if (reduced) return;
  a.classList.remove("in");
  a.classList.add("out");
  void a.offsetHeight;
  a.classList.remove("out");
  a.classList.add("in");
}
function navUpdate() {
  const y = scrollY + innerHeight * 0.35;
  /* ABOVE THE FIRST LISTED SECTION THE SLOT IS EMPTY (at Manny's direction —
     "don't have a label Opening, remove it, only for that section"). The old
     default was the word "Opening" with a #vig anchor, which is real on
     future.html — its opening is a listed section, so the list supplies it —
     and a leak on index.html, which has no #vig and no opening chapter: the
     word stood over the hero naming a section that does not exist there. */
  /* a NO-BREAK SPACE, not an empty string: an empty anchor collapses its
     line box, which shrinks the header bar and shaves the wordmark's hit
     area beside it (measured: 35px to 32). The space holds the slot and
     the tap geometry and reads as nothing. */
  let label = "\u00A0", href = "#" + ((SECTIONS[0] || [""])[0]);
  for (const [id, name] of SECTIONS) {
    const el = document.getElementById(id);
    if (el && docTop(el) <= y) { label = name; href = "#" + id; }
  }
  setNavWord(label, href);
}
addEventListener("scroll", navUpdate, { passive:true });
addEventListener("resize", navUpdate);
navUpdate();

/* type scales with the window, so every reserved width re-measures */
let relock;
addEventListener("resize", () => {
  clearTimeout(relock);
  relock = setTimeout(() => {
    widths.clear();
    lockClock();
    lockNav();
    lockMark();
    showCity(false);
    /* re-set every scrambled title in its new glyph slots, no churn —
       stale pixel slots are what compressed the type on resize */
    for (const el of SCRAMBLED) {
      if (el.isConnected && el._scrText != null) scrambleInto(el, el._scrText, true);
    }
  }, 120);
});

}

function revealInit(sel) {
/* ---------- reveals, both ways. an element arrives as it enters, and
   the same move runs backwards as it leaves, so scrolling up rewinds
   the page instead of replaying a memory of it. anything marked scr
   scrambles in fresh on every landing. ---------- */
function land(el) {
  el.classList.add("on");
  const scrs = el.matches(".scr") ? [el] : [...el.querySelectorAll(".scr")];
  for (const s of scrs) scrambleInto(s, s.dataset.scram);
}
const io = new IntersectionObserver(entries => {
  for (const en of entries) {
    if (en.isIntersecting) land(en.target);
    else en.target.classList.remove("on");
  }
}, { threshold:0.12, rootMargin:"0px 0px 140px 0px" });
/* the margin reaches under the fold, so gathered decks land while they
   still ghost at the glass's edge — a reveal can begin as a hint */
const rvAll = [...document.querySelectorAll(sel)];
rvAll.forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 90 + "ms";
  io.observe(el);
});
/* THE OBSERVER ALONE IS NOT ENOUGH, and index.html learned this the hard
   way long before this file existed: anything already above the fold when
   the observer is set up, or that a jump-scroll clean passes, never reports
   as intersecting and sits at opacity 0 for good. This sweep catches those.
   It was index-only until the extraction, and leaving it behind cost the
   index its whole first screen for a minute — the reveal count went to
   zero. Both pages get it now; it is strictly better than not having it. */
const rvSweep = () => {
  for (const el of rvAll) {
    if (el.classList.contains("on")) continue;
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight + 40 && r.bottom > -40) { el.classList.add("on"); io.unobserve(el); }
  }
};
addEventListener("scroll", rvSweep, { passive: true });
addEventListener("resize", rvSweep);
rvSweep();


}

/* ============================================================
   the three objects, carried over from the index.
   ============================================================ */
/* the contact block gets the screen to itself */
new IntersectionObserver(([e]) => {
  document.body.classList.toggle("at-contact", e.intersectionRatio > 0.35);
}, { threshold:[0, 0.35, 1] }).observe(document.getElementById("contact"));

/* ---------- the bug ----------
   a draggable organism. drag it anywhere, click to bloom a color
   wheel, sweep the wheel to paint the page. contrast is derived,
   never chosen: type, panels, and footer flip themselves. */
const root = document.documentElement;
const bug = document.getElementById("bug");
const core = document.getElementById("bug-core");
const ring = document.getElementById("bug-ring");

const HOUSE = ["#FFFFFF","#000000","#FF3300","#0018F0","#D9FF00","#B8B8B8"];
const R = 108;

const FORCE_BLACK = { "#FF3300": true };      /* red carries black type */
const lumOf = hex => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrastOn = hex => FORCE_BLACK[hex] ? "#000000"
                        : lumOf(hex) > 0.42 ? "#000000" : "#FFFFFF";

let locked = false;                          /* true once a color has been chosen */
/* the bar's real height, so panels can sit flush against it at any
   type size or viewport width */
const barEl = document.querySelector("header");
const setBar = () => root.style.setProperty("--bar",
  Math.round(barEl.getBoundingClientRect().height) + "px");
setBar();
addEventListener("resize", setBar);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(setBar);

/* the browser's own chrome follows the page. NOT ON AN IPHONE (6 Oct, iOS 26):
   there a theme-color makes Safari's bars opaque instead of letting the page
   run under them, so each page's <head> takes the tag out before the first
   paint, and this finds nothing. */
const themeMeta = document.querySelector('meta[name="theme-color"]');
function paint(hex) {
  hex = hex.toUpperCase();
  if (root.style.getPropertyValue("--bg").trim().toUpperCase() === hex) return;
  root.style.setProperty("--bg", hex);
  root.style.setProperty("--fg", contrastOn(hex));
  /* the verticals panel is a dark field, so it takes the picked colour as
     its ink only where that colour can survive on it. black was the case
     named, but ultramarine and safety fail the same way, so the test is
     luminance rather than a list. the line sits between ultramarine at
     0.069 and safety at 0.236, so everything but black and blue keeps
     its own colour on the panel. safety is the tight one. */
  root.style.setProperty("--kink", lumOf(hex) >= 0.15 ? hex : "#FFFFFF");
  /* the community field is pale whatever the page does, so it needs the
     opposite test to the industry panel: take the picked colour only when it
     is dark enough to read on pale, and fall back to a warm near-black when
     it is not. the line is at 0.15 rather than by name. ultramarine sits at
     0.069 and reads 7.2 to 1 on the field. safety is at 0.236 and only makes
     3.0 to 1, under the floor, so red keeps the near-black. paper, acid and
     silver are nowhere near. */
  root.style.setProperty("--cmink", lumOf(hex) <= 0.15 ? hex : "#2A1620");
  if (themeMeta) themeMeta.setAttribute("content", hex);   /* browser chrome follows */
}
function setBg(hex) {
  locked = true;                             /* a choice wins over the scroll */
  paint(hex);
}

/* the page stays paper until someone picks from the wheel */

/* seat the house colors around the wheel */
HOUSE.forEach((c, i) => {
  const a = (i / HOUSE.length) * Math.PI * 2 - Math.PI / 2;
  const t = document.createElement("button");
  t.className = "tick";
  t.style.background = c;
  t.style.left = (50 + Math.cos(a) * 31) + "%";
  t.style.top  = (50 + Math.sin(a) * 31) + "%";
  t.setAttribute("aria-label", c);
  t.addEventListener("pointerdown", e => e.stopPropagation(), { passive:true });
  t.addEventListener("click", e => { e.stopPropagation(); setBg(c); });
  ring.appendChild(t);
});

ring.addEventListener("pointerdown", e => e.stopPropagation(), { passive:true });

const idxBug = document.getElementById("idx-bug");
const HOLD_MS = 3500;      /* how long a maxim stays up */
/* the navigator. one door, no menu. */
/* draggable, like the other two. a drag must not also count as a click, so
   the open only fires when the pointer never really moved. */
let ixDrag = false, ixMoved = false, ixDx = 0, ixDy = 0, ixDown = 0;

/* ---------- studio notes ----------
   one turn of the mark is ten seconds, and a note lands when it closes. */
/* how the work actually goes, and what we have learned in the categories.
   observations rather than opinions about ourselves. */
/* truisms. six words at the outside, no antithesis, nothing that needs a
   second clause to land. */
/* truisms, five words at the outside. drawn from the same material as the
   studio brief in ask.js so the site and the chatbot agree. nothing about
   named individuals, and co-ownership is alluded to rather than explained. */
/* truisms, grouped by chapter. the mark reads whichever section you are in
   and pulls from that pool, falling back to the general one. every line is a
   single short phrase: the pill cannot wrap, so anything long would be cut
   rather than shown, and there is a guard below that refuses them outright. */
/* the studio's maxims, grouped by chapter. the mark reads which section is
   under the fold and cycles that pool in order, so a chapter says its own
   three and then comes round again. */
/* THE POOLS ARE THE PAGE'S. A page sets window.UN_NOTES = { general: [...],
   <sectionId>: [...] } before calling UN.start(); the mark reads whichever
   section the reader is in and falls back to general. Content is page
   material; the mechanism is not. */
/* READ LAZILY, NEVER CACHED AT LOAD. This file runs BEFORE the page's own
   script, so `window.UN_NOTES` does not exist yet at this line — reading it
   here would permanently capture an empty pool, and the asterisk would turn
   forever with nothing to say. Every access goes through noteSets(). */
const noteSets = () => (window.UN_NOTES && Object.keys(window.UN_NOTES).length)
  ? window.UN_NOTES : { general: [] };
/* nothing longer than a pill can hold. the bubble shape is a bug, so a note
   that would wrap is dropped rather than shown badly. */
const NOTE_MAX = 32;
const noteAll = () => Object.values(noteSets()).flat().filter(n => n.length <= NOTE_MAX);
const idxNote = document.getElementById("idx-note");
const NOTE_MS = 15000;      /* a quarter quicker than it was, still long
                               enough that it never nags */
let noteAt = performance.now(), noteN = 0, noteShut = null;
/* OFF BY DEFAULT (at Manny's direction — "have the asterisk start off").
   the notes are an easter egg, not a greeting: the mark sits held until
   someone taps it, and the tap already toggles it live. */
idxBug.classList.add("held");

function noteHold(held) {
  idxBug.classList.toggle("held", held);
  /* held only stops the interval. the mark keeps turning, because a still
     asterisk reads as broken rather than paused. */
  if (held) hideNote();
  else noteAt = performance.now();
}
function hideNote() {
  idxBug.classList.remove("telling");
  clearTimeout(noteShut);
  noteShut = setTimeout(() => { idxNote.textContent = ""; }, 750);
}
/* whichever chapter is under the fold decides which pool to read from */
function notePool() {
  const y = scrollY + innerHeight * 0.5;
  let key = "general";
  const sets = noteSets();
  for (const [id] of (NAV_SECTIONS || [])) {
    const el = document.getElementById(id);
    if (el && docTop(el) <= y && sets[id]) key = id;
  }
  return (sets[key] || sets.general || []).filter(n => n.length <= NOTE_MAX);
}

function showNote() {
  clearTimeout(noteShut);
  const pool = notePool();
  /* a page with no material simply never speaks, rather than printing
     "undefined" into the pill */
  if (!pool.length) return;
  idxNote.textContent = pool[noteN % pool.length];
  noteN++;
  /* let the browser size the open pill for real, read that number, then put
     it back and animate towards it. adding up the parts by hand kept coming
     up short, because the padding and the flex gap are not in either piece. */
  idxBug.classList.add("telling");
}
function noteTick(now) {
  if (idxBug.classList.contains("held") || reduced) return;
  const t = (now - noteAt) / NOTE_MS;
  /* the mark thins across the interval and returns to full as the note
     lands. it never goes far enough to look switched off. */
  if (t >= 1) {
    noteAt = now;
    showNote();
    clearTimeout(noteShut);
    noteShut = setTimeout(hideNote, HOLD_MS);
  }
}
/* EVERY POINTER LISTENER IS PASSIVE (8 Oct, at Kir's report: "hard to move
   further" on the phone). A listener that may cancel makes WebKit hold each
   touch until the page's script has answered it, and these sit on the window,
   so on a busy stretch (a wall dealing its pictures) the page did not follow
   the finger: a flick came out late, as a lurch, or not at all. None of them
   cancels anything. The floating objects keep the page still under a drag with
   `touch-action:none` (unnamed.css), which needs no listener. */
idxBug.addEventListener("pointerdown", e => {
  ixDrag = true; ixMoved = false; ixDown = performance.now();
  const r = idxBug.getBoundingClientRect();
  ixDx = e.clientX - (r.left + r.width / 2);
  ixDy = e.clientY - (r.top + r.height / 2);
  try { idxBug.setPointerCapture(e.pointerId); } catch {}
  e.stopPropagation();
}, { passive:true });
addEventListener("pointermove", e => {
  if (!ixDrag) return;
  if (Math.abs(e.movementX) + Math.abs(e.movementY) > 1) {
    if (!ixMoved) { ixMoved = true; idxBug.classList.add("drag"); }
    const w = idxBug.offsetWidth, h = idxBug.offsetHeight;
    idxBug.style.margin = "0";
    idxBug.style.left = Math.max(8, Math.min(innerWidth - w - 8, e.clientX - ixDx - w / 2)) + "px";
    idxBug.style.top  = Math.max(8, Math.min(innerHeight - h - 8, e.clientY - ixDy - h / 2)) + "px";
  }
}, { passive:true });
addEventListener("pointerup", () => {
  if (!ixDrag) return;
  ixDrag = false;
  idxBug.classList.remove("drag");
  /* A TAP HOLDS OR RELEASES THE RUN, which is what it always did. No words for
     it: the mark simply sits back at half strength while it is held.

     THE ROOM CAME OFF THIS BUTTON (17 Aug, at Manny's direction — "for the
     asterisk I want to bring back the previous function, not the grid room, but
     instead what it was previously"). The room is still built and still works;
     it has no door on the page now and is reached only through `UN.room()`, so
     whatever gets it next can be chosen deliberately rather than inheriting the
     one gesture this mark already had a job for. */
  if (!ixMoved) noteHold(!idxBug.classList.contains("held"));
}, { passive:true });
/* THE MERGE THAT USED TO LIVE HERE IS THE PAGE'S BUSINESS, not this file's.
   future.html folded its `industry` pool into `general` because a thematic
   page wants to speak both wherever the reader is; index.html does not. A
   page that wants the same does it inside its own UN_NOTES, which is where
   content decisions belong. (This line was a real bug for a minute: it
   mutated a pool this file no longer owns and threw before `UN` was ever
   defined, which surfaced as "UN is not defined" — a stale reference, one
   error masquerading as another.) */

/* open and close */
let shutTimer = null;
function setOpen(open) {
  if (open && typeof holdOpen === "function") holdOpen();
  bug.classList.toggle("open", open);
  /* the bug stays exactly where it is. only the wheel adjusts. */
  clearTimeout(shutTimer);
  if (open) {
    ring.classList.remove("shut");
    ring.removeAttribute("hidden");
    ringFit();
  } else if (!ring.hasAttribute("hidden")) {
    /* let it play its exit before it is taken out of the layout */
    ring.classList.add("shut");
    shutTimer = setTimeout(() => {
      ring.classList.remove("shut");
      ring.setAttribute("hidden", "");
    }, reduced ? 0 : 260);
  }
  core.setAttribute("aria-expanded", String(open));
  if (open) bug.classList.remove("pulse");
}
addEventListener("pointerdown", e => { if (!bug.contains(e.target)) setOpen(false); }, { passive:true });

/* leave the wheel and it closes itself */
let leaveTimer = null;
const holdOpen = () => { clearTimeout(leaveTimer); leaveTimer = null; };
const letGo = () => {
  clearTimeout(leaveTimer);
  leaveTimer = setTimeout(() => { if (!dragging) setOpen(false); }, 260);
};
bug.addEventListener("pointerenter", holdOpen, { passive:true });
bug.addEventListener("pointerleave", e => { if (e.pointerType !== "touch") letGo(); }, { passive:true });
bug.addEventListener("focusin", holdOpen);
bug.addEventListener("focusout", e => { if (!bug.contains(e.relatedTarget)) letGo(); });

/* drag the bug around the screen. position is kept as a ratio of the
   viewport so scaling or resizing the window never strands it. */
let dragging = false, moved = false, ox = 0, oy = 0, placed = false;
let bx = 0.5, by = 0.5;                      /* 0 to 1, viewport relative */

function place(x, y) {
  const pad = bug.classList.contains("open") ? 128 : 8;
  const maxX = innerWidth - 56 - pad, maxY = innerHeight - 56 - pad;
  x = Math.max(pad, Math.min(maxX, x));
  y = Math.max(pad, Math.min(maxY, y));
  bug.style.margin = "0";
  bug.style.left = x + "px";
  bug.style.top = y + "px";
  bx = maxX > pad ? (x - pad) / (maxX - pad) : 0.5;
  by = maxY > pad ? (y - pad) / (maxY - pad) : 0.5;
  placed = true;
}

function reflow() {
  if (!placed) return;                       /* untouched: stays centered */
  const w = bug.offsetWidth || 56, h = bug.offsetHeight || 56, pad = 8;
  const maxX = innerWidth - w - pad, maxY = innerHeight - h - pad;
  bug.style.left = (pad + bx * Math.max(0, maxX - pad)) + "px";
  bug.style.top  = (pad + by * Math.max(0, maxY - pad)) + "px";
}

/* the wheel is far wider than the thing it hangs off, so near an edge it
   would run off screen. it used to be the bug that got shoved out of the
   way, which is why clicking it made it jump. the bug holds its ground now
   and the wheel slides itself back into view instead. */
function ringFit() {
  ring.style.translate = "";
  if (ring.hasAttribute("hidden")) return;
  /* measured from layout, not from the rect. the wheel blooms in from a
     quarter size, so anything read off getBoundingClientRect during the
     animation looks like it fits when the settled wheel will not. */
  const rw = ring.offsetWidth, rh = ring.offsetHeight, pad = 10;
  const b = bug.getBoundingClientRect();
  const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
  let dx = 0, dy = 0;
  if (cx - rw / 2 < pad) dx = pad - (cx - rw / 2);
  else if (cx + rw / 2 > innerWidth - pad) dx = innerWidth - pad - (cx + rw / 2);
  if (cy - rh / 2 < pad) dy = pad - (cy - rh / 2);
  else if (cy + rh / 2 > innerHeight - pad) dy = innerHeight - pad - (cy + rh / 2);
  if (dx || dy) ring.style.translate = Math.round(dx) + "px " + Math.round(dy) + "px";
}
const onResize = () => { reflow(); ringFit(); };
addEventListener("resize", onResize);
if (window.visualViewport) visualViewport.addEventListener("resize", onResize);
core.addEventListener("pointerdown", e => {
  dragging = true; moved = false;
  const b = bug.getBoundingClientRect();
  ox = e.clientX - b.left; oy = e.clientY - b.top;
  try { core.setPointerCapture(e.pointerId); } catch {}
  place(bug.getBoundingClientRect().left, bug.getBoundingClientRect().top);
  bug.classList.add("drag");
}, { passive:true });
addEventListener("pointermove", e => {
  if (!dragging) return;
  if (Math.abs(e.movementX) + Math.abs(e.movementY) > 1) moved = true;
  place(e.clientX - ox, e.clientY - oy);
}, { passive:true });
addEventListener("pointerup", () => {
  if (!dragging) return;
  dragging = false;
  bug.classList.remove("drag");
  if (!moved) setOpen(ring.hasAttribute("hidden"));
}, { passive:true });

/* press C to walk the house colors */
addEventListener("keydown", e => {
  if (e.key.toLowerCase() !== "c" || e.metaKey || e.ctrlKey || e.altKey) return;
  if (/^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
  const now = (root.style.getPropertyValue("--bg") || "#FFFFFF").trim().toUpperCase();
  const at = HOUSE.indexOf(now);
  setBg(HOUSE[(at + 1) % HOUSE.length]);
});

paint("#FFFFFF");
if (!reduced) bug.classList.add("pulse");

/* ---------- ask ----------
   a question goes to Claude with the studio's own context attached,
   so answers come back in the studio's voice, not a chatbot's. */
const ask = document.getElementById("ask");
const askInput = document.getElementById("ask-input");
const askOut = document.getElementById("ask-out");
const askOpen = document.getElementById("ask-bug");


let askBusy = false;
const history = [];

function askShow(open) {
  ask.toggleAttribute("hidden", !open);
  document.body.classList.toggle("asking", open);
  askOpen.setAttribute("aria-expanded", String(open));
  if (open) { askInput.focus(); askInput.select(); }
}
/* the pill drags like the color bug, and only opens if it did not move */
let aDrag = false, aMoved = false, aox = 0, aoy = 0, aPlaced = false, ax = .5, ay = .5;

function aPlace(x, y) {
  const w = askOpen.offsetWidth, h = askOpen.offsetHeight;
  const maxX = innerWidth - w - 8, maxY = innerHeight - h - 8;
  x = Math.max(8, Math.min(maxX, x));
  y = Math.max(8, Math.min(maxY, y));
  askOpen.style.margin = "0";
  askOpen.style.right = "auto";
  askOpen.style.left = x + "px";
  askOpen.style.top = y + "px";
  ax = maxX > 8 ? (x - 8) / (maxX - 8) : .5;
  ay = maxY > 8 ? (y - 8) / (maxY - 8) : .5;
  aPlaced = true;
}
function aReflow() {
  if (!aPlaced) return;
  const w = askOpen.offsetWidth, h = askOpen.offsetHeight;
  askOpen.style.left = (8 + ax * Math.max(0, innerWidth - w - 16)) + "px";
  askOpen.style.top  = (8 + ay * Math.max(0, innerHeight - h - 16)) + "px";
}
addEventListener("resize", aReflow);
if (window.visualViewport) visualViewport.addEventListener("resize", aReflow);

askOpen.addEventListener("pointerdown", e => {
  aDrag = true; aMoved = false;
  const b = askOpen.getBoundingClientRect();
  aox = e.clientX - b.left; aoy = e.clientY - b.top;
  try { askOpen.setPointerCapture(e.pointerId); } catch {}
  aPlace(b.left, b.top);
  askOpen.classList.add("drag");
}, { passive:true });
addEventListener("pointermove", e => {
  if (!aDrag) return;
  if (Math.abs(e.movementX) + Math.abs(e.movementY) > 1) aMoved = true;
  aPlace(e.clientX - aox, e.clientY - aoy);
}, { passive:true });
addEventListener("pointerup", () => {
  if (!aDrag) return;
  aDrag = false;
  askOpen.classList.remove("drag");
  if (!aMoved) askShow(true);
}, { passive:true });
document.getElementById("ask-close").addEventListener("click", () => askShow(false));

/* click anywhere that is not the question or the answer and it closes */
ask.addEventListener("pointerdown", e => {
  if (e.target.closest("#ask-input, #ask-out, #ask-close")) return;
  askShow(false);
}, { passive:true });
addEventListener("keydown", e => {
  if (e.key === "Escape" && !ask.hasAttribute("hidden")) askShow(false);
  if (e.key === "/" && ask.hasAttribute("hidden") && !/^(INPUT|TEXTAREA)$/.test(e.target.tagName)) {
    e.preventDefault(); askShow(true);
  }
});

/* the wait is the site's own scramble, not a spinner */
function thinking(el) {
  const up = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", lo = "abcdefghijklmnopqrstuvwxyz";
  const width = 34;
  if (reduced) { el.textContent = "Thinking"; return () => {}; }
  const iv = setInterval(() => {
    let s = "", head = true;                 /* caps a word, lowercase the rest */
    for (let i = 0; i < width; i++) {
      if (Math.random() < 0.18) { s += " "; head = true; continue; }
      s += head ? up[Math.floor(Math.random() * 26)] : lo[Math.floor(Math.random() * 26)];
      head = false;
    }
    el.textContent = s;
  }, 60);
  return () => clearInterval(iv);
}

async function send(question) {
  if (askBusy || !question.trim()) return;
  askBusy = true;
  const stop = thinking(askOut);
  history.push({ role: "user", content: question });
  try {
    const res = await fetch("/.netlify/functions/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history })
    });
    /* read it as text first. a missing function answers with netlify's own
       404 page, and calling res.json() on html throws somewhere unhelpful.
       visitors still get the plain line; the console gets what actually
       happened, which is the difference between a bad path and a bad key. */
    const raw = await res.text();
    let data = {};
    try { data = JSON.parse(raw); } catch {
      console.error("[ask] " + res.status + " " + (res.headers.get("content-type") || "") +
                    " — the endpoint did not return json. if this is a 404 the function is " +
                    "not deployed: it has to sit at netlify/functions/ask.js.");
    }
    if (!res.ok || data.error) {
      console.error("[ask] " + res.status + " " + (data.error || raw.slice(0, 160)));
    }
    const text = (data.text || "").trim();
    stop();
    askOut.textContent = text || "No answer came back. Try again.";
    if (text) history.push({ role: "assistant", content: text });
    else history.pop();
  } catch (err) {
    stop();
    console.error("[ask] request failed", err);
    askOut.textContent = "The line dropped. Try again.";
    history.pop();
  }
  askBusy = false;
}

askInput.addEventListener("keydown", e => {
  if (e.key !== "Enter") return;
  const q = askInput.value;
  askInput.value = "";
  send(q);
});


/* ---------- NO PARAGRAPH ENDS ON ONE WORD ----------
   (at Manny's direction, mobile pass — "ensure the typography is nicely anchored
   and that there aren't any weird widows or gaps".) `text-wrap: pretty` in the
   stylesheet asks the browser to solve this and the newest ones do; this is the
   backstop for the ones that do not, and it is the whole trick in one line: bind
   the last two words with a non-breaking space so they wrap together or not at
   all. A one-word last line is the most visible typographic fault on a 350px
   column and the cheapest to remove.

   It touches the LAST TEXT NODE only, so inline links and <br> structure survive.
   It re-runs on resize because the ideal break moves with the measure. Elements
   the scrambler owns are fine: it splits on spaces, and a bound pair simply
   travels as one word. */
const KNIT = "p, q, cite, .say > div, .d, .pcell p, blockquote, #psay, #ksay, .m-say";

/* how much of the column the LAST LINE fills, 0 to 1. That is the actual
   definition of a widow, measured rather than guessed at from a character
   count. */
function lastLineShare(el) {
  const box = el.getBoundingClientRect();
  if (box.width < 20) return 1;
  const r = document.createRange();
  r.selectNodeContents(el);
  const rects = [...r.getClientRects()].filter(x => x.width > 1);
  if (rects.length < 2) return 1;
  const y = Math.max(...rects.map(x => x.top));
  const w = rects.filter(x => Math.abs(x.top - y) < 3).reduce((a, x) => a + x.width, 0);
  return w / box.width;
}
function knitWidows(root) {
  for (const el of (root || document).querySelectorAll(KNIT)) {
    if (el.childElementCount > 6) continue;             /* a container, not a line */
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let last = null;
    while (w.nextNode()) if (w.currentNode.textContent.trim()) last = w.currentNode;
    if (!last) continue;
    /* IT HAS TO BE IDEMPOTENT, and the first version was not: it bound the last
       SPACE, so on the second run the last space was the one before the pair it
       had already bound, and it bound that too. Three runs (load, webfont, one
       resize) bound three words into an unbreakable block, which is what put
       "strategy," alone on a line in the middle of a paragraph: the browser had
       no legal break left where it wanted one.

       Idempotent BY CONSTRUCTION now, not by a guard against itself. Every run
       starts from the STRIPPED text and decides the bind again from nothing, so
       the hundredth run lands exactly where the first one did. */
    const words = last.textContent.replace(/\u00A0/g, " ").replace(/\s+$/, "").split(/\s+/);
    if (words.length < 3) continue;                    /* nothing to bind */
    const bind = n => {
      last.textContent = words.slice(0, -n).join(" ") + "\u00A0" +
                         words.slice(-n).join("\u00A0");
    };
    bind(1);
    /* One word is usually enough. Where it is not, a short word after another
       short one ("a wait."), the bound pair still sits alone on the line, so the
       word before it comes down too. Only worth measuring when the tail is short
       enough to be a candidate, which keeps this off the reflow path for every
       paragraph that was already fine. */
    if (words.length > 3 && words.slice(-2).join("").length < 9 &&
        lastLineShare(el) < 0.2) bind(2);
  }
}
let knitAt;
addEventListener("resize", () => { clearTimeout(knitAt); knitAt = setTimeout(() => knitWidows(), 200); },
                { passive: true });

/* ---------- the entry point ----------
   Everything above either ran on load (it needed nothing from the page) or
   waited here (it needed the page's own sections and material). */
let NAV_SECTIONS = null;
/* ---------- A FULL-GLASS BERTH DOES NOT SLICE ITS PICTURE ----------
   (17 Aug, at Manny's report: "make sure you're not cropping / clipping the
   3:2s".)

   HE IS RIGHT, AND HERE ARE THE NUMBERS. `#vpic`, `#vpic2` and `.q-wrap` are
   `inset:0`, so their box is the SHAPE OF THE WINDOW and never the shape of a
   ratio. Measured with `cover` forced: a 3:2 lost 6.3% of its width at 1440x900,
   15.6% at 1920x1080 and 69% on a 390x844 phone, and a 16:9 in the film stage
   lost 7.2% at 1920. Every earlier answer to this was a better CHOICE of picture
   — 16:9 to 3:2 for the nest, 3:2 for the strobe — and each one only made the
   slice smaller.

   A PICTURE PAINTED WHOLE NEEDS SOMEWHERE TO STAND, and the site already built
   that: these berths carry `groundOf`, the colour sampled from the picture
   itself, so the band left over by `contain` is the same colour as the
   photograph's own edge.

   IT LIVES HERE BECAUSE FIVE PAGES HAVE THESE BERTHS. The first version was
   written into belong.html and the audit's sibling check caught it inside the
   hour: a function declared on one project page and not on the other four is the
   exact shape of every fault this month. It carries its own ratio table and its
   own hue lookup so it needs nothing from a page. */
const GLASS_SEL = "#vpic, #vpic2, .q-wrap";
/* 0.16, AND THE NUMBER IS MEASURED. It has to clear the worst mismatch a desktop
   window can make between the shapes this library ships — a 3:2 in a 16:9 window,
   15.6% — because that is the case a hand-cast hero on Glome and future lands in,
   and it has to refuse a portrait phone, where a landscape frame misses by 42%
   and more and painting it whole would be a strip in a field. There is nothing
   between those two numbers to be careful about. */
const GLASS_BARS = 0.16;
const GLASS_RTOK = { "1x1": 1, "3x2": 1.5, "2x3": 2 / 3, "16x9": 16 / 9, "4x5": 0.8, "3x4": 0.75 };
const glassHue = v => {
  const s = decodeURIComponent(String(v || "")).replace(/^url\(["']?|["']?\)$/g, "");
  const a = (window.UN_ASSETS || {})[s.split("?")[0].split("/").pop()];
  return a && a.hue ? a.hue : "";
};
/* ---------- ON A PAGE MARKED `un-whole`, THE GLASS SHOWS EVERY PICTURE WHOLE ----------
   (12 Oct, at Manny's direction, on Tamber's opening with its green wordmark
   cut at the edge: "ensure no assets, including large ones... do a thorough
   pass across all 3 cases and ensure... assets (of any size) aren't getting
   cropped".)

   THIS IS THE NEWER LINE, AND ON THESE PAGES IT WINS OVER BOTH RULES BELOW. A
   16:9 no longer bleeds, and a 4:5 on a phone's glass is no longer cut because
   the miss is past `GLASS_BARS`. Measured before it: a 16:9 lost 10% of its
   width at 1728x1080, a 4:5 opening lost 42% of its width on a 390 phone and a
   16:9 film stage 72%. Every picture is painted whole on the colour sampled
   from its own edge, so a flat plate's band is invisible and a photograph's
   is a mat of its own colour. Deeds, Tamber and Belong carry the class on
   `<html>`; every other page keeps the rules as they were until Manny moves
   it. The films in these berths follow in `shared/unnamed.css`. */
const glassWhole = () => document.documentElement.classList.contains("un-whole");
function fitGlass(el) {
  const bg = el.style.backgroundImage;
  if (!bg) return;
  const m = decodeURIComponent(bg).match(/-(\d+x\d+)-/);
  const want = m ? GLASS_RTOK[m[1]] : undefined;
  if (want === undefined) { el.style.backgroundSize = glassWhole() ? "contain" : "cover"; return; }
  /* ---------- A 16:9 BLEEDS. IT IS THE ONE SHAPE THAT IS FOR BLEEDING ----------
     (17 Aug, at Manny's report on future: "these 16x9 titles must extend edge to
     edge".)

     He is right, and the rule above was overreaching. 16:9 is not a picture in
     this library, it is FOOTAGE: the chapter stage was moved to it on 15 Aug for
     exactly this reason — "the one shape that fills a full-bleed window without a
     crop" — so painting a 16:9 whole defeats the only reason it is cast there.
     Measured at his window shape, 1300x694 at 1.873: a 16:9 misses by 5.2% and a
     full-bleed stage was showing 34px of ground down both sides, on `#vpic`,
     `#vpic2` and `.q-wrap` alike.

     EVERY OTHER SHAPE KEEPS THE RULE. A 3:2, a 4:5 and a 1:1 in a glass berth are
     pictures that happen to be in a window, and those are the ones that must not
     be sliced. That is the distinction the first pass of this missed: it treated
     one measurement as one problem when the library has two kinds of frame in it. */
  if (m[1] === "16x9" && (!glassWhole() || el._gfull)) {
    if (el._gfit !== "cover") {
      el._gfit = "cover";
      el.style.backgroundSize = "cover";
      el.style.backgroundRepeat = "no-repeat";
    }
    if (el._gband && !el._gkeep) { el._gband = ""; el.style.removeProperty("background-color"); }
    return;
  }
  const bw = el.clientWidth, bh = el.clientHeight;
  if (bw < 8 || bh < 8) return;
  const boxR = bw / bh;
  const miss = 1 - Math.min(boxR / want, want / boxR);
  const fit = (glassWhole() || miss <= GLASS_BARS) ? "contain" : "cover";
  /* THE RULE THAT MAKES A BAND OWNS THE BAND: the fit, the repeat and the colour
     the band is painted in. Belt and braces on `no-repeat`, because a box that
     has always covered has never needed it and three of these had it missing. */
  if (el._gfit !== fit) {
    el._gfit = fit;
    el.style.backgroundSize = fit;
    el.style.backgroundRepeat = "no-repeat";
  }
  /* AND THE BAND IS THE PICTURE'S COLOUR, NEVER THE PANEL'S. `.q-wrap` stands on
     `var(--fg)`, which measured white on the film stage: a white strip beside a
     dark frame, the same fault as a tile wearing a different colour.

     KEYED ON THE PICTURE AND NOT ON THE FIT, which was the bug in the first pass.
     A berth on a walk swaps pictures without changing its fit, so an early return
     on `fit` unchanged left the previous frame's colour standing. `_gkeep` marks
     the surfaces that set a ground deliberately. */
  if (fit === "contain") {
    const g = glassHue(bg);
    if (g && el._gband !== g) { el._gband = g; el.style.backgroundColor = g; }
  } else if (el._gband && !el._gkeep) {
    el._gband = "";
    el.style.removeProperty("background-color");
  }
}
/* ---------- AND THE OPENING'S WINDOW TAKES THE PICTURE'S SHAPE ----------
   (12 Oct, at Manny's direction, on three openings with a band above and below
   the picture: "fix the margins above and below all intro images. either use
   the 16x9 images or the 3x2, but don't try and fit them in a container that
   doesn't fit".)

   Painting whole left the glass's shape around the picture, filled with the
   picture's colour. The window is now cut to the picture itself: these are its
   insets inside the berth's box (top, right, bottom, left, in px), which the
   opening's loop lays into the clip it already draws, so the window grows to
   the picture's own edges and holds there with the house corner. Null on a
   page that does not paint whole, and the loop then runs as it always has. */
function glassInset(el) {
  if (!glassWhole()) return null;
  /* the opening's own 16:9 film covers the glass edge to edge (THE OPENING
     FILM RUNS EDGE TO EDGE, in each case page's opening), so it has no edges
     of its own to cut to */
  if (el._gfull && /-16x9-/.test(decodeURIComponent(el.style.backgroundImage || ""))) return null;
  const bg = el.style.backgroundImage || "";
  const bw = el.clientWidth, bh = el.clientHeight;
  if (el._gi && el._gi.bg === bg && el._gi.w === bw && el._gi.h === bh) return el._gi.v;
  const m = decodeURIComponent(bg).match(/-(\d+x\d+)-/);
  const want = m ? GLASS_RTOK[m[1]] : undefined;
  let v = null;
  if (want && bw >= 8 && bh >= 8) {
    if (bw / bh > want) { const x = (bw - bh * want) / 2; v = [0, x, 0, x]; }
    else { const y = (bh - bw / want) / 2; v = [y, 0, y, 0]; }
  }
  el._gi = { bg, w: bw, h: bh, v };
  return v;
}

/* ==========================================================================
   THE LIBRARY IS A ROOM YOU CAN WALK INTO
   (17 Aug, at Manny's direction over three passes. The last one: "just index the
   4x5s and make the interaction a lot more interesting, and have the wash have
   some sort of interplay with the images, for example if I choose an image it
   swaps the background".)

   ONE SHAPE. 227 of the library's files are 4:5, which is the shape this site
   actually stands things in, and a wall of one shape reads as a rack of prints
   rather than a grid of assorted boxes. What varies is the work, the size and
   the holes — never the frame.

   NOTHING IS BEHIND A CLICK. Pictures load a screen ahead and films play where
   they are seen. A click is not how you SEE a frame here; it is how you hand the
   room to one, which is a different thing and worth having.

   THE ROOM ANSWERS WHAT YOU PICK. `#amb` on every page of this site is a blurred
   picture behind the page; here the chosen frame becomes it, on two stacked
   plates that crossfade the way `#amb i` always has. The blob field steps back,
   the room's own ground moves to a colour taken out of the frame, and the rest
   of the wall dims and desaturates. Pick another and the whole room moves with
   it. Nothing about that vocabulary is new — it is the site's, pointed at
   whatever the reader is looking at.
   ========================================================================== */
const ROOM_SORTS = ["Luminance", "Hue", "Client", "Client run"];
const ROOM_STAGGER = 900;          /* ms: the whole wall is in by this point */
const ROOM_REELS = 6;              /* films playing at once, at the outside */
/* IT OPENS ON HUE, NOT ON THE MEASUREMENT IT IS ARGUING FOR, and that is a
   correction rather than a compromise. Luminance sorted either way opens on a
   monotone screen — descending is a wall of white marks, ascending two screens
   of ink — and a reader who has just pressed a button reads a monotone screen as
   nothing having loaded. Hue is measured too, it opens on the whole spectrum at
   once, and luminance is one press away for anyone who wants the gradient. */
let roomEl = null, roomGrid = null, roomSaid = null, roomSort = "Hue";
let roomEye = null, roomReel = null, roomPlaying = new Set();
let roomAmb = [], roomAmbN = 0, roomPicked = null;

/* the hue as an angle, so a hue sort walks the colour wheel rather than the
   alphabet of hex strings. a near-grey has no angle to sort by and is sent to
   the end, where the greys read as their own family. */
const hueAngle = hex => {
  if (!/^#[0-9a-f]{6}$/i.test(hex || "")) return 999;
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (d < 0.06) return 900 + (mx + mn) / 2;
  let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
};
/* the room's ground, taken out of the picture and pushed most of the way to
   ink: the wall behind a lit print is never the print's own value */
const roomInk = hex => {
  if (!/^#[0-9a-f]{6}$/i.test(hex || "")) return "#08080a";
  const n = parseInt(hex.slice(1), 16);
  /* MOST OF THE WAY TO INK, and further than it looks: a light picture at 0.17
     put the room at mid-grey and every dimmed tile on it went pale rather than
     dark. The wall behind a lit print is never the print's own value. */
  const mix = v => Math.round(v * 0.10 + 4);
  return "#" + [mix(n >> 16), mix((n >> 8) & 255), mix(n & 255)]
    .map(v => v.toString(16).padStart(2, "0")).join("");
};
const isReel = n => /\.mp4$/i.test(n);
/* ?v=2: on 6 Oct the films were re-encoded under their old names, and /content/ is
   cached for a month, so a browser holding the old bytes could splice them with
   the new ones. The query is a new address for every film. Bump it whenever a
   film is replaced in place. */
const roomSrc = (n, a) => `https://studio.unnamed.xyz/content/${a.lib || "studio"}/${isReel(n) ? "video" : "stills"}/${n}${isReel(n) ? "?v=2" : ""}`;
/* THE ROOM IS THE 4:5 SHELF. Everything else in the manifest is a shape this
   wall would have to make a decision about, and the decision is the thing the
   room is trying not to have. */
const roomNames = () => Object.keys(window.UN_ASSETS || {})
  .filter(n => (window.UN_ASSETS[n] || {}).ratio === "4x5");

function roomOrder(mode) {
  const M = window.UN_ASSETS || {};
  const key = {
    /* THE MEASUREMENT, AND THE REASON THE ROOM EXISTS. Descending, because a
       third of this library is near-black and ascending opens the wall on two
       screens of ink, which a reader who has just pressed a button reads as
       nothing loading. */
    Luminance: n => [-(M[n].lum ?? 0), hueAngle(M[n].hue)],
    Hue:       n => [hueAngle(M[n].hue), M[n].lum ?? 0],
    Client:    n => [M[n].client || "zzz", -(M[n].lum ?? 0)],
    /* the same clients, each run laid out light to dark, which is the one sort
       where a project reads as a body of work rather than a list */
    "Client run": n => [M[n].client || "zzz", hueAngle(M[n].hue), -(M[n].lum ?? 0)]
  }[mode] || (n => [M[n].lum ?? 0]);
  return roomNames().sort((a, b) => {
    const x = key(a), y = key(b);
    for (let i = 0; i < x.length; i++) { if (x[i] < y[i]) return -1; if (x[i] > y[i]) return 1; }
    return a < b ? -1 : 1;
  });
}

/* the picture, and the film, arrive because the reader is near them */
function roomWatch() {
  if (roomEye) roomEye.disconnect();
  if (roomReel) roomReel.disconnect();
  /* LOW DATA MODE: A FILM TILE WEARS A STILL (7 Oct, memory plan item 4). The
     reader asked us not to spend their data, so no film is mounted, and a tile
     left in its sampled colour reads as a hole in the wall. It takes a still of
     its own client instead (`UN.home.still`), the same shape first, and this
     wall's films are spread across that client's stills rather than all wearing
     its first one. Every 4:5 still is already somewhere in the room, so a stand-
     in repeats one: accepted, because the alternative is a bare box. */
  const stood = new Set();
  roomEye = new IntersectionObserver(es => {
    for (const e of es) {
      if (!e.isIntersecting) continue;
      const t = e.target, a = (window.UN_ASSETS || {})[t.dataset.n];
      roomEye.unobserve(t);
      if (!a) continue;
      const pic = !isReel(t.dataset.n) ? roomSrc(t.dataset.n, a)
                : LOWDATA ? UN.home.still(t.dataset.n, stood) : "";
      if (!pic) continue;
      t.style.backgroundImage = `url("${pic}")`;
      t.classList.add("lit");
    }
  }, { root: roomGrid, rootMargin: "120% 0px" });

  /* A FILM PLAYS WHERE IT IS SEEN AND NOWHERE ELSE, and no more than six at a
     time. The page's own budget is `KIT.reels`; this is the same idea with a
     tighter number, because a wall of playing video is the one thing here that
     can actually cost a frame. */
  roomReel = new IntersectionObserver(es => {
    for (const e of es) {
      const t = e.target, n = t.dataset.n, a = (window.UN_ASSETS || {})[n];
      if (!a) continue;
      if (e.isIntersecting && !t.firstElementChild && roomPlaying.size < ROOM_REELS && !reduced) {
        const v = document.createElement("video");
        v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
        v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
        v.preload = "auto"; v.src = roomSrc(n, a);
        t.appendChild(v);
        roomPlaying.add(t);
        v.play().catch(() => {});
      } else if (!e.isIntersecting && t.firstElementChild) {
        const v = t.firstElementChild;
        v.pause(); v.removeAttribute("src"); v.load(); v.remove();
        roomPlaying.delete(t);
      }
    }
  }, { root: roomGrid, rootMargin: "30% 0px" });

  /* in Low Data Mode a film tile is watched for its stand-in, never for a film */
  for (const t of roomGrid.querySelectorAll(".rtile"))
    (isReel(t.dataset.n) && !LOWDATA ? roomReel : roomEye).observe(t);
}

function roomLay() {
  const M = window.UN_ASSETS || {};
  const order = roomOrder(roomSort);
  const step = Math.min(3.4, ROOM_STAGGER / Math.max(1, order.length));
  const frag = document.createDocumentFragment();
  /* PLACED BY A HASH, NOT BY A LOTTERY, so the same wall comes back on every
     open instead of reshuffling under a reader who is halfway down it. One tile
     in twelve is dealt at double and one cell in eighteen is left for the wash. */
  /* `>>> 0` IS LOAD-BEARING. `^` truncates to a SIGNED 32-bit integer, so about
     half of these came out negative, every negative is under any threshold, and
     the wall shipped with 58% of its tiles at double size and a hole every other
     slot. Measured, not spotted: the sizes were counted rather than looked at. */
  const roll = (i, k) => ((((i + 1) * 2654435761) ^ (k * 40503)) >>> 0) / 4294967296;
  order.forEach((n, i) => {
    const a = M[n] || {};
    if (i > 5 && roll(i, 7) < 0.055) {
      const g = document.createElement("div");
      g.className = "rgap";
      frag.appendChild(g);
    }
    const big = roll(i, 3) < 0.085;
    const t = document.createElement("button");
    t.type = "button";
    t.className = "rtile";
    t.style.backgroundColor = a.hue || "#222";
    t.style.setProperty("--cx", big ? 8 : 4);
    t.style.setProperty("--cy", big ? 10 : 5);
    t.style.setProperty("--d", (i * step).toFixed(1) + "ms");
    t.dataset.n = n;
    t.setAttribute("aria-label", `${a.client || "studio"}${isReel(n) ? ", film" : ""}`);
    frag.appendChild(t);
  });
  /* THE OLD ORDER'S FILMS ARE PUT DOWN BEFORE THE GRID IS EMPTIED (7 Oct,
     memory plan item 4). Emptying it took up to six playing films out of the
     document with their sources still held, and each re-sort left six more for
     the collector to find whenever it got round to them. */
  UN.home.down(roomPlaying);
  roomPlaying.clear();
  roomGrid.textContent = "";
  roomPicked = null;
  roomEl.classList.remove("picked");
  roomGrid.appendChild(frag);
  roomGrid.scrollTop = 0;
  const b = roomEl.querySelector("#room-count");
  if (b) b.textContent = `${order.length} at 4:5`;
  for (const s of roomEl.querySelectorAll("#room-sorts button"))
    s.setAttribute("aria-pressed", String(s.dataset.s === roomSort));
  roomWatch();
}

/* ---------- pick one, and the room takes its light from it ---------- */
function roomSay(t) {
  if (!roomSaid) return;
  if (!t) { roomSaid.textContent = ""; return; }
  const a = (window.UN_ASSETS || {})[t.dataset.n] || {};
  roomSaid.textContent = `${t.dataset.n}   ${a.w || "?"}x${a.h || "?"}   ${a.client || "studio"}`;
}
function roomPick(t) {
  if (!t || t === roomPicked) { roomDrop(); return; }
  if (roomPicked) roomPicked.classList.remove("chosen");
  roomPicked = t;
  t.classList.add("chosen");
  roomEl.classList.add("picked");
  const n = t.dataset.n, a = (window.UN_ASSETS || {})[n] || {};
  /* TWO PLATES, ONE FADING UP AS THE OTHER FADES DOWN — `#amb i`, exactly. A
     background-image cannot be transitioned, so a second layer is the only way a
     wash can change without a cut, and this site has answered that the same way
     since the first page. */
  const inc = roomAmb[roomAmbN % roomAmb.length], out = roomAmb[(roomAmbN + 1) % roomAmb.length];
  roomAmbN++;
  /* a film has no still to blur, so its own sampled colour is the wash. A
     still paints its 256px copy, and the plate going out lets go of its
     picture once it has faded (7 Oct, memory plan item 1: UN.wash) */
  if (isReel(n)) inc.style.backgroundImage = "none";
  else UN.wash.paint(inc, roomSrc(n, a));
  inc.style.backgroundColor = a.hue || "#08080a";
  inc.classList.add("on");
  out.classList.remove("on");
  UN.wash.empty(out, 1000, inc);
  roomEl.style.setProperty("--room-ink", roomInk(a.hue));
  roomSay(t);
}
function roomDrop() {
  if (roomPicked) roomPicked.classList.remove("chosen");
  roomPicked = null;
  roomEl.classList.remove("picked");
  /* both plates let go of their pictures once dark, which is also how the
     room lets go of them when it closes (7 Oct, memory plan item 1) */
  for (const i of roomAmb) { i.classList.remove("on"); UN.wash.empty(i, 1000); }
  roomEl.style.removeProperty("--room-ink");
}

/* arrows walk the wall by geometry rather than by DOM order, because a dense
   grid with two tile sizes has no row a sibling index would agree with */
function roomStep(from, dx, dy) {
  const all = [...roomGrid.querySelectorAll(".rtile")];
  const r = from.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  let best = null, bestD = Infinity;
  for (const t of all) {
    if (t === from) continue;
    const b = t.getBoundingClientRect();
    const bx = b.left + b.width / 2, by = b.top + b.height / 2;
    const ax = bx - cx, ay = by - cy;
    if (dx && Math.sign(ax) !== Math.sign(dx)) continue;
    if (dy && Math.sign(ay) !== Math.sign(dy)) continue;
    /* the axis you asked for counts for much more than the one you did not */
    const d = dx ? Math.abs(ax) + Math.abs(ay) * 3 : Math.abs(ay) + Math.abs(ax) * 3;
    if (d < bestD) { bestD = d; best = t; }
  }
  if (best) { best.focus({ preventScroll: false }); roomSay(best); }
}

/* ---------- the light in the room comes from the library ----------
   Five blobs, each wearing a colour sampled off a real file and drifting on its
   own clock. It is `#amb` built out of the manifest instead of out of one
   picture, and it is what the room breathes when nothing is chosen. */
function roomWash() {
  const M = window.UN_ASSETS || {};
  const hues = Object.values(M).map(a => a.hue)
    .filter(h => /^#[0-9a-f]{6}$/i.test(h || "") && hueAngle(h) < 900);
  const w = document.createElement("div");
  w.id = "room-wash";
  w.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 5; i++) {
    const b = document.createElement("i");
    b.style.background = hues.length ? hues[Math.floor(hues.length * ((i * 0.37 + 0.11) % 1))] : "#3a3a6a";
    b.style.left = (12 + i * 19) + "%";
    b.style.top = (18 + ((i * 29) % 64)) + "%";
    b.style.setProperty("--x0", (-8 + i * 5) + "vw");
    b.style.setProperty("--y0", (-6 + ((i * 7) % 13)) + "vh");
    b.style.setProperty("--x1", (14 - i * 6) + "vw");
    b.style.setProperty("--y1", (9 - ((i * 5) % 15)) + "vh");
    b.style.setProperty("--s0", (0.85 + i * 0.07).toFixed(2));
    b.style.setProperty("--s1", (1.15 + i * 0.09).toFixed(2));
    b.style.setProperty("--t", (34 + i * 9) + "s");
    b.style.setProperty("--dl", (-i * 6) + "s");
    w.appendChild(b);
  }
  return w;
}

function roomBuild() {
  roomEl = document.createElement("div");
  roomEl.id = "room";
  roomEl.hidden = true;
  roomEl.setAttribute("role", "dialog");
  roomEl.setAttribute("aria-modal", "true");
  roomEl.setAttribute("aria-label", "The library");
  roomEl.innerHTML =
    '<div id="room-amb" aria-hidden="true"><i></i><i></i></div>' +
    '<div id="room-bar">' +
      '<b id="room-count"></b>' +
      '<span id="room-sorts">' +
        ROOM_SORTS.map(k => `<button type="button" data-s="${k}" aria-pressed="false">${k}</button>`).join("") +
      '</span>' +
      '<span id="room-said" aria-live="polite"></span>' +
      '<button id="room-shut" type="button">Close</button>' +
    '</div>' +
    '<div id="room-grid"></div>';
  roomEl.insertBefore(roomWash(), roomEl.firstChild);
  document.body.appendChild(roomEl);
  roomGrid = roomEl.querySelector("#room-grid");
  roomSaid = roomEl.querySelector("#room-said");
  roomAmb = [...roomEl.querySelectorAll("#room-amb i")];

  roomEl.querySelector("#room-shut").addEventListener("click", () => roomShow(false));
  roomEl.querySelector("#room-sorts").addEventListener("click", e => {
    const b = e.target.closest("button[data-s]");
    if (!b || b.dataset.s === roomSort) return;
    roomSort = b.dataset.s;
    roomDrop();
    roomLay();
    /* the wall is already up, so the new order has to be told to appear: the
       stagger is a transition off `.up`, and `.up` never left */
    roomEl.classList.remove("up");
    void roomEl.offsetWidth;
    roomEl.classList.add("up");
  });
  const name = e => { const t = e.target.closest(".rtile"); if (t) roomSay(t); };
  roomGrid.addEventListener("pointerover", name, { passive:true });
  roomGrid.addEventListener("focusin", name);
  roomGrid.addEventListener("click", e => {
    const t = e.target.closest(".rtile");
    /* the ground of the wall is a way out of a choice, not a dead zone */
    if (t) roomPick(t); else roomDrop();
  });
  roomGrid.addEventListener("keydown", e => {
    const t = e.target.closest(".rtile");
    if (!t) return;
    const step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (!step) return;
    e.preventDefault();
    roomStep(t, step[0], step[1]);
  });
  roomLay();
}

let roomWasScroll = "";
function roomShow(on) {
  if (on && !roomEl) roomBuild();
  if (!roomEl) return;
  if (on) {
    roomWasScroll = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    roomEl.hidden = false;
    void roomEl.offsetWidth;
    roomEl.classList.add("up");
    const first = roomGrid.querySelector(".rtile");
    if (first) first.focus({ preventScroll: true });
  } else {
    document.body.style.overflow = roomWasScroll;
    roomDrop();
    roomEl.classList.remove("up");
    /* a wall of playing film behind a closed door is the one thing here that
       would keep costing something, so every reel is put down on the way out
       (the same routine a re-sort uses now: UN.home.down) */
    UN.home.down(roomPlaying);
    roomPlaying.clear();
    setTimeout(() => { if (roomEl && !roomEl.classList.contains("up")) roomEl.hidden = true; },
               reduced ? 0 : 440);
    if (idxBug) idxBug.focus({ preventScroll: true });
  }
}
addEventListener("keydown", e => {
  if (e.key !== "Escape" || !roomEl || !roomEl.classList.contains("up")) return;
  /* one Escape, one layer: a choice is let go of before the room is */
  if (roomPicked) { roomDrop(); return; }
  roomShow(false);
});

/* ---------- THE CLUSTER'S RATES ----------
   How fast each of a chapter cluster's three cards rides against the scroll,
   in pixels per screen of travel. On a phone (12 Oct, at Manny's direction:
   "the one on right is slower ... to make the cluster cover more vertical
   space") the card standing on the right lags the page and the others lead it,
   so the cluster opens out as it passes rather than closing up; which card is
   on the right depends on the cluster's constellation, so it is read from the
   layout, not assumed. Every case page reads its rates from here. */
const UN_CLUSTER = {
  desk: [-42, 18, 72],
  rate(cards) {
    if (!matchMedia("(max-width:600px)").matches) return this.desk;
    let right = 0, best = -1;
    cards.forEach((c, n) => { const r = c.offsetLeft + c.offsetWidth / 2; if (r > best) { best = r; right = n; } });
    return cards.map((_, n) => n === right ? -64 : (n === 0 ? 34 : 10));
  }
};

const UN = {
  start(opts) {
    opts = opts || {};
    NAV_SECTIONS = opts.sections || [];
    if (NAV_SECTIONS.length) navInit(NAV_SECTIONS);
    revealInit(opts.reveal || ".rv, .rvb");
    /* after the page has built its own DOM, and again once the webfont has
       settled — the binding is per text node, so a second pass is free */
    knitWidows();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => knitWidows());
    return UN;
  },
  /* exposed so a page can re-run them after it rebuilds its own DOM */
  nav: navInit,
  reveal: revealInit,
  knit: knitWidows,
  /* so a page can put a second door on the room without knowing how it works */
  room: () => roomShow(true),
  /* ---------- A BLURRED SURFACE PAINTS A 256px COPY (7 Oct, memory plan item 1) ----------
     EVERY BLURRED SURFACE WAS PAINTING A MASTER. The wash behind a case study and
     future.html, the home and ventures nest once it sits behind the page, the
     work page's field and the library room's light each painted a 1080-2880px
     still under a heavy blur (46px; 22 on a phone, 18 in the light nest, 70 in
     the room), and the browser decodes the whole master to do it: about 8 MB a
     picture, and on a case page a new one every five seconds. A blur that wide
     keeps almost nothing a 256px file does not hold while it spans about three
     of the copy's pixels: blurred the same way, copy and master then differ by
     about 4 levels in 255 on the median still at full strength, under 2 at a
     wash's .3-.42 (estimated offline, 99.9th percentile; most of it is the
     WebP's own loss, which a higher quality does not win back and lossless
     does). At one and a half pixels it is twice that. So the nest and the
     work page's field keep the master where a wide window thins their blur
     below three (`soft`): the light nest's 18px blur on a desktop window, the
     work field from about 3300px wide. A case wash falls below three only for
     a 4:5 still on a window over about 3100px wide, at .42, and does not ask.
     The closest calls left are about 7 levels: the work page's field, at full
     strength, on its worst wide at 2560 wide, and studio-152 (fine saturated
     detail, the WebP's worst still) in the nest at .42. Only a screenshot pair
     can settle those.

     tools/px-copies.py writes the copy into content/px/wash/ under the master's
     own name, and the manifest carries `px.wash`: present means the copy is
     there, and the value is a hash of its bytes, which goes into the address
     (`?h=`), so a re-cut copy is a new file to every browser although /content/
     is cached for a month. NO COPY, NO CHANGE: a still the manifest has no copy
     for is painted from its master, and a copy that fails to load hands its
     plate back to the master, so a wash never goes dark.

     LEFT ON THE MASTER, on purpose: #vwash, the index quote panel, and a work
     plate that is the card's own picture. Each shows a picture the page decodes
     anyway, so a copy would only add one.

     ONE NAME, `UN.wash`, so nothing new joins the top-level scope every page
     shares with this file (a name declared twice there is a SyntaxError that
     stops a whole page script). */
  wash: (() => {
    const DIR = "https://studio.unnamed.xyz/content/px/wash/";
    const CSSURL = /url\(["']?([^"')]+)["']?\)/;
    const name = u => String(u || "").split(/[?#]/)[0].split("/").pop();
    /* a master's address in, its copy's address out; anything else, unchanged */
    const src = u => {
      const n = name(u), h = (((window.UN_ASSETS || {})[n] || {}).px || {}).wash;
      return h && /\/stills\//.test(u) ? `${DIR}${n}?h=${h}` : u;
    };
    /* IS THE BLUR WIDE ENOUGH TO HIDE THE COPY HERE? It is while it spans three
       of the copy's pixels (above). `blur` is the surface's blur measured in the
       plate's own layout pixels; the copy of `u` (by default the picture the
       plate holds) is laid on the plate's box with `cover`. A plate with no box,
       or a picture the manifest cannot size, says yes: nothing shows either way,
       and `src` hands back the master for a picture it has no copy of. */
    const soft = (el, blur, u) => {
      const a = (window.UN_ASSETS || {})[name(u || (CSSURL.exec(el.style.backgroundImage || "") || [])[1])];
      const w = el.offsetWidth, h = el.offsetHeight;
      if (!a || !a.w || !a.h || !w || !h) return true;
      const s = 256 / Math.max(a.w, a.h);           /* the copy: 256 on its long side */
      return blur >= 3 * Math.max(w / (a.w * s), h / (a.h * s));
    };
    /* paint a plate with the copy of `url` (with `url` itself when `use` is
       false). The address held is read back rather than rebuilt for the
       comparison: Safari can hand an inline url() back absolute, and a string
       built here would never match it. A plate with no box shows nothing
       whatever it holds (#amb is display:none under reduced motion), so it is not
       probed: the probe would be the one thing fetching its picture. */
    const paint = (el, url, use = true) => {
      if (el._we) el._we();                       /* a plate being painted is not one to empty */
      const copy = use ? src(url) : url;
      el.style.backgroundImage = `url("${copy}")`;
      if (copy === url || !el.getClientRects().length) return;
      const held = el.style.backgroundImage, probe = new Image();
      probe.onerror = () => { if (el.style.backgroundImage === held) el.style.backgroundImage = `url("${url}")`; };
      probe.src = copy;
    };
    /* AND THE PLATE THAT HAS FADED OUT LETS GO OF ITS PICTURE. At opacity 0 a
       plate still holds its decoded picture until something else is painted on
       it. It is emptied when its fade ends, with a timer as the backstop for a
       fade that never runs (reduced motion, a room closed mid-fade), and only if
       it is still out and still holds the same address: a fast scroll can bring a
       plate straight back. A fade that started late is looked at again a few
       times rather than given up on. A plate that holds the very picture the
       incoming one shows (a work client with one wide) would free nothing, so it
       is left alone. For plates that fade by the class `on` and their opacity. */
    const empty = (el, ms, inc) => {
      if (el._we) el._we();
      const held = el.style.backgroundImage;
      if (!held || held === "none" || (inc && inc.style.backgroundImage === held)) return;
      let t = 0, tries = 0;
      const out = () => el.style.backgroundImage === held && !el.classList.contains("on");
      const faded = () => parseFloat(getComputedStyle(el).opacity) <= 0;
      const stop = () => { clearTimeout(t); el.removeEventListener("transitionend", end); el._we = null; };
      const end = e => {
        if (e.target !== el || e.propertyName !== "opacity") return;
        if (!out()) stop();
        else if (faded()) { stop(); el.style.backgroundImage = "none"; }
      };
      const late = () => {
        if (!out() || ++tries > 4) stop();
        else if (faded()) { stop(); el.style.backgroundImage = "none"; }
        else t = setTimeout(late, ms);
      };
      el.addEventListener("transitionend", end);
      t = setTimeout(late, ms + 100);
      el._we = stop;
    };
    /* the two stacked plates of a wash (`#amb i`): the one coming on takes the
       copy and fades up, the one going off fades down and is then emptied. `css`
       is the master as a CSS image value, exactly as the pages build it. */
    const turn = (inc, out, css, ms = 900) => {
      const m = CSSURL.exec(css || "");
      if (m) paint(inc, m[1]);
      else { if (inc._we) inc._we(); inc.style.backgroundImage = css; }
      inc.classList.add("on");
      out.classList.remove("on");
      empty(out, ms, inc);
    };
    /* THE NEST STARTS A CHANGE OF FILE ONLY WHILE IT IS FULLY HAZED: to the
       copy once it sits behind the page (where `soft` allows; `on` false sends a
       frame to its master), back to the master the moment the hero takes it
       again. The new file is fetched and decoded first and only then painted, so
       a frame never blinks empty while it waits; if the frame has been dealt
       another picture meanwhile, or the field has changed its mind, the swap is
       dropped, and a copy that fails to load is never swapped in.
       THE WAY BACK IS NOT PROMISED TO LAND UNDER THE HAZE. A frame dealt behind
       the page was dealt its copy, so its master has never been fetched, and on
       a fast scroll up the haze thins within a few frames. On a slow connection
       the copy can still be on a frame for a moment after the blur has eased:
       the same picture, softer, never a blank. */
    const flip = (el, on) => {
      el._wf = on;
      const m = CSSURL.exec(el.style.backgroundImage || "");
      if (!m || m[1].includes("/px/wash/") === on) return;   /* empty, or already right */
      const n = name(m[1]), a = (window.UN_ASSETS || {})[n];
      if (!a || !a.lib) return;
      const master = `https://studio.unnamed.xyz/content/${a.lib}/stills/${n}`;
      const want = on ? src(master) : master;
      if (want === master && on) return;                     /* no copy: it keeps its master */
      const held = el.style.backgroundImage, im = new Image();
      im.src = want;
      const go = () => { if (el._wf === on && el.style.backgroundImage === held) el.style.backgroundImage = `url("${want}")`; };
      (im.decode ? im.decode() : new Promise((ok, no) => { im.onload = ok; im.onerror = no; })).then(go, () => {});
    };
    return { src, soft, paint, empty, turn, flip };
  })(),
  /* the glass berths' own fit, exposed for a page that dresses one by hand */
  fitGlass
};

/* ---------- A FILM THAT HAS BEEN PASSED IS LET GO ----------
   (7 Oct, memory plan item 3.) A paused <video> is not an empty one: it keeps
   its player, the bytes it buffered and the frames it decoded. The berths have
   always handed their films back off the glass, and the walls of the case
   pages and future.html now do on every path of their own (see mosaicPaint
   and mosaicScale there). The opening film and the case film only ever
   PAUSED, so each kept its whole player for the rest of the visit: on an
   iPhone an estimated 12 to 19 MB for a case film, and more for
   future.html's 2880-wide opening, which phones get too.

   `UN.films.keep(film, box, o)` lets one of them go a screen past the glass,
   and in a tab left hidden, with the three moves every engine reads as "tear
   it down now" rather than "whenever you next collect": pause, drop the
   source, `load()`. THE ELEMENT STAYS. Its id, its listeners, the fullscreen
   wiring and every reference a page holds keep working, and with no source it
   draws nothing, so the poster or the ground under it shows, as it does on
   arrival before the first frame. A screen before the box is back the film
   takes its source again (`o.src`, the page's own VSRC address; the one it
   gave up, if the page names none) and seeks to the second it left. A page
   that sets the time itself, as a first Play does when it starts the film
   from the top, calls `fresh()` on what this returns, so the remembered
   second cannot land on top of it.

   IT DOES NOT DECIDE WHEN THE FILM PLAYS. The page's own observer still does,
   on arrival. Once the source is back, this only asks whether the page wants
   the film running, two ways, and neither depends on which observer is told
   first when both fire in one step: `o.on()`, the page's own record of
   whether its film is on the glass, and whether the page called `play()` on
   the empty element in the meantime, which leaves it unpaused. That second
   one is read BEFORE the source goes in, because loading resets it. Play and
   pause EVENTS are not read at all: a load cancels the ones still queued, and
   a browser pausing a hidden tab's film on its own fires them too, and
   neither is the page changing its mind.

   A HIDDEN TAB LETS GO AFTER FIFTEEN SECONDS, not at once, so a glance at
   another tab or a notification neither cuts the opening to its poster nor
   refetches the film (27 MB on future.html); coming back inside that time
   cancels it. `o.hold()` keeps the film whatever the distance or the tab: a
   reader listening with sound. A source the page took away itself is never
   given back; only the one this took. And one the page has put in while the
   film was let go is the page's own: it is neither replaced nor sent to the
   remembered second.

   Rooted on <body> on an iPhone, for the reason the lazy loader below is: a
   margin on the window's observer cannot reach past body's own edge, so the
   screen of lead would shrink to the spill. */
UN.films = (() => {
  const LEAD = "100% 0px";      /* a screen above the glass, and a screen below */
  const GRACE = 15000;          /* how long a hidden tab keeps its film */
  const keep = (v, box, o) => {
    o = o || {};
    let near = true, gone = false, was = "", at = 0, nap = 0, held = [];
    const handle = { fresh() { at = 0; } };
    if (!v || !box || !("IntersectionObserver" in window)) return handle;
    /* the second it left, once the returning source knows its own length */
    v.addEventListener("loadedmetadata", () => {
      if (!at) return;
      try { v.currentTime = at; } catch (e) {}
      at = 0;
    });
    const go = () => {
      if (gone || (o.hold && o.hold())) return;
      if (!v.getAttribute("src") && !v.querySelector("source")) return;
      gone = true;
      was = v.getAttribute("src") || "";
      if (v.readyState) at = v.currentTime;    /* a source that never loaded keeps the last second */
      /* `autoplay` goes with the source, or the browser would start the film
         the moment it came back, a screen before anybody could see it */
      v.autoplay = false;
      v.pause();
      v.removeAttribute("src");
      /* <source> children are kept aside, so a film named only by them can
         take them back; one named by `src` gets that back instead */
      held = [...v.querySelectorAll("source")];
      for (const s of held) s.remove();
      v.load();
    };
    const back = () => {
      if (!gone) return;
      gone = false;
      const kids = held;
      held = [];
      /* the page has handed it one of its own: that source is left alone, and
         so is its time, so the remembered second goes too */
      if (v.getAttribute("src") || v.querySelector("source")) { at = 0; return; }
      const asked = !v.paused;
      const s = o.src || was;
      if (s) v.src = s;
      else { for (const k of kids) v.appendChild(k); v.load(); }
      if (asked || (o.on && o.on())) v.play().catch(() => {});
    };
    const sync = () => {
      clearTimeout(nap);
      if (document.hidden) nap = setTimeout(() => { if (document.hidden) go(); }, GRACE);
      else if (near) back();
      else go();
    };
    new IntersectionObserver(es => { near = es[es.length - 1].isIntersecting; sync(); },
      { root: SPILL ? document.body : null, rootMargin: LEAD }).observe(box);
    addEventListener("visibilitychange", sync);
    addEventListener("pageshow", sync);
    return handle;
  };
  return { keep };
})();

/* ---------- PICTURES LOAD AS THEY APPROACH (6 Oct) ----------
   The other half of the `un-lazy` rule in unnamed.css. Every berth (.box, .face,
   .mtile, .pic) is watched from the moment it enters the document; once it comes
   within a screen and a half of the glass it gets `un-seen`, the rule lets go of
   that berth, and the browser fetches its picture. The markup is untouched, so
   everything that reads a berth's url back out of its style keeps working.

   THIS FILE RUNS BEFORE THE PAGE BUILDS ITS ROOMS, which is the whole trick: the
   root class is on before the first berth is written, so no berth is ever
   styled, and fetched, without the rule. A MutationObserver picks the berths up
   as they arrive, including any a page writes later. */
(() => {
  if (!("IntersectionObserver" in window) || !("MutationObserver" in window)) return;
  const SEL = ".box, .face, .mtile, .pic";
  /* ON AN IPHONE <body> IS THE SCROLLER, and a margin on the window's observer
     cannot reach past body's own edge, so the lead would shrink to the spill.
     A second observer rooted on <body> keeps the screen and a half there; the
     first still sees berths that live in fixed layers, outside body's scroll. */
  const ios = [];
  const seen = es => {
    for (const e of es) if (e.isIntersecting) {
      e.target.classList.add("un-seen");
      for (const o of ios) o.unobserve(e.target);
    }
  };
  ios.push(new IntersectionObserver(seen, { rootMargin: "150% 100%" }));
  if (SPILL) ios.push(new IntersectionObserver(seen, { root: document.body, rootMargin: "150% 100%" }));
  const watch = el => { if (!el.classList.contains("un-seen")) for (const o of ios) o.observe(el); };
  const scan = n => {
    if (n.nodeType !== 1) return;
    if (n.matches(SEL)) watch(n);
    if (n.firstElementChild) n.querySelectorAll(SEL).forEach(watch);
  };
  document.documentElement.classList.add("un-lazy");
  new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) scan(n); })
    .observe(document.documentElement, { childList: true, subtree: true });
  scan(document.documentElement);
})();

/* ---------- A PICTURE TURNS ONLY WHERE IT CAN BE SEEN ----------
   (7 Oct, memory plan item 2.) The rotators and the walks on the project pages
   and on future turned anywhere from 0.4 of a screen above the glass to 1.4
   below it (a walk from a whole screen above to two below, hidden tab or not),
   and the case wall cut its tiles while its stage was still up to 900px below
   the glass. A reader parked mid-page paid for a change of picture every two
   or three seconds in boxes nobody could see: a fetch, a decode and a fresh
   bitmap each time, and now and then a film started off the glass. Counted in
   the iOS Simulator's Safari, parked mid Nike Diamond: 44 of the 81 picture
   swaps a minute were off the glass.

   SO A BERTH TURNS ON THE GLASS, AND ONCE UNDER IT. Under the glass lies a
   strip 15% of a screen deep: a box rising into view may take one turn there,
   so it can still arrive wearing a fresh picture, and then it waits for the
   reader instead of turning for nobody. Above the glass a berth simply holds.

   A HOLD IS A PAUSE, NOT A DEBT. A berth back on the glass after a hold does
   not turn the moment it reappears, which is the one moment the reader is sure
   to be looking at it: it waits a fresh share of its own beat first (`later`).
   The turn in the strip is the only catch-up, and nobody sees it. On the glass
   nothing else changes: every clock, beat and gate is still the page's own.

   THE GLASS IS THE SCREEN, BARS INCLUDED. Everywhere but an iPhone it is the
   window, 0 to innerHeight. On an iPhone (SPILL, top of this file) the held
   document is 100lvh and two spills tall and is held a spill down, so client
   y 0 is the top of the large viewport and the page runs on a spill past
   either end of it. The screen shows less than that:
   - THE FLOOR is 100lvh, the large viewport's bottom. The toolbar is drawn over
     the page from 100svh down to there, and past it lies the spill, off the
     screen's edge. In the --floor terms of the pinned frames that is
     innerHeight + FLOOR_PX - SPILL_PX while innerHeight is 100svh, because
     FLOOR_PX is 100lvh + spill - 100svh: the frames reach a spill further down
     than the screen does, so their floor would call a spill of unseen page
     "on the glass". A probe reads 100lvh straight, so this floor does not hang
     on what innerHeight reports under a toolbar that never folds.
   - THE TOP is the status bar's top edge. The screen is screen.height tall (its
     short side in landscape) and the large viewport is all of it below the
     status bar, so the difference is the status bar, drawn over the page above
     client y 0. The spill above that (120px, against a status bar of about 60)
     is off the screen.
   These are rects, not an IntersectionObserver, so <body> being the scroller
   on an iPhone changes nothing here.

   WHAT A PAGE GETS, as `UN.walks`:
     band(el, r)   for a berth whose rect the caller holds: 2 on the glass, 1 in
                   the strip with its one turn still to take, 0 hold. A caller
                   that turns a berth on a 1 sets `el._ahead = 1`; the glass
                   clears it.
     near(r)       glass or strip, and nothing written: the family guard and
                   the case wall's frame.
     later(per)    a fresh share of a beat, for a berth back from a hold.
     hold, wake    the walks' own gate and clocks, below.
     BACKSTOP      the clock under a walk's film step. */
UN.walks = (() => {
  const AHEAD = 0.15;        /* the strip under the glass, in screens */
  const BACKSTOP = 30000;    /* see `walkShow` */
  /* 100lvh comes off a probe of its own, put in here as the file loads, as the
     --floor probe is, so that `band` and `near` only ever read. It is read in
     the caller's own read phase, straight after the rect the caller already
     took, so it forces no layout of its own, and a resize marks it stale. */
  let probe = null, lvh = 0, top = 0, floor = 0;
  if (SPILL) {
    probe = document.createElement("i");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "position:absolute;left:0;top:0;width:0;height:100lvh;visibility:hidden;pointer-events:none";
    document.body.appendChild(probe);
    addEventListener("resize", () => { lvh = 0; });
  }
  const edges = () => {
    if (!SPILL) { top = 0; floor = innerHeight; return; }
    if (!lvh) lvh = probe.offsetHeight;
    floor = lvh || innerHeight;
    const tall = innerWidth > innerHeight ? Math.min(screen.width, screen.height)
                                          : Math.max(screen.width, screen.height);
    top = -Math.min(SPILL_PX, Math.max(0, tall - floor));
  };
  const band = (el, r) => {
    edges();
    if (r.width < 1 || r.bottom <= top || r.top >= floor + innerHeight * AHEAD) return 0;
    if (r.top < floor) { el._ahead = 0; return 2; }
    return el._ahead ? 0 : 1;
  };
  const near = r => {
    edges();
    return r.bottom > top && r.top < floor + innerHeight * AHEAD;
  };
  /* four tenths of a beat to a whole one, drawn afresh each time, so berths
     that come back together do not turn together */
  const later = per => per * (0.4 + 0.6 * Math.random());

  /* A WALK HOLDS ITS STEP where `band` says hold, and in a tab nobody is looking
     at. `hold(el, go, still)` is asked at the top of every step (`go` is the
     page's `walkAdvance`, `still` its still beat), and true means do not step:
     - in a hidden tab the walk is left with no clock at all, and `wake` gives
       it one on the way back;
     - off the glass it joins `held`, and ONE shared clock reads every held walk
       in a single batch twice a second and lets go of those back in view. A
       timer per walk would have been a rect read apiece, each its own task
       between frames that write styles: the periodic layout the project pages
       have already fought once (see their `fitTick`);
     - in the strip it takes its one step, and the step is marked;
     - back on the glass from a hold it waits `later` of a still's beat, and a
       film step waits for its film's own `ended`, under the backstop. A film
       the sweep has mounted again is already playing from its first frame. A
       film that ended off the glass would stand on its last frame, and some
       of the library ends on black, which reads as the dead card the backstop
       is there to prevent, so it starts again from its first frame, as a
       looping film would. It is still mounted, inside the sweep's budget, so
       this asks for nothing the sweep has not already granted.
       A film that failed to load has no `ended` coming and takes the still's
       beat on its ground colour instead of the backstop;
     - and a film that runs to its own end on the glass before the shared clock
       has let its walk go hands over as it always did, because the reader
       watched it end: that is the film's own beat, not a turn owed. */
  const held = new Map();
  let tick = 0;
  const arm = (el, go, ms) => { clearTimeout(el._wt); el._wt = setTimeout(() => go(el), ms); };
  const filmOf = el => {
    const v = el.firstElementChild;
    return v && v.tagName === "VIDEO" ? v : null;
  };
  const resume = (el, go, ms) => {
    const v = filmOf(el);
    if (!v || v.error) { arm(el, go, ms); return; }
    if (v.ended) { v.currentTime = 0; v.play().catch(() => {}); }
    arm(el, go, BACKSTOP);
  };
  const look = () => {
    tick = 0;
    if (document.hidden) return;
    const back = [];
    for (const el of held.keys()) {
      const b = band(el, el.getBoundingClientRect());
      if (b) back.push([el, b]);
    }
    for (const [el, b] of back) {
      const [go, still] = held.get(el);
      held.delete(el);
      if (b === 1) arm(el, go, 0);     /* `hold` lets its strip step through */
      else { el._wh = 0; resume(el, go, later(still)); }
    }
    if (held.size) tick = setTimeout(look, 500);
  };
  const hold = (el, go, still) => {
    clearTimeout(el._wt);
    el._wt = 0;
    if (document.hidden) { held.delete(el); return true; }
    const b = band(el, el.getBoundingClientRect());
    if (!b) {
      el._wh = 1;
      held.set(el, [go, still]);
      if (!tick) tick = setTimeout(look, 500);
      return true;
    }
    held.delete(el);
    /* still held but on the glass: only a film's own `ended` or `error`, or a
       strip step that landed late, can ask here before `look` does */
    const v = filmOf(el);
    if (el._wh && b === 2 && !(v && v.ended)) { el._wh = 0; resume(el, go, later(still)); return true; }
    el._wh = 0;
    if (b === 1) el._ahead = 1;
    return false;
  };
  /* AND A HIDDEN TAB STOPS EVERY WALK WHERE IT STANDS. The page calls `wake`
     with all its walks on both edges of `visibilitychange`, after its own
     sweep. On the way out every clock is dropped. On the way back each walk
     gets a fresh one, staggered from half a still's beat to one and a half so
     the walks on the glass do not all step together; a film the sweep has
     just mounted again from its first frame runs to its own `ended` instead,
     under the backstop, because cutting it on a stale clock would cut a film
     that had only just come back. A film step the sweep did not mount takes
     the staggered still beat rather than thirty seconds on its ground. */
  const wake = (list, go, still) => {
    held.clear();
    clearTimeout(tick);
    tick = 0;
    for (const el of list) {
      clearTimeout(el._wt);
      el._wt = 0;
      el._wh = 0;
      if (!document.hidden) resume(el, go, still * (0.5 + Math.random()));
    }
  };
  return { band, near, later, hold, wake, BACKSTOP };
})();
/* ---------- end: a picture turns only where it can be seen ---------- */

/* ---------- SQUIRCLE CORNERS (7 Oct) ----------
   (at Kir's direction: "on the rounded rectangles, the squircle we used in
   Ariadna".) Figma's corner smoothing, 0.6, the value Ariadna and the NOWN kit
   use (ADR-040), drawn by figma-squircle and cut with `clip-path: path()`.
   CSS `corner-shape` would be one line, but Safari does not have it (measured:
   iOS 26.5 reports no support and draws plain round corners), so the corners
   would differ between browsers.

   WHAT TAKES IT. Every rounded rectangle whose corner is a fixed size: the
   picture berths, the wall and mosaic tiles, the cards, the work card, the
   notes button. Circles and pills keep their curve. The hero window, the quote
   panel and the verticals' picture keep theirs too, because their radius is
   rewritten every frame. So do the index's nest frames: Chrome draws a clip as
   a mask the size of its layer, and those layers are several screens wide
   (measured: +50% of the drawn area on the index; without them the whole site
   costs 0 to 6%).

   THE ROUND CORNER STAYS UNDERNEATH. The smoothed corner lies inside the round
   one of the same radius (measured on the path: it leaves the edge earlier and
   meets the same arc at 45°), so `border-radius` is the first paint and the
   fallback, and the clip only ever takes away.

   THREE THINGS WOULD SHOW THE CLIP, AND EACH IS STEPPED AROUND:
   - A blur on the element itself. A filter is applied before the clip, so the
     soft edge would be cut hard. While a tile or a card is blurred (the walls'
     drift, the deal), the clip is off. A blurred corner shows no shape anyway.
   - A radius in motion (a berth born round, `.c2s`; a card's arrival). The
     clip is dropped and drawn again once the radius has held still.
   - A box changing size. The clip is dropped and drawn once the size has held
     still for a beat, not on every frame of a resize (the kit's rule).

   A transparent border used as halo room (the cards' `.face`) is not part of
   the shape: the path is drawn on the padding box and moved in by the border. */
(() => {
  if (!window.ResizeObserver || !window.MutationObserver || !CSS.supports("clip-path", 'path("M0 0H1V1Z")')) return;

  /* figma-squircle 1.1.0, npm figma-squircle, github.com/phamfoo/figma-squircle.
MIT License

Copyright (c) 2021 Tien Pham

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
  */
  const getSvgPath = (() => {
  // src/distribute.ts
  function distributeAndNormalize({
    topLeftCornerRadius,
    topRightCornerRadius,
    bottomRightCornerRadius,
    bottomLeftCornerRadius,
    width,
    height
  }) {
    const roundingAndSmoothingBudgetMap = {
      topLeft: -1,
      topRight: -1,
      bottomLeft: -1,
      bottomRight: -1
    };
    const cornerRadiusMap = {
      topLeft: topLeftCornerRadius,
      topRight: topRightCornerRadius,
      bottomLeft: bottomLeftCornerRadius,
      bottomRight: bottomRightCornerRadius
    };
    Object.entries(cornerRadiusMap).sort(([, radius1], [, radius2]) => {
      return radius2 - radius1;
    }).forEach(([cornerName, radius]) => {
      const corner = cornerName;
      const adjacents = adjacentsByCorner[corner];
      const budget = Math.min(
        ...adjacents.map((adjacent) => {
          const adjacentCornerRadius = cornerRadiusMap[adjacent.corner];
          if (radius === 0 && adjacentCornerRadius === 0) {
            return 0;
          }
          const adjacentCornerBudget = roundingAndSmoothingBudgetMap[adjacent.corner];
          const sideLength = adjacent.side === "top" || adjacent.side === "bottom" ? width : height;
          if (adjacentCornerBudget >= 0) {
            return sideLength - roundingAndSmoothingBudgetMap[adjacent.corner];
          } else {
            return radius / (radius + adjacentCornerRadius) * sideLength;
          }
        })
      );
      roundingAndSmoothingBudgetMap[corner] = budget;
      cornerRadiusMap[corner] = Math.min(radius, budget);
    });
    return {
      topLeft: {
        radius: cornerRadiusMap.topLeft,
        roundingAndSmoothingBudget: roundingAndSmoothingBudgetMap.topLeft
      },
      topRight: {
        radius: cornerRadiusMap.topRight,
        roundingAndSmoothingBudget: roundingAndSmoothingBudgetMap.topRight
      },
      bottomLeft: {
        radius: cornerRadiusMap.bottomLeft,
        roundingAndSmoothingBudget: roundingAndSmoothingBudgetMap.bottomLeft
      },
      bottomRight: {
        radius: cornerRadiusMap.bottomRight,
        roundingAndSmoothingBudget: roundingAndSmoothingBudgetMap.bottomRight
      }
    };
  }
  var adjacentsByCorner = {
    topLeft: [
      {
        corner: "topRight",
        side: "top"
      },
      {
        corner: "bottomLeft",
        side: "left"
      }
    ],
    topRight: [
      {
        corner: "topLeft",
        side: "top"
      },
      {
        corner: "bottomRight",
        side: "right"
      }
    ],
    bottomLeft: [
      {
        corner: "bottomRight",
        side: "bottom"
      },
      {
        corner: "topLeft",
        side: "left"
      }
    ],
    bottomRight: [
      {
        corner: "bottomLeft",
        side: "bottom"
      },
      {
        corner: "topRight",
        side: "right"
      }
    ]
  };

  // src/draw.ts
  function getPathParamsForCorner({
    cornerRadius,
    cornerSmoothing,
    preserveSmoothing,
    roundingAndSmoothingBudget
  }) {
    let p = (1 + cornerSmoothing) * cornerRadius;
    if (!preserveSmoothing) {
      const maxCornerSmoothing = roundingAndSmoothingBudget / cornerRadius - 1;
      cornerSmoothing = Math.min(cornerSmoothing, maxCornerSmoothing);
      p = Math.min(p, roundingAndSmoothingBudget);
    }
    const arcMeasure = 90 * (1 - cornerSmoothing);
    const arcSectionLength = Math.sin(toRadians(arcMeasure / 2)) * cornerRadius * Math.sqrt(2);
    const angleAlpha = (90 - arcMeasure) / 2;
    const p3ToP4Distance = cornerRadius * Math.tan(toRadians(angleAlpha / 2));
    const angleBeta = 45 * cornerSmoothing;
    const c = p3ToP4Distance * Math.cos(toRadians(angleBeta));
    const d = c * Math.tan(toRadians(angleBeta));
    let b = (p - arcSectionLength - c - d) / 3;
    let a = 2 * b;
    if (preserveSmoothing && p > roundingAndSmoothingBudget) {
      const p1ToP3MaxDistance = roundingAndSmoothingBudget - d - arcSectionLength - c;
      const minA = p1ToP3MaxDistance / 6;
      const maxB = p1ToP3MaxDistance - minA;
      b = Math.min(b, maxB);
      a = p1ToP3MaxDistance - b;
      p = Math.min(p, roundingAndSmoothingBudget);
    }
    return {
      a,
      b,
      c,
      d,
      p,
      arcSectionLength,
      cornerRadius
    };
  }
  function getSVGPathFromPathParams({
    width,
    height,
    topLeftPathParams,
    topRightPathParams,
    bottomLeftPathParams,
    bottomRightPathParams
  }) {
    return `
      M ${width - topRightPathParams.p} 0
      ${drawTopRightPath(topRightPathParams)}
      L ${width} ${height - bottomRightPathParams.p}
      ${drawBottomRightPath(bottomRightPathParams)}
      L ${bottomLeftPathParams.p} ${height}
      ${drawBottomLeftPath(bottomLeftPathParams)}
      L 0 ${topLeftPathParams.p}
      ${drawTopLeftPath(topLeftPathParams)}
      Z
    `.replace(/[\t\s\n]+/g, " ").trim();
  }
  function drawTopRightPath({
    cornerRadius,
    a,
    b,
    c,
    d,
    p,
    arcSectionLength
  }) {
    if (cornerRadius) {
      return rounded`
      c ${a} 0 ${a + b} 0 ${a + b + c} ${d}
      a ${cornerRadius} ${cornerRadius} 0 0 1 ${arcSectionLength} ${arcSectionLength}
      c ${d} ${c}
          ${d} ${b + c}
          ${d} ${a + b + c}`;
    } else {
      return rounded`l ${p} 0`;
    }
  }
  function drawBottomRightPath({
    cornerRadius,
    a,
    b,
    c,
    d,
    p,
    arcSectionLength
  }) {
    if (cornerRadius) {
      return rounded`
      c 0 ${a}
        0 ${a + b}
        ${-d} ${a + b + c}
      a ${cornerRadius} ${cornerRadius} 0 0 1 -${arcSectionLength} ${arcSectionLength}
      c ${-c} ${d}
        ${-(b + c)} ${d}
        ${-(a + b + c)} ${d}`;
    } else {
      return rounded`l 0 ${p}`;
    }
  }
  function drawBottomLeftPath({
    cornerRadius,
    a,
    b,
    c,
    d,
    p,
    arcSectionLength
  }) {
    if (cornerRadius) {
      return rounded`
      c ${-a} 0
        ${-(a + b)} 0
        ${-(a + b + c)} ${-d}
      a ${cornerRadius} ${cornerRadius} 0 0 1 -${arcSectionLength} -${arcSectionLength}
      c ${-d} ${-c}
        ${-d} ${-(b + c)}
        ${-d} ${-(a + b + c)}`;
    } else {
      return rounded`l ${-p} 0`;
    }
  }
  function drawTopLeftPath({
    cornerRadius,
    a,
    b,
    c,
    d,
    p,
    arcSectionLength
  }) {
    if (cornerRadius) {
      return rounded`
      c 0 ${-a}
        0 ${-(a + b)}
        ${d} ${-(a + b + c)}
      a ${cornerRadius} ${cornerRadius} 0 0 1 ${arcSectionLength} -${arcSectionLength}
      c ${c} ${-d}
        ${b + c} ${-d}
        ${a + b + c} ${-d}`;
    } else {
      return rounded`l 0 ${-p}`;
    }
  }
  function toRadians(degrees) {
    return degrees * Math.PI / 180;
  }
  function rounded(strings, ...values) {
    return strings.reduce((acc, str, i) => {
      const value = values[i];
      if (typeof value === "number") {
        return acc + str + value.toFixed(4);
      } else {
        return acc + str + (value ?? "");
      }
    }, "");
  }

  // src/index.ts
  function getSvgPath({
    cornerRadius = 0,
    topLeftCornerRadius,
    topRightCornerRadius,
    bottomRightCornerRadius,
    bottomLeftCornerRadius,
    cornerSmoothing,
    width,
    height,
    preserveSmoothing = false
  }) {
    topLeftCornerRadius = topLeftCornerRadius ?? cornerRadius;
    topRightCornerRadius = topRightCornerRadius ?? cornerRadius;
    bottomLeftCornerRadius = bottomLeftCornerRadius ?? cornerRadius;
    bottomRightCornerRadius = bottomRightCornerRadius ?? cornerRadius;
    if (topLeftCornerRadius === topRightCornerRadius && topRightCornerRadius === bottomRightCornerRadius && bottomRightCornerRadius === bottomLeftCornerRadius && bottomLeftCornerRadius === topLeftCornerRadius) {
      const roundingAndSmoothingBudget = Math.min(width, height) / 2;
      const cornerRadius2 = Math.min(
        topLeftCornerRadius,
        roundingAndSmoothingBudget
      );
      const pathParams = getPathParamsForCorner({
        cornerRadius: cornerRadius2,
        cornerSmoothing,
        preserveSmoothing,
        roundingAndSmoothingBudget
      });
      return getSVGPathFromPathParams({
        width,
        height,
        topLeftPathParams: pathParams,
        topRightPathParams: pathParams,
        bottomLeftPathParams: pathParams,
        bottomRightPathParams: pathParams
      });
    }
    const { topLeft, topRight, bottomLeft, bottomRight } = distributeAndNormalize(
      {
        topLeftCornerRadius,
        topRightCornerRadius,
        bottomRightCornerRadius,
        bottomLeftCornerRadius,
        width,
        height
      }
    );
    return getSVGPathFromPathParams({
      width,
      height,
      topLeftPathParams: getPathParamsForCorner({
        cornerSmoothing,
        preserveSmoothing,
        cornerRadius: topLeft.radius,
        roundingAndSmoothingBudget: topLeft.roundingAndSmoothingBudget
      }),
      topRightPathParams: getPathParamsForCorner({
        cornerSmoothing,
        preserveSmoothing,
        cornerRadius: topRight.radius,
        roundingAndSmoothingBudget: topRight.roundingAndSmoothingBudget
      }),
      bottomRightPathParams: getPathParamsForCorner({
        cornerSmoothing,
        preserveSmoothing,
        cornerRadius: bottomRight.radius,
        roundingAndSmoothingBudget: bottomRight.roundingAndSmoothingBudget
      }),
      bottomLeftPathParams: getPathParamsForCorner({
        cornerSmoothing,
        preserveSmoothing,
        cornerRadius: bottomLeft.radius,
        roundingAndSmoothingBudget: bottomLeft.roundingAndSmoothingBudget
      })
    });
  }
    return getSvgPath;
  })();

  const SEL = ".box, .wtile, .mtile, .card .face, #faces > i, #wk-card, #idx-bug";
  const SMOOTH = 0.6, SETTLE = 90;
  const paths = new Map();
  const pathFor = (w, h, r) => {
    const k = w + "|" + h + "|" + r;
    let d = paths.get(k);
    if (!d) {
      d = getSvgPath({ width: w, height: h, cornerRadius: r, cornerSmoothing: SMOOTH });
      if (paths.size > 400) paths.clear();
      paths.set(k, d);
    }
    return d;
  };
  const px = v => parseFloat(v) || 0;
  const blurOf = el => { const m = /blur\(([\d.e+-]+)px\)/.exec(el.style.filter || ""); return m ? +m[1] : 0; };

  /* the shape as it stands: the path for the box, or "" for none */
  function shape(el) {
    const cs = getComputedStyle(el);
    if (cs.display === "none") return "";
    let w = px(cs.width), h = px(cs.height);
    if (cs.boxSizing !== "border-box") {
      w += px(cs.paddingLeft) + px(cs.paddingRight) + px(cs.borderLeftWidth) + px(cs.borderRightWidth);
      h += px(cs.paddingTop) + px(cs.paddingBottom) + px(cs.borderTopWidth) + px(cs.borderBottomWidth);
    }
    /* one round corner, the same at all four: an elliptical or mixed set is
       left as it is rather than clipped to the wrong shape */
    const rs = [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius];
    if (rs.some(v => v !== rs[0] || v.includes(" "))) return "";
    let r = px(cs.borderTopLeftRadius), bx = 0, by = 0;
    /* a transparent border kept as halo room is not part of the shape */
    if (cs.backgroundClip === "padding-box" && (px(cs.borderLeftWidth) || px(cs.borderTopWidth)) &&
        /transparent|rgba\([^)]*,\s*0\)$/.test(cs.borderTopColor)) {
      bx = px(cs.borderLeftWidth); by = px(cs.borderTopWidth);
      w -= bx + px(cs.borderRightWidth); h -= by + px(cs.borderBottomWidth);
      r = Math.max(0, r - Math.max(bx, by));
    }
    w = Math.round(w * 100) / 100; h = Math.round(h * 100) / 100;
    /* nothing to smooth: no corner, a circle or a pill, a % radius */
    if (w < 4 || h < 4 || r < 2 || r >= Math.min(w, h) / 2 - 0.5 || cs.borderTopLeftRadius.includes("%")) return "";
    let d = pathFor(w, h, Math.round(r * 100) / 100);
    if (bx || by) d = d.replace(/([ML]) (-?[\d.]+(?:e[-+]?\d+)?) (-?[\d.]+(?:e[-+]?\d+)?)/g, (m, c, x, y) => c + " " + (+x + bx) + " " + (+y + by));
    return 'path("' + d + '")';
  }

  /* UNDER THE GLASS, NO CLIP (7 Oct, at Kir's report from an iPhone: "the
     squircles don't go under the top panel, the rest of the content does").
     On an iPhone a clipped box stops at the header's glass instead of running
     on under it and under the status bar, while the bottom toolbar takes it
     fine. So while a box crosses the band from the top of the screen down to
     the glass's lower edge, the clip is off and the round corner underneath
     is all there is. Under the blur the two cannot be told apart. The band is
     watched on <body>, the iPhone's scroller (SPILL, top of this file). */
  let watch = () => {}, unwatch = () => {}, overGlass = () => false;
  const want = el => blurOf(el) > 0.5 || (el._sql ? overGlass(el) : el._sqg) ? "" : el._sqd;
  const live = new Set();
  /* the observer reports every box once on arrival; only a real change of size
     is a resize */
  const sizes = new ResizeObserver(es => {
    for (const e of es) {
      const el = e.target, k = Math.round(e.contentRect.width * 10) + "x" + Math.round(e.contentRect.height * 10);
      if (el._sqs === k) continue;
      const first = el._sqs === undefined;
      el._sqs = k;
      /* the arrival report: the box may have been sized since it was adopted */
      if (first) { if (!el._sqt) draw(el); }
      else settle(el);
    }
  });
  const styles = new MutationObserver(ms => {
    for (const m of ms) (m.attributeName === "style" ? restyle : reclass)(m.target);
  });

  /* write the clip only when it changes: these elements are restyled every frame */
  function put(el, v) {
    if (el._sqv === v && el.style.clipPath === el._sqw) return;
    el._sqv = v;
    el.style.clipPath = v;
    el._sqw = el.style.clipPath;
  }
  function draw(el) {
    clearTimeout(el._sqt);
    el._sqt = 0;
    el._sqd = shape(el);
    el._sqr = el.style.borderRadius;
    put(el, want(el));
  }
  function settle(el) {
    if (!el.isConnected) { drop(el); return; }
    if (el._sqd === undefined) { draw(el); return; }
    put(el, "");
    clearTimeout(el._sqt);
    el._sqt = setTimeout(() => draw(el), SETTLE);
  }
  function restyle(el) {
    if (el._sqd === undefined) return;
    if (el.style.borderRadius !== el._sqr) { el._sqr = el.style.borderRadius; settle(el); return; }
    if (el._sqt) return;
    put(el, want(el));
  }
  /* a class can move the radius (`.c2s` grows from a circle into its corner),
     and so can a card turning from a still to a film (`data-video` takes its
     halo border away): wait for the transition to land, or draw again at once
     if there is none */
  function reclass(el) {
    if (el._sqd === undefined) return;
    const moving = el.getAnimations ? el.getAnimations().some(a => /radius/.test(a.transitionProperty || "")) : false;
    if (moving) { clearTimeout(el._sqt); el._sqt = 0; put(el, ""); el._sqd = ""; return; }
    if (!el._sqt) draw(el);
  }
  function adopt(el) {
    if (live.has(el)) return;
    live.add(el);
    draw(el);
    sizes.observe(el);
    watch(el);
    styles.observe(el, { attributes: true, attributeFilter: ["style", "class", "data-video"] });
    el.addEventListener("transitionend", landed);
  }
  function landed(e) { if (e.target === this && /radius|width|height|border/.test(e.propertyName)) draw(this); }
  function drop(el) {
    if (!live.delete(el)) return;
    sizes.unobserve(el);
    unwatch(el);
    clearTimeout(el._sqt);
  }
  const scan = n => {
    if (n.nodeType !== 1) return;
    if (n.matches(SEL)) adopt(n);
    if (n.firstElementChild) n.querySelectorAll(SEL).forEach(adopt);
  };
  const unscan = n => {
    if (n.nodeType !== 1) return;
    if (live.has(n)) drop(n);
    if (n.firstElementChild) n.querySelectorAll(SEL).forEach(drop);
  };
  new MutationObserver(ms => {
    for (const m of ms) { m.removedNodes.forEach(unscan); m.addedNodes.forEach(scan); }
  }).observe(document.documentElement, { childList: true, subtree: true });
  /* a breakpoint can change the radius without changing the size. Only a change
     of width counts: a phone's toolbar resizes the window on every scroll, and
     no radius here depends on the height. Each corner is simply drawn again
     once the resizing stops; one that has not changed is not written. */
  let lastW = innerWidth, sweep = 0;
  addEventListener("resize", () => {
    if (innerWidth === lastW) return;
    lastW = innerWidth;
    clearTimeout(sweep);
    sweep = setTimeout(() => { for (const el of live) if (el.isConnected) { if (!el._sqt) draw(el); } else drop(el); }, SETTLE);
  });

  /* THE WALLS' RIDES CARRY THEIR OWN CORNER. On the case pages a tile's arrival
     and exit run as a scroll-driven animation that blurs it (8px arriving,
     10px or 34px leaving), and an animation outranks anything written into the
     style: the clip from here would stay on and cut that blur hard. So a ride
     asks for the path and carries it as one more channel of its keyframes,
     on only between `on` and `off`, the stretch where the tile is seated and
     sharp. Each flip sits a hair inside the blur-free stretch. */
  UN.squircle = el => shape(el);
  UN.squircleRide = (el, frames, on, off) => {
    const d = shape(el);
    if (!d || !(off > on)) return frames;
    /* on an iPhone a ride with no blur in it (every ride there is a phone's)
       leaves the corner to the style, so the glass band above can take it off */
    if (SPILL && on <= 0 && off >= 1) return frames;
    /* a ride with no blur in it (a phone's) keeps the corner the whole way */
    if (on <= 0 && off >= 1) return [...frames, { offset: 0, clipPath: d }, { offset: 1, clipPath: d }].sort((a, b) => a.offset - b.offset);
    const e = Math.min(0.0004, (off - on) / 4);
    const clip = [[0, "none"], [Math.max(0, on - e), "none"], [on, d], [off, d], [Math.min(1, off + e), "none"], [1, "none"]];
    return [...frames, ...clip.map(([offset, clipPath]) => ({ offset, clipPath }))]
      .sort((a, b) => a.offset - b.offset);
  };
  /* the band: <body>'s box starts a spill above the screen, so it runs from
     there down to the header's lower edge, and is measured again whenever
     the header or the screen can have changed size */
  if (SPILL && window.IntersectionObserver) {
    const head = document.querySelector("header"), body = document.body;
    let top = 0, low = 0, glass = null;
    /* a box placed out of the flow (the cards' faces, absolute in a scaled
       card, and anything fixed) is not reported reliably by an observer on
       <body> (measured in Chromium: a face 4 to 90px into the band read as
       outside it).
       There are only a handful a page, and they are measured instead. */
    const loose = el => {
      for (let a = el; a && a !== body; a = a.parentElement)
        if (/^(absolute|fixed)$/.test(getComputedStyle(a).position)) return true;
      return false;
    };
    const strays = new Set();
    overGlass = el => { const r = el.getBoundingClientRect(); return r.bottom > top && r.top < low; };
    const flip = (el, g) => {
      if (el._sqg === g) return;
      el._sqg = g;
      if (el._sqd !== undefined && !el._sqt) put(el, want(el));
    };
    const band = () => {
      const b = body.getBoundingClientRect();
      top = b.top;
      low = head ? head.getBoundingClientRect().bottom : 0;
      if (glass) glass.disconnect();
      glass = new IntersectionObserver(es => { for (const e of es) flip(e.target, e.isIntersecting); },
        { root: body, rootMargin: "0px 0px " + -Math.max(0, Math.round(b.bottom - low)) + "px 0px" });
      for (const el of live) if (!el._sql) glass.observe(el);
      for (const el of strays) flip(el, overGlass(el));
    };
    watch = el => {
      if (loose(el)) { el._sql = true; strays.add(el); flip(el, overGlass(el)); }
      else glass.observe(el);
    };
    unwatch = el => { strays.delete(el); glass.unobserve(el); };
    /* they ease into place after the scroll has stopped, so they are followed
       frame by frame until they stand still */
    let ticking = false;
    const follow = () => {
      let moved = false;
      for (const el of strays) {
        const r = el.getBoundingClientRect(), y = Math.round(r.top) + "," + Math.round(r.bottom);
        if (el._sqy !== y) { el._sqy = y; moved = true; }
        flip(el, r.bottom > top && r.top < low);
      }
      if (moved) requestAnimationFrame(follow); else ticking = false;
    };
    body.addEventListener("scroll", () => {
      if (ticking || !strays.size) return;
      ticking = true;
      requestAnimationFrame(follow);
    }, { passive: true });
    band();
    let again = 0;
    const later = () => { clearTimeout(again); again = setTimeout(band, SETTLE); };
    addEventListener("resize", later);
    if (head) new ResizeObserver(later).observe(head);
  }
  scan(document.documentElement);
})();

/* ==========================================================================
   HOME FILMS: HELD WHILE NEAR, LET GO PROPERLY, A STILL FOR LOW DATA
   (7 Oct, memory plan item 4.) The tools for the films that are not a case
   page's: the index's Industry panel and reel, the ventures question panel,
   the home and ventures walls when they are dealt again, and the library room
   (roomWatch, roomLay, roomShow, which reach it only once the room is opened).
   All of it hangs off one name, `UN.home`, and declares nothing at the top
   level: the memory items land as separate changes, and two of them declaring
   the same top-level name would be a SyntaxError that stops every page script
   that loads this file. It sits at the end of the file for the same reason:
   the other items add their blocks after `UN` and after the lazy loader, and
   a block of its own here keeps each change's lines apart.
   ========================================================================== */
UN.home = {
  /* A FILM LET GO IS PAUSED, EMPTIED AND RESET. A pause keeps the decoder and
     every buffered byte, and taking an element out of the document only hands
     them to the collector, which gets round to it when it likes. Dropping the
     source and calling load() is what ends the player: the three steps the
     walls and the room already took inline, written once. The element stays
     where it is; a caller that is done with it removes it. */
  letGo(v) {
    if (!v) return;
    v.pause();
    if (v.hasAttribute("src")) { v.removeAttribute("src"); v.load(); }
  },

  /* every film standing in these tiles, let go and taken out. A tile's film is
     its first child, which is how the walls and the room both build it. */
  down(tiles) {
    for (const t of tiles) {
      const v = t.firstElementChild;
      if (v && v.tagName === "VIDEO") { UN.home.letGo(v); v.remove(); }
    }
  },

  /* NEAR AND FAR, WITH ROOM BETWEEN THEM. `on(true)` once `el` is within `near`
     screens of the glass, `on(false)` once it is more than `far` screens away,
     and nothing in between, so a reader resting at one edge does not load and
     drop the same film over and over. `far` must be the larger.

     THE MARGINS ARE PIXELS, measured off the glass, and set again when its
     height changes. A percentage margin is a share of the root's box, and ON
     AN IPHONE THE ROOT IS <body> (UNDER SAFARI'S BARS, at the top of this
     file), whose box already runs a spill past each edge of the glass: there
     '100%' came to about 1.3 screens and '150%' to about 1.9. So the spill is
     taken off the margin, and a screen is a screen on every device, give or
     take a toolbar. Rooted on <body> there for the lazy loader's reason: a
     margin on the window's observer cannot reach past body's own edge. With no
     IntersectionObserver the film is simply held, as every page did before. */
  band(el, near, far, on) {
    if (!el) return;
    if (!("IntersectionObserver" in window)) { on(true); return; }
    const root = SPILL ? document.body : null;
    const edge = k => Math.max(0, Math.round(k * innerHeight - SPILL_PX)) + "px 0px";
    let at = null, eyes = [], tall = 0, again = 0;
    const set = v => { if (at !== v) { at = v; on(v); } };
    const arm = () => {
      if (innerHeight === tall) return;
      tall = innerHeight;
      for (const o of eyes) o.disconnect();
      eyes = [
        new IntersectionObserver(es => { if (es[es.length - 1].isIntersecting) set(true); },
                                 { root, rootMargin: edge(near) }),
        new IntersectionObserver(es => { if (!es[es.length - 1].isIntersecting) set(false); },
                                 { root, rootMargin: edge(far) })
      ];
      for (const o of eyes) o.observe(el);
    };
    arm();
    /* once the size has held still for a beat, not on every frame of a drag */
    addEventListener("resize", () => { clearTimeout(again); again = setTimeout(arm, 250); });
  },

  /* A FILM'S OWN STILL, FOR A READER IN LOW DATA MODE. The case pages' `standIn`
     rule, loosened, and theirs is untouched (they keep their own copy): the
     same client in the manifest, the film's own shape first (its ratio, or,
     for a film the manifest gives no ratio, the same orientation: the panels'
     reels are unlabelled 16:9), any shape second, then the client's root
     (`nike-adapt` falls back to `nike`), and never a mark. Loosened twice.
     ANY LIBRARY: the panels' reels live in studio/ and several of their
     clients ship stills only in future/, and a still of the right client
     beats the panel's bare ground. A REPEAT BEFORE NOTHING: `taken`, when a
     caller passes one, is its no-repeat ledger; a name in it is passed over
     while anything else qualifies, a name chosen goes into it, and only when
     every candidate is taken is the first of them worn again, where `standIn`
     would return nothing. The query is cut before the lookup, because the
     manifest is keyed by bare filename and a film's address carries `?v=`.
     Empty when the client ships no stills, and the caller keeps its sampled
     colour. The manifest's names are sorted once, on the first call. */
  still: (() => {
    let names = null;
    const wide = c => (c.w || 0) > (c.h || 0);
    return (film, taken) => {
      const M = window.UN_ASSETS || {};
      const A = M[String(film || "").split("?")[0].split("/").pop()];
      if (!A || !A.client) return "";
      if (!names) names = Object.keys(M).sort();
      const like = c => A.ratio ? c.ratio === A.ratio : wide(c) === wide(A);
      const kins = [A.client];
      for (let cut = A.client.lastIndexOf("-"); cut > 0; cut = A.client.lastIndexOf("-", cut - 1))
        kins.push(A.client.slice(0, cut));
      let spare = "";
      for (const kin of kins)
        for (const sameShape of [true, false])
          for (const n of names) {
            const c = M[n];
            if (/\.mp4$/i.test(n) || c.client !== kin || c.subject === "logo") continue;
            if (sameShape && !like(c)) continue;
            if (taken && taken.has(n)) { spare = spare || n; continue; }
            if (taken) taken.add(n);
            return `https://studio.unnamed.xyz/content/${c.lib || "studio"}/stills/${n}`;
          }
      return spare ? `https://studio.unnamed.xyz/content/${M[spare].lib || "studio"}/stills/${spare}` : "";
    };
  })()
};

/* ---------- NO BOX STANDS BLACK WHILE ITS FILM IS HELD BACK ----------
   (14 Oct, at Manny's direction: "ensure no other case study have black
   boxes please", after "how come https://studio.unnamed.xyz/deeds isn't
   loading seeing a lot of black boxes".)

   Measured on every case page with the films held back, as Safari holds them
   in Low Power Mode or past the number it will decode at once: the walls
   aside, film boxes in the chapters, the film stages, the case player and a
   wall film with no still of its own stood as flat dark boxes, up to eight
   kinds on one page (Magic Leap, Deeds, Root). One net for every page: any
   berth that holds a film (`data-video`) and wears no picture wears the
   film's own still of the same name underneath, or failing that a still of
   the same piece (`UN_TWINS`), or failing that one of the same client and
   shape (`UN.home.still`). The case player takes the same as its film's
   `poster`. A berth that already wears a picture keeps it: this only fills a
   hole. It runs once the page is built and again whenever a berth takes a
   new film, so walks and cuts are covered too. */
(() => {
  const M = () => window.UN_ASSETS || {};
  const name = s => String(s || "").split("/").pop().replace(/\?.*$/, "");
  const at = n => { const a = M()[n]; return a ? `https://studio.unnamed.xyz/content/${a.lib || "studio"}/stills/${n}` : ""; };
  const posterOf = film => {
    const n = name(film);
    if (!/\.mp4$/i.test(n)) return "";
    const own = at(n.replace(/\.mp4$/i, ".webp"));
    if (own) return own;
    /* a still of the same piece, the same shape first */
    const piece = typeof UN_TWINS !== "undefined" ? UN_TWINS.of(n) : "";
    const tok = (n.match(/-(\d+x\d+)-/) || [])[1];
    if (piece) {
      const kin = Object.keys(M()).filter(k => /\.webp$/i.test(k) && UN_TWINS.of(k) === piece);
      const best = kin.find(k => tok && k.includes("-" + tok + "-")) || kin[0];
      if (best) return at(best);
    }
    return typeof UN !== "undefined" && UN.home && UN.home.still ? UN.home.still(n) : "";
  };
  const bare = el => { const b = el.style.backgroundImage; return !b || b === "none"; };
  const dress = el => {
    if (!el || el.nodeType !== 1) return;
    if (el.dataset && el.dataset.video && bare(el)) {
      /* a wall tile gets its thumb from the wall itself (`tilePoster`); the
         net only covers one whose film has no still of its own name */
      if (el.classList.contains("mtile") && at(name(el.dataset.video).replace(/\.mp4$/i, ".webp"))) return;
      const p = posterOf(el.dataset.video);
      if (!p) return;
      el.style.backgroundImage = `url('${p}')`;
      if (typeof GLASS_SEL !== "undefined" && el.matches(GLASS_SEL)) fitGlass(el);
      else if (typeof fitOne === "function") fitOne(el);
    }
    if (el.id === "cfilm" && !el.getAttribute("poster")) {
      /* the player's film may be named only in the page's THEME until it is
         near the glass; its poster goes on at once either way */
      const src = el.getAttribute("src") || (typeof THEME !== "undefined" && THEME.caseFilm) || "";
      const p = posterOf(src);
      if (p) {
        el.setAttribute("poster", p);
        const frame = el.closest(".cframe");
        if (frame && bare(frame)) {
          frame.style.backgroundImage = `url('${p}')`;
          frame.style.backgroundSize = "cover";
          frame.style.backgroundPosition = "center";
        }
      }
    }
  };
  const sweep = root => {
    if (!root || !root.querySelectorAll) return;
    dress(root);
    for (const el of root.querySelectorAll("[data-video], #cfilm")) dress(el);
  };
  const start = () => {
    sweep(document.body);
    new MutationObserver(list => {
      for (const m of list) {
        if (m.type === "attributes") { if (m.attributeName === "data-video" || m.target.id === "cfilm") dress(m.target); }
        else for (const n of m.addedNodes) sweep(n);
      }
    }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-video", "src"] });
  };
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();

/* ---------- A FILM STAGE STARTS ITS FILM AS IT ARRIVES ----------
   (28 Oct, at Manny's direction, with the settle in shared/unnamed.css: "smart
   do it on glassworks first".) On a page marked `un-films-settle`, a film
   stage that comes back into view plays its film from the first frame, so a
   reader never walks in halfway through a cut. Only on arrival: a film already
   on screen is left alone, and a still in the walk is not touched. */
(() => {
  if (!document.documentElement.classList.contains("un-films-settle") || !("IntersectionObserver" in window)) return;
  const away = new WeakMap();
  const start = () => {
    const io = new IntersectionObserver(es => {
      for (const e of es) {
        if (e.intersectionRatio < 0.1) { away.set(e.target, true); continue; }
        if (e.intersectionRatio < 0.35 || !away.get(e.target)) continue;
        away.set(e.target, false);
        const v = e.target.querySelector(".q-wrap > video");
        if (!v) continue;
        try { v.currentTime = 0; } catch (_) {}
        const p = v.play && v.play();
        if (p && p.catch) p.catch(() => {});
      }
    }, { threshold: [0, 0.1, 0.35] });
    for (const s of document.querySelectorAll(".q-stage.film")) { away.set(s, true); io.observe(s); }
  };
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
