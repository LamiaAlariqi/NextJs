"use client";

import React, { useState } from "react";

const FAQ_ITEMS = [
  {
    question: "What is AURA's shipping policy?",
    answer: "We offer free standard worldwide shipping on all orders over $150. Standard delivery typically takes 3–5 business days, while express shipping options are available at checkout and take 1–2 business days."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day hassle-free return window for all AURA products. Items must be returned in their original, unopened packaging with all accessories included. Return shipping is free for domestic orders."
  },
  {
    question: "Do AURA products come with a warranty?",
    answer: "Yes, all our hardware and lifestyle objects include a 2-year limited hardware warranty. This covers any manufacturing defects, hardware failures, or component malfunctions under normal usage conditions."
  },
  {
    question: "How can I track my package?",
    answer: "As soon as your order leaves our fulfillment center, you will receive a confirmation email containing a carrier tracking link. You can track its journey in real-time directly through the link."
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call for premium UI experience
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: ""
      });
    }, 1500);
  };

  const toggleFaq = (index) => {
    setActiveFaq((prev) => (prev === index ? null : index));
  };

  return (
    <main className="flex-1 bg-background text-foreground transition-colors duration-300 pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden py-24 px-6 border-b border-border/30">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[130px] -z-10 pointer-events-none animate-pulse" />
        
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6 animate-fade-in">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
            We’d Love To <br />
            <span className="gradient-text font-extrabold">Connect With You</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mt-2">
            Have questions about our premium minimalist tech? Our team is dedicated to providing you with exceptional customer support and guidance.
          </p>
        </div>
      </section>

      {/* Main Grid: Form & Info */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6 animate-fade-in">
            <div className="glass rounded-[2.5rem] border border-border/60 p-8 sm:p-12 relative overflow-hidden">
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-secondary/5 rounded-full blur-[50px] pointer-events-none" />
              
              <h2 className="text-2xl font-bold tracking-tight mb-2">Send us a Message</h2>
              <p className="text-xs text-muted-foreground mb-8">
                Fill out the form below and we will get back to you within 24 hours.
              </p>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Message Sent Successfully!</h3>
                  <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                    Thank you for reaching out. An AURA representative has received your request and will contact you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-xs border border-border bg-muted/30 text-foreground font-semibold px-6 py-2.5 rounded-full hover:bg-muted transition-colors tracking-wider"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* Name Input */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-name" className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Alex Carter"
                      className="w-full bg-muted/40 border border-border/70 rounded-2xl px-5 py-3.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50"
                      required
                    />
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-email" className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g., alex@example.com"
                      className="w-full bg-muted/40 border border-border/70 rounded-2xl px-5 py-3.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50"
                      required
                    />
                  </div>

                  {/* Subject Dropdown */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-subject" className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Subject
                    </label>
                    <div className="relative">
                      <select
                        id="contact-subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-muted/40 border border-border/70 rounded-2xl px-5 py-3.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Order Support">Order & Shipping Support</option>
                        <option value="Warranty / Returns">Warranty & Returns</option>
                        <option value="Partnerships">Partnerships & Press</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-message" className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      How can we help?
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      className="w-full bg-muted/40 border border-border/70 rounded-2xl px-5 py-3.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50 resize-none"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-full hover:opacity-95 transition-all text-xs tracking-widest mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        SENDING...
                      </>
                    ) : (
                      "SEND MESSAGE"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Info & Details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-8 animate-fade-in-delay-1">
            {/* Cards wrapper */}
            <div className="flex flex-col gap-6">
              {/* Card 1: Support */}
              <div className="group p-8 rounded-[2rem] border border-border/40 glass hover:border-primary/45 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold mb-2 text-foreground">Customer Support</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  For all orders, shipping details, and warranty inquiries.
                </p>
                <div className="flex flex-col gap-1.5">
                  <a href="mailto:support@aurashop.com" className="text-xs font-semibold text-primary hover:underline w-fit">
                    support@aurashop.com
                  </a>
                  <span className="text-[11px] text-muted-foreground">
                    Mon - Fri: 9:00 AM - 6:00 PM EST
                  </span>
                </div>
              </div>

              {/* Card 2: HQ Location */}
              <div className="group p-8 rounded-[2rem] border border-border/40 glass hover:border-secondary/45 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold mb-2 text-foreground">AURA Headquarters</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Our workspace, research center, and design labs.
                </p>
                <address className="text-xs font-semibold text-foreground not-italic">
                  AURA Labs Inc.<br />
                  452 Minimalist Way, Suite 100<br />
                  San Francisco, CA 94107
                </address>
              </div>

              {/* Card 3: Business/Press */}
              <div className="group p-8 rounded-[2rem] border border-border/40 glass hover:border-accent/45 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold mb-2 text-foreground">Partnerships & PR</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  For retail partnerships, media kit inquiries, and creator programs.
                </p>
                <a href="mailto:press@aurashop.com" className="text-xs font-semibold text-accent hover:underline w-fit">
                  press@aurashop.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto border-t border-border/30">
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase mb-2">
            Common Inquiries
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mt-4" />
        </div>

        <div className="flex flex-col gap-4">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border/40 glass overflow-hidden transition-all duration-350"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between text-foreground hover:bg-muted/30 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-semibold pr-4">
                    {faq.question}
                  </span>
                  <div className={`text-muted-foreground transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                <div
                  className={`transition-all duration-350 ease-in-out ${
                    isOpen ? "max-h-[200px] border-t border-border/20" : "max-h-0 pointer-events-none"
                  } overflow-hidden`}
                >
                  <p className="px-6 py-5 text-xs text-muted-foreground leading-relaxed bg-muted/10">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
