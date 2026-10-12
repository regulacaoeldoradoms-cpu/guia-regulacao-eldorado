export const GNOME_ACTIONS=Object.freeze(['idle','walk','run','scratch','trip','laugh','dance','nap']);
export const GNOME_FRAME_COUNT=8;
// Isolated 192px cells keep complete figures; padding restores the old world anchor.
export const GNOME_CANVAS_SIZE=78;
export const GNOME_RENDER_SIZE=128*192/(1254/8);
export const GNOME_ANCHOR_X=64+8*128/(1254/8);
export const GNOME_ANCHOR_Y=120+16*128/(1254/8);
// All eight idle core-alpha bounds share floor174 in the isolated tile.
// Keep animation origin unchanged; depth uses the actual stable foot baseline.
export const GNOME_GROUND_Y=174*128/(1254/8);
let sheet,pending;
export function loadGnomeFrames(){
  if(sheet)return Promise.resolve(sheet);if(pending)return pending;
  pending=new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{sheet=image;resolve(image);};image.onerror=()=>{pending=null;reject(Error('Não foi possível carregar o Gnomo.'));};image.src='/assets/pets/gnome-sheet-isolated.png?v=gnome-frames-20261012-2';});return pending;
}
export function drawGnome(ctx,action='idle',frame=0){
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);if(!sheet)return;
  const row=Math.max(0,GNOME_ACTIONS.indexOf(action==='sleep'?'nap':action));
  const column=((Math.floor(Number.isFinite(frame)?frame:0)%GNOME_FRAME_COUNT)+GNOME_FRAME_COUNT)%GNOME_FRAME_COUNT;
  const tileWidth=sheet.naturalWidth/8,tileHeight=sheet.naturalHeight/8;
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(sheet,column*tileWidth,row*tileHeight,tileWidth,tileHeight,0,0,ctx.canvas.width,ctx.canvas.height);
}
