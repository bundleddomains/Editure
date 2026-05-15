function renderLayers(layers, layerTransforms){
  const f = document.getElementById("pv");
  const activeLayers = Object.values(layers).filter(v => v.trim() !== "");
  if(activeLayers.length === 0) return;

  const cameraOrbit = window.cameraOrbit || 0;

  const xRot = layerTransforms[1].x || 0;
  const yRot = layerTransforms[1].y || 0;
  const finalYRot = yRot + cameraOrbit;

  const thickness = layerTransforms[1].z || 0;
  const thickness2 = layerTransforms[1].z2 || 0;

  const stackCountY = Math.max(1, Math.round(Math.abs(thickness) / 5));
  const stackCountX = Math.max(1, Math.round(Math.abs(thickness2) / 5));

  const spacingY = thickness >= 0 ? 2 : -2;
  const spacingX = thickness2 >= 0 ? 2 : -2;

  let html = `
  <body style="
    margin:0;
    background:#111;
    height:100vh;
    width:100vw;
    display:flex;
    align-items:center;
    justify-content:center;
    isolation:isolate;
    perspective:1000px;
    overflow:hidden;
  ">
    <div id="container" style="
      transform-style: preserve-3d;
      transform: rotateX(${xRot}deg) rotateY(${finalYRot}deg);
      width:100%;
      height:100%;
      position:relative;
    ">
  `;

  for(let i=1;i<=8;i++){
    if(layers[i] && layers[i].trim() !== ""){
      const content = layers[i];
      const t = layerTransforms[i] || {};

      const artW = t.w ? `${t.w}px` : "auto";
      const artH = t.h ? `${t.h}px` : "auto";

      const moveX = t.tx || 0;
      const moveY = t.ty || 0;

      const scale = (t.scale || 100) / 100;

      for(let y = 0; y < stackCountY; y++){
        for(let x = 0; x < stackCountX; x++){

          const yOffset = y * spacingY;
          const xOffset = x * spacingX;

          html += `
          <div style="
            position:absolute;
            top:50%;
            left:50%;
            width:${artW};
            height:${artH};
            transform-style:preserve-3d;
            transform:
              translate(
                calc(-50% + ${xOffset + moveX}px),
                calc(-50% + ${yOffset + moveY}px)
              )
              scale(${scale});
            transform-origin:center center;
          ">
            ${content}
          </div>
          `;
        }
      }
    }
  }

  html += `</div></body>`;
  f.srcdoc = html;
}

function buildExportHTML(layers, layerTransforms){
  const activeLayers = Object.values(layers).filter(v => v.trim() !== "");

  if(activeLayers.length === 0){
    return "<!doctype html><html><body></body></html>";
  }

  const cameraOrbit = window.cameraOrbit || 0;

  const xRot = layerTransforms[1].x || 0;
  const yRot = layerTransforms[1].y || 0;
  const finalYRot = yRot + cameraOrbit;

  const thickness = layerTransforms[1].z || 0;
  const thickness2 = layerTransforms[1].z2 || 0;

  const stackCountY = Math.max(1, Math.round(Math.abs(thickness) / 5));
  const stackCountX = Math.max(1, Math.round(Math.abs(thickness2) / 5));

  const spacingY = thickness >= 0 ? 2 : -2;
  const spacingX = thickness2 >= 0 ? 2 : -2;

  let html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Saved Art</title>

<style>
html, body {
  margin: 0;
  width: 100%;
  height: 100%;
  background: #111;
  overflow: hidden;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
}

#container {
  width: 100vw;
  height: 100vh;
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(${xRot}deg) rotateY(${finalYRot}deg);
}
</style>
</head>

<body>
<div id="container">
`;

  for(let i=1;i<=8;i++){
    if(layers[i] && layers[i].trim() !== ""){
      const content = layers[i];
      const t = layerTransforms[i] || {};

      const artW = t.w ? `${t.w}px` : "auto";
      const artH = t.h ? `${t.h}px` : "auto";

      const moveX = t.tx || 0;
      const moveY = t.ty || 0;

      const scale = (t.scale || 100) / 100;

      for(let y = 0; y < stackCountY; y++){
        for(let x = 0; x < stackCountX; x++){

          const yOffset = y * spacingY;
          const xOffset = x * spacingX;

          html += `
  <div style="
    position:absolute;
    top:50%;
    left:50%;
    width:${artW};
    height:${artH};
    transform-style:preserve-3d;
    transform:translate(calc(-50% + ${xOffset + moveX}px), calc(-50% + ${yOffset + moveY}px)) scale(${scale});
    transform-origin:center center;
  ">
${content}
  </div>
`;
        }
      }
    }
  }

  html += `
</div>
</body>
</html>
`;

  return html;
}