"""Deterministic atlas packing; no generated artwork or per-pose resizing.
Run with Pillow, numpy and scipy. Original source remains immutable.
"""
import hashlib,json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import label,distance_transform_edt,find_objects
ROOT=Path(__file__).resolve().parents[2]
source=ROOT/'assets/pets/gnome-sheet.png'
rgba=np.array(Image.open(source).convert('RGBA'))
core,n=label(rgba[:,:,3]>=128)
assert n==64,'Each of 64 complete figures must have one opaque connected core'
distance,nearest=distance_transform_edt(core==0,return_indices=True)
owner=core[tuple(nearest)]
keep=(rgba[:,:,3]>0)&(distance<=8)
assert np.all(keep[rgba[:,:,3]>=16]),'Every visible source pixel must be retained'
size=192;pad=(8,16);atlas=np.zeros((size*8,size*8,4),dtype=np.uint8)
frames=[];cells=set();old_foreign=0;old_cut=0
for ident,sl in enumerate(find_objects(core),1):
 ys,xs=sl;col=int((xs.start+xs.stop)/2/(rgba.shape[1]/8));row=int((ys.start+ys.stop)/2/(rgba.shape[0]/8))
 assert (row,col) not in cells;cells.add((row,col))
 selected=keep&(owner==ident);yy,xx=np.where(selected)
 ox=round(col*rgba.shape[1]/8);oy=round(row*rgba.shape[0]/8)
 tx=xx-ox+pad[0];ty=yy-oy+pad[1]
 assert tx.min()>0 and ty.min()>0 and tx.max()<size-1 and ty.max()<size-1
 atlas[row*size+ty,col*size+tx]=rgba[yy,xx]
 x0=col*rgba.shape[1]/8;y0=row*rgba.shape[0]/8;x1=x0+rgba.shape[1]/8;y1=y0+rgba.shape[0]/8
 cy,cx=np.where(core==ident);cut=int(((cx+.5<x0)|(cx+.5>=x1)|(cy+.5<y0)|(cy+.5>=y1)).sum());old_cut+=cut
 window=core[int(np.ceil(y0-.5)):int(np.ceil(y1-.5)),int(np.ceil(x0-.5)):int(np.ceil(x1-.5))]
 foreign=int(((window>0)&(window!=ident)).sum());old_foreign+=foreign
 frames.append({'row':row,'column':col,'sourceOrigin':[ox,oy],'coreBounds':[xs.start,ys.start,xs.stop,ys.stop],'packedBounds':[int(tx.min()),int(ty.min()),int(tx.max()+1),int(ty.max()+1)],'visiblePixelsRetained':int(((owner==ident)&(rgba[:,:,3]>=16)).sum()),'oldCutCorePixels':cut,'oldForeignCorePixels':foreign})
assert len(cells)==64
assert int((atlas[:,:,3]>=16).sum())==int((rgba[:,:,3]>=16).sum())
dest=ROOT/'assets/pets/gnome-sheet-isolated.png';Image.fromarray(atlas).save(dest,optimize=True)
manifest={'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'atlasSha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'sourceSize':[rgba.shape[1],rgba.shape[0]],'tileSize':size,'padding':list(pad),'coreAlpha':128,'haloRadius':8,'visibleAlpha':16,'visiblePixelsRetained':int((atlas[:,:,3]>=16).sum()),'oldCutCorePixels':old_cut,'oldForeignCorePixels':old_foreign,'frames':sorted(frames,key=lambda f:(f['row'],f['column']))}
(ROOT/'assets/pets/gnome-atlas-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({k:v for k,v in manifest.items() if k!='frames'}))
