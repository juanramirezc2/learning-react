/* TODO: clean up this */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
function RegisterSw() {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function(ServiceWorkerRegistration) {
      // Registration was successful
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          'BNVFaEer_S5bnKoFlwJjf5wzW7EUCIWzYtu6wVw_mnwWVCukMNdwyC1grHaQSfVEeDIFohbgw47tncBHaNa9AZE'
        )
      };
      return ServiceWorkerRegistration.pushManager.subscribe(subscribeOptions);
    })
    .then(function(pushSubscription) {
      return fetch(`/api/save-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pushSubscription)
      });
    })
    .catch(function(err) {
      console.log('Something went wrong: ', err);
    });
}

export default RegisterSw;
