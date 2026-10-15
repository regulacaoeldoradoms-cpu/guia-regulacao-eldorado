import {expect} from '@playwright/test';

const genderOptions=[{value:'',label:'Selecione uma opção',disabled:true,selected:true},{value:'masculino',label:'Masculino',disabled:false,selected:false},{value:'feminino',label:'Feminino',disabled:false,selected:false}];
async function genderContract(page,id){
 const field=page.locator('#'+id);await expect(field).toHaveCount(1);
 return field.evaluate(node=>({tag:node.localName,label:node.labels?.[0]?.textContent.trim(),value:node.value,options:[...node.options].map(option=>({value:option.value,label:option.textContent.trim(),disabled:option.disabled,selected:option.selected}))}));
}

// Assert the approved private additions before projecting only those additions
// out of the historical comparison. Prior controls, styles, pixels and the
// raster tolerance stay subject to the same current-vs-base gates.
export async function projectPrivateAccountAdditions(page,info,route,current,baseHtml){
 const base=await page.evaluate(html=>{
  const doc=new DOMParser().parseFromString(html,'text/html'),birth=doc.getElementById('signupBirthDate'),terms=doc.getElementById('signupTerms');
  return {gender:Boolean(doc.getElementById('signupGender')),card:Boolean(doc.getElementById('privateRegistrationCard')),caption:doc.querySelector('#signupForm > p')?.textContent,
   birth:birth?{min:birth.getAttribute('min'),max:birth.getAttribute('max'),described:birth.getAttribute('aria-describedby'),help:birth.closest('.portal-field').querySelector('small')?.textContent,helpId:birth.closest('.portal-field').querySelector('small')?.getAttribute('id')}:null,
   backStyle:doc.querySelector('#signupForm > a')?.getAttribute('style'),
   terms:terms?{text:terms.closest('label').textContent.trim(),labelStyle:terms.closest('label').getAttribute('style'),labelClass:terms.closest('label').getAttribute('class'),inputStyle:terms.getAttribute('style')}:null};
 },baseHtml);
 if(route==='/cadastro/'){
  if(!current){await expect(page.locator('#signupGender')).toHaveCount(Number(base.gender));return;}
  const gender=await genderContract(page,'signupGender');expect(gender).toEqual({tag:'select',label:'Gênero',value:'',options:genderOptions});
  await expect(page.locator('#signupGender')).toHaveJSProperty('required',true);
  if(base.gender)return;
  await expect(page.locator('#signupGenderHelp')).toHaveText('Guardado de forma privada para futuras funções. Não altera suas permissões e não aparece no perfil público, chat ou manifestações.');
  await expect(page.locator('#signupBirthDate')).toHaveAttribute('min','1900-01-01');
  await expect(page.locator('#signupBirthDate')).toHaveAttribute('max',/^\d{4}-\d{2}-\d{2}$/);
  await expect(page.locator('#signupBirthDate')).toHaveAttribute('aria-describedby','signupBirthHelp');
  await expect(page.locator('#signupBirthHelp')).toHaveText('Data autodeclarada para a restrição 18+ do Gnomo; não verifica identidade. Não aparece no perfil público, chat ou manifestações.');
  await expect(page.locator('#signupForm > p')).toHaveText('Escolha um nome de usuário e uma senha e complete seus dados privados.');
  expect(await page.locator('.signup-consent').textContent().then(s=>s.trim())).toBe(base.terms.text);
  await expect(page.locator('#signupTerms')).toHaveJSProperty('required',true);
  await expect(page.locator('#signupForm > a')).toHaveText('← Voltar ao login');await expect(page.locator('#signupForm > a')).toHaveAttribute('href','/login/');
  await expect(page.locator('body')).toHaveClass(/\bsignup-page\b/);
  const sheet=page.locator('link[rel="stylesheet"][href^="/css/signup-private-data.css?"]');await expect(sheet).toHaveCount(1);
  await info.attach('approved-private-gender-field.json',{body:Buffer.from(JSON.stringify({gender,termsPreserved:true})),contentType:'application/json'});
  await page.evaluate(base=>{
   document.getElementById('signupGender').closest('.portal-field').remove();
   document.querySelector('link[href^="/css/signup-private-data.css?"]').remove();
   document.body.classList.remove('signup-page');
   const birth=document.getElementById('signupBirthDate'),small=birth.closest('.portal-field').querySelector('small'),terms=document.getElementById('signupTerms'),label=terms.closest('label');
   const attr=(node,name,value)=>value===null?node.removeAttribute(name):node.setAttribute(name,value);
   if(base.birth){for(const [name,key]of [['min','min'],['max','max'],['aria-describedby','described']])attr(birth,name,base.birth[key]);small.textContent=base.birth.help;attr(small,'id',base.birth.helpId);}
   attr(document.querySelector('#signupForm > a'),'style',base.backStyle);
   document.querySelector('#signupForm > p').textContent=base.birth?base.caption:'Escolha um nome de usuário e uma senha. Sua data de nascimento é privada.';
   attr(label,'class',base.terms.labelClass);attr(label,'style',base.terms.labelStyle);attr(terms,'style',base.terms.inputStyle);
  },base);
 }
 if(route==='/seguranca/'){
  if(!current){await expect(page.locator('#privateRegistrationCard')).toHaveCount(Number(base.card));return;}
  const card=page.locator('#privateRegistrationCard');await expect(card).toHaveCount(1);
  if(base.card)return;
  await expect(card.getByRole('heading',{name:'Dados privados da conta',exact:true})).toBeVisible();
  await expect(page.locator('#privateRegistrationSummary')).toContainText('Seus dados privados já estão registrados.');
  await expect(page.locator('#privateRegistrationHelp')).toHaveText('Informe seus próprios dados. A data é autodeclarada para a restrição 18+ do Gnomo e não verifica identidade. O gênero fica reservado para futuras funções, sem alterar permissões. Esses dados não aparecem no perfil público, chat ou manifestações.');
  const gender=await genderContract(page,'privateGender');expect(gender).toEqual({tag:'select',label:'Gênero',value:'',options:genderOptions});
  const birth=page.locator('#privateBirthDate');await expect(birth).toHaveAttribute('type','date');await expect(birth).toHaveAttribute('autocomplete','bday');await expect(birth).toHaveValue('');await expect(birth).toBeDisabled();
  await expect(page.locator('#privateGender')).toBeDisabled();await expect(page.locator('#privateRegistrationForm')).toBeHidden();
  const sheet=page.locator('link[rel="stylesheet"][href^="/css/private-registration.css?"]');await expect(sheet).toHaveCount(1);
  await info.attach('approved-own-private-details-card.json',{body:Buffer.from(JSON.stringify({gender,storedValuesNotDisplayed:true,completedFormHidden:true})),contentType:'application/json'});
  await card.evaluate(node=>node.remove());await sheet.evaluate(node=>node.remove());
 }
}
