function iframe(){
  return document.getElementById("pv")
}

function renderLayers(layers, layerTransforms){

  let activeLayers = Object.values(layers).filter(v => v.trim() !== "")

  // 🔹 SINGLE LAYER MODE
  if(activeLayers.length === 1){

    let i = Object.keys(layers).find(k => layers[k].trim() !== "")
    let t = layerTransforms[i]
    let code = layers[i].trim()

    // 🔥 FULL DOCUMENT MODE (FIXED PROPERLY)
    if(
      /<!doctype/i.test(code) ||
      /<html[\s>]/i.test(code)
    ){

      // 🔥 extract ONLY inside <body>
      let bodyMatch = code.match(/<body[^>]*>([\s\S]*)<\/body>/i)
      let inner = bodyMatch ? bodyMatch[1] : code

      // 🔥 extract styles from <head>
      let styleMatch = code.match(/<style[^>]*>([\s\S]*)<\/style>/i)
      let styles = styleMatch ? styleMatch[1] : ""

      iframe().srcdoc = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
html,body{
  margin:0;
  height:100%;
  background:#000; /* 🔥 needed for blend-mode */
}
${styles}
</style>
</head>
<body>
${inner}
</body>
</html>
`
      return
    }

    // 🔹 COMPONENT MODE
    let html = `
<body style="
margin:0;
background:${t.bg ? "black" : "transparent"};
display:flex;
align-items:center;
justify-content:center;
height:100vh;
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

  // 🔹 MULTI LAYER MODE
  let html = `<body style="margin:0;background:transparent;position:relative;">`

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
