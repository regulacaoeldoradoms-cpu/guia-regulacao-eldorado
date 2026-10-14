import assert from 'node:assert/strict';
// Wait for the observable next task; never click a generic progression control.
export async function stage(dialog,number){
 await dialog.locator('[data-tutorial-progress]').filter({hasText:new RegExp(`^Etapa ${number} de 16$`)}).waitFor();
 assert.equal(await dialog.locator('[data-tutorial-next]').count(),0);
}
