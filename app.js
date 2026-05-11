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
const saveArt = document.getElementById("saveArt")

const thick = document.getElementById("thick")
const thick2 = document.getElementById("thick2")

const artW = document.getElementById("artW")
const artH = document.getElementById("artH")

/* POSITION INPUTS */
const artX = document.getElementById("artX")
const artY = document.getElementById("artY")

/* SCALE INPUT */
const previewScale = document.getElementById("previewScale")

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
    h:"",
    tx:0,
    ty:0,
    scale:100
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
    artX.value=0
    artY.value=0

    if(previewScale) previewScale.value=100

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

  artX.value = layerTransforms[n].tx || 0
  artY.value = layerTransforms[n].ty || 0

  if(previewScale){
    previewScale.value = layerTransforms[n].scale || 100
  }

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

function updateArtSize(){
  if(!currentLayer) return

  layerTransforms[currentLayer].w = artW.value
  layerTransforms[currentLayer].h = artH.value

  renderLayers(layers, layerTransforms)
}

function updateArtPosition(){
  if(!currentLayer) return

  layerTransforms[currentLayer].tx = parseFloat(artX.value) || 0
  layerTransforms[currentLayer].ty = parseFloat(artY.value) || 0

  renderLayers(layers, layerTransforms)
}

function updatePreviewScale(){
  if(!currentLayer || !previewScale) return

  layerTransforms[currentLayer].scale = parseFloat(previewScale.value) || 100

  renderLayers(layers, layerTransforms)
}

rotX.oninput = updateRotation
rotY.oninput = updateRotation

thick.oninput = updateThickness
thick2.oninput = updateThickness

artW.oninput = updateArtSize
artH.oninput = updateArtSize

artX.oninput = updateArtPosition
artY.oninput = updateArtPosition

if(previewScale){
  previewScale.oninput = updatePreviewScale
}

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

toggleLayout.onclick=()=>{
  horizontal = !horizontal
  panel.classList.toggle("horizontal", horizontal)
  toggleLayout.classList.toggle("active", horizontal)
}

saveArt.onclick = () => {
  const fullHTML = buildExportHTML(layers, layerTransforms)

  const overlay = document.createElement("div")
  overlay.style.position = "fixed"
  overlay.style.inset = "0"
  overlay.style.background = "rgba(0,0,0,0.88)"
  overlay.style.zIndex = "9999"
  overlay.style.display = "flex"
  overlay.style.flexDirection = "column"
  overlay.style.padding = "16px"
  overlay.style.boxSizing = "border-box"

  const topBar = document.createElement("div")
  topBar.style.display = "flex"
  topBar.style.gap = "10px"
  topBar.style.marginBottom = "10px"

  const closeBtn = document.createElement("button")
  closeBtn.textContent = "Close"

  const copyBtn = document.createElement("button")
  copyBtn.textContent = "Copy"

  const downloadBtn = document.createElement("button")
  downloadBtn.textContent = "Download"

  const box = document.createElement("textarea")
  box.value = fullHTML
  box.style.flex = "1"
  box.style.width = "100%"
  box.style.background = "#07110d"
  box.style.color = "#d8ffe9"
  box.style.border = "1px solid #00a676"
  box.style.borderRadius = "10px"
  box.style.padding = "14px"
  box.style.fontFamily = "monospace"
  box.style.fontSize = "12px"
  box.style.resize = "none"
  box.style.outline = "none"

  closeBtn.onclick = () => overlay.remove()

  copyBtn.onclick = async () => {
    await navigator.clipboard.writeText(fullHTML)
    copyBtn.textContent = "Copied"
  }

  downloadBtn.onclick = () => {
    const blob = new Blob([fullHTML], { type: "text/html" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "saved-art.html"
    document.body.appendChild(a)
    a.click()
    a.remove()

    URL.revokeObjectURL(url)
  }

  topBar.appendChild(closeBtn)
  topBar.appendChild(copyBtn)
  topBar.appendChild(downloadBtn)

  overlay.appendChild(topBar)
  overlay.appendChild(box)

  document.body.appendChild(overlay)
}

document.getElementById("paste").onclick =
()=>paste().catch(()=>alert("paste blocked"))

document.getElementById("run").onclick = run
document.getElementById("clear").onclick = clearLayer
document.getElementById("stop").onclick = stop
