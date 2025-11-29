// backend/tests/sanitization.test.js
const { sanitizeSql, escapeHtml, sanitizeWhitespace, sanitizeObject } = require('../utils/sanitization');

describe('Sanitization Utils', () => {

    describe('escapeHtml', () => {
        it('should escape HTML characters', () => {
            const input = '<script>alert("xss")</script>';
            const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;';
            expect(escapeHtml(input)).toBe(expected);
        });

        it('should return non-string input as is', () => {
            expect(escapeHtml(123)).toBe(123);
            expect(escapeHtml(null)).toBe(null);
        });
    });

    describe('sanitizeSql', () => {
        it('should escape single quotes', () => {
            const input = "O'Connor";
            const expected = "O''Connor";
            expect(sanitizeSql(input)).toBe(expected);
        });

        it('should remove semicolons', () => {
            const input = 'SELECT * FROM users; DROP TABLE users';
            const expected = 'SELECT * FROM users DROP TABLE users';
            expect(sanitizeSql(input)).toBe(expected);
        });

        it('should remove SQL comments', () => {
            const input = 'admin -- comment';
            const expected = 'admin  comment';
            expect(sanitizeSql(input)).toBe(expected);
        });
    });

    describe('sanitizeWhitespace', () => {
        it('should trim and collapse whitespace', () => {
            const input = '  Hello   World  ';
            const expected = 'Hello World';
            expect(sanitizeWhitespace(input)).toBe(expected);
        });

        it('should remove control characters', () => {
            const input = 'Hello\x00World';
            const expected = 'HelloWorld';
            expect(sanitizeWhitespace(input)).toBe(expected);
        });
    });

    describe('sanitizeObject', () => {
        it('should sanitize object properties recursively', () => {
            const input = {
                name: '  John   Doe  ',
                details: {
                    bio: '  <p>Hello</p>  '
                },
                tags: ['  tag1  ', '  tag2  ']
            };
            const expected = {
                name: 'John Doe',
                details: {
                    bio: '<p>Hello</p>' // uses sanitizeWhitespace by default which preserves specific characters but trims
                },
                tags: ['tag1', 'tag2']
            };

            // Note: sanitizeWhitespace does not escape HTML, it just trims and removes control chars/extra spaces.
            expect(sanitizeObject(input)).toEqual(expected);
        });
    });
});
