const codeEl = document.getElementById("code")
const panel = document.getElementById("panel")
const rotX = document.getElementById("rotX")
const rotY = document.getElementById("rotY")
const orbit = document.getElementById("orbit")
const viewer = document.getElementById("viewer")
const toggleCodeBtn = document.getElementById("toggleCode")
const wrap = document.getElementById("wrap")
const bgBtn = document.getElementById("bg")

let currentLayer = 1
let layers = {}
let layerTransforms = {}

for(let i=1;i<=8;i++){
  layers[i] = ""
  layerTransforms[i] = {x:0,y:0,bg:true}
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
    return
  }

  currentLayer=n

  document.querySelectorAll(".layer").forEach(b=>b.classList.remove("active"))
  layerWrap.children[n-1].classList.add("active")

  codeEl.value=layers[n]||""
  rotX.value=layerTransforms[n].x
  rotY.value=layerTransforms[n].y

  bgBtn.classList.toggle("active", !layerTransforms[n].bg)
}

/* 🔥 REAL FIX: remove background ONLY from first style block */
function stripBackgrounds(str){

  return str.replace(
    /(style\s*=\s*["'][^"']*?)background\s*:[^;]+;?/i,
    "$1"
  )
}

function run(){
  const raw=(codeEl.value||"").trim()

  const t = layerTransforms[currentLayer]

  const processed = t.bg
    ? raw
    : stripBackgrounds(raw)

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
    layerTransforms[currentLayer].x=rotX.value
    layerTransforms[currentLayer].y=rotY.value
    renderLayers(layers, layerTransforms)
  }else{
    panel.style.transform=
    `rotateX(${rotX.value}deg) rotateY(${rotY.value}deg)`
  }
}

rotX.oninput=updateRotation
rotY.oninput=updateRotation

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
  if(codeEl.style.display==="none"){
    codeEl.style.display="block"
    wrap.style.display="none"
    toggleCodeBtn.classList.add("active")
    codeEl.value = formatCode(codeEl.value)
  }else{
    codeEl.style.display="none"
    wrap.style.display="flex"
    toggleCodeBtn.classList.remove("active")
  }
}

document.getElementById("paste").onclick=
()=>paste().catch(()=>alert("paste blocked"))

document.getElementById("run").onclick=run
document.getElementById("clear").onclick=clearLayer
document.getElementById("stop").onclick=stop
