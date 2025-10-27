// === НАСТРОЙКИ ===
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx6tsy4hyZw_iOKlU5bUSEAVjckwY7SYh4zyaVLn5AftRg7T0gztg3K1AdIOUWCL7Nc_Q/exec";
const WEB_APP_SECRET = "MYKUB_SECRET_2025";

// === ГЛАВНАЯ ФУНКЦИЯ ОТПРАВКИ ===
async function sendToSheet(type, dataObj) {
    const data = {
        secret: WEB_APP_SECRET,
        type,
        ...dataObj
    };

    try {
        const res = await fetch(WEB_APP_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const json = await res.json();
        console.log("Ответ сервера:", json);

        if (json.ok) {
            alert("✅ Успешно отправлено!");
            closeModals();
        } else {
            alert("⚠ Ошибка сервера: " + json.error);
        }

    } catch (err) {
        alert("❌ Ошибка сети: " + err.message);
        console.error(err);
    }
}

// === МОДАЛКИ ===
const overlay = document.getElementById("overlay");
const modalRent = document.getElementById("modal-rent");
const modalAuction = document.getElementById("modal-auction");

// Закрытие модалок
overlay.onclick = closeModals;
document.querySelectorAll(".close-modal").forEach(btn =>
    btn.onclick = closeModals
);

function closeModals() {
    overlay.style.display = "none";
    modalRent.style.display = "none";
    modalAuction.style.display = "none";
}

// === КЛИК НА КУБ ===
document.addEventListener("click", e => {
    const cube = e.target.closest(".cube");
    if (!cube) return;

    const idText = cube.textContent.trim();

    if (idText === "Центр") {
        openModalAuction("Центральный куб");
    } else if (idText.startsWith("#")) {
        const number = idText.slice(1);
        openModalRent(number);
    }
});

// === ОТКРЫТИЕ ФОРМ ===
function openModalRent(num) {
    document.getElementById("rent-cube").value = num;
    overlay.style.display = "block";
    modalRent.style.display = "block";
}

function openModalAuction(label) {
    document.getElementById("auction-label").innerText = label;
    overlay.style.display = "block";
    modalAuction.style.display = "block";
}

// === КНОПКИ ОТПРАВКИ ===

// 🔹 Аренда обычного куба
document.getElementById("send-rent").onclick = () => {
    sendToSheet("rent", {
        cubeId: document.getElementById("rent-cube").value,
        name: document.getElementById("rent-name").value,
        contact: document.getElementById("rent-contact").value,
        link: document.getElementById("rent-link").value,
        message: document.getElementById("rent-msg").value
    });
};

// 🔸 Ставка на аукцион центра
document.getElementById("send-auction").onclick = () => {
    sendToSheet("auction", {
        bid: document.getElementById("auction-bid").value,
        name: document.getElementById("auction-name").value,
        contact: document.getElementById("auction-contact").value,
        link: document.getElementById("auction-link").value,
        message: document.getElementById("auction-msg").value
    });
};
