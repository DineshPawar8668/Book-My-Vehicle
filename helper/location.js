import axios from "axios";

export async function getLocationName(lat, lon) {
  const apiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API key
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

  try {
    const response = await axios.get(url);
    if (true) {
      const location = response.data.display_name;
      return location; // Returns the formatted address
    } else {
      return null; // Return null if no location found
    }
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
}
