const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const foods = [
  {id:1, name:"Vegetable Rice", category:"Vegetarian", location:"Benz Circle, Vijayawada", qty:30, time:"Today, 11:30 AM – 4:00 PM", icon:"🍚", image:"images/vegetable rice.jpg", status:"available"},
  {id:2, name:"Idly & Sambar", category:"Vegetarian", location:"Guntur", qty:20, time:"Today, 9:00 AM – 1:00 PM", icon:"🥣", image:"images/idly sambar.jpg", status:"available"},
  {id:3, name:"Dal Rice", category:"Vegetarian", location:"Mangalagiri", qty:25, time:"Today, 2:00 PM – 4:00 PM", icon:"🍚", image:"images/dal rice.jpg", status:"requested"},
  {id:4, name:"Pongal", category:"Vegetarian", location:"Vijayawada", qty:15, time:"Today, 5:00 PM – 5:00 PM", icon:"🥘", image:"images/pongal.jpg", status:"available"}
];

function showPage(pageId) {
  if (!pageId) pageId = "home";
  $$(".page").forEach(p => p.classList.toggle("active", p.id === pageId));
  $$("[data-page]").forEach(a => a.classList.toggle("active", a.dataset.page === pageId));
  $("#mainNav").classList.remove("open");
  window.scrollTo({top:0, behavior:"smooth"});
}

function navigateFromHash() {
  const id = location.hash.replace("#","") || "home";
  showPage(document.getElementById(id) ? id : "home");
}

$$("[data-page]").forEach(el => {
  el.addEventListener("click", () => {
    const page = el.dataset.page;
    if (document.getElementById(page)) {
      history.pushState(null, "", "#" + page);
      showPage(page);
    }
  });
});
window.addEventListener("hashchange", navigateFromHash);

$("#menuBtn").addEventListener("click", () => $("#mainNav").classList.toggle("open"));

function showMessage(target, message, type="success") {
  target.textContent = message;
  target.className = "form-msg " + type;
  setTimeout(() => target.textContent = "", 4500);
}

function toast(message) {
  const t = $("#toast");
  t.textContent = message;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}

// Donor registration
$("#donorForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = e.target.name.value.trim();
  showMessage($("#donorMsg"), `Thanks ${name}! Donor registration completed for this demo.`);
  toast("Donor registered successfully");
  e.target.reset();
});

// Donation
$("#donateForm").addEventListener("submit", e => {
  e.preventDefault();
  const qty = Number(e.target.quantity.value || 0);
  const food = e.target.food.value.trim();
  showMessage($("#donateMsg"), `${food} (${qty} meals) has been added to the demo donation list.`);
  toast("Food donation created");
  $("#totalDonations").textContent = Number($("#totalDonations").textContent) + 1;
  $("#mealsShared").textContent = Number($("#mealsShared").textContent) + qty;
  $("#homeMeals").textContent = (1200 + qty) + "+";
  e.target.reset();
});

// Food list
function renderFoods() {
  const search = $("#foodSearch").value.toLowerCase().trim();
  const cat = $("#categoryFilter").value;
  const loc = $("#locationFilter").value;
  const status = $("#statusFilter").value;

  const filtered = foods.filter(f =>
    (!search || (f.name + " " + f.category + " " + f.location).toLowerCase().includes(search)) &&
    (cat === "all" || f.category === cat) &&
    (loc === "all" || f.location.includes(loc)) &&
    (status === "all" || f.status === status)
  );

  $("#foodList").innerHTML = filtered.length ? filtered.map(f => `
    <article class="food-item">
      <div class="food-img">
        <img src="${f.image || f.icon}" alt="${f.name}" />
      </div>
      <div>
        <span class="status ${f.status}">${f.status === "available" ? "Available" : "Requested"}</span>
        <h3>${f.name}</h3>
        <p>${f.category} • ${f.qty} meals</p>
        <p>📍 ${f.location}</p>
        <p>🕐 ${f.time}</p>
      </div>
      <div>
        ${f.status === "available"
          ? `<button class="btn btn-primary request-food" data-id="${f.id}">Request</button>`
          : `<button class="btn btn-outline" disabled>View</button>`}
      </div>
    </article>
  `).join("") : `<div class="card" style="padding:30px;text-align:center">No food items match your filters.</div>`;

  $$(".request-food").forEach(btn => btn.addEventListener("click", () => {
    const item = foods.find(f => f.id === Number(btn.dataset.id));
    history.pushState(null,"","#request");
    showPage("request");
    $("#requestForm").dataset.foodId = item.id;
    $("#requestForm").scrollIntoView({behavior:"smooth", block:"start"});
    toast(`${item.name} selected. Complete the request form.`);
  }));
}

$("#searchBtn").addEventListener("click", renderFoods);
["foodSearch","categoryFilter","locationFilter","statusFilter"].forEach(id => {
  $("#" + id).addEventListener("input", renderFoods);
  $("#" + id).addEventListener("change", renderFoods);
});

// Request food
$("#requestForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = e.target.name.value.trim();
  const qty = e.target.quantity.value;
  showMessage($("#requestMsg"), `Request submitted for ${qty} meals. Thank you, ${name}!`);
  toast("Food request submitted");
  $("#requestedCount")?.remove();
  e.target.reset();
});

// Contact
$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  showMessage($("#contactMsg"), "Thank you! Your feedback message has been sent in this demo.");
  toast("Message sent");
  e.target.reset();
});

// Tracking demo
let trackingSteps = ["Collected", "Distributed"];
let trackingIndex = 0;
$("#advanceTracking").addEventListener("click", () => {
  if (trackingIndex < trackingSteps.length - 1) {
    trackingIndex++;
    $("#trackingStatus").textContent = trackingSteps[trackingIndex];
    $(".timeline-item.current").classList.remove("current");
    const items = $$(".timeline-item");
    items[3].classList.add("current");
    items[2].classList.add("done");
    items[2].querySelector("span").textContent = "✓";
    items[3].querySelector("span").textContent = "●";
    toast("Tracking status advanced to Distributed");
  } else {
    toast("Demo is already at the final status");
  }
});

// Period selector changes a small demo message
$("#periodSelect").addEventListener("change", e => {
  toast(`Dashboard period changed to ${e.target.value}`);
});

// Initial render
renderFoods();
navigateFromHash();
