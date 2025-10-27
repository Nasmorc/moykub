document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("container");

    const CONFIG = {
        totalCubes: 130,
        center: {
            label: "ЦЕНТР",
            class: "cube center"
        },
        goodCube: {
            label: "КУБ ДОБРА",
            class: "cube good"
        },
        heroes: [
            { label: "Герой 1", class: "cube hero" },
            { label: "Герой 2", class: "cube hero" },
            { label: "Герой 3", class: "cube hero" }
        ]
    };

    function createCube(label, className) {
        const cube = document.createElement("div");
        cube.className = className;
        cube.textContent = label;
        return cube;
    }

    function renderCubes() {
        for (let i = 1; i <= CONFIG.totalCubes; i++) {
            container.appendChild(createCube(`#${i}`, "cube orbit"));
        }
        container.appendChild(createCube(CONFIG.heroes[0].label, CONFIG.heroes[0].class));
        container.appendChild(createCube(CONFIG.center.label, CONFIG.center.class));
        container.appendChild(createCube(CONFIG.heroes[1].label, CONFIG.heroes[1].class));
        container.appendChild(createCube(CONFIG.goodCube.label, CONFIG.goodCube.class));
        container.appendChild(createCube(CONFIG.heroes[2].label, CONFIG.heroes[2].class));
    }

    renderCubes();
});
