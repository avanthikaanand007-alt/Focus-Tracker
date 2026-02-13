let sec = 0, min = 0;
let running = false;
let timer;

let history = JSON.parse(localStorage.getItem("focusHistory")) || [];
let totalFocus = history.reduce((a,b)=>a+b,0);
let sessions = history.length;

updateUI();

function updateTimer() {
    sec++;
    if (sec === 60) { min++; sec = 0; }

    document.getElementById("timer").innerText =
        `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;

    aiLearning();
}

function startFocus() {
    if (!running) {
        running = true;
        timer = setInterval(updateTimer,1000);
        ai("Focus started 🚀 Blocking distractions...");
    }
}

function stopFocus() {
    clearInterval(timer);
    running = false;

    history.push(min);
    localStorage.setItem("focusHistory", JSON.stringify(history));

    totalFocus += min;
    sessions++;

    sec = 0; min = 0;
    document.getElementById("timer").innerText = "00:00";

    ai("Session saved 🎉 Great work!");
    motivation();
    updateUI();
    drawChart();
}

function takeBreak() {
    clearInterval(timer);
    running = false;
    ai("Break suggested ☕ Relax 5 mins");
    vibrate();
}

function ai(msg) {
    document.getElementById("aiMessage").innerText = msg;
}

function motivation() {
    const quotes = [
        "Consistency beats motivation.",
        "You are improving every session.",
        "Deep focus = Big success.",
        "Keep pushing forward.",
        "Your future self will thank you."
    ];
    document.getElementById("quote").innerText =
        quotes[Math.floor(Math.random()*quotes.length)];
}

function vibrate() {
    if (navigator.vibrate) navigator.vibrate(200);
}

function updateUI() {
    document.getElementById("totalTime").innerText = totalFocus;
    document.getElementById("sessions").innerText = sessions;

    let score = sessions ? Math.min(100, Math.round(totalFocus/sessions * 2)) : 0;
    document.getElementById("score").innerText = score;
}

function aiLearning() {
    if (min === 20) {
        ai("AI: You focus well for 20min. Suggest short break soon ☕");
        vibrate();
    }
    if (min === 35) {
        ai("AI: Focus dropping. Try easier task 📘");
    }
    if (min === predictBestTime()) {
        ai("AI Prediction: Your ideal session length reached 🎯");
    }
}

/* SIMPLE AI PREDICTION */
function predictBestTime() {
    if (history.length === 0) return 25;
    let avg = history.reduce((a,b)=>a+b,0) / history.length;
    return Math.round(avg);
}

/* CHART DRAW */
function drawChart() {
    let canvas = document.getElementById("chart");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,300,150);

    let max = Math.max(...history, 30);
    history.slice(-10).forEach((val,i)=>{
        let h = (val/max)*120;
        ctx.fillStyle = `hsl(${i*35},80%,60%)`;
        ctx.fillRect(i*28+10,140-h,20,h);
    });
}

drawChart();
