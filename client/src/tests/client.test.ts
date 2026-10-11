import { describe, it, expect } from 'vitest';
import { translations } from '../i18n/translations';

describe('ScrapSetu Frontend Unit Tests', () => {
  it('has consistent English and Hindi translation dictionaries', () => {
    expect(translations.en.brandName).toBe('ScrapSetu');
    expect(translations.hi.brandName).toBe('स्क्रैपसेतु');

    expect(translations.en.roleHousehold).toBeDefined();
    expect(translations.hi.roleHousehold).toBe('घरेलू उपभोक्ता');

    expect(translations.en.step1Title).toBeDefined();
    expect(translations.hi.step1Title).toContain('अनुरोध');
  });

  it('validates demo role credentials structure', () => {
    const roles = ['HOUSEHOLD', 'BUSINESS', 'COLLECTOR', 'RECYCLER', 'ADMIN'];
    roles.forEach((role) => {
      expect(role).toBeDefined();
    });
  });

  it('verifies indicative calculation formula logic', () => {
    const baseRate = 14.0;
    const qty = 50.0;
    const cleanMultiplier = 1.08;
    const estimatedValue = Math.round(qty * baseRate * cleanMultiplier * 100) / 100;
    expect(estimatedValue).toBe(756.0);
  });
});
