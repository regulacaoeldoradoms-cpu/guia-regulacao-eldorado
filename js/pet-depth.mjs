// World ground anchors determine depth; pose, hat and transparent frame do not.
export function frontPet(primaryY, companionY, previous='gnome') {
 if(!Number.isFinite(primaryY)||!Number.isFinite(companionY)||primaryY===companionY)return previous;
 return primaryY>companionY?'primary':'gnome';
}
