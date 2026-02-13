/* 🔑 Put your GROQ API key here */
const API_KEY = "PASTE_YOUR_KEY_HERE";

/* ---------------- TIMER ---------------- */

let sec = 0;
let timer = null;
let total = 0;
let sessions = 0;

function start() {
  if (!timer) {
    timer = setInterval(() => {
      sec++;
      let m = Math.floor(sec / 60);
      let s = sec % 60;
      document.getElementById("timer").innerText =
        `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }, 1000);
  }
}

function stop() {
  clearInterval(timer);
  timer = null;

  let minutes = Math.floor(sec / 60);
  total += minutes;
  sessions++;

  document.getElementById("total").innerText = total;
  document.getElementById("sessions").innerText = sessions;

  askAI(`User focused for ${minutes} minutes. Give short productivity feedback.`);
  sec = 0;
  document.getElementById("timer").innerText = "00:00";
}

function motivate() {
  askAI("Give a short powerful one-line motivation to focus.");
}

/* ---------------- GROQ AI (FREE MODEL) ---------------- */

async function askAI(prompt) {
  document.getElementById("aiText").innerText = "Thinking...";

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",   // ✅ FREE + FAST MODEL
        messages: [
          {
            role: "system",
            content:
              "You are a smart AI focus coach helping users stay productive, avoid distractions, and stay motivated. Keep responses short."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      })
    });

    const data = await res.json();

    if (data.choices && data.choices.length > 0) {
      document.getElementById("aiText").innerText =
        data.choices[0].message.content.trim();
    } else {
      document.getElementById("aiText").innerText =
        "AI error: " + JSON.stringify(data);
    }
  } catch (err) {
    document.getElementById("aiText").innerText =
      "API Error / Internet issue / Wrong API key.";
  }
}

/* ---------------- CURSOR GLOW ---------------- */

document.addEventListener("mousemove", e => {
  const c = document.querySelector(".cursor");
  if (c) {
    c.style.left = e.clientX + "px";
    c.style.top = e.clientY + "px";
  }
});
