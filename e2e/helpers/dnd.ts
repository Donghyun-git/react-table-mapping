import { type Page, expect } from '@playwright/test';

interface PerformDndTestParams {
  page: Page;
  sourceTestId: string;
  targetTestId: string;
}

export const performDragAndDrop = async (params: PerformDndTestParams) => {
  const { page, sourceTestId, targetTestId } = params;

  const sourceConnector = page.locator(`[data-testid="${sourceTestId}"]`);
  const targetConnector = page.locator(`[data-testid="${targetTestId}"]`);

  const sourceBox = await sourceConnector.boundingBox();
  const targetBox = await targetConnector.boundingBox();

  if (sourceBox && targetBox) {
    const sourceX = sourceBox.x + sourceBox.width / 2;
    const sourceY = sourceBox.y + sourceBox.height / 2;
    const targetX = targetBox.x + targetBox.width / 2;
    const targetY = targetBox.y + targetBox.height / 2;

    await page.mouse.move(sourceX, sourceY);
    await page.mouse.down();

    const steps = 3;

    for (let i = 1; i <= steps; i++) {
      const currentX = sourceX + (targetX - sourceX) * (i / steps);
      const currentY = sourceY + (targetY - sourceY) * (i / steps);

      await page.mouse.move(currentX, currentY);
      await page.waitForTimeout(20);
    }

    await page.mouse.up();
  }

  await page.waitForTimeout(1000);
};

export const verifyMappingCount = async (page: Page, expectedCount: number) => {
  const mappingLines = page.locator('[data-testid^="mapping-line-"]');
  await expect(mappingLines).toHaveCount(expectedCount);
};
