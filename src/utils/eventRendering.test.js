import { describe, it, expect } from 'vitest';
import { pickLayoutStyles } from './eventRendering';

describe('pickLayoutStyles', () => {
  it('keeps positioning and size, drops visual chrome', () => {
    const result = pickLayoutStyles({
      position: 'absolute',
      top: '10px',
      left: '8px',
      right: '8px',
      height: '48px',
      zIndex: 2,
      background: '#eff6ff',
      border: '1px solid #bfdbfe',
      borderLeft: '4px solid #3b82f6',
      borderRadius: '8px',
      padding: '8px 12px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    });

    expect(result).toEqual({
      position: 'absolute',
      top: '10px',
      left: '8px',
      right: '8px',
      height: '48px',
      zIndex: 2,
    });
    expect(result.background).toBeUndefined();
    expect(result.border).toBeUndefined();
  });

  it('keeps list spacing margins', () => {
    expect(pickLayoutStyles({ marginBottom: '10px', border: '1px solid red' })).toEqual({
      marginBottom: '10px',
    });
  });
});
