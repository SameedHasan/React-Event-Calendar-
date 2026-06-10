import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import { formatWeekLabel, getViewLabel, loadDayjsLocale } from './locale';
import { getLocalizedShortDOW } from './dateHelpers';

dayjs.extend(localeData);

describe('locale helpers', () => {
  it('formatWeekLabel uses Chinese pattern', () => {
    expect(formatWeekLabel(24, 'zh-cn')).toBe('第24周');
  });

  it('formatWeekLabel uses German word', () => {
    expect(formatWeekLabel(24, 'de')).toBe('Woche 24');
  });

  it('getViewLabel returns German month tab', () => {
    expect(getViewLabel('month', 'de')).toBe('Monat');
  });

  it('getLocalizedShortDOW returns German abbreviations after locale load', async () => {
    await loadDayjsLocale('de');
    const dow = getLocalizedShortDOW('monday');
    expect(dow[0]).toMatch(/^Mo/);
    expect(dow).not.toContain('Mon');
  });
});
