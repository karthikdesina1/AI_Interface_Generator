(function () {
  const LS_KEY = "prompts.v1";
  let inited = false;

  // Minimal seed so the page isn't empty on first load
  const seed = [
    { id: id(), title: "Responsive Navbar", text: "Create a responsive navbar with a hamburger menu." },
    { id: id(), title: "Pricing Table", text: "Build a 3-tier pricing table with CTA buttons." },
    { id: id(), title: "Login Form", text: "Create a login form with email, password, and show/hide toggle." }
  ];

  function id(){ return "p_" + Math.random().toString(36).slice(2) + Date.now().toString(36); }
  function load() { try { return JSON.parse(localStorage.getItem(LS_KEY)) || seed; } catch { return seed; } }
  function save(arr) { localStorage.setItem(LS_KEY, JSON.stringify(arr)); }
  function escapeHtml(s){ return (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;"); }

  let prompts = load();

  // Initialize after SearchBar has been injected
  window.initPromptLibrary = function initPromptLibrary(){
    if (inited) return;
    const listEl   = document.getElementById("promptGridContainer");
    const searchEl = document.querySelector("#searchBarContainer input") || document.getElementById("plSearch");
    if (!listEl) return; // wait until container exists

    inited = true;

    // Controls row (Add / Export / Import) – light styling, non-intrusive
    const searchBar = document.getElementById("searchBarContainer");
    const ctrls = document.createElement("div");
    ctrls.className = "mb-4 flex flex-wrap gap-2";
    ctrls.innerHTML = `
      <button id="plAdd" class="px-3 py-2 rounded bg-black text-white text-sm">Add</button>
      <button id="plExport" class="px-3 py-2 rounded border text-sm">Export</button>
      <button id="plImportBtn" class="px-3 py-2 rounded border text-sm">Import</button>
      <input id="plImportFile" type="file" accept="application/json" class="hidden" />
    `;
    searchBar?.insertAdjacentElement("afterend", ctrls);

    const addBtn    = ctrls.querySelector("#plAdd");
    const exportBtn = ctrls.querySelector("#plExport");
    const importBtn = ctrls.querySelector("#plImportBtn");
    const importInp = ctrls.querySelector("#plImportFile");

    function render(q = "") {
      const query = q.trim().toLowerCase();
      listEl.innerHTML = "";
      const filtered = prompts.filter(p =>
        !query || p.title.toLowerCase().includes(query) || p.text.toLowerCase().includes(query)
      );

      if (!filtered.length) {
        listEl.innerHTML = `<div class="text-sm text-gray-500 p-3 border rounded">No prompts found.</div>`;
        return;
      }

      for (const p of filtered) {
        const card = document.createElement("div");
        card.className = "prompt-card cursor-pointer bg-gray-100 hover:bg-blue-50 border border-gray-300 rounded p-3 text-sm text-gray-700 shadow-sm transition break-words";
        card.innerHTML = `
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="font-medium truncate">${escapeHtml(p.title || "Untitled")}</div>
              <div class="text-gray-600 mt-1 whitespace-pre-wrap">${escapeHtml(p.text)}</div>
            </div>
            <div class="shrink-0 flex gap-2">
              <button class="use px-2 py-1 text-white bg-black rounded">Use</button>
              <button class="edit px-2 py-1 border rounded">Edit</button>
              <button class="del px-2 py-1 border rounded text-red-600">Delete</button>
            </div>
          </div>
        `;
        // Actions
        card.querySelector(".use").onclick = () => {
          try { localStorage.setItem("selectedPrompt", p.text); } catch {}
          window.location.href = "/CodeGenerator.html";
        };
        card.querySelector(".edit").onclick = () => {
          const newTitle = prompt("Title:", p.title || "");
          if (newTitle === null) return;
          const newText  = prompt("Prompt text:", p.text || "");
          if (newText === null) return;
          p.title = newTitle.trim();
          p.text  = newText.trim();
          save(prompts); render(searchEl?.value || "");
        };
        card.querySelector(".del").onclick = () => {
          if (!confirm("Delete this prompt?")) return;
          prompts = prompts.filter(x => x.id !== p.id);
          save(prompts); render(searchEl?.value || "");
        };
        listEl.appendChild(card);
      }
    }

    // Events
    searchEl?.addEventListener("input", () => render(searchEl.value));
    addBtn?.addEventListener("click", () => {
      const title = prompt("Title:");
      if (title === null) return;
      const text = prompt("Prompt text:");
      if (text === null) return;
      prompts.unshift({ id: id(), title: title.trim(), text: text.trim() });
      save(prompts); render(searchEl?.value || "");
    });
    exportBtn?.addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(prompts, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "prompts.json";
      a.click();
      URL.revokeObjectURL(a.href);
    });
    importBtn?.addEventListener("click", () => importInp?.click());
    importInp?.addEventListener("change", async (e) => {
      const file = e.target.files?.[0]; if (!file) return;
      try {
        const txt = await file.text();
        const arr = JSON.parse(txt);
        if (!Array.isArray(arr)) throw new Error("Invalid file");
        prompts = arr.map(p => ({ id: p.id || id(), title: (p.title||"").trim(), text: (p.text||"").trim() }));
        save(prompts); render(searchEl?.value || "");
      } catch {
        alert("Import failed. Use a prompts.json previously exported from this app.");
      } finally { e.target.value = ""; }
    });

    // initial paint
    save(prompts); // persist seed on first run
    render();
  };

  // Safety: if the page loads before injection, wait for the search bar
  document.addEventListener("DOMContentLoaded", () => {
    const target = document.getElementById("searchBarContainer");
    if (!target) return;
    const obs = new MutationObserver(() => {
      const input = document.querySelector("#searchBarContainer input");
      if (input) { obs.disconnect(); window.initPromptLibrary(); }
    });
    obs.observe(target, { childList: true, subtree: true });
    // fallback
    setTimeout(() => window.initPromptLibrary?.(), 1500);
  });
})();
