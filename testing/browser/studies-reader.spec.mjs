import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const origin = 'http://127.0.0.1:8777';
const sectionBody = 'Texto sintético para testar leitura, navegação e preservação da prática. Não é uma aula publicada. '.repeat(8);
const mission = {
  id: 'banking.sfn.audit', topicId: 'banking.sfn.audit', contentVersion: 2, order: 1,
  title: 'Leitura sintética com título longo para verificar a adaptação no celular', shortTitle: 'Leitura',
  estimatedMinutes: 20, xp: 100, objective: 'Conferir o leitor sem usar dados pessoais nem acessar a API real.',
  sections: Array.from({ length: 15 }, (_, i) => ({ id: `part-${i}`, heading: `${i + 1}. Explicação sintética com título detalhado`, body: sectionBody, type: 'explanation' })),
  recall: ['Explique com suas palavras o que acabou de ler.'], sources: [],
  questions: [1, 2, 3].map((id) => ({ id: `q.audit.${id}`, prompt: `Questão sintética ${id}: escolha uma alternativa para verificar o fluxo.`, options: ['Opção A', 'Opção B', 'Opção C'] }))
};

async function setup(page, { theme = 'light', history = false, kind = 'lesson', missingReader = false, username = 'wellyton' } = {}) {
  const content = structuredClone(mission);
  content.kind = kind === 'review' ? 'lesson' : kind;
  const payload = {
    user: { username, name: 'Estudante sintético' }, missions: [content], progress: {},
    attemptedQuestions: { [content.topicId]: history ? ['q.audit.1'] : [] },
    reviews: kind === 'review' ? [{ id: 'review-audit', missionId: content.id, title: 'Leitura', cycle: 1, dueAt: '2026-09-25 12:00:00' }] : [],
    metrics: { xp: 0, level: 1, levelTitle: 'Iniciante', nextLevelXp: 150, hoursSeconds: 0, questions: 0, accuracy: 0, reviewsDue: 0, publishedMissions: 1, plannedMissions: 9, campaignAvailability: 11.1, completedPublished: 0, campaignProgress: 0, availableCompletion: 0, streak: { current: 0, best: 0 } }
  };
  const errors = [];
  const unexpected = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const auth = `
    window.__studyCalls = [];
    window.__studyPayload = ${JSON.stringify(payload)};
    window.RegulationAuth = {
      requireRole: async () => ({username: ${JSON.stringify(username)}, name: 'Estudante sintético'}),
      logout: async () => {},
      api: async (route, options = {}) => {
        window.__studyCalls.push({route, method:options.method});
        if (route.endsWith('/bootstrap')) return structuredClone(window.__studyPayload);
        if (route.endsWith('/sessions')) return {sessionId:'session-audit'};
        if (route.endsWith('/attempts')) {
          const answer = JSON.parse(options.body);
          const key = window.__studyPayload.missions[0].topicId;
          const saved = window.__studyPayload.attemptedQuestions[key] || [];
          if (!saved.includes(answer.questionId)) saved.push(answer.questionId);
          window.__studyPayload.attemptedQuestions[key] = saved;
          return {correct:true, explanation:'Correção sintética para testar a interface.'};
        }
        if (route.endsWith('/complete')) return {completed:true, xpGranted:0, newAchievements:[]};
        return {finished:true};
      }
    };`;
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) { unexpected.push(url.origin + url.pathname); return route.abort(); }
    const pathname = url.pathname;
    if (pathname === '/estudos/') {
      let html = await readFile(path.join(root, 'estudos/index.html'), 'utf8');
      html = html.replace('<html lang="pt-BR">', `<html lang="pt-BR" data-portal-theme="${theme}">`)
        .replace(/<link rel="preconnect"[^>]*>/g, '');
      return route.fulfill({ contentType: 'text/html', body: html });
    }
    if (pathname === '/ferramentas/') return route.fulfill({ contentType: 'text/html', body: '<p>Ferramentas sintéticas</p>' });
    if (pathname === '/js/auth-client.js') return route.fulfill({ contentType: 'text/javascript', body: auth });
    if (pathname === '/js/studies.js' || pathname === '/js/studies-reader.js') {
      const body = missingReader && pathname.endsWith('studies-reader.js') ? '' : await readFile(path.join(root, pathname.slice(1)), 'utf8');
      return route.fulfill({ contentType: 'text/javascript', body });
    }
    if (pathname.endsWith('.js')) return route.fulfill({ contentType: 'text/javascript', body: '' });
    if (pathname.startsWith('/css/') && pathname.endsWith('.css')) {
      return route.fulfill({ contentType: 'text/css', body: await readFile(path.join(root, pathname.slice(1)), 'utf8') });
    }
    if (pathname.startsWith('/assets/')) return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>' });
    unexpected.push(pathname);
    return route.abort();
  });
  await page.goto(`${origin}/estudos/`);
  if (username !== 'wellyton') return { errors, unexpected };
  await expect(page.locator('#continueStudy')).toBeEnabled();
  await page.locator(kind === 'review' ? '#startReview' : '#continueStudy').click();
  await expect(page.locator('#studyFocus')).toBeVisible();
  return { errors, unexpected };
}

