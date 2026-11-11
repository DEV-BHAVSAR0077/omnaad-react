import { describe, expect, it } from 'vitest';
import { media } from './api';

describe('required public workflows', () => {
  it('keeps admission and jam entry routes', () => {
    expect(['/admission', '/jam-session', '/login']).toEqual(
      expect.arrayContaining(['/admission', '/jam-session']),
    );
  });

  it('maps Laravel storage paths to the uploads endpoint', () => {
    expect(media('/storage/courses/guitar.jpg')).toBe('/uploads/courses/guitar.jpg');
    expect(media('blogs/article.jpg')).toBe('/uploads/blogs/article.jpg');
    expect(media('https://example.com/photo.jpg')).toBe('https://example.com/photo.jpg');
  });
});
