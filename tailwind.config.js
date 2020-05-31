module.exports = {
  purge: [
    './src/**/*.svelte',
    './src/**/*.html',
    './static/**/*.html',
  ],
  theme: {
    fontFamily: {
      display: ['VT323', 'monospace'],
      body: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen-Sans', 'Ubuntu', 'Cantarell', 'Helvetica Neue', 'sans-serif'],
    },
    extend: {
      screens: {
        light: { raw: "(prefers-color-scheme: light)" },
        dark: { raw: "(prefers-color-scheme: dark)" }
      },
      height: {
        'vh90': '90vh'
      },
      width: {
        'vw90': '90vw'
      }
    },
  },
  variants: {},
  plugins: [function({ addBase, config }) {
    addBase({
      body: {
        color: config("theme.colors.black"),
        backgroundColor: config("theme.colors.white")
      },
      "@screen dark": {
        body: {
          color: config("theme.colors.white"),
          backgroundColor: config("theme.colors.black")
        }
      }
    });
  }],
}
