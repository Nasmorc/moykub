// === НАСТРОЙКИ === //
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx6tsy4hyZw_iOKlU5bUSEAVjckwY7SYh4zyaVLn5AftRg7T0gztg3K1AdIOUWCL7Nc_Q/exec";
const WEB_APP_SECRET = "MYKUB_SECRET_2025";

const wrapper = document.getElementById("wrapper");

// === Создание форм === //
const modals = {
  rent: document.getElementById("modal-rent"),
  auction: document.getElementById("modal-auction"),
  closeButtons: document.querySelectorAll(".close-modal")
};

// === ОТКРЫТИЕ МОДАЛОК === //
function openRentModal(cubeId) {
  document.getElementById("rent-cube-id").value = cubeId;
  modals.rent.classList.add("show");
}

function openAuctionModal() {
  modals.auction.classList.add("show");
}

// === ЗАКРЫТИЕ МОДАЛОК === //
modals.closeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".modal").forEach(m => m.classList.remove("show"));
  });
});

// Закрытие по клику вне окна
document.querySelectorAll(".modal").forEach(m => {
  m.addEventListener("click", e => {
    if (e.target.classList.contains("modal")) {
      m.classList.remove("show");
    }
  });
});

// === ОТПРАВКА ФОРМ === //
async function submitForm(type, data) {
  data.secret = WEB_APP_SECRET;
  data.type = type;

  try {
    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!result.ok) throw new Error(result.error);

    alert("✅ Заявка отправлена!");
    document.querySelectorAll(".modal").forEach(m => m.classList.remove("show"));

  } catch (err) {
    alert("❌ Ошибка: " + err.message);
  }
}

// === СОБЫТИЯ НА ФОРМЫ === //
document.getElementById("form-rent").addEventListener("submit", e => {
  e.preventDefault();
  submitForm("rent", {
    cubeId: document.getElementById("rent-cube-id").value,
    name: document.getElementById("rent-name").value,
    contact: document.getElementById("rent-contact").value,
    link: document.getElementById("rent-link").value,
    message: document.getElementById("rent-message").value
  });
});

document.getElementById("form-auction").addEventListener("submit", e => {
  e.preventDefault();
  submitForm("auction", {
    bid: document.getElementById("auction-bid").value,
    contact: document.getElementById("auction-contact").value,
    link: document.getElementById("auction-link").value,
    message: document.getElementById("auction-message").value
  });
});

// === ПРИКЛИКИ НА КУБЫ === //
document.addEventListener("click", e => {
  if (e.target.classList.contains("cube")) {
    const txt = e.target.textContent.trim();
    if (txt === "ЦЕНТР") openAuctionModal();
    else if (txt.startsWith("#")) openRentModal(txt.replace("#", ""));
  }
});
