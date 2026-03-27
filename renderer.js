function renderLayers(layers, layerTransforms){
  const f = document.getElementById("pv");
  const activeLayers = Object.values(layers).filter(v => v.trim() !== "");
  if(activeLayers.length === 0) return;

  // Grab rotation & thickness from layerTransforms[1] (your main slider layer)
  const xRot = layerTransforms[1].x || 0;
  const yRot = layerTransforms[1].y || 0;
  const thickness = layerTransforms[1].z || 0; // new thickness slider

  // Build HTML for all layers inside a single container
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
      transform: rotateX(${xRot}deg) 
                 rotateY(${yRot}deg) 
                 translateZ(${thickness}px);
      width:100%;
      height:100%;
      position:relative;
    ">
  `;

  for(let i=1;i<=8;i++){
    if(layers[i] && layers[i].trim() !== ""){
      html += `
      <div style="
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%, -50%);
      ">
        ${layers[i]}
      </div>
      `;
    }
  }

  html += `</div></body>`;
  f.srcdoc = html;
}
