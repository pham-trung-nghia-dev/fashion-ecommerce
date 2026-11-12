"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { getBanners } from "@/src/lib/api"

const defaultSlides = [
  { id: 1, image: "/hero-slide-1.png" },
  { id: 2, image: "/hero-slide-2.png" },
  { id: 3, image: "/hero-slide-3.png" },
]

type HeroSectionProps = {
  slides?: { id: number; image: string }[]
}

const HeroSection = ({ slides: propSlides }: HeroSectionProps) => {
  const [slides, setSlides] = useState<{ id: number; image: string }[]>(
    propSlides && propSlides.length > 0 ? propSlides : defaultSlides,
  )
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    // Fetch banner qua hàm API tập trung
    const fetchBanners = async () => {
      try {
        const data = await getBanners()
        if (data && data.length > 0) {
          setSlides(data)
        }
      } catch {
        // Giữ slides mặc định
      }
    }

    fetchBanners()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative w-full border-b bg-black">
      <div className="relative h-[60vh] w-full min-h-[320px] overflow-hidden md:h-[75vh] lg:h-screen">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt="Hero banner"
              fill
              priority={index === 0}
              className="object-cover object-center"
              unoptimized
              sizes="100vw"
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrent(index)}
              className={`h-2 w-2 rounded-full border border-white/80 transition ${
                index === current ? "bg-violet-500" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
