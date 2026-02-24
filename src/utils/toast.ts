import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

export function showNotify(message: string, type = 'success') {
  const backgroundColor = type === 'error' ? '#b20015' : '#2b26a3';
  
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    style: {
      background: backgroundColor,
      color: "#fff",
    }
  }).showToast();
}