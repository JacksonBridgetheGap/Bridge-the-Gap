import { DateTime } from "luxon";

export async function httpRequest(URL, method, data) {
  return fetch(URL, {
    method: method,
    headers: {
      "Content-Type": "application/json", // Indicate the data type
    },
    body: JSON.stringify(data), // Convert data to JSON string
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse JSON data from the response
    })
    .then((data) => {
      // Handle successful response
      // Update UI or perform other actions with the data
      return data;
    })
    .catch((error) => {
      // Handle error
      console.error("Error fetching data:", error);
      // Display an error message or retry the request
    });
}

export function convertEventsToLocal(events) {
  return events.map((event) => {
    event.start = DateTime.fromISO(event.start, { zone: "utc" })
      .toLocal()
      .toISO({ suppressMilliseconds: true, includeOffset: false });
    event.end = DateTime.fromISO(event.end, { zone: "utc" })
      .toLocal()
      .toISO({ suppressMilliseconds: true, includeOffset: false });
    return event;
  });
}
