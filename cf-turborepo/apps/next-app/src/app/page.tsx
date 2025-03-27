"use client";
import AboutUsSection from "./home/components/AboutUsSection";
import HeroSection from "./home/components/HeroSection";
import NavigationCards from "./home/components/NavigationCards";

export default function Home() {
  const handleClick = () => {
    alert("Button clicked!");
  };
  return (
    <div className="w-full h-full">
      <HeroSection />
      <NavigationCards />
      <AboutUsSection />
    </div>
  );
}
