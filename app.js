if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker đã được đăng ký thành công:', registration);
      })
      .catch((error) => {
        console.log('Service Worker đăng ký thất bại:', error);
      });
  });
}
