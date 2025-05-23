"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

// Данни за слайдера
const slides = [
  {
    id: 1,
    title: "Support, information and hope for",
    titleHighlight: "people with cystic fibrosis",
    subtitle: "See the latest news, stories and products to help those living with cystic fibrosis.",
    image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=1920",
    ctaText: "See current news"
  },
  {
    id: 2,
    title: "Creating a better future for",
    titleHighlight: "everyone affected by CF",
    subtitle: "Join our mission to support families and improve lives of people with cystic fibrosis.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1920",
    ctaText: "Support our cause"
  },
  {
    id: 3,
    title: "Professional care and support for",
    titleHighlight: "families dealing with CF",
    subtitle: "Access resources, connect with specialists, and find the support you need.",
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&q=80&w=1920",
    ctaText: "Find support"
  }
];

export default function CampaignHero() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startSlideshow = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000);
    }
  }, [isPaused]);

  useEffect(() => {
    startSlideshow();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startSlideshow]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/campaigns/all?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [searchQuery, router]);

  const handleSearchFocus = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleSearchBlur = useCallback(() => {
    setIsPaused(false);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    startSlideshow();
  }, [startSlideshow]);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    startSlideshow();
  }, [startSlideshow]);

  const handleSlideClick = useCallback((index: number) => {
    setCurrentSlide(index);
    startSlideshow();
  }, [startSlideshow]);

  return (
    <div className="relative mb-20">
      <div className="rounded-xl overflow-hidden shadow-2xl">
        {/* Карусел слайдър */}
        <div className="relative w-full h-[600px]">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-white/98 via-white/80 to-transparent z-10" />
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover brightness-95"
                  priority={index === 0}
                  sizes="100vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://picsum.photos/1920/1080?random=${index}`;
                  }}
                />
                <div className="absolute inset-0 z-20 flex items-center px-4 sm:px-8 md:px-16">
                  <div className="max-w-2xl">
                    <h1 className="text-left text-3xl md:text-4xl lg:text-5xl font-medium mb-4">
                      <span className="text-slate-900">{slide.title}</span>
                      <br />
                      <span className="text-slate-900">
                        {slide.titleHighlight}
                      </span>
                    </h1>
                    <p className="text-left text-base md:text-lg text-slate-600 mb-6 font-normal">
                      {slide.subtitle}
                    </p>

                    <div className="flex items-center gap-4">
                      <Link 
                        href="/campaigns/all" 
                        className="inline-block px-8 py-3 bg-[#26baa4] text-white rounded-md hover:bg-[#26baa4]/90 transition-all duration-300 text-base font-medium"
                      >
                        {slide.ctaText}
                      </Link>

                      {/* Търсачка */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search campaigns..."
                          className="w-[200px] pl-10 pr-4 py-3 border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:border-[#26baa4] transition-colors"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                          onFocus={handleSearchFocus}
                          onBlur={handleSearchBlur}
                          suppressHydrationWarning
                        />
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Навигационни бутони */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/30 shadow-md flex items-center justify-center hover:bg-gray-50 transition-all duration-300"
            aria-label="Предишен слайд"
            suppressHydrationWarning
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/30 shadow-md flex items-center justify-center hover:bg-gray-50 transition-all duration-300"
            aria-label="Следващ слайд"
            suppressHydrationWarning
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Индикатори */}
          <div className="absolute right-8 bottom-8 z-30 flex flex-col gap-2">
            {slides.map((_, index) => (
              <button 
                key={`slide-indicator-${index}`}
                onClick={() => handleSlideClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-[#26baa4]' : 'bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Към слайд ${index + 1}`}
                suppressHydrationWarning
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
