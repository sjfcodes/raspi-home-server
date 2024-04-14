// Request server state change
export async function dispatch(url: string, newState: any) {
  fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newState),
  });
}
