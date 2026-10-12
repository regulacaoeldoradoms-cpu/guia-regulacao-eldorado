export const GNOME_ACTIONS=Object.freeze(['idle','walk','run','scratch','trip','laugh','dance','nap']);
export const GNOME_FRAME_COUNT=8;
let sheet,pending;
export function loadGnomeFrames(){
  if(sheet)return Promise.resolve(sheet);if(pending)return pending;
  pending=new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{sheet=image;resolve(image);};image.onerror=()=>{pending=null;reject(Error('Não foi possível carregar o Gnomo.'));};image.src='/assets/pets/gnome-sheet.png?v=gnome-20261012-1';});return pending;
}
export function drawGnome(ctx,action='idle',frame=0){
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);if(!sheet)return;
  const row=Math.max(0,GNOME_ACTIONS.indexOf(action==='sleep'?'nap':action));
  const column=Math.floor(frame)%GNOME_FRAME_COUNT;
  const tileWidth=sheet.naturalWidth/8,tileHeight=sheet.naturalHeight/8;
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(sheet,column*tileWidth,row*tileHeight,tileWidth,tileHeight,0,0,ctx.canvas.width,ctx.canvas.height);
}
