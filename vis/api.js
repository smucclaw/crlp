// export async function fetchJson<T>(url: string): Promise<T> {
//   const response = await fetch(url)
//   if (!response.ok) throw new Error('failed to fetch json')
//   return response.json() as Promise<T>
// }
export async function fetchJson(input) {
    if (typeof input === 'object') {
        return input;
    }
    const response = await fetch(input);
    if (!response.ok)
        throw new Error('failed to fetch json');
    return response.json();
}
export async function fetchUpdates(url, previousData) {
    const response = await fetch(url);
    if (!response.ok)
        throw new Error('failed to get updated json');
    const newData = (await response.json());
    if (JSON.stringify(newData) !== JSON.stringify(previousData)) {
        return newData;
    }
    return null;
}
export async function sendToLadder(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok)
        throw new Error('failed to send to ladderdiagram');
    return response.json();
}
