const BASE = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("kundali_token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

async function handleRes(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "કંઈક ખોટું થયું");
  return data;
}

// Auth
export const authAPI = {
  register: (body) =>
    fetch(`${BASE}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(handleRes),
  login: (body) =>
    fetch(`${BASE}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(handleRes),
  me: () =>
    fetch(`${BASE}/auth/me`, { headers: authHeaders() }).then(handleRes),
  updateProfile: (body) =>
    fetch(`${BASE}/auth/profile`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(body) }).then(handleRes),
};

// Kundali
export const kundaliAPI = {
  save: (body) =>
    fetch(`${BASE}/kundali/save`, { method: "POST", headers: authHeaders(), body: JSON.stringify(body) }).then(handleRes),
  myKundalis: () =>
    fetch(`${BASE}/kundali/my`, { headers: authHeaders() }).then(handleRes),
  get: (id) =>
    fetch(`${BASE}/kundali/${id}`, { headers: authHeaders() }).then(handleRes),
  delete: (id) =>
    fetch(`${BASE}/kundali/${id}`, { method: "DELETE", headers: authHeaders() }).then(handleRes),
};

// Appointments
export const apptAPI = {
  book: (body) =>
    fetch(`${BASE}/appointments/book`, { method: "POST", headers: authHeaders(), body: JSON.stringify(body) }).then(handleRes),
  myAppointments: () =>
    fetch(`${BASE}/appointments/my`, { headers: authHeaders() }).then(handleRes),
  updateStatus: (id, status) =>
    fetch(`${BASE}/appointments/status/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ status }) }).then(handleRes),
  cancel: (id) =>
    fetch(`${BASE}/appointments/cancel/${id}`, { method: "PUT", headers: authHeaders() }).then(handleRes),
  availableSlots: (date) =>
    fetch(`${BASE}/appointments/available-slots?date=${date}`, { headers: authHeaders() }).then(handleRes),
};
