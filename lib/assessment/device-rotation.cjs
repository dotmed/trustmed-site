const scalpel=require('./scalpel.cjs');
// Keep the shared scene wrapper so responsive authentication connectors stay aligned.
module.exports=()=>`<div class="device-rotation" data-device-rotation data-active-device="scalpel"><div class="device-slide" data-device="scalpel">${scalpel}</div></div>`;
