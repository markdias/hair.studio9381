/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary-brown': 'var(--primary-brown)',
                'primary-brown-hover': 'var(--primary-brown-hover)',
                'accent-cream': 'var(--accent-cream)',
                'soft-cream': 'var(--soft-cream)',
                'text-dark': 'var(--text-dark)',
            },
            fontFamily: {
                sans: ['var(--font-body)', 'sans-serif'],
                serif: ['var(--font-heading)', 'serif'],
                heading: ['var(--font-heading)', 'serif'],
                body: ['var(--font-body)', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
