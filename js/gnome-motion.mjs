// Only the Gnomo uses this cadence. Cat animation/movement remains independent.
export const GNOME_MOTION=Object.freeze({walk:{speed:42,frameMs:160},run:{speed:92,frameMs:120},trip:{speed:42,frameMs:160,stopFrame:1}});
export function gnomeFrame(action,elapsed){const interval=GNOME_MOTION[action]?.frameMs||160;const frame=Math.floor(Math.max(0,elapsed)/interval);return action==='trip'?Math.min(7,frame):frame%8;}
export function gnomeDuration(action,milliseconds){const profile=GNOME_MOTION[action];if(action==='walk'||action==='run'){const cycle=profile.frameMs*8;return Math.ceil(milliseconds/cycle)*cycle;}return milliseconds;}
export function gnomeTravel(action,from,to){const profile=GNOME_MOTION[action];if(!profile||to<=from)return 0;const end=action==='trip'?profile.frameMs*profile.stopFrame:Infinity;return profile.speed*Math.max(0,Math.min(to,end)-Math.max(0,from))/1000;}
