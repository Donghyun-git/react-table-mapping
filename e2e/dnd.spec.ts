import { expect, test } from '@playwright/test';

import { performDragAndDrop, verifyMappingCount } from './helpers/dnd';

/**
 * - source: 1 fields
 * - target: 0 fields
 */
test.describe('React Table Mapping DnD', () => {
  test('1. Create 1 on 1 Mapping', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    const sourceConnectors = page.locator('[data-testid^="connector-source-"]');

    await expect(sourceConnectors).toHaveCount(5);

    const targetConnectors = page.locator('[data-testid^="connector-target-"]');

    await expect(targetConnectors).toHaveCount(3);

    // dnd test
    await performDragAndDrop({ page, sourceTestId: 'connector-source-0', targetTestId: 'connector-target-0' });

    // check mapping count
    await verifyMappingCount(page, 2);
  });

  test('2. Delete Mapping', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    const sourceConnectors = page.locator('[data-testid^="connector-source-"]');

    await expect(sourceConnectors).toHaveCount(5);

    const targetConnectors = page.locator('[data-testid^="connector-target-"]');

    await expect(targetConnectors).toHaveCount(3);

    await performDragAndDrop({ page, sourceTestId: 'connector-source-0', targetTestId: 'connector-target-0' });

    await verifyMappingCount(page, 2);

    const mappedLine = page.locator('[data-testid="mapping-line-mapping-0-0"]');

    await expect(mappedLine).toBeAttached();

    const hoverArea = page.locator('g[data-testid="mapping-line-mapping-0-0"] path.hover-area');

    await hoverArea.click({ force: true });

    await page.waitForTimeout(1000);

    await verifyMappingCount(page, 1);
  });
});
