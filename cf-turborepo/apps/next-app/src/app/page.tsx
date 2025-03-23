"use client";
import Image from "next/image";
import Button from "./components/buttons/Button";
import Card from "./components/cards/Card";
export default function Home() {
  const handleClick = () => {
    alert("Button clicked!");
  };
  return (
    <Card
    imageUrl="https://images.unsplash.com/photo-1561525140-c2a4cc68e4bd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    title="Cardafdhfgjhjjgkukyhkujjkvfjlh"
    description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. gggghfghfgQuisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur"
    tags={["Tag 1", "Tag 2", "Tag 3"]}
    onClick={handleClick}
  />
  );
}
