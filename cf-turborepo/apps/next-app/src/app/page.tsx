"use client";
import HeroSection from "./home/components/HeroSection";

export default function Home() {
  const handleClick = () => {
    alert("Button clicked!");
  };
  return (
    <div className="w-full h-full">
      <HeroSection />

    </div>
  );
}
