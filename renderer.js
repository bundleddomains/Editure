function renderLayers(layers, layerTransforms){
  const f = iframe();
  const activeLayers = Object.values(layers).filter(v => v.trim() !== "");

  if(activeLayers.length === 0) return;

  // Wrap all layers in a single container
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
      transform: rotateX(${layerTransforms[1].x}deg) rotateY(${layerTransforms[1].y}deg);
      width:100%;
      height:100%;
    ">
  `;

  // Insert all layers
  for(let i=1;i<=8;i++){
    if(layers[i] && layers[i].trim() !== ""){
      html += `<div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);">${layers[i]}</div>`;
    }
  }

  html += `</div></body>`;

  f.srcdoc = html;
}
