function renderLayers(layers, layerTransforms){
  const f = document.getElementById("pv");
  const activeLayers = Object.values(layers).filter(v => v.trim() !== "");
  if(activeLayers.length === 0) return;

  const xRot = layerTransforms[1].x || 0;
  const yRot = layerTransforms[1].y || 0;

  const thickness = layerTransforms[1].z || 0;   // Y stack
  const thickness2 = layerTransforms[1].z2 || 0; // X stack (NEW)

  // stack counts
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
  ">
    <div id="container" style="
      transform-style: preserve-3d;
      transform: rotateX(${xRot}deg) rotateY(${yRot}deg);
      width:100%;
      height:100%;
      position:relative;
    ">
  `;

  for(let i=1;i<=8;i++){
    if(layers[i] && layers[i].trim() !== ""){
      const content = layers[i];

      // 🔥 dual-axis stacking (Y + X)
      for(let y = 0; y < stackCountY; y++){
        for(let x = 0; x < stackCountX; x++){

          const yOffset = y * spacingY;
          const xOffset = x * spacingX;

          html += `
          <div style="
            position:absolute;
            top:50%;
            left:50%;
            transform:
              translate(
                calc(-50% + ${xOffset}px),
                calc(-50% + ${yOffset}px)
              );
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
