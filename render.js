// Schema (per project):
//   path:   string  shown text, e.g. "./blog"
//   url:    string  primary link
//   desc:   string  one-line description
//   status: "live" | "wip" | "dormant" | "archived"   (defaults to "live")
//   meta:   [{ label, url }]              (optional)

(() => {
  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));

  const renderMeta = (meta) => {
    if (meta.length === 0) return "";
    const links = meta
      .map((m) => `<a href="${escapeHtml(m.url)}">[${escapeHtml(m.label)}]</a>`)
      .join(" ");
    return `
      <div class="meta-wrap" data-open="false">
        <div class="meta">
          <span class="arrow" aria-hidden="true">↳</span>
          ${links}
        </div>
      </div>`;
  };

  const renderProject = (raw) => {
    const p = {
      path: raw.path ?? "",
      url: raw.url ?? "#",
      desc: raw.desc ?? "",
      status: raw.status ?? "live",
      meta: Array.isArray(raw.meta) ? raw.meta : []
    };
    const toggle = p.meta.length > 0
      ? `<button class="toggle" type="button" aria-expanded="false" aria-label="show links">+</button>`
      : "";
    return `
    <li data-status="${escapeHtml(p.status)}">
      <div class="row">
        <a class="primary" href="${escapeHtml(p.url)}">
          <span class="dot" aria-hidden="true"></span>
          <span class="sr-only">status: ${escapeHtml(p.status)}</span>
          <span class="path">${escapeHtml(p.path)}</span>
          <span class="desc">${escapeHtml(p.desc)}</span>
        </a>
        ${toggle}
      </div>${renderMeta(p.meta)}
    </li>`;
  };

  const wireToggles = () => {
    document.querySelectorAll(".toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const wrap = btn.closest("li").querySelector(".meta-wrap");
        const open = wrap.dataset.open === "true";
        wrap.dataset.open = String(!open);
        btn.setAttribute("aria-expanded", String(!open));
        btn.setAttribute("aria-label", open ? "show links" : "hide links");
      });
    });
  };

  const wireGroupToggles = () => {
    document.querySelectorAll(".collapsible .group-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const section = btn.closest(".collapsible");
        const open = section.dataset.open === "true";
        section.dataset.open = String(!open);
        btn.setAttribute("aria-expanded", String(!open));
      });
    });
  };

  const showLoadError = () => {
    const first = document.querySelector("[data-group]");
    if (!first) return;
    first.innerHTML = `<li class="load-error">could not load projects — try serving over http (e.g. <code>python3 -m http.server</code>)</li>`;
  };

  fetch("./projects.json")
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((data) => {
      document.querySelectorAll("[data-group]").forEach((ul) => {
        const items = data[ul.dataset.group] || [];
        ul.innerHTML = items.map(renderProject).join("");
      });
      wireToggles();
      wireGroupToggles();
    })
    .catch((err) => {
      console.error("failed to load projects.json", err);
      showLoadError();
    });
})();