for (const [width, height] of [[320, 568], [390, 844], [768, 1024], [1280, 800]]) {
  for (const theme of ['light', 'dark']) {
    test(`leitura e prática ${width}x${height} ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      const { errors, unexpected } = await setup(page, { theme });
      await expect(page.locator('#studyPracticePanel')).toBeHidden();
      await expect(page.locator('#lessonSections .study-section:visible')).toHaveCount(1);
      await expect(page.locator('#lessonSections .study-section')).toHaveCount(15);
      await expect(page.locator('#studyPreviousPart')).toBeDisabled();
      await page.locator('#studyNextPart').click();
      await expect(page.locator('#studyPartLabel')).toContainText('Parte 2 de 15');
      await page.locator('#studySectionSelect').selectOption('14');
      await expect(page.locator('#studyNextPart')).toBeDisabled();
      await page.locator('#studyShowAll').click();
      await expect(page.locator('#lessonSections .study-section:visible')).toHaveCount(15);
      await page.locator('#studyShowAll').click();
      await page.locator('#studySectionSelect').selectOption('0');
      for (let i = 0; i < 3; i++) await page.locator('#studyFontLarger').click();
      await expect(page.locator('#studyFontLarger')).toBeDisabled();
      expect(await page.locator('#studyFocusBody').evaluate((e) => e.scrollWidth <= e.clientWidth + 1)).toBe(true);
      await expect(page.locator('#lessonSections .study-section').first().locator('p')).toHaveText(sectionBody.trim());
      await page.locator('#studyPracticeButton').click();
      await expect(page.locator('#studyLessonPanel')).toBeHidden();
      await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow', '0');
      const first = page.locator('[data-question-id="q.audit.1"]');
      await first.locator('input').nth(1).check();
      await page.locator('#studyReturnLesson').click();
      await page.locator('#studyPracticeButton').click();
      await expect(first.locator('input').nth(1)).toBeChecked();
      await first.locator('button').click();
      await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow', '1');
      await page.locator('#studyReturnLesson').click();
      await page.locator('#studyPracticeButton').click();
      await expect(first.locator('input').nth(1)).toBeDisabled();
      await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow', '1');
      await expect(page.locator('#completeMission')).toBeDisabled();
      expect(await page.evaluate(() => window.__studyCalls.filter((c) => c.route === '/api/studies/sessions').length)).toBe(1);
      expect(await page.evaluate(() => window.__studyCalls.filter((c) => c.route.endsWith('/complete')).length)).toBe(0);
      expect(await page.locator('#studyFocusBody').evaluate((e) => e.scrollWidth <= e.clientWidth + 1)).toBe(true);
      expect(errors).toEqual([]);
      expect(unexpected).toEqual([]);
    });
  }
}

for (const kind of ['lesson', 'review', 'boss']) {
  test(`consulta preserva regras do histórico: ${kind}`, async ({ page }) => {
    const { errors, unexpected } = await setup(page, { history: true, kind });
    await page.locator('#studyPracticeButton').click();
    await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow', kind === 'lesson' ? '1' : '0');
    await page.locator('#studyReturnLesson').click();
    await page.locator('#studyPracticeButton').click();
    await expect(page.locator('#studyPracticeProgress')).toHaveAttribute('aria-valuenow', kind === 'lesson' ? '1' : '0');
    expect(errors).toEqual([]);
    expect(unexpected).toEqual([]);
  });
}

test('falha do módulo novo mantém texto e prática em sequência', async ({ page }) => {
  const { errors, unexpected } = await setup(page, { missingReader: true });
  await expect(page.locator('#studyReaderNav')).toBeHidden();
  await expect(page.locator('#lessonSections .study-section:visible')).toHaveCount(15);
  await expect(page.locator('#studyPracticePanel')).toBeVisible();
  expect(errors).toEqual([]);
  expect(unexpected).toEqual([]);
});

test('teclado navega, texto não executa HTML e leitura não escreve dados', async ({ page }) => {
  const { errors, unexpected } = await setup(page);
  await page.locator('#studyNextPart').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#studyPartLabel')).toContainText('Parte 2 de 15');
  await expect(page.locator('#lessonSections .study-section').nth(1).locator('h2')).toBeFocused();
  await page.evaluate(() => {
    const reader = window.StudyReader.create(document.getElementById('studyFocus'));
    reader.mount({ sections: [{ heading: '<img src=x onerror="window.__injected=true">', body: '<script>window.__injected=true</script>' }] });
  });
  await expect(page.locator('#lessonSections img, #lessonSections script')).toHaveCount(0);
  expect(await page.evaluate(() => window.__injected)).toBeUndefined();
  expect(await page.evaluate(() => window.__studyCalls.filter((c) => /attempts|complete/.test(c.route)))).toEqual([]);
  expect(errors).toEqual([]);
  expect(unexpected).toEqual([]);
});

test('não abre conteúdo nem consulta API de estudos para outra conta', async ({ page }) => {
  const { errors, unexpected } = await setup(page, { username: 'conta-teste' });
  await expect(page).toHaveURL(/\/ferramentas\/\?estudos=acesso-negado/);
  expect(errors).toEqual([]);
  expect(unexpected).toEqual([]);
});
