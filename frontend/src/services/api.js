export async function getRecommendations(preferences) {
  try {
    const response = await fetch("http://localhost:8000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferences }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch recommendations");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
