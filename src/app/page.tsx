"use client";

import { motion } from "framer-motion";
import { JoinNowButton } from "@/components/JoinNowButton";
import { Dumbbell, Users, Clock, ListCheck, Smile, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full px-6 md:px-24 py-20 md:py-40 font-montserrat">
        <div className="absolute inset-0 bg-[url('/assets/hero-image-compressed.webp')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />

        <div className="relative max-w-4xl mx-auto text-center md:text-left text-white space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-bold text-4xl md:text-6xl lg:text-7xl leading-tight"
          >
            Get Stronger <br /> Feel Better
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl font-light"
          >
            Your journey starts here. Top equipment, expert trainers, <br />
            and a community that pushes you further.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="inline-block"
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,255,255,0.6)' }}
          >
            <JoinNowButton className="mx-auto md:mx-0 px-[30px] py-[15px] font-bold rounded-[5px]" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-brand-fill py-20 font-montserrat">
        <div className="max-w-6xl mx-auto text-center space-y-16 text-black">
          <h2 className="text-4xl md:text-5xl font-bold">Why Choose Palestra?</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center space-y-4 hover:shadow-xl transition"
                >
                  <Icon className="w-12 h-12 text-black" />
                  <h3 className="text-xl font-semibold">{f.title}</h3>
                  <p className="text-gray-700">{f.content}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12"
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}
            transition={{ duration: 0.3, yoyo: Infinity }}
          >
            <h3 className="text-2xl md:text-3xl font-semibold">What are you waiting for?</h3>
            <JoinNowButton className="px-[30px] py-[15px] font-bold rounded-[5px]" />
          </motion.div>
        </div>
      </section>
    </>
  );
}

const features = [
  { icon: Dumbbell, title: "Modern Equipment", content: "Train with the best gear for strength, endurance, and flexibility" },
  { icon: Star, title: "Expert Trainers", content: "Get personalized guidance from certified professionals" },
  { icon: Users, title: "Motivating Community", content: "Surround yourself with like-minded people who push you to be your best" },
  { icon: Clock, title: "24/7 Access", content: "Workout on your schedule, anytime, day or night" },
  { icon: ListCheck, title: "Training Programs", content: "Structured plans that help you stay consistent and progress" },
  { icon: Smile, title: "A Space for Everyone", content: "Whether you're a beginner or a pro, you'll feel at home here" },
];
