'use client';

export default function CookieReset() {
  return (
    <button type="button" className="btn btn-ink" onClick={() => { try { localStorage.removeItem('tdl_consent'); } catch { /* ignore */ } window.location.reload(); }}>
      Cambiar mi elección de cookies
    </button>
  );
}
