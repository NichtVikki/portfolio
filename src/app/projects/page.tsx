import React from 'react';

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-100 to-white flex flex-col items-center py-16 relative overflow-x-hidden">
      {/* Cat decorations */}
      <span className="absolute left-8 top-8 text-5xl animate-bounce">🐾</span>
      <span className="absolute right-12 top-24 text-4xl animate-spin-slow">😺</span>
      <span className="absolute left-1/2 bottom-8 text-6xl -translate-x-1/2 animate-wiggle">🐈</span>
      <h1 className="text-5xl font-extrabold text-purple-700 mb-10">My Work</h1>
      <section className="w-full max-w-3xl bg-white/80 rounded-xl shadow-lg p-10 mb-12 flex flex-col items-center">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-6xl">🐾</span>
          <h2 className="text-3xl font-bold text-purple-800">Lantharos</h2>
        </div>
        <p className="text-lg text-gray-700 text-center mb-2">Most of my code lives here! Lantharos is my main playground for building cool stuff, breaking things, and occasionally fixing them. If you want to see what I'm really up to, this is the place. (Warning: may contain traces of cat fur.)</p>
        <a href="https://github.com/lantharos" target="_blank" rel="noopener noreferrer" className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">Check out Lantharos on GitHub</a>
      </section>
      <section className="w-full max-w-2xl bg-white/80 rounded-xl shadow p-8 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">😸</span>
          <h3 className="text-2xl font-semibold text-purple-700">Personal Projects</h3>
        </div>
        <p className="text-gray-600 text-center">I'd list more here, but honestly, most of my stuff is over at Lantharos. Maybe one day I'll have a secret project to show off. For now, enjoy the cats! 🐱</p>
      </section>
    </main>
  );
} 