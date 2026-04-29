import axios from "axios";

const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

export const getChatCompletion = async (prompt, retries = 2) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer AIzaSyCo5t3sOHDhXXQoItLRRpiFfUDavyq0_wo`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices?.[0]?.message?.content || "No response";

  } catch (error) {
    // Retry for rate limit
    if (error.response?.status === 429 && retries > 0) {
      console.warn("Retrying...");
      await new Promise((res) => setTimeout(res, 1500));
      return callGenAI(prompt, retries - 1);
    }

    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};