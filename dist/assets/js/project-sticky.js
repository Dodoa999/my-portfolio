/**
 * project-sticky.js
 * Záloha pro případ že CSS sticky stále nefunguje.
 * Zkontroluje zda sticky funguje — pokud ne, použije position:fixed.
 */

function initProjectSticky() {
  var rows = document.querySelectorAll(".project-row");
  if (!rows.length) return;

  // Test jestli CSS sticky funguje
  function isStickyWorking() {
    var test = document.createElement("div");
    test.style.cssText = "position:sticky;position:-webkit-sticky;top:0;";
    document.body.appendChild(test);
    var works = getComputedStyle(test).position === "sticky";
    document.body.removeChild(test);
    return works;
  }

  // Zkontroluj jestli má rodič overflow:hidden (to zabíjí sticky)
  function hasOverflowHiddenParent(el) {
    var node = el.parentElement;
    while (node && node !== document.body) {
      var overflow = getComputedStyle(node).overflow;
      var overflowY = getComputedStyle(node).overflowY;
      if (overflow === "hidden" || overflowY === "hidden") return true;
      node = node.parentElement;
    }
    return false;
  }

  rows.forEach(function (row) {
    var info = row.querySelector(".project-row__info");
    if (!info) return;

    if (hasOverflowHiddenParent(info)) {
      // CSS sticky nefunguje — přepni na position:fixed
      row.style.position = "relative";

      // Placeholder drží místo
      var ph = document.createElement("div");
      ph.className = "project-row__info-placeholder";
      ph.style.visibility = "hidden";
      ph.style.pointerEvents = "none";
      row.insertBefore(ph, info);

      function tick() {
        var rowRect = row.getBoundingClientRect();
        var infoH   = info.offsetHeight;
        var phW     = ph.offsetWidth;
        var phLeft  = ph.getBoundingClientRect().left;
        var viewH   = window.innerHeight;
        var centeredTop = (viewH - infoH) / 2;

        ph.style.width  = phW + "px";
        ph.style.height = infoH + "px";

        var relTop = centeredTop - rowRect.top;

        if (relTop <= 0) {
          // Před sticky zónou
          info.style.position = "absolute";
          info.style.top      = "0px";
          info.style.left     = "0";
          info.style.width    = phW + "px";
          info.style.transform = "none";
        } else if (relTop + infoH >= row.offsetHeight) {
          // Za sticky zónou
          info.style.position = "absolute";
          info.style.top      = (row.offsetHeight - infoH) + "px";
          info.style.left     = "0";
          info.style.width    = phW + "px";
          info.style.transform = "none";
        } else {
          // Sticky zóna — fixed uprostřed
          info.style.position = "fixed";
          info.style.top      = centeredTop + "px";
          info.style.left     = phLeft + "px";
          info.style.width    = phW + "px";
          info.style.transform = "none";
        }
      }

      window.addEventListener("scroll", tick, { passive: true });
      window.addEventListener("resize", tick, { passive: true });
      tick();
    }
    // Jinak CSS sticky funguje — nic nedělej
  });
}

window.addEventListener("load", initProjectSticky);