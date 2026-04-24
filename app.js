const codeEl = document.getElementById("code")
const panel = document.getElementById("panel")
const rotX = document.getElementById("rotX")
const rotY = document.getElementById("rotY")
const orbit = document.getElementById("orbit")
const viewer = document.getElementById("viewer")
const toggleCodeBtn = document.getElementById("toggleCode")
const wrap = document.getElementById("wrap")
const bgBtn = document.getElementById("bg")
const codeOptions = document.getElementById("codeOptions")
const toggleLayout = document.getElementById("toggleLayout")

const thick = document.getElementById("thick")
const thick2 = document.getElementById("thick2")

/* WIDTH / HEIGHT OVERLAY INPUTS */
const artW = document.getElementById("artW")
const artH = document.getElementById("artH")

let currentLayer = 1
let layers = {}
let layerTransforms = {}
let horizontal = false

for(let i=1;i<=8;i++){
  layers[i] = ""
  layerTransforms[i] = {
    x:0,
    y:0,
    z:0,
    z2:0,
    bg:true,
    w:"",
    h:""
  }
}

const layerWrap = document.getElementById("layers")

for(let i=1;i<=8;i++){
  const b = document.createElement("button")
  b.textContent = i
  b.className = "layer"+(i===1?" active":"")
  b.onclick = ()=>selectLayer(i)
  layerWrap.appendChild(b)
}

function selectLayer(n){

  if(currentLayer===n){
    currentLayer=null
    document.querySelectorAll(".layer").forEach(b=>b.classList.remove("active"))
    codeEl.value=""

    artW.value=""
    artH.value=""

    return
  }

  currentLayer=n

  document.querySelectorAll(".layer").forEach(b=>b.classList.remove("active"))
  layerWrap.children[n-1].classList.add("active")

  codeEl.value=layers[n]||""
  rotX.value=layerTransforms[n].x
  rotY.value=layerTransforms[n].y
  thick.value=layerTransforms[n].z || 0
  thick2.value=layerTransforms[n].z2 || 0

  artW.value = layerTransforms[n].w || ""
  artH.value = layerTransforms[n].h || ""

  bgBtn.classList.toggle("active", !layerTransforms[n].bg)
}

function stripBackgrounds(str){
  const match = str.match(/^\s*<div[^>]*>([\s\S]*)<\/div>\s*$/i)
  if(match){
    return match[1]
  }
  return str
}

function run(){
  if(!currentLayer) return

  const raw=(codeEl.value||"").trim()
  const t = layerTransforms[currentLayer]

  const processed = t.bg ? raw : stripBackgrounds(raw)

  layers[currentLayer]=processed
  renderLayers(layers, layerTransforms)

  panel.style.opacity="1"
  panel.style.pointerEvents="auto"
}

async function paste(){
  const text=await navigator.clipboard.readText()
  codeEl.value=text
}

function clearLayer(){
  if(!currentLayer) return

  layers[currentLayer]=""
  codeEl.value=""
  renderLayers(layers, layerTransforms)
}

function stop(){
  const old=document.getElementById("pv")
  const fresh=document.createElement("iframe")

  fresh.id="pv"
  fresh.setAttribute("sandbox","allow-scripts allow-same-origin")
  fresh.setAttribute("scrolling","no")
  fresh.style.width="100%"
  fresh.style.height="100%"
  fresh.style.border="none"

  old.replaceWith(fresh)
}

function updateRotation(){
  if(currentLayer){
    layerTransforms[currentLayer].x = parseFloat(rotX.value) || 0
    layerTransforms[currentLayer].y = parseFloat(rotY.value) || 0
    renderLayers(layers, layerTransforms)
  }else{
    panel.style.transform =
    `rotateX(${rotX.value}deg) rotateY(${rotY.value}deg)`
  }
}

function updateThickness(){
  if(currentLayer){
    const t = layerTransforms[currentLayer]
    t.z = parseFloat(thick.value) || 0
    t.z2 = parseFloat(thick2.value) || 0
    renderLayers(layers, layerTransforms)
  }
}

/* WIDTH / HEIGHT LIVE UPDATE */
function updateArtSize(){
  if(!currentLayer) return

  layerTransforms[currentLayer].w = artW.value
  layerTransforms[currentLayer].h = artH.value

  renderLayers(layers, layerTransforms)
}

rotX.oninput = updateRotation
rotY.oninput = updateRotation

thick.oninput = updateThickness
thick2.oninput = updateThickness

artW.oninput = updateArtSize
artH.oninput = updateArtSize

orbit.oninput=()=>{
  viewer.style.transform=`rotateY(${orbit.value}deg)`
}

bgBtn.onclick = () => {
  if(!currentLayer) return

  let t = layerTransforms[currentLayer]
  t.bg = !t.bg

  bgBtn.classList.toggle("active", !t.bg)

  renderLayers(layers, layerTransforms)
}

function formatCode(str){
  str = str.replace(/></g, ">\n<")
  let indent = 0
  const lines = str.split("\n")

  return lines.map(line=>{
    line = line.trim()
    if(line.startsWith("</")) indent--
    let out = "  ".repeat(Math.max(indent,0)) + line
    if(line.startsWith("<") && !line.startsWith("</") && !line.endsWith("/>") && !line.includes("</")) indent++
    return out
  }).join("\n")
}

/* CODE BUTTON NOW OPENS HTMLO TOOL PANEL */
toggleCodeBtn.onclick=()=>{
  if(codeOptions.style.display==="block"){
    codeOptions.style.display="none"
    wrap.style.display="flex"
    toggleCodeBtn.classList.remove("active")
  }else{
    codeOptions.style.display="block"
    wrap.style.display="none"
    toggleCodeBtn.classList.add("active")
  }
}

/* HORIZONTAL PREVIEW TOGGLE */
toggleLayout.onclick=()=>{
  horizontal = !horizontal
  panel.classList.toggle("horizontal", horizontal)
  toggleLayout.classList.toggle("active", horizontal)
}

document.getElementById("paste").onclick =
()=>paste().catch(()=>alert("paste blocked"))

document.getElementById("run").onclick = run
document.getElementById("clear").onclick = clearLayer
document.getElementById("stop").onclick = stop
