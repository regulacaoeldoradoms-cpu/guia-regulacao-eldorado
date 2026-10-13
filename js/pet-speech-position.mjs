export function alphaBounds(data,width,height,threshold=16){
 let left=width,top=height,right=0,bottom=0;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(data[(y*width+x)*4+3]>=threshold){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x+1);bottom=Math.max(bottom,y+1);}
 return right?{left,top,right,bottom}:null;
}
export function spriteRect(bounds,canvas,geometry,x,y,facing=1){
 const sx=geometry.width/canvas.width,sy=geometry.height/canvas.height;
 return {left:facing===-1?x+geometry.x-bounds.right*sx:x-geometry.x+bounds.left*sx,right:facing===-1?x+geometry.x-bounds.left*sx:x-geometry.x+bounds.right*sx,top:y-geometry.y+bounds.top*sy,bottom:y-geometry.y+bounds.bottom*sy};
}
export function speechPosition(sprite,bubble,scene,gap=12){
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 const inset=8,left=scene.left??inset,top=scene.top??inset,right=scene.right??scene.width-inset,bottom=scene.bottom??scene.height-inset;
 const width=bubble.width,height=bubble.height,center=(sprite.left+sprite.right-width)/2;
 const x=clamp(center,left,right-width),above=sprite.top-height-gap;
 if(above>=top&&height<=bottom-top)return {left:x,top:Math.min(above,bottom-height),side:'above'};
 const aboveSpace=Math.min(bottom-top,sprite.top-gap-top);
 if(aboveSpace>=(scene.minReadableHeight||96))return {left:x,top:top,side:'above',maxHeight:aboveSpace};
 const availableHeight=Math.max(1,bottom-top),fittedHeight=Math.min(height,availableHeight);
 const y=clamp(sprite.top,top,bottom-fittedHeight),rightSpace=right-sprite.right-gap,leftSpace=sprite.left-gap-left;
 if(rightSpace>=width)return {left:Math.max(left,sprite.right+gap),top:y,side:'right',...(height>availableHeight?{maxHeight:availableHeight}:{})};
 if(leftSpace>=width)return {left:Math.min(right-width,sprite.left-gap-width),top:y,side:'left',...(height>availableHeight?{maxHeight:availableHeight}:{})};
 // Below is allowed only beyond the entire visible body, never over the face/body.
 if(sprite.bottom+gap+height<=bottom)return {left:x,top:sprite.bottom+gap,side:'below'};
 const belowSpace=bottom-sprite.bottom-gap;
 if(belowSpace>=(scene.minReadableHeight||96))return {left:x,top:sprite.bottom+gap,side:'below',maxHeight:belowSpace};
 // The caller may narrow wrapping to the free side, rather than cover the face.
 const side=rightSpace>=leftSpace?'right':'left',available=Math.min(right-left,Math.max(0,Math.max(rightSpace,leftSpace)));
 return {left:side==='right'?sprite.right+gap:left,top:y,side,maxWidth:available,...(height>availableHeight?{maxHeight:availableHeight}:{})};
}
