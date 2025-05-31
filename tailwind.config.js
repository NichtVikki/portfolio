/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'foreground': 'rgb(255, 255, 255)',
        'background': 'rgb(10, 10, 12)',
        'primary': 'rgb(170, 80, 255)',
        'secondary': 'rgb(255, 68, 189)',
        'accent': 'rgb(189, 0, 255)',
        'muted': 'rgb(51, 51, 60)',
        'card': 'rgb(18, 18, 23)',
        'border': 'rgb(38, 38, 45)',
      },
      backgroundColor: {
        'primary-gradient': 'linear-gradient(to right, rgb(170, 80, 255), rgb(255, 68, 189))',
      },
      fontFamily: {
        sans: ['var(--font-poppins)'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
        'float': 'float 15s infinite ease-in-out',
        'glow': 'glow 3s infinite ease-in-out',
        'pull-in': 'pullIn 1.5s ease-out forwards',
        'blob-form': 'blobForm 1s ease-out forwards',
        'blob-pulse': 'blobPulse 2s ease-in-out infinite',
      },
      keyframes: {
        pullIn: {
          '0%': { transform: 'scale(2)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        blobForm: {
          '0%': { borderRadius: '0%', transform: 'scale(0.5)', opacity: 0 },
          '50%': { borderRadius: '30%', transform: 'scale(0.8)', opacity: 0.7 },
          '100%': { borderRadius: '50%', transform: 'scale(1)', opacity: 1 },
        },
        blobPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        float: {
          '0%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(10px) translateX(10px)' },
          '50%': { transform: 'translateY(20px) translateX(-5px)' },
          '75%': { transform: 'translateY(5px) translateX(-10px)' },
          '100%': { transform: 'translateY(0) translateX(0)' },
        },
        glow: {
          '0%, 100%': { filter: 'blur(25px) brightness(1)' },
          '50%': { filter: 'blur(30px) brightness(1.2)' },
        },
        fadeIn: {
          'from': { opacity: 0, transform: 'translateY(20px)' },
          'to': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} 