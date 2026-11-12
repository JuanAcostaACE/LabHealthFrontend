// Bootstrap entra por CDN (index.html), así que vive en window.
export const cerrarModal = (id) =>
  window.bootstrap?.Modal.getInstance(document.getElementById(id))?.hide();
