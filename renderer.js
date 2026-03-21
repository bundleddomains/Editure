function iframe(){
  return document.getElementById("pv")
}

function renderLayers(layers, layerTransforms){

  let activeLayers = Object.values(layers).filter(v => v.trim() !== "")

  if(activeLayers.length === 1){

    let i = Object.keys(layers).find(k => layers[k].trim() !== "")
    let t = layerTransforms[i]
    let code = layers[i].trim()

    // 🔥 FULL DOCUMENT MODE (leave user art untouched BUT control iframe environment)
    if(
      /<!doctype/i.test(code) ||
      /<html[\s>]/i.test(code)
    ){
      const f = iframe()

      f.srcdoc = code

      // ✅ FORCE NEUTRAL VIEWPORT
      f.style.width = "100%"
      f.style.height = "100%"
      f.style.background = "#111"
      f.style.isolation = "isolate"

      return
    }

    // 🔹 COMPONENT MODE (ALWAYS neutral now)
    let html = `
<body style="
margin:0;
background:#111;
display:flex;
align-items:center;
justify-content:center;
height:100vh;
isolation:isolate;
">
<div style="
position:absolute;
top:50%;
left:50%;
transform:translate(-50%,-50%) rotateX(${t.x}deg) rotateY(${t.y}deg);
transform-style:preserve-3d;
">
${code}
</div>
</body>
`

    iframe().srcdoc = html
    return
  }

  // 🔹 MULTI LAYER MODE (ALSO neutral)
  let html = `
<body style="
margin:0;
background:#111;
position:relative;
isolation:isolate;
">
`

  for(let i=1;i<=8;i++){
    if(layers[i] && layers[i].trim() !== ""){

      const t = layerTransforms[i]

      html += `
<div style="
position:absolute;
top:50%;
left:50%;
transform:translate(-50%,-50%) rotateX(${t.x}deg) rotateY(${t.y}deg);
transform-style:preserve-3d;
">
${layers[i]}
</div>
`
    }
  }

  html += "</body>"

  iframe().srcdoc = html
}
