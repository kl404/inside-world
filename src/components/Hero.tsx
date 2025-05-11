import React from "react";
import Button from "./Button";
import { Link } from "react-router-dom";
import CallToAction from "./CallToAction";
import Elf from "./Elf";

export default function Hero() {
  return (
    <div className="py-4 md:py-10 flex flex-col gap-16 sm:gap-24">
      <h1 className="text-5xl sm:text-6xl md:text-7xl text-center zcool-font">
        <span className="textGradient">Mood</span> helps you track your{" "}
        <span className="textGradient">daily</span> mood!
      </h1>

      <div className="flex justify-center gap-4">
        <Elf />
        <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl text-center w-full mx-auto max-w-[600px] mb-16 pt-4">
  Build your emotional history and see your inner world change{" "}
  <span className="font-semibold">day by day, all year long.</span>
</h2>
          <CallToAction />
        </div>
      </div>
    </div>
  );
}
