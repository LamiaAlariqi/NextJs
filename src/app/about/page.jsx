"use client";

import React from "react";
import Link from "next/link";

const CORE_VALUES = [
  {
    title: "Aesthetic Utility",
    description: "We believe technology should enhance your environment, not clutter it. Our products blend seamlessly into modern workspaces and home decors.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    )
  },
  {
    title: "Eco-Conscious Build",
    description: "Crafted using premium, sustainable materials. We prioritize CNC-milled recycled aluminum, natural concrete, and biodegradable packaging.",
    icon: (
      <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m14.071-3.071l-.707.707M6.343 17.657l-.707.707m2.828 0l-.707-.707m8.486-8.486l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    )
  },
  {
    title: "Acoustic Perfection",
    description: "Every audio element is tuned by experts for high-resolution acoustics, ensuring sound stages that are warm, realistic, and highly immersive.",
    icon: (
      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    )
  }
];

const TEAM_MEMBERS = [
  {
    name: "Marcus Sterling",
    role: "Founder & Creative Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Ex-designer at Teenage Engineering, dedicated to creating silent technology."
  },
  {
    name: "Elena Rostova",
    role: "Lead Acoustic Engineer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Over 12 years of designing high-end monitoring speakers and spatial sound engines."
  },
  {
    name: "Kaito Tanaka",
    role: "Director of Sustainability",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Focused on circular economies and sourcing carbon-neutral materials globally."
  }
];

export default function AboutPage() {
  return (
    <>
      <main className="flex-1 bg-background text-foreground transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 px-6 border-b border-border/30">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6 animate-fade-in">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full">
              Our Vision
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
              Designed For <br />
              <span className="gradient-text font-extrabold">Modern Living</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mt-2">
              At AURA, we build quiet, premium gadgets that integrate beautifully into your home and workspace. We don&apos;t build electronics that scream for attention — we create design objects that elevate your everyday routine.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-6 max-w-7xl mx-auto border-b border-border/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Image */}
            <div className="lg:col-span-6 animate-fade-in">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary rounded-[2.5rem] blur-[30px] opacity-15" />
                <div className="relative glass rounded-[2rem] overflow-hidden p-4 border border-border/80">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/about_workspace.png"
                    alt="AURA minimalist workspace"
                    className="w-full h-auto object-cover rounded-xl group-hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

            {/* Right Story */}
            <div className="lg:col-span-6 flex flex-col gap-6 items-start animate-fade-in-delay-1">
              <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                The Journey
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                How AURA Began
              </h2>
              <div className="w-12 h-1 bg-primary rounded-full mb-2" />
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Founded in 2024 by a small collective of designers and acoustic engineers, AURA set out to disrupt the bloated consumer electronics industry. We grew tired of cheap plastic cases, blinking blue LEDs, and hardware that became obsolete within a year.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We believe premium hardware should be built to last. Our design vocabulary is rooted in minimalism, Scandinavian functionalism, and Japanese craftsmanship. By utilizing durable materials like concrete, glass, and titanium, our items are meant to be displayed, not hidden.
              </p>
              <Link
                href="/home"
                className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity text-xs tracking-wider mt-4"
              >
                BROWSE OUR STUFF
              </Link>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-20 px-6 max-w-7xl mx-auto border-b border-border/30">
          <div className="flex flex-col items-center mb-16 text-center">
            <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase mb-2">
              Our Principles
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              What Guides Us
            </h2>
            <div className="w-12 h-1 bg-primary rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CORE_VALUES.map((val, idx) => (
              <div
                key={idx}
                className="group p-8 rounded-[2rem] border border-border/40 glass hover:border-primary/40 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {val.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">{val.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-6 max-w-7xl mx-auto border-b border-border/30">
          <div className="flex flex-col items-center mb-16 text-center">
            <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase mb-2">
              The Collective
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Meet The Founders
            </h2>
            <div className="w-12 h-1 bg-primary rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member, idx) => (
              <div
                key={idx}
                className="group relative rounded-[2rem] border border-border/40 glass p-5 hover:border-primary/40 transition-colors duration-300"
              >
                {/* Profile Photo */}
                <div className="h-64 rounded-xl overflow-hidden mb-5 bg-muted/30 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white text-xs leading-relaxed">{member.bio}</p>
                  </div>
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-base font-semibold text-foreground">{member.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 px-6 max-w-5xl mx-auto text-center">
          <div className="glass rounded-[2.5rem] border border-border/60 p-12 lg:p-16 relative overflow-hidden flex flex-col items-center gap-6">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-secondary/10 rounded-full blur-[60px]" />
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-primary/15 rounded-full blur-[60px]" />

            <span className="text-xs font-semibold tracking-[0.25em] text-muted-foreground uppercase">
              Join Our Journey
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              Ready to Transform <br />Your Workspace?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mt-2 leading-relaxed">
              Browse our catalog of premium minimalist items and experience the art of quiet technology.
            </p>
            <Link
              href="/home"
              className="bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity text-xs tracking-wider mt-4"
            >
              SHOP NEW ARRIVALS
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
