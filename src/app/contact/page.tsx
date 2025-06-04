import React from 'react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#121212] flex flex-col items-left justify-left p-[150px] relative overflow-x-hidden">
      {/* Cat decorations */}
      <span className="absolute left-8 top-8 text-5xl animate-bounce">🐾</span>
      <h1 className="text-5xl font-normal text-[#D3D3D3] mb-4">wanna work together, or just say hi? let's talk.</h1>
      <h1 className="text-5xl font-normal text-[#878787] mb-14">don't be shy, i'm probably just overthinking my last button design anyway.</h1>
      <section className="w-full max-w-6xl bg-white/80 rounded-2xl shadow-2xl p-14 flex flex-col md:flex-row gap-16 mb-16 items-start">
        {/* Left fields */}
        <div className="flex flex-col gap-8 w-[700px]">
          <div>
            <label className="block text-2xl font-semibold text-purple-800 mb-4">what should i call you?</label>
            <input type="text" className="w-full h-[100px] rounded-xl border-2 border-[#232323] px-8 py-6 text-2xl focus:outline-none focus:border-purple-500 bg-[#1A1A1A] text-[#878787] placeholder-[#878787] transition" placeholder="your name, nickname, or secret agent code" />
          </div>
          <div>
            <label className="block text-2xl font-semibold text-purple-800 mb-2">how do i reach you?</label>
            <span className="block text-sm text-gray-500 mb-2">*carrier pigeons not accepted (yet)</span>
            <input type="text" className="w-full h-[100px] rounded-xl border-2 border-[#232323] px-8 py-6 text-2xl focus:outline-none focus:border-purple-500 bg-[#1A1A1A] text-[#878787] placeholder-[#878787] transition" placeholder="email, discord, or smoke signal" />
          </div>
        </div>
        {/* Right textarea, top-aligned */}
        <div className="flex flex-col justify-start w-[850px]">
          <label className="block text-2xl font-semibold text-purple-800 mb-4">spill the tea, i don't bite (much)</label>
          <textarea className="w-full h-[300px] rounded-xl border-2 border-[#232323] px-8 py-6 text-2xl focus:outline-none focus:border-purple-500 bg-[#1A1A1A] text-[#878787] placeholder-[#878787] resize-none transition" placeholder="your message, meme, or cat fact goes here" />
        </div>
      </section>
      {/* Send button */}
      <button className="mt-2 mb-10 px-14 py-6 bg-purple-600 text-white rounded-2xl font-bold text-2xl shadow-xl hover:bg-purple-700 transition">Send the message</button>
      {/* FAQ Section */}
      <section className="w-full max-w-3xl mt-10 bg-white/80 rounded-2xl shadow-xl p-10 flex flex-col items-center relative">
        <span className="absolute left-4 top-4 text-3xl">🐾</span>
        <h2 className="text-3xl font-bold text-purple-700 mb-8">have some questions?</h2>
        <div className="w-full flex flex-col gap-8">
          <div>
            <h3 className="font-semibold text-xl text-purple-800 flex items-center gap-2 mb-1">Can I really message you about anything? <span>😼</span></h3>
            <p className="text-gray-700 ml-2 text-lg">Absolutely! Project ideas, memes, existential questions, or just to say hi. I'm here for it.</p>
          </div>
          <div>
            <h3 className="font-semibold text-xl text-purple-800 flex items-center gap-2 mb-1">Why so many cats? <span>🐾</span></h3>
            <p className="text-gray-700 ml-2 text-lg">Because cats make everything better. Also, I aspire to their level of chill (and mischief).</p>
          </div>
          <div>
            <h3 className="font-semibold text-xl text-purple-800 flex items-center gap-2 mb-1">What if I'm shy? <span>🙀</span></h3>
            <p className="text-gray-700 ml-2 text-lg">Don't worry, I'm probably just overthinking my last button design anyway. Shoot your shot!</p>
          </div>
        </div>
      </section>
    </main>
  );
} 