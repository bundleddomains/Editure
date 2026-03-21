function iframe(){
  return document.getElementById("pv")
}

function renderLayers(layers, layerTransforms){

  let activeLayers = Object.values(layers).filter(v => v.trim() !== "")

  if(activeLayers.length === 1){

    let i = Object.keys(layers).find(k => layers[k].trim() !== "")
    let t = layerTransforms[i]
    let code = layers[i].trim()

    // 🔥 FULL DOCUMENT MODE
    if(
      /<!doctype/i.test(code) ||
      /<html[\s>]/i.test(code)
    ){
      const f = iframe()

      f.srcdoc = code

      // 🔥 CRITICAL FIX
      f.style.width = "100%"
      f.style.height = "100%"
      f.style.background = "#ffffff"

      // 👇 THIS IS THE REAL FIX
      f.style.isolation = "isolate"

      return
    }

    let html = `
<body style="
margin:0;
background:${t.bg ? "black" : "transparent"};
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

  let html = `<body style="margin:0;background:transparent;position:relative;isolation:isolate;">`

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
