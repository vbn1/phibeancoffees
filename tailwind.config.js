module.exports = {
  content: ['./index.html', './grower.html', './privacy.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        phibean: {
          50: '#f3f6f1',
          100: '#dfe9d9',
          200: '#bfd0ab',
          300: '#9bb780',
          400: '#72945d',
          500: '#4f6d3a',
          600: '#39532c',
          700: '#2a3a22',
          800: '#1d291a',
          900: '#121a12'
        },
        crema: '#f5efe7',
        soil: '#7a4d32'
      },
      boxShadow: {
        glow: '0 10px 30px rgba(131, 92, 45, 0.25)'
      }
    }
  },
  plugins: []
};
