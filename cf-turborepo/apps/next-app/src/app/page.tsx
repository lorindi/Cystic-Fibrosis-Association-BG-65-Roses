"use client";
import AboutUsSection from "./home/components/AboutUsSection";
import HeroSection from "./home/components/HeroSection";
import NavigationCards from "./home/components/NavigationCards";
import ContributeSection from "./home/components/ContributeSection";
import NewsSection from "./home/components/NewsSection";

export default function Home() {
  const handleClick = () => {
    alert("Button clicked!");
  };
  return (
    <div className="w-full h-full">
      <HeroSection />
      <NavigationCards />
      <AboutUsSection />
      <ContributeSection />
      <NewsSection />
    </div>
  );
}
