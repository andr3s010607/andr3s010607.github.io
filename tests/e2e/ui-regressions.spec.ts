import { expect, test } from '@playwright/test';

test.describe('e-portafolio estático', () => {
  test('expone metadatos en español y recursos de rastreo correctos', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('Geovanny Andres Riaño Perez | Portafolio Bases de Datos 1');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      'E-portafolio académico de Geovanny Andres Riaño Perez para la asignatura Bases de Datos 1.',
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://andr3s010607.github.io/',
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://andr3s010607.github.io/og-image.svg',
    );

    const sitemap = await page.goto('/sitemap.xml');
    expect(sitemap?.ok()).toBe(true);
    await expect(page.locator('body')).toContainText('https://andr3s010607.github.io/');

    const robots = await page.goto('/robots.txt');
    expect(robots?.ok()).toBe(true);
    await expect(page.locator('body')).toContainText(
      'Sitemap: https://andr3s010607.github.io/sitemap.xml',
    );
  });

  test('carga sin errores de consola o de página', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('los enlaces principales llevan a las secciones internas', async ({ page, isMobile }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Geovanny Andres Riaño Perez',
    );
    await expect(page.getByRole('link', { name: 'Ver presentación' })).toHaveAttribute(
      'href',
      '/#presentacion',
    );
    await expect(page.getByRole('link', { name: 'Ver evidencias' }).first()).toHaveAttribute(
      'href',
      '/#evidencias',
    );

    const navigation = isMobile
      ? page.locator('#mobile-menu')
      : page.locator('nav[aria-label="Navegación principal"]');

    if (isMobile) {
      await page.getByRole('button', { name: 'Abrir menú de navegación' }).click();
    }

    await expect(navigation.getByRole('link', { name: 'Inicio' })).toHaveAttribute(
      'href',
      '/#inicio',
    );
    await expect(navigation.getByRole('link', { name: 'Presentación' })).toHaveAttribute(
      'href',
      '/#presentacion',
    );
    await expect(navigation.locator('summary')).toContainText('Evidencias');
    await expect(page.locator('a[href="#"]')).toHaveCount(0);
  });

  test('la presentación funciona con archivos personales o sus placeholders', async ({ page }) => {
    await page.goto('/');

    const presentation = page.locator('#presentacion');
    await expect(
      presentation.getByRole('img', { name: /Geovanny Andres Riaño Perez/i }),
    ).toBeVisible();

    const video = presentation.locator('video');
    if (await video.count()) {
      await expect(video).toBeVisible();
      await expect(video).toHaveAttribute('controls', '');
    } else {
      await expect(
        presentation.getByText('Video de presentación próximamente disponible.'),
      ).toBeVisible();
    }
  });

  test('las cuatro categorías de evidencias muestran contenido o un estado vacío claro', async ({ page }) => {
    await page.goto('/');

    for (const category of ['modelado', 'normalizacion', 'sql', 'proyecto']) {
      const section = page.locator('#' + category);
      await expect(section).toBeVisible();
      const cards = await section.locator('.evidence-card').count();
      const emptyState = await section
        .getByText('Aún no se han publicado evidencias en esta categoría.')
        .count();
      expect(cards + emptyState).toBeGreaterThan(0);
    }
  });

  test('el menú móvil y el tema se pueden usar sin desbordamiento horizontal', async ({ page, isMobile }) => {
    await page.goto('/');

    if (isMobile) {
      const menuButton = page.getByRole('button', {
        name: 'Abrir menú de navegación',
      });
      await menuButton.click();
      await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('#mobile-menu')).not.toHaveClass(/(^|\s)hidden(\s|$)/);

      const evidenceSummary = page.locator('#mobile-menu summary');
      await evidenceSummary.click();
      await expect(
        page.locator('#mobile-menu').getByRole('link', { name: 'Modelado' }),
      ).toBeVisible();
    }

    const themeButton = page.locator('[data-theme-toggle]:visible').first();
    await themeButton.click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  });
});
