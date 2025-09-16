import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Call Groq API
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // or any other Groq model
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await groqRes.json();
    console.log("Groq raw response:", data);

    const reply = data?.choices?.[0]?.message?.content || "⚠️ Sorry, I couldn’t generate a response.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Groq API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
