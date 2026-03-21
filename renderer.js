function iframe(){
  return document.getElementById("pv")
}

function renderLayers(layers, layerTransforms){

  let activeLayers = Object.values(layers).filter(v=>v.trim()!="")

  if(activeLayers.length===1){

    let i = Object.keys(layers).find(k=>layers[k].trim()!="")
    let t = layerTransforms[i]

    let html = `
<body style="margin:0;background:black;display:flex;align-items:center;justify-content:center;height:100vh;">
<div style="
position:absolute;
top:50%;
left:50%;
transform:translate(-50%,-50%) rotateX(${t.x}deg) rotateY(${t.y}deg);
transform-style:preserve-3d;
">
${layers[i]}
</div>
</body>
`

    iframe().srcdoc = html
    return
  }

  let html = `<body style="margin:0;background:transparent;position:relative;">`

  for(let i=1;i<=8;i++){
    if(layers[i]){
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
