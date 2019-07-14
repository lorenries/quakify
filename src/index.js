import GIF from "gif.js";
import { saveAs } from "file-saver";
import "./styles.css";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const uploadButton = document.querySelector("#upload");

const offsets = [
  [-3, 5],
  [-2, 6],
  [4, -3],
  [6, 5],
  [3, -3],
  [-4, -4],
  [5, 1],
  [-8, 1]
];

uploadButton.addEventListener("input", handleImageUpload);

function handleImageUpload(e) {
  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = () => quakifyMe(img);
    img.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
}

async function quakifyMe(img) {
  canvas.style.display = "block";
  canvas.width = img.width + 15;
  canvas.height = img.height + 15;

  const workerScript = await fetch(
    "https://unpkg.com/gif.js/dist/gif.worker.js"
  )
    .then(response => response.blob())
    .then(blob => URL.createObjectURL(blob, { type: "text/javascript" }));

  var gif = new GIF({
    workers: 2,
    quality: 10,
    width: canvas.width,
    height: canvas.height,
    transparent: "0x00FF00",
    workerScript
  });

  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      canvas.height / 2 - img.width / 2 + offsets[i][0],
      canvas.height / 2 - img.width / 2 + offsets[i][1]
    );
    gif.addFrame(ctx, { copy: true, delay: 25 });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  gif.on("finished", function(blob) {
    saveAs(blob, "emoj.gif");
  });

  gif.render();
}
