export async function getWikipediaSummary(title) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        title
      )}`
    );

    const data = await response.json();
    return data.extract || "No summary available for this title.";
  } catch (error) {
    console.error("Error in getWikipediaSummary", error);
  }
}
