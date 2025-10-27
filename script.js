// === URL твоего Google Apps Script ===
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx6tsy4hyZw_iOKlU5bUSEAVjckwY7SYh4zyaVLn5AftRg7T0gztg3K1AdIOUWCL7Nc_Q/exec";
const WEB_APP_SECRET = "MYKUB_SECRET_2025";

// === Элементы ===
const modal = document.getElementById("rentModal");
const closeBtn = document.getElementById("closeModal");
const notify = document.getElementById("notify");

// === Закрытие модалки ===
closeBtn.addEventListener("click", () => modal.classList.remove("show"));
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("show");
});

// === Открыть форму аренды ===
function openRentModal(cubeId) {
  modal.classList.add("show");
  document.getElementById("rentCubeId").value = cubeId;
}

// === Показ уведомления ===
function showNotify(text, good = true) {
  notify.innerText = text;
  notify.style.borderColor = good ? "#0f0" : "#f00";
  notify.classList.add("show");
  setTimeout(() => notify.classList.remove("show"), 3500);
}

// === Отправка данных в Google ===
async function sendToGoogle(type, payload) {
  const body = {
    secret: WEB_APP_SECRET,
    type,
    ...payload
  };

  try {
    const r = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body)
    });

    const data = await r.json();
    if (data.ok) showNotify("✅ Заявка успешно отправлена!");
    else throw new Error(data.error || "Ошибка сервера");
  } catch(e) {
    showNotify("❌ Ошибка: " + e.message, false);
  }
}

// === Отправка обычной аренды ===
document.getElementById("rentSubmit").addEventListener("click", () => {
  sendToGoogle("rent", {
    cubeId: document.getElementById("rentCubeId").value,
    name: document.getElementById("rentName").value,
    contact: document.getElementById("rentContact").value,
    link: document.getElementById("rentLink").value,
    message: document.getElementById("rentMsg").value
  });

  modal.classList.remove("show");
});

// === Отправка на АУКЦИОН ===
document.getElementById("auctionSubmit").addEventListener("click", () => {
  sendToGoogle("auction", {
    bid: document.getElementById("auctionBid").value,
    contact: document.getElementById("auctionContact").value,
    link: document.getElementById("auctionLink").value,
    message: document.getElementById("auctionMsg").value
  });

  modal.classList.remove("show");
});
