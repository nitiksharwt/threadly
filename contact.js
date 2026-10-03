// ============ Contact page: form validation ============
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const success = document.getElementById("success");

  const rules = {
    name:    (v) => (v.length >= 3 ? "" : "Please enter your full name (min 3 letters)."),
    email:   (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address."),
    phone:   (v) => (/^[6-9]\d{9}$/.test(v) ? "" : "Enter a valid 10-digit Indian mobile number."),
    topic:   (v) => (v ? "" : "Please choose a topic."),
    message: (v) => (v.length >= 10 ? "" : "Message must be at least 10 characters.")
  };

  function check(id) {
    const input = document.getElementById(id);
    const field = input.closest(".field");
    const msg = rules[id](input.value.trim());
    field.classList.toggle("invalid", Boolean(msg));
    field.querySelector(".error").textContent = msg;
    return !msg;
  }

  // Live validation after the user leaves a field
  Object.keys(rules).forEach((id) => {
    document.getElementById(id).addEventListener("blur", () => check(id));
    document.getElementById(id).addEventListener("input", () => {
      if (document.getElementById(id).closest(".field").classList.contains("invalid")) check(id);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const allValid = Object.keys(rules).map(check).every(Boolean);
    if (!allValid) { success.style.display = "none"; return; }

    // Save the message locally (a real site would send it to a server)
    const inbox = Store.get("tl_messages", []);
    inbox.push({
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      topic: document.getElementById("topic").value,
      message: document.getElementById("message").value.trim(),
      date: new Date().toISOString()
    });
    Store.set("tl_messages", inbox);

    form.reset();
    success.style.display = "block";
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});
