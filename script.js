// Sample data only — placeholder addresses and prices for review purposes.
// Real listings will replace this once William provides them.
const LISTINGS = [
  {
    id: "clay-st",
    address: "1412 SW Clay St",
    neighborhood: "SW Topeka",
    type: "rental",
    status: "available",
    price: 1150,
    beds: 3,
    baths: 2,
    pets: "Cats only",
    available: "Sept 1",
  },
  {
    id: "burlingame-rd",
    address: "3317 SW Burlingame Rd",
    neighborhood: "NW Topeka",
    type: "rental",
    status: "available",
    price: 1400,
    beds: 4,
    baths: 2,
    pets: "Dogs & cats ok",
    available: "Sept 15",
  },
  {
    id: "indiana-ave",
    address: "2208 SE Indiana Ave",
    neighborhood: "College Hill",
    type: "rental",
    status: "rented",
    price: 875,
    beds: 2,
    baths: 1,
    pets: "No pets",
    available: "—",
  },
  {
    id: "lyman-rd",
    address: "905 NW Lyman Rd",
    neighborhood: "Westboro",
    type: "sale",
    status: "pending",
    price: 189900,
    beds: 3,
    baths: 2,
    pets: "—",
    available: "—",
  },
  {
    id: "macvicar-ave",
    address: "1725 SW MacVicar Ave",
    neighborhood: "Westboro",
    type: "sale",
    status: "available",
    price: 214500,
    beds: 4,
    baths: 3,
    pets: "—",
    available: "—",
  },
];

function fmtPrice(listing) {
  const p = listing.price.toLocaleString();
  return listing.type === "rental" ? `$${p}/mo` : `$${p}`;
}

function statusBadge(status) {
  const label = { available: "Available", rented: "Rented", pending: "Pending" }[status];
  return `<span class="status-badge status-${status}">${label}</span>`;
}

function listingCardHTML(listing) {
  return `
    <a class="listing-card" href="property.html?id=${listing.id}">
      <div class="photo-placeholder"><span class="ph-icon"></span> property photo</div>
      <div class="listing-body">
        <div class="price ${listing.type === "sale" ? "for-sale" : ""}">${fmtPrice(listing)}</div>
        <div class="meta">${listing.beds} bd &middot; ${listing.baths} ba &middot; ${listing.neighborhood}</div>
        ${statusBadge(listing.status)}
      </div>
    </a>`;
}

function renderHomeListings() {
  const el = document.getElementById("home-listings");
  if (!el) return;
  const featured = LISTINGS.filter((l) => l.status !== "rented").slice(0, 4);
  el.innerHTML = featured.map(listingCardHTML).join("");
}

function renderListingsPage() {
  const grid = document.getElementById("listings-grid");
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  let activeTab = params.get("tab") === "sale" ? "sale" : "rent";

  const tabRent = document.getElementById("tab-rent");
  const tabSale = document.getElementById("tab-sale");

  function draw() {
    const type = activeTab === "rent" ? "rental" : "sale";
    const items = LISTINGS.filter((l) => l.type === type && l.status !== "rented");
    grid.innerHTML = items.length
      ? items.map(listingCardHTML).join("")
      : `<p style="color:#6b7280;">Nothing listed here right now — check back soon.</p>`;
    tabRent.classList.toggle("active", activeTab === "rent");
    tabSale.classList.toggle("active", activeTab === "sale");
  }

  tabRent.addEventListener("click", () => { activeTab = "rent"; draw(); });
  tabSale.addEventListener("click", () => { activeTab = "sale"; draw(); });
  draw();
}

function renderPropertyPage() {
  const wrap = document.getElementById("property-detail");
  if (!wrap) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const listing = LISTINGS.find((l) => l.id === id) || LISTINGS[0];

  document.getElementById("prop-address").textContent = listing.address;
  document.getElementById("prop-price").textContent = fmtPrice(listing);
  document.getElementById("prop-price").className = "price-big " + (listing.type === "sale" ? "for-sale" : "");
  document.getElementById("prop-status").innerHTML = statusBadge(listing.status);
  document.getElementById("prop-beds").textContent = listing.beds;
  document.getElementById("prop-baths").textContent = listing.baths;
  document.getElementById("prop-neighborhood").textContent = listing.neighborhood;
  document.getElementById("prop-pets").textContent = listing.pets;
  document.getElementById("prop-available").textContent = listing.available;

  const form = document.getElementById("inquiry-form");
  const success = document.getElementById("inquiry-success");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    success.style.display = "block";
    form.style.display = "none";
  });
}

// Demo-only credentials for the mockup's admin sign-in. There is no real
// account system behind this — it's a client-side check so the review
// flow feels real, and it's fully visible to anyone who views the page
// source. Do not reuse this pattern once the real site is built.
const ADMIN_DEMO_USER = "william";
const ADMIN_DEMO_PASS = "mahnopoly2026";

function initAdminLogin() {
  const form = document.getElementById("login-form");
  if (!form) return;
  const errorEl = document.getElementById("login-error");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("login-user").value.trim().toLowerCase();
    const pass = document.getElementById("login-pass").value;
    if (user === ADMIN_DEMO_USER && pass === ADMIN_DEMO_PASS) {
      sessionStorage.setItem("mahnopoly_demo_admin", "1");
      window.location.href = "admin.html";
    } else {
      errorEl.style.display = "block";
    }
  });
}

function initAdminLogout() {
  const btn = document.getElementById("logout-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    sessionStorage.removeItem("mahnopoly_demo_admin");
    window.location.href = "admin-login.html";
  });
}

function initAdminForm() {
  const openBtn = document.getElementById("add-property-btn");
  const panel = document.getElementById("add-property-panel");
  if (!openBtn || !panel) return;
  openBtn.addEventListener("click", () => {
    panel.classList.add("open");
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  const publishBtn = document.getElementById("publish-btn");
  const draftBtn = document.getElementById("draft-btn");
  const note = document.getElementById("admin-save-note");
  function showNote(text) {
    note.textContent = text;
    note.style.display = "inline";
  }
  publishBtn.addEventListener("click", () => showNote("Preview only — this would publish to the live site."));
  draftBtn.addEventListener("click", () => showNote("Preview only — this would save as a draft."));
}

document.addEventListener("DOMContentLoaded", () => {
  renderHomeListings();
  renderListingsPage();
  renderPropertyPage();
  initAdminLogin();
  initAdminLogout();
  initAdminForm();
});
