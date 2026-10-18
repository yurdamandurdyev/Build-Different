import { initMotion } from "../motion.js";
import { calculate } from "../nutrition.js";
import { programs, recipes } from "../data.js";
const dialog = document.querySelector("dialog");
let trigger;
function openDetail(html, button) {
  trigger = button;
  document.querySelector("#dialog-content").innerHTML = html;
  dialog.showModal();
}
function showSaved() {
  try {
    const name = localStorage.getItem("sainttraining-program");
    document.querySelector("#saved-program").textContent = name
      ? "Твоя сохранённая программа: " + name
      : "";
  } catch {}
}
showSaved();
document.querySelectorAll("[data-filter]").forEach(
  (button) =>
    (button.onclick = () => {
      document.querySelectorAll("[data-filter]").forEach((b) => {
        b.classList.toggle("active", b === button);
        b.setAttribute("aria-pressed", String(b === button));
      });
      document
        .querySelectorAll("[data-type]")
        .forEach(
          (c) =>
            (c.hidden =
              button.dataset.filter !== "all" &&
              c.dataset.type !== button.dataset.filter),
        );
    }),
);
document.querySelectorAll("[data-program]").forEach(
  (button) =>
    (button.onclick = () => {
      const p = programs[Number(button.dataset.program)];
      openDetail(
        `<span class="eyebrow">${p.tag} / ${p.meta}</span><h2>${p.name}</h2><p>${p.desc}</p><h3>Пример тренировочного дня</h3><ol>${p.work.map((w) => `<li>${w}</li>`).join("")}</ol><p>Разминка — 5–7 минут. Отдых между подходами — 60–90 секунд. Сохраняй комфортную интенсивность и прекращай упражнение при боли.</p><button class="button dark" id="save-program">Сохранить программу ＋</button><p id="save-status" role="status"></p>`,
        button,
      );
      document.querySelector("#save-program").onclick = () => {
        try {
          localStorage.setItem("sainttraining-program", p.name);
          document.querySelector("#save-status").textContent =
            "Сохранено в этом браузере";
          showSaved();
        } catch {
          document.querySelector("#save-status").textContent =
            "Браузер запретил сохранение.";
        }
      };
    }),
);
document.querySelectorAll("[data-recipe]").forEach(
  (button) =>
    (button.onclick = () => {
      const r = recipes[Number(button.dataset.recipe)];
      openDetail(
        `<span class="eyebrow">РЕЦЕПТ / ${r.time}</span><h2>${r.name}</h2><p>≈ ${r.kcal} ккал · Б ${r.p} г · Ж ${r.f} г · У ${r.c} г</p><h3>Ингредиенты на порцию</h3><p>${r.ingredients}</p><h3>Как приготовить</h3><p>${r.steps}</p><p class="footnote">Учитывай аллергию и непереносимость. Для точного расчёта используй данные с упаковок.</p>`,
        button,
      );
    }),
);
document.querySelector(".close-dialog").onclick = () => dialog.close();
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
});
dialog.addEventListener("close", () => trigger?.focus());
document.querySelector("#calc-form").onsubmit = (e) => {
  e.preventDefault();
  const f = new FormData(e.target),
    out = document.querySelector("#calc-result");
  try {
    const goal = f.get("goal"),
      r = calculate({
        sex: f.get("sex"),
        goal,
        weight: Number(f.get("weight")),
        height: Number(f.get("height")),
        age: Number(f.get("age")),
        activity: Number(f.get("activity")),
      });
    out.innerHTML = `<span class="eyebrow">ТВОЙ ДНЕВНОЙ ОРИЕНТИР</span><div class="calories">${r.calories}<small>ккал / день</small></div><div class="macros"><div><b>${r.protein} г</b><span>Белки</span></div><div><b>${r.fat} г</b><span>Жиры</span></div><div><b>${r.carbs} г</b><span>Углеводы</span></div></div><p>${goal === "lose" ? "Умеренный дефицит 15%. Следи за восстановлением." : goal === "gain" ? "Профицит 10%. Постепенно увеличивай силовую нагрузку." : "Поддерживай привычную активность."} Корректируй ориентир по самочувствию и динамике за 2–3 недели.</p>`;
  } catch (err) {
    out.textContent = err.message;
  }
};

initMotion();
