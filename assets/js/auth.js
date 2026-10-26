import { supabase } from "./supabase-client.js";
const $ = (selector) => document.querySelector(selector);
const message = $("#auth-message"), forms = $("#auth-forms"), accountPanel = $("#account-panel"), emailForm = $("#email-form"), submitButton = $("#email-submit");
let mode = "signin";
function showMessage(text, kind = "info") { message.textContent = text; message.dataset.kind = kind; message.hidden = false; }
function clearMessage() { message.hidden = true; message.textContent = ""; }
function setBusy(busy) { submitButton.disabled = busy; document.querySelectorAll("[data-provider], .auth-tab, #forgot-password").forEach((el) => { el.disabled = busy; }); }
function setMode(nextMode) {
  mode = nextMode; clearMessage();
  document.querySelectorAll("[data-mode]").forEach((button) => { const active = button.dataset.mode === mode; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
  submitButton.innerHTML = mode === "signup" ? "Create account <span>↗</span>" : "Sign in <span>↗</span>";
  $("#forgot-password").hidden = mode !== "signin"; $("#password").autocomplete = mode === "signup" ? "new-password" : "current-password";
}
function renderSession(session) {
  const signedIn = Boolean(session?.user); forms.hidden = signedIn; accountPanel.hidden = !signedIn;
  if (signedIn) { $("#account-email").textContent = session.user.email || "Signed-in CrowRules account"; loadMembership(); }
  else { $("#membership-status").textContent = ""; }
}
async function loadMembership() {
  const target = $("#membership-status"); target.textContent = "Checking Universal CrowRules Membership…";
  const { data, error } = await supabase.functions.invoke("membership-status");
  if (error) { target.textContent = "Signed in, but membership status could not be loaded. Please try again."; return; }
  if (!data?.ok) { target.textContent = data?.error || "Membership status is currently unavailable."; return; }
  const membership = data.membership;
  const entitlements = Array.isArray(data.entitlements) ? data.entitlements : [];
  const holidayAccess = entitlements.find((item) => item.site_key === "holidays");
  target.textContent = (membership?.plan_key ? "Membership plan: " + membership.plan_key + ". " : "No active membership plan was returned. ") +
    (holidayAccess ? "Holiday Hub access: " + (holidayAccess.access_level || "available") + "." : "Holiday Hub entitlement was not found on the returned plan.");
}
emailForm.addEventListener("submit", async (event) => {
  event.preventDefault(); clearMessage(); setBusy(true);
  const email = $("#email").value.trim(), password = $("#password").value;
  try {
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: new URL("./auth.html", window.location.href).href } });
      if (error) throw error;
      if (data.session) { showMessage("Account created and signed in.", "success"); renderSession(data.session); }
      else showMessage("Account request received. Check your email for the confirmation link before signing in.", "success");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error; showMessage("Signed in successfully.", "success"); renderSession(data.session);
    }
  } catch (error) { showMessage(error.message || "Authentication failed. Please try again.", "error"); }
  finally { setBusy(false); }
});
document.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
document.querySelectorAll("[data-provider]").forEach((button) => button.addEventListener("click", async () => {
  clearMessage(); setBusy(true);
  try {
    const { error } = await supabase.auth.signInWithOAuth({ provider: button.dataset.provider, options: { redirectTo: new URL("./auth.html", window.location.href).href } });
    if (error) throw error;
  } catch (error) { showMessage(error.message || "Social sign-in could not start. Confirm that this provider is enabled in Supabase.", "error"); setBusy(false); }
}));
$("#forgot-password").addEventListener("click", async () => {
  clearMessage(); const email = $("#email").value.trim();
  if (!email) { showMessage("Enter your email address first, then select Forgot password.", "error"); $("#email").focus(); return; }
  setBusy(true);
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: new URL("./auth.html", window.location.href).href });
    if (error) throw error; showMessage("If password recovery is available for this address, a reset email will be sent.", "success");
  } catch (error) { showMessage(error.message || "Password recovery could not be started.", "error"); }
  finally { setBusy(false); }
});
$("#sign-out").addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) showMessage(error.message || "Sign-out failed.", "error");
  else { showMessage("You have signed out.", "success"); renderSession(null); }
});
$("#refresh-membership").addEventListener("click", loadMembership);
document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
setMode("signin");
const { data: { session } } = await supabase.auth.getSession();
renderSession(session);
supabase.auth.onAuthStateChange((_event, nextSession) => renderSession(nextSession));