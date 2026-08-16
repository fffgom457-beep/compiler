(() => {
  const tg = window.Telegram && window.Telegram.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
    try {
      tg.setHeaderColor("secondary_bg_color");
      tg.setBackgroundColor("bg_color");
    } catch (_) {}
  }

  const user = tg && tg.initDataUnsafe && tg.initDataUnsafe.user;
  const nameEl = document.getElementById("userName");
  const badgeEl = document.getElementById("premiumBadge");

  if (user) {
    nameEl.textContent = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || "User";
  } else {
    nameEl.textContent = "Гость";
  }
  badgeEl.textContent = "Открой из бота AeroCompile";
  badgeEl.className = "badge muted";

  function send(action, extra = {}) {
    const payload = JSON.stringify({ action, ...extra, ts: Date.now() });
    if (tg && typeof tg.sendData === "function") {
      try {
        tg.sendData(payload);
        return;
      } catch (e) {
        console.warn(e);
      }
    }
    // fallback: deep link hints
    if (tg) tg.showAlert("Открой Mini App кнопкой из бота, чтобы действие сработало.");
  }

  document.querySelectorAll("[data-action]").forEach((el) => {
    el.addEventListener("click", () => {
      const action = el.getAttribute("data-action");
      if (action === "close") {
        if (tg) tg.close();
        return;
      }
      send(action);
      if (tg && action !== "close") {
        try {
          tg.HapticFeedback && tg.HapticFeedback.impactOccurred("light");
        } catch (_) {}
      }
    });
  });

  document.getElementById("promoBtn").addEventListener("click", () => {
    const code = (document.getElementById("promoInput").value || "").trim();
    if (!code) {
      if (tg) tg.showAlert("Введи промокод");
      return;
    }
    send("promo", { code });
    if (tg) {
      try {
        tg.HapticFeedback && tg.HapticFeedback.notificationOccurred("success");
      } catch (_) {}
    }
  });

  document.getElementById("promoInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("promoBtn").click();
  });
})();
