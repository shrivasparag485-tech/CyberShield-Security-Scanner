async function scanWebsite(){

let url = document.getElementById("urlInput").value;
let result = document.getElementById("result");
let scoreBar = document.getElementById("scoreBar");
let scoreText = document.getElementById("scoreText");
let suggestions = document.getElementById("suggestions");
let aiExplain = document.getElementById("aiExplain");

suggestions.innerHTML="";
aiExplain.innerHTML="";

let httpsScore = 0;
let headerScore = 0;
let securityScore = 0;

try{

let response = await fetch(
"https://api.hackertarget.com/httpheaders/?q=" + url
);

let data = await response.text();

result.innerText = data;

if(data.includes("Content-Security-Policy")){
headerScore += 30;
}else{
suggestions.innerHTML += "<li>Missing Content Security Policy header</li>";
aiExplain.innerHTML += "<p>CSP protects websites from XSS attacks.</p>";
}

if(data.includes("X-Frame-Options")){
headerScore += 30;
}else{
suggestions.innerHTML += "<li>Missing X-Frame-Options header</li>";
aiExplain.innerHTML += "<p>This header prevents clickjacking attacks.</p>";
}

if(data.includes("Strict-Transport-Security")){
headerScore += 40;
}else{
suggestions.innerHTML += "<li>Enable HSTS header for stronger HTTPS security</li>";
aiExplain.innerHTML += "<p>HSTS forces browsers to use HTTPS only.</p>";
}

securityScore = headerScore;

}
catch{
result.innerText="Scan failed";
}

scoreBar.style.width = securityScore + "%";
scoreText.innerHTML="Security Score: "+securityScore+"/100";

createChart(headerScore);

}

function createChart(score){

let ctx = document.getElementById("securityChart");

new Chart(ctx, {
type: 'doughnut',
data: {
labels: ["Secure", "Risk"],
datasets: [{
data: [score, 100-score]
}]
}
});

}


/* Spam link check */

let spamScore = 0;

if(url.includes("login")){
spamScore += 20;
}

if(url.includes("verify")){
spamScore += 20;
}

if(url.includes("update")){
spamScore += 20;
}

if(url.length > 30){
spamScore += 20;
}

let ipPattern = /[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/;

if(ipPattern.test(url)){
spamScore += 20;
}

if(spamScore > 40){
suggestions.innerHTML += "<li>⚠️ This link looks suspicious or spam.</li>";
aiExplain.innerHTML += "<p>This domain contains patterns often used in phishing or spam links.</p>";
}