"use client";
import AboutUsSection from "@/components/home/AboutUsSection";
import HeroSection from "@/components/home/HeroSection";
import NavigationCards from "@/components/home/NavigationCards";
import ContributeSection from "@/components/home/ContributeSection";
import NewsSection from "@/components/home/NewsSection";
import PatientStoriesSection from "@/components/home/PatientStoriesSection";
export default function Home() {
  const handleClick = () => {
    alert("Button clicked!");
  };
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <HeroSection />
      <NavigationCards />
      <AboutUsSection />
      <ContributeSection />
      <NewsSection />
      <PatientStoriesSection />
    </div>
  );
}
