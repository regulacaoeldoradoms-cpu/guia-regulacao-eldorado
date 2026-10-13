// World ground anchors determine depth; pose, hat and transparent frame do not.
export function frontPet(primaryY, companionY, previous='gnome') {
 if(!Number.isFinite(primaryY)||!Number.isFinite(companionY)||Math.abs(primaryY-companionY)<=0.001)return previous;
 return primaryY>companionY?'primary':'gnome';
}
