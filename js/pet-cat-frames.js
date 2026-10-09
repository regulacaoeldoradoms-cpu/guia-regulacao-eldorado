'use strict';
// All poses share this logical frame. Bone sizes never follow a pose's bounding box.
export const CAT_FRAME=Object.freeze({width:64,height:48,anchor:{x:32,y:44},head:{width:16,height:14},torso:{length:24,thickness:12}});
export const CAT_ACTIONS=['idle','walk','run','sit','lick','lie','roll','belly','sleep','wake','stretch'];
export function drawCat(ctx,action='idle',phase=0,variant='ginger',collar=false){
 ctx.clearRect(0,0,64,48);ctx.imageSmoothingEnabled=false;
 const gray=variant==='gray',p={outline:gray?'#353b4e':'#663d30',fur:gray?'#8994ab':'#e6a253',light:gray?'#c8cfdb':'#f8d29b',stripe:gray?'#65718a':'#c77838',pink:'#e69eab',eye:'#273047'};
 const rect=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);};
 const poly=(pts,c)=>{ctx.fillStyle=c;ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();};
 const f=Math.floor(phase)%4;
 const lying=['lie','roll','belly','sleep','wake'].includes(action);
 const sitting=['sit','lick'].includes(action);
 const stretched=action==='stretch';
 // Ground anchor is invariant. The pale shadow does not resize the cat.
 rect(20,44,30,2,'rgba(33,44,65,.14)');
 let bx=22,by=27,hx=39,hy=18;
 if(lying){by=31;hx=40;hy=29;}
 if(sitting){bx=25;by=20;hx=29;hy=9;}
 if(stretched){by=28;hx=40;hy=28;}
 if(action==='run'&&f===1){by-=1;hy-=1;}
 // Tail: shared two-pixel bones, articulated rather than scaled.
 const tailY=lying?35:sitting?36:30;
 rect(16,tailY,8,5,p.outline);rect(13,tailY-7,5,10,p.outline);
 rect(15,tailY-11,5,5,p.outline);rect(17,tailY-13,5,3,p.outline);
 rect(17,tailY+1,7,3,p.fur);rect(14,tailY-6,3,10,p.fur);
 rect(16,tailY-10,3,5,p.fur);rect(18,tailY-12,3,3,p.fur);
 // Torso rotated for sitting: length 24, thickness 12 in every pose.
 const bw=sitting?12:24,bh=sitting?24:12;
 rect(bx+2,by,bw-4,bh,p.outline);rect(bx,by+2,bw,bh-4,p.outline);
 rect(bx+2,by+2,bw-4,bh-4,p.fur);
 if(action==='belly'||(action==='roll'&&f>1))rect(bx+5,by+2,14,7,p.light);
 else{rect(bx+6,by+2,3,4,p.stripe);rect(bx+13,by+2,3,4,p.stripe);}
 // Feet use a fixed 4x7 bone; gait changes angle/offset, never length.
 if(!lying){
  const gait=['walk','run'].includes(action),stride=action==='run'?4:2;
  for(const [i,x] of [bx+3,bx+bw-6].entries()){
   const offset=gait?((f+i)%2?stride:-stride):0;
   rect(x+offset,37,5,7,p.outline);rect(x+offset+1,38,3,5,p.fur);
  }
 }else if(action==='belly'||action==='roll'){
  rect(26,26,5,8,p.outline);rect(27,27,3,6,p.light);
  rect(37,26,5,8,p.outline);rect(38,27,3,6,p.light);
 }else{rect(29,40,9,4,p.outline);rect(30,40,7,3,p.light);}
 // Head is a rigid 16x14 shape with ears attached at fixed offsets.
 rect(hx+2,hy,12,14,p.outline);rect(hx,hy+2,16,10,p.outline);
 rect(hx+2,hy+2,12,10,p.fur);
 poly([[hx+1,hy+4],[hx+1,hy-5],[hx+7,hy+1]],p.outline);
 poly([[hx+9,hy+1],[hx+14,hy-5],[hx+15,hy+5]],p.outline);
 poly([[hx+2,hy+1],[hx+2,hy-2],[hx+5,hy+1]],p.pink);
 poly([[hx+11,hy+1],[hx+13,hy-2],[hx+14,hy+2]],p.pink);
 rect(hx+9,hy+8,6,4,p.light);
 const closed=['sleep','lick','belly'].includes(action)||(action==='idle'&&f===3);
 rect(hx+10,hy+5,closed?4:2,closed?1:3,p.eye);
 rect(hx+14,hy+8,2,2,p.pink);rect(hx+15,hy+11,3,1,p.outline);
 if(collar)rect(hx+1,hy+12,7,2,'#4f8de3');
 if(action==='lick'){
  rect(40,24,5,9,p.outline);rect(41,25,3,7,p.light);
  if(f%2===0)rect(41,22,2,3,p.pink);
 }
 if(action==='sleep'&&f%2===0)rect(34,33,3,2,p.light);
}
export function drawBed(ctx,id='bed-cloud'){
 ctx.clearRect(0,0,80,30);ctx.imageSmoothingEnabled=false;
 const green=id==='bed-moss';
 ctx.fillStyle=green?'#47665a':'#586886';ctx.fillRect(4,10,72,18);ctx.fillRect(8,6,64,22);
 ctx.fillStyle=green?'#96bca0':'#adbed8';ctx.fillRect(8,10,64,14);
 ctx.fillStyle=green?'#d2e3c8':'#e0e8f4';ctx.fillRect(14,12,52,9);
 ctx.fillStyle=green?'#648674':'#7a91b4';ctx.fillRect(8,24,64,4);
}
