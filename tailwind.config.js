/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary-brown': '#3D2B1F',
                'primary-brown-hover': '#4D3B2F',
                'accent-cream': '#EAE0D5',
                'soft-cream': '#F5F1ED',
                'text-dark': '#2A1D15',
            },
        },
    },
    plugins: [],
}
