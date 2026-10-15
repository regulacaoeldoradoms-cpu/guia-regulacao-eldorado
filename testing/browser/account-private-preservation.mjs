import {expect} from '@playwright/test';

const genderOptions=[{value:'',label:'Selecione uma opção',disabled:false,selected:true},...[['mulher','Mulher'],['homem','Homem'],['pessoa_nao_binaria','Pessoa não binária'],['outra_identidade','Outra identidade de gênero'],['prefiro_nao_informar','Prefiro não informar']].map(([value,label])=>({value,label,disabled:false,selected:false}))];
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
   backStyle:doc.querySelector('#signupForm > a')?.getAttribute('style'),privacyHtml:doc.querySelector('#signupForm > .portal-note.info')?.innerHTML,lastNoteHtml:[...doc.querySelectorAll('#signupForm > .portal-note.info')].at(-1)?.outerHTML,usernameHelp:doc.getElementById('signupUsername')?.closest('.portal-field').querySelector('small')?.textContent,
   terms:terms?{text:terms.closest('label').textContent.trim(),labelStyle:terms.closest('label').getAttribute('style'),labelClass:terms.closest('label').getAttribute('class'),inputStyle:terms.getAttribute('style')}:null};
 },baseHtml);
 if(route==='/cadastro/'){
  if(!current){await expect(page.locator('#signupGender')).toHaveCount(Number(base.gender));return;}
  const gender=await genderContract(page,'signupGender');expect(gender).toEqual({tag:'select',label:'Gênero (opcional)',value:'',options:genderOptions});
  await expect(page.locator('#signupGender')).toHaveJSProperty('required',false);
  if(base.gender)return;
  await expect(page.locator('#signupGenderHelp')).toHaveText('Privado. Pode ser alterado depois na sua conta.');
  await expect(page.locator('#signupBirthDate')).toHaveAttribute('min','1900-01-01');
  await expect(page.locator('#signupBirthDate')).toHaveAttribute('max',/^\d{4}-\d{2}-\d{2}$/);
  await expect(page.locator('#signupBirthDate')).toHaveAttribute('aria-describedby','signupBirthHelp');
  await expect(page.locator('#signupBirthHelp')).toHaveText('Data autodeclarada e privada. Não aparece no perfil público nem no chat.');
  await expect(page.locator('#signupForm > p')).toHaveText('Você começa com uma Conta Bronze. Pode confirmar um e-mail depois.');
  await expect(page.locator('#signupForm > .portal-note.info')).toHaveCount(1);
  await expect(page.locator('#signupForm > .portal-note.info')).toHaveText('Preserve sua identidade: não use seu nome completo, CPF, telefone, e-mail ou data de nascimento no usuário.');
  await expect(page.locator('#signupUsername').locator('..').locator('small')).toHaveText('3 a 40 caracteres: letras, números, ponto, hífen ou sublinhado.');
  if(page.viewportSize().width<=860){await expect(page.locator('.login-message')).toBeHidden();expect((await page.locator('.login-visual').boundingBox()).height).toBeLessThan(150);}else await expect(page.locator('.login-message')).toBeVisible();
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
   document.querySelector('#signupForm > .portal-note.info').innerHTML=base.privacyHtml;document.getElementById('signupUsername').closest('.portal-field').querySelector('small').textContent=base.usernameHelp;label.insertAdjacentHTML('beforebegin',base.lastNoteHtml);
   attr(label,'class',base.terms.labelClass);attr(label,'style',base.terms.labelStyle);attr(terms,'style',base.terms.inputStyle);
  },base);
 }
 if(route==='/seguranca/'){
  if(!current){await expect(page.locator('#privateRegistrationCard')).toHaveCount(Number(base.card));return;}
  const card=page.locator('#privateRegistrationCard');await expect(card).toHaveCount(1);
  if(base.card)return;
  await expect(card.getByRole('heading',{name:'Dados privados da conta',exact:true})).toBeVisible();
  await expect(page.locator('#privateRegistrationSummary')).toContainText('Nascimento já registrado.');
  await expect(page.locator('#privateRegistrationHelp')).toHaveText('Nascimento e gênero são privados e não aparecem no perfil público nem no chat. O gênero é opcional e pode ser alterado.');
  const gender=await genderContract(page,'privateGender');expect(gender).toEqual({tag:'select',label:'Gênero (opcional)',value:'',options:genderOptions});
  const birth=page.locator('#privateBirthDate');await expect(birth).toHaveAttribute('type','date');await expect(birth).toHaveAttribute('autocomplete','bday');await expect(birth).toHaveValue('');await expect(birth).toBeDisabled();
  await expect(page.locator('#privateGender')).toBeEnabled();await expect(page.locator('#privateGender')).toHaveJSProperty('required',false);await expect(page.locator('#privateRegistrationForm')).toBeVisible();
  const sheet=page.locator('link[rel="stylesheet"][href^="/css/private-registration.css?"]');await expect(sheet).toHaveCount(1);
  await info.attach('approved-own-private-details-card.json',{body:Buffer.from(JSON.stringify({gender,storedValuesNotDisplayed:true,genderEditable:true})),contentType:'application/json'});
  await card.evaluate(node=>node.remove());await sheet.evaluate(node=>node.remove());
 }
}
