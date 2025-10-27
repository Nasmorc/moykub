// === ТВОЙ Apps Script ===
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx6tsy4hyZw_iOKlU5bUSEAVjckwY7SYh4zyaVLn5AftRg7T0gztg3K1AdIOUWCL7Nc_Q/exec";
const WEB_APP_SECRET = "MYKUB_SECRET_2025";

// === Узлы интерфейса (должны уже быть в твоём index.html) ===
const modal = document.getElementById("rentModal");         // общая модалка
const closeBtn = document.getElementById("closeModal");     // крестик закрытия
const notify = document.getElementById("notify");           // полоска уведомления

// Поля формы аренды (обычный куб)
const rentCubeId   = document.getElementById("rentCubeId");
const rentName     = document.getElementById("rentName");
const rentContact  = document.getElementById("rentContact");
const rentLink     = document.getElementById("rentLink");
const rentMsg      = document.getElementById("rentMsg");
const rentSubmit   = document.getElementById("rentSubmit");

// Поля формы аукциона (ЦЕНТР)
const auctionBid     = document.getElementById("auctionBid");
const auctionContact = document.getElementById("auctionContact");
const auctionLink    = document.getElementById("auctionLink");
const auctionMsg     = document.getElementById("auctionMsg");
const auctionSubmit  = document.getElementById("auctionSubmit");

// === Открыть модалку аренды на конкретный куб ===
// (эта функция уже вызывается из твоего кода на клике по кубу)
window.openRentModal = function (cubeId) {
  if (rentCubeId) rentCubeId.value = cubeId || "";
  modal.classList.add("show");
};

// === Открыть модалку аукциона (на центр) ===
window.openAuctionModal = function () {
  modal.classList.add("show");
  // если у тебя аукцион в той же модалке — просто показываем нужный блок
  const sectionRent = document.getElementById("section-rent");
  const sectionAuction = document.getElementById("section-auction");
  if (sectionRent && sectionAuction) {
    sectionRent.style.display = "none";
    sectionAuction.style.display = "block";
  }
};

// === Показать уведомление ===
function showNotify(text, good = true) {
  if (!notify) return;
  notify.innerText = text;
  notify.style.borderColor = good ? "#0f0" : "#f33";
  notify.classList.add("show");
  setTimeout(() => notify.classList.remove("show"), 3500);
}

// === Закрытие модалки ===
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");
    // если переключали секции — вернём в состояние по умолчанию
    const sectionRent = document.getElementById("section-rent");
    const sectionAuction = document.getElementById("section-auction");
    if (sectionRent && sectionAuction) {
      sectionRent.style.display = "block";
      sectionAuction.style.display = "none";
    }
  });
}
// клик по фону
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
      const sectionRent = document.getElementById("section-rent");
      const sectionAuction = document.getElementById("section-auction");
      if (sectionRent && sectionAuction) {
        sectionRent.style.display = "block";
        sectionAuction.style.display = "none";
      }
    }
  });
}

// === Отправка на Google Apps Script ===
async function sendToGoogle(type, payload) {
  const body = { secret: WEB_APP_SECRET, type, ...payload };

  try {
    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.ok) {
      showNotify("✅ Заявка успешно отправлена!");
    } else {
      throw new Error(data.error || "Сервер вернул ошибку");
    }
  } catch (err) {
    showNotify("❌ Ошибка: " + err.message, false);
  }
}

// === Сабмит: обычная аренда ===
if (rentSubmit) {
  rentSubmit.addEventListener("click", () => {
    sendToGoogle("rent", {
      cubeId:  rentCubeId?.value?.trim() || "",
      name:    rentName?.value?.trim() || "",
      contact: rentContact?.value?.trim() || "",
      link:    rentLink?.value?.trim() || "",
      message: rentMsg?.value?.trim() || "",
    });
    modal.classList.remove("show");
  });
}

// === Сабмит: аукцион (ЦЕНТР) ===
if (auctionSubmit) {
  auctionSubmit.addEventListener("click", () => {
    sendToGoogle("auction", {
      bid:     auctionBid?.value?.trim() || "",
      contact: auctionContact?.value?.trim() || "",
      link:    auctionLink?.value?.trim() || "",
      message: auctionMsg?.value?.trim() || "",
    });
    modal.classList.remove("show");
  });
}
