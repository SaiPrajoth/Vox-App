'use client'
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle, Zap, ChevronRight, Quote } from "lucide-react";
import messages from "@/messages.json";
import useEmblaCarousel from "embla-carousel-react";
import AutoplayPlugin from "embla-carousel-autoplay";

function App() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    AutoplayPlugin({ delay: 4000, stopOnInteraction: true })
  ]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 relative">
        {/* Noise texture overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] opacity-50" />

        {/* Header Content */}
        <div className="text-center mb-24 relative z-10">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <MessageCircle className="w-16 h-16 text-white" strokeWidth={1.5} />
              <Zap className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          <h1 className="font-display text-6xl md:text-7xl font-bold tracking-tight mb-4">
            Anonymous
            <span className="block mt-2">
              Conversations
              <span className="text-yellow-400">.</span>
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-400 font-medium tracking-wide">
            Share your thoughts in a safe, private space
          </p>
        </div>

        {/* Centered Carousel */}
        <div className="flex justify-center w-full relative z-10 -mt-12">
          <div className="w-full max-w-md">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {messages.map((message, index) => (
                  <div className="flex-[0_0_100%] min-w-0 pl-4 first:pl-0" key={index}>
                    <Card className="relative overflow-hidden bg-zinc-900/70 backdrop-blur-sm border-[1px] border-zinc-800 shadow-[0_0_15px_-5px_rgba(0,0,0,0.5)] rounded-lg transition-all duration-300 hover:border-yellow-400/40 group">
                      {/* Card Header */}
                      <CardHeader className="relative text-center py-6">
                        <span className="font-display text-3xl font-bold text-white inline-block group-hover:text-yellow-400 transition-colors">
                          {message.title}
                        </span>
                      </CardHeader>

                      {/* Card Content */}
                      <CardContent className="relative p-6 flex flex-col items-center justify-center text-center">
                        <span className="text-gray-300 leading-relaxed font-medium text-lg">
                          {message.content}
                        </span>

                        {/* Decorative Accent */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                      </CardContent>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center p-6 text-gray-500 relative z-10 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto text-sm font-medium tracking-wide">
          &copy; 2024 Anonymous Conversations<span className="text-yellow-400">.</span> All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
