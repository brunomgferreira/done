const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

const saveSubscription = async (subscription) => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/v1/notifications/subscription/save",
      {
        method: "post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(subscription),
      }
    );

    return response.json();
  } catch (error) {
    throw new Error("Error saving subscription:", error);
  }
};

self.addEventListener("activate", async (e) => {
  const subscription = await self.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      "BA38HDLOIcEcSqRso4JvhxRUYKKq7l1Thf8ON3ffpnfRyrFZNG_1zBPGfMcSno83j2_770Eyy_QcyIhHCdvbB-U"
    ),
  });

  const response = await saveSubscription(subscription);
  console.log(response);
});

self.addEventListener("push", (e) => {
  self.registration.showNotification("Wohoo!!", { body: e.data.text() });
});
