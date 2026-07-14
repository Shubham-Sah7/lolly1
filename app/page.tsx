"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView, useScroll } from "framer-motion"
import { useTheme } from "next-themes"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  Copy,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Sparkles,
  BarChart3,
  Globe,
  Shield,
  Activity,
  Layers,
  Database,
  Users,
  PieChart,
  Bot
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Shared entrance variants - Apple-style ease-out curve, used across every section
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
}
const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
}
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const cardHover = {
  whileHover: { y: -6, transition: { type: "spring" as const, stiffness: 300, damping: 20 } },
  whileTap: { scale: 0.99 },
}

// Cursor-follow "magnetic" wrapper for primary CTAs - classic Apple/agency-site micro-interaction, GSAP-driven
function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" })
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" })

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      xTo((e.clientX - (rect.left + rect.width / 2)) * strength)
      yTo((e.clientY - (rect.top + rect.height / 2)) * strength)
    }
    const handleLeave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener("mousemove", handleMove)
    el.addEventListener("mouseleave", handleLeave)
    return () => {
      el.removeEventListener("mousemove", handleMove)
      el.removeEventListener("mouseleave", handleLeave)
    }
  }, [strength])

  return (
    <div ref={ref} className="inline-block will-change-transform">
      {children}
    </div>
  )
}

// GSAP count-up for the stat numbers - keeps any prefix/suffix text intact, fires once on scroll into view
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const match = value.match(/^([\d.]+)(.*)$/)
  const target = match ? parseFloat(match[1]) : 0
  const suffix = match ? match[2] : value
  const isDecimal = value.includes(".")

  useEffect(() => {
    if (!inView) return
    const obj = { val: 0 }
    const tween = gsap.to(obj, {
      val: target,
      duration: 1.4,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = (isDecimal ? obj.val.toFixed(1) : Math.round(obj.val)) + suffix
        }
      },
    })
    return () => {
      tween.kill()
    }
  }, [inView, target, suffix, isDecimal])

  return <span ref={ref}>0{suffix}</span>
}

export default function Page() {
  // Theme is owned by next-themes (see components/theme-provider.tsx) -
  // it already handles the "d" hotkey and applying the "dark" class,
  // so this only needs to read/set it, not duplicate that logic.
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const darkMode = mounted && resolvedTheme === "dark"

  // Interactive search query in Discovery Section
  const [searchQuery, setSearchQuery] = useState("loyalty programme mentions US")

  // Interactive state for Quick API / Alerts list
  const [activeAlertItem, setActiveAlertItem] = useState<number | null>(null)

  // AI Assistant Chatbot mockup tab
  const [activeAnaTab, setActiveAnaTab] = useState<string>("Latest campaign")

  // Copy success indicator
  const [copiedText, setCopiedText] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(true)
    setTimeout(() => setCopiedText(false), 2000)
  }

  // Page-wide scroll progress bar
  const { scrollYProgress } = useScroll()

  // Hero parallax: mockup panel drifts at a different rate than the page as you scroll past it
  const heroSectionRef = useRef<HTMLElement>(null)
  const heroMockupRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!heroSectionRef.current || !heroMockupRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(heroMockupRef.current, {
        y: 70,
        ease: "none",
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  // Simulated social listening feeds
  const loyaltyMentions = [
    { username: "@amy_travels", text: "Loving the new Lolly loyalty programme rewards!", sentiment: "Positive", platform: "Instagram", match: "High influence" },
    { username: "@saver_sam", text: "Points system is slightly confusing but values are great.", sentiment: "Neutral", platform: "TikTok", match: "Emerging thread" },
    { username: "@discount_deals", text: "Unbelievable discounts with the new Lolly program.", sentiment: "Positive", platform: "X", match: "Viral spike" }
  ]

  const competitorMentions = [
    { username: "@brand_watch", text: "Competitor X just launched a new loyalty scheme today.", sentiment: "Neutral", platform: "LinkedIn", match: "Competitor alert" },
    { username: "@insider_tech", text: "Lolly's sentiment tracking beats Competitor Y.", sentiment: "Positive", platform: "Blogs", match: "Industry review" }
  ]

  const activeFeeds = searchQuery.toLowerCase().includes("loyalty") ? loyaltyMentions : competitorMentions

  // Ana chatbot responses map
  const anaReplies: Record<string, string> = {
    "Latest campaign": "Mostly positive. Launch mentions are up sharply this week, with praise for the creative concentrated on Instagram and TikTok. A small cluster of shipping questions on Reddit is worth a look.",
    "Sentiment change": "Overall positive sentiment increased by 12% following the campaign launch. Negative mentions decreased by 4% as customer support handled queries quickly.",
    "Competitor attention": "Competitor X mentions went up 8% this week, mostly discussing their new features. However, Lolly's share of voice remains dominant at 64% in positive sentiment categories.",
    "Today's summary": "A total of 12,400 conversations were analyzed today. Key emerging themes: interest in the loyalty program, positive product speed reviews, and mild pricing discussions.",
    "Trends to watch": "Discussions around custom integrations are emerging among developers, and mid-sized creators are driving brand advocacy on TikTok.",
    "Needs attention": "There is a minor discussion thread on a tech forum regarding API rate limits. Our developer relations team is already responding.",
    "Top topics": "1. Reward Program (45% of mentions), 2. Platform Speed (30%), 3. Analytics Accuracy (15%)."
  }

  return (
    <div className="min-h-screen font-sans antialiased transition-colors duration-300 bg-[#fbfaf7] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">

      {/* Scroll progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#6b4bf2] to-[#aa9ef4] origin-left z-[100]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* 1. Announcement Banner */}
      <motion.div
        className="w-full bg-[#0b0c10] text-white text-xs py-2.5 px-4 text-center font-medium border-b border-zinc-800"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span>Now live — real-time <span className="text-[#f87171] font-semibold">Spike detection</span> for social mentions. </span>
        <a href="#quick-api" className="underline hover:text-indigo-300 transition-colors ml-1 inline-flex items-center gap-0.5">
          Learn more →
        </a>
      </motion.div>

      {/* 2. Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#fbfaf7]/90 dark:bg-zinc-950/90 border-b border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.03 }}>
            <span className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white flex items-center">
              lolly
              <motion.span
                className="w-2.5 h-2.5 rounded-full bg-[#6b4bf2] ml-1"
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              />
            </span>
          </motion.div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-700 dark:text-zinc-300">
            {[
              { href: "#platform", label: "Platform" },
              { href: "#ana", label: "AI Assistant" },
              { href: "#teams", label: "Teams" },
              { href: "#channels", label: "Channels" },
              { href: "#resources", label: "Resources" },
              { href: "#faq", label: "FAQ" },
            ].map((link) => (
              <a key={link.href} href={link.href} className="relative group py-1">
                <span className="group-hover:text-[#6b4bf2] transition-colors">{link.label}</span>
                <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-0 bg-[#6b4bf2] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => setTheme(darkMode ? "light" : "dark")}
              className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white text-xs border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors font-bold"
              title="Toggle Dark Mode (Shortcut: D)"
              suppressHydrationWarning
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mounted ? (darkMode ? "☀️ Light" : "🌙 Dark") : "🌙 Dark"}
            </motion.button>
            <Button variant="ghost" className="text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-[#6b4bf2] hover:bg-transparent">
              Book a Demo
            </Button>
            <Magnetic strength={0.25}>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button className="bg-[#6b4bf2] hover:bg-[#5636dd] text-white rounded-lg px-4 py-2 text-xs font-bold shadow-sm transition-colors">
                  Start Free Trial
                </Button>
              </motion.div>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section ref={heroSectionRef} className="relative pt-20 pb-16 px-6 overflow-hidden">
        <motion.div
          className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Hero Content Left */}
          <div className="flex-1 text-left space-y-8 max-w-2xl">
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8e4fd] dark:bg-indigo-950/40 border border-[#cfc4fc]/40 text-[#6b4bf2] dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#6b4bf2]"></span>
              Social Listening ✦
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-7xl font-black text-zinc-950 dark:text-white leading-[1.05] tracking-tighter font-sans"
            >
              AI-Powered <br />
              Social Listening for <span className="text-[#6b4bf2] relative inline-block">Smarter Decisions<span className="absolute bottom-1.5 left-0 w-full h-[8px] bg-[#e7fca7] dark:bg-emerald-500/20 -z-10 rounded"></span></span>
            </motion.h1>

            {/* Subheading */}
            <motion.p variants={fadeUp} className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
              Monitor your brand, competitors, and customer conversations in real time to uncover insights that help your business stay ahead.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-row items-center gap-4">
              <Magnetic>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Button className="bg-[#6b4bf2] hover:bg-[#5636dd] text-white rounded-lg px-6 py-4 text-sm font-bold shadow-sm transition-all">
                    Start Free Trial
                  </Button>
                </motion.div>
              </Magnetic>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg px-6 py-4 text-sm font-bold shadow-sm transition-all">
                  Book a Demo
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Hero Mockup Right (Premium Visual Layout representing mentions, spike detection) - scroll parallax via GSAP */}
          <motion.div variants={fadeUp} className="flex-1 w-full max-w-xl">
            <div
              ref={heroMockupRef}
              className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg space-y-6 will-change-transform"
            >
              {/* Header row */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-black text-zinc-400 tracking-wider">Lolly Listening Panel //</span>
                <span className="bg-[#eef9df] text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Live Feed
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Spike Detection Widget */}
                <motion.div
                  className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-4 rounded-2xl relative overflow-hidden"
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                >
                  <span className="text-[9px] uppercase font-black text-rose-500 block mb-1">Spike detection ✦</span>
                  <span className="text-2xl font-black text-rose-900 dark:text-rose-300">381k+</span>
                  <span className="text-rose-600 text-[10px] font-bold ml-1">162% ↑</span>
                  <p className="text-[10px] text-zinc-400 mt-1">Mentions · &quot;summer launch&quot;</p>
                </motion.div>

                {/* Sentiment Card */}
                <motion.div
                  className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-2xl flex flex-col justify-between"
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                >
                  <div>
                    <span className="text-[9px] uppercase font-black text-emerald-600 block mb-1">Sentiment ✦</span>
                    <span className="text-2xl font-black text-emerald-900 dark:text-emerald-300">86%</span>
                    <span className="text-emerald-500 text-[10px] font-bold ml-1">positive</span>
                  </div>
                  {/* Horizontal split */}
                  <div className="flex gap-1.5 text-[8.5px] font-black mt-2 pt-2 border-t border-emerald-100/50">
                    <span className="text-emerald-600">86% pos</span>
                    <span className="text-zinc-400">9% neu</span>
                    <span className="text-red-400">5% neg</span>
                  </div>
                </motion.div>
              </div>

              {/* Mentions Trend & AI Insights */}
              <div className="p-4 bg-[#f7f6f0] dark:bg-zinc-950 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/40 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-zinc-800 dark:text-white uppercase tracking-wider">Mentions trend</span>
                  <span className="text-[10px] font-bold text-zinc-400">12.4k today</span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-black text-[#6b4bf2] dark:text-indigo-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Insight
                  </span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                    Emerging: interest in your <span className="bg-[#e7fca7] dark:bg-emerald-950/60 px-1 rounded font-bold">loyalty programme</span> is accelerating — mentions up <span className="text-[#6b4bf2] font-bold">3× this week</span>, led by two mid-size creators.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* 4. Logo Cloud */}
      <motion.section
        className="px-6 py-8 border-y border-zinc-300/50 dark:border-zinc-800/50 bg-[#aa9ef4] dark:bg-[#2a2360]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Rating */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-[#1a0f3d] dark:text-white/80 text-[10px] font-bold tracking-widest uppercase">
              Trusted by Marketing Teams and Businesses //
            </span>
            <div className="flex items-center gap-2">
              <span className="bg-[#0b0c10] text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">G2</span>
              <span className="text-[#1a0f3d] dark:text-white font-black text-xs">4.8 / 5</span>
              <div className="flex text-amber-500 text-xs">
                {"★".repeat(5)}
              </div>
              <span className="text-[#1a0f3d]/80 dark:text-white/60 text-[10px] font-bold">on G2</span>
            </div>
          </div>

          {/* Logos grid */}
          <motion.div
            className="grid grid-cols-3 md:flex md:items-center md:gap-10 gap-8 font-black uppercase tracking-widest text-[11px] text-[#1a0f3d] dark:text-white"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {["Spotify", "Nike", "Airbnb", "Netflix", "Duolingo", "Gymshark", "Revolut"].map((brand) => (
              <motion.span key={brand} variants={fadeUp} whileHover={{ y: -3, scale: 1.06 }} className="cursor-default">
                {brand}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 5. The Problem Section ("See Beyond the Mentions" Grid) */}
      <section className="py-24 px-6 max-w-7xl mx-auto" id="platform">
        <motion.div
          className="max-w-4xl mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <span className="text-xs font-black text-[#6b4bf2] uppercase tracking-widest block mb-2">The problem //</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-950 dark:text-white mb-3">
            See <span className="text-[#6b4bf2]">Beyond</span> the Mentions
          </h2>
          <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-3xl leading-relaxed">
            Every conversation tells a story. Lolly goes beyond collecting mentions to uncover the insights behind every conversation. Understand what customers think, why trends are emerging, how competitors are performing, and where new opportunities exist.
          </p>
        </motion.div>

        {/* 3-column Grid matching reference layout */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Card 1: Wording description */}
          <motion.div
            variants={fadeUp}
            whileHover={cardHover.whileHover}
            className="bg-[#e7fca7] dark:bg-[#1a2510] text-[#2c3e10] dark:text-[#d4ed9a] rounded-3xl p-8 flex flex-col justify-between border border-[#cbe5a2]/30 min-h-[340px]"
          >
            <div>
              <span className="text-[9px] uppercase tracking-widest font-black opacity-60 block mb-2">[ SIGNAL ANALYSIS ]</span>
              <h3 className="text-2xl font-black tracking-tight mb-4 leading-tight">Understand What They Mean</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                Don&apos;t just monitor conversations. Uncover <span className="underline decoration-[#2c3e10] dark:decoration-[#d4ed9a] font-bold">sentiment shifts</span>, reputation threats, and competitive moves in real time before they impact your growth.
              </p>
            </div>
            <div className="mt-8 flex justify-end">
              <span className="text-xs font-mono opacity-50">listening index //</span>
            </div>
          </motion.div>

          {/* Card 2: Interactive Grid indicators (Trend, Sentiment, Risk) */}
          <div className="flex flex-col gap-6">
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="bg-[#eae7e0] dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/40 dark:border-zinc-800/40 flex flex-col justify-center min-h-[168px] relative overflow-hidden"
            >
              <motion.div
                className="space-y-2"
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <motion.div variants={fadeUp} className="flex items-center gap-2.5 text-xs font-black text-[#6b4bf2] bg-white dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 w-full max-w-[210px] shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6b4bf2] animate-ping shrink-0"></span>
                  Trend emerging
                </motion.div>
                <motion.div variants={fadeUp} className="flex items-center gap-2.5 text-xs font-black text-emerald-600 bg-white dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 w-full max-w-[210px] shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                  Sentiment shift
                </motion.div>
                <motion.div variants={fadeUp} className="flex items-center gap-2.5 text-xs font-black text-rose-600 bg-white dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 w-full max-w-[210px] shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                  Reputation risk
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Card 3: Covers details */}
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="bg-[#bdf3df] dark:bg-[#0f2420] text-[#0f443b] dark:text-[#aeeec4] rounded-3xl p-8 flex flex-col justify-between border border-[#aae0cc]/30 min-h-[168px]"
            >
              <div>
                <h3 className="text-lg font-black tracking-tight mb-2">Signal Detection</h3>
                <p className="text-xs opacity-90 leading-relaxed font-medium">
                  Signal: <span className="text-[#6b4bf2] dark:text-indigo-400 font-black">3 conversations</span> matter right now — out of 12,400 monitored today. Protect your reputation proactively.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Card 4: AI powered search explanation & Creator discovery */}
          <div className="flex flex-col gap-6">
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="bg-[#b5a7fa] dark:bg-[#1a133d] text-[#1c0f4c] dark:text-[#d3cbfe] rounded-3xl p-8 flex flex-col justify-between border border-[#a597e7]/30 min-h-[168px]"
            >
              <div>
                <h3 className="text-lg font-black tracking-tight mb-2">Omnichannel Coverage</h3>
                <p className="text-xs opacity-90 leading-relaxed font-medium">
                  <span className="text-[#6b4bf2] dark:text-indigo-300 font-black">14 channel types</span> covered globally. Identify influential creators, journalists, experts, and brand advocates instantly.
                </p>
              </div>
            </motion.div>

            {/* Creator discovery visual card */}
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="bg-[#eae7e0] dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/40 dark:border-zinc-800/40 flex items-center justify-center min-h-[168px] relative overflow-hidden"
            >
              <div className="bg-white dark:bg-zinc-950 rounded-2xl p-4 shadow-md border border-zinc-200/50 dark:border-zinc-800/50 w-full max-w-[260px]">

                {/* Profile row */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="/alex_rivers.png"
                    alt="Alex Rivers"
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1">
                      Alex Rivers
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white text-[8px] font-bold flex items-center justify-center">✓</span>
                    </h4>
                    <span className="text-[10px] text-zinc-400">@alexrivers • Brand Advocate</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                  <div className="bg-zinc-50 dark:bg-zinc-900/60 p-1.5 rounded-lg border border-zinc-100 dark:border-zinc-800/40">
                    <span className="text-[9px] text-zinc-400 block">followers</span>
                    <span className="text-xs font-bold text-zinc-800 dark:text-white">12.4M</span>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900/60 p-1.5 rounded-lg border border-zinc-100 dark:border-zinc-800/40">
                    <span className="text-[9px] text-zinc-400 block">engagement</span>
                    <span className="text-xs font-bold text-zinc-800 dark:text-white">8.2%</span>
                  </div>
                </div>

                {/* Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-[#6b4bf2] hover:bg-[#5636dd] text-white text-[10px] py-1.5 rounded-lg font-bold transition-colors relative"
                >
                  View profile
                </motion.button>

                {/* Overlaid cursor arrow */}
                <motion.div
                  className="absolute right-4 bottom-2 pointer-events-none translate-x-2 translate-y-2"
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                >
                  <svg className="w-6 h-6 fill-zinc-950 stroke-white stroke-2" viewBox="0 0 24 24">
                    <path d="M4.5 3v15.2l4-4 3.5 8 2.5-1.1-3.5-8 5.3-.2L4.5 3z" />
                  </svg>
                </motion.div>

              </div>
            </motion.div>
          </div>

        </motion.div>

        {/* Global Stats bar below problem grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-3xl bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 text-center"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
        >
          {[
            { metric: "50M+", text: "mentions monitored monthly" },
            { metric: "14", text: "channel types covered" },
            { metric: "500+", text: "brands & agencies onboard" },
            { metric: "4.8 / 5", text: "rated on G2" },
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeUp}>
              <span className="text-3xl font-black text-[#6b4bf2] block mb-1">
                <CountUp value={stat.metric} />
              </span>
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">{stat.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 6. Emerging Trends Section */}
      <section className="py-24 px-6 bg-[#f7f6f0] dark:bg-zinc-900/30 transition-colors border-y border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8e4fd] dark:bg-indigo-950/40 border border-[#cfc4fc]/40 text-[#6b4bf2] dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider mb-6">
              Emerging trends //
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-950 dark:text-white mb-6 leading-tight">
              Markets Change <span className="text-[#6b4bf2]">Quickly.</span> <br />
              Stay One Step Ahead.
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
              Identify emerging conversations before they become trends, discover changing customer interests, monitor industry discussions, and uncover opportunities before your competitors.
            </p>

            {/* Checklist details with bold terms */}
            <motion.div
              className="space-y-3.5 mb-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {[
                ["Identify emerging conversations", " before they become trends"],
                ["Discover changing", " customer interests"],
                ["Monitor", " industry discussions"],
                ["Uncover opportunities", " before your competitors"]
              ].map((item, idx) => (
                <motion.div key={idx} variants={fadeUp} className="flex items-center gap-2.5">
                  <span className="bg-emerald-100 dark:bg-emerald-950/40 p-0.5 rounded-full text-emerald-600 border border-emerald-200 dark:border-emerald-800 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <strong className="text-zinc-900 dark:text-white font-bold">{item[0]}</strong>{item[1]}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Button className="bg-[#6b4bf2] hover:bg-[#5636dd] text-white rounded-lg px-5 py-3 text-xs font-bold shadow-sm transition-colors">
                Learn more →
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Dashboard Mockup Column */}
          <motion.div
            className="bg-white dark:bg-zinc-950 rounded-3xl p-6 shadow-xl border border-zinc-200/60 dark:border-zinc-800/60 relative overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            {/* Header Tabs */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-6">
              <span className="text-xs font-black text-zinc-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                <Globe className="w-4 h-4 text-[#6b4bf2]" /> Social Intelligence
              </span>
              <span className="bg-[#e8e4fd] dark:bg-indigo-950 text-[#6b4bf2] dark:text-indigo-400 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                Global monitor
              </span>
            </div>

            {/* Simulated Search bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-[#6b4bf2] transition-all font-mono font-bold"
              />
            </div>

            {/* Results Grid */}
            <div className="space-y-3 mb-6">
              <AnimatePresence mode="popLayout">
                {activeFeeds.map((feed) => (
                  <motion.div
                    key={feed.username}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-colors border border-zinc-200/40 dark:border-zinc-800/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#6b4bf2] font-bold flex items-center justify-center text-xs">
                        {feed.platform[0]}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-800 dark:text-white">{feed.username}</h4>
                        <span className="text-[10px] text-zinc-400 block max-w-xs truncate">{feed.text}</span>
                      </div>
                    </div>
                    <span className="bg-[#eef9df] dark:bg-emerald-950/40 text-[#2c3e10] dark:text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {feed.match}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Search prompt */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
              <div className="flex items-center gap-1.5 mb-3 text-[10px] uppercase font-black text-zinc-400 tracking-wider">
                <Bot className="w-3.5 h-3.5 text-[#6b4bf2]" /> AI Assistant query ✦
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value="What is the overall sentiment of the loyalty programme?"
                  readOnly
                  className="flex-1 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-400 font-medium"
                />
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => alert(`Analyzing loyalty program sentiment`)}
                  className="bg-[#6b4bf2] hover:bg-[#5636dd] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
                >
                  Analyze
                </motion.button>
              </div>
            </div>

          </motion.div>

        </div>
      </section>

      {/* 7. Quick API. Real-time Social Signals Section */}
      <section id="quick-api" className="py-24 px-6 bg-[#dcd4fd] dark:bg-indigo-950/20 border-y border-zinc-300/30 dark:border-zinc-800/30">
        <div className="max-w-7xl mx-auto">
          {/* Headline */}
          <motion.div
            className="mb-12"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
              <span className="text-[#6b4bf2]">Quick API.</span> <span className="text-zinc-950 dark:text-white">Real-time social signals.</span>
            </h2>
          </motion.div>

          {/* Three cards layout */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Card 1: Query live */}
            <motion.div
              variants={fadeUp}
              whileHover={cardHover.whileHover}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col justify-between"
            >
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Query live, unfiltered data straight from the social listening pipeline.
              </p>

              {/* Code Box */}
              <div className="bg-[#181820] text-zinc-300 font-mono text-xs p-5 rounded-2xl overflow-x-auto leading-relaxed border border-zinc-800 relative">
                <div className="text-[#a3e635] font-bold mb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  GET /raw/feed/mentions
                </div>
                <pre>
{`{
  "monitored_conversations": 12400,
  "flagged_sentiment_shift": true,
  "spike_detection": "Summer Launch",
  "active_alert_level": "Low"
}`}
                </pre>
              </div>
            </motion.div>

            {/* Card 2: Track campaign posts */}
            <motion.div
              variants={fadeUp}
              whileHover={cardHover.whileHover}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col justify-between"
            >
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Track campaign posts, monitor mentions, and watch performance move in real time.
              </p>

              {/* Mock Dashboard container */}
              <div className="bg-[#f7f6f0] dark:bg-zinc-950 rounded-2xl p-5 border border-zinc-200/40 dark:border-zinc-800/40">

                {/* Profile row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200/50 flex items-center justify-center font-bold text-xs text-[#6b4bf2]">M</div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1">@lunavisuals <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span></h4>
                      <span className="text-[9px] text-zinc-400 block">95,000 followers</span>
                    </div>
                  </div>
                  <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full">
                    ▲ 4.2%
                  </span>
                </div>

                {/* Mentions tags */}
                <div className="mb-4">
                  <span className="text-[9px] text-zinc-400 block mb-1 font-bold uppercase tracking-wider">Recent mentions</span>
                  <div className="flex gap-1.5 text-[9px] font-semibold text-zinc-600 dark:text-zinc-300">
                    <span className="px-2 py-0.5 rounded border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 font-mono">@mention</span>
                    <span className="px-2 py-0.5 rounded border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 font-mono">#campaign</span>
                    <span className="px-2 py-0.5 rounded bg-[#e8e4fd] dark:bg-indigo-950 text-[#6b4bf2] dark:text-indigo-400 font-bold font-mono">+12 more</span>
                  </div>
                </div>

                {/* Statistics today */}
                <div className="flex items-end justify-between pt-2 border-t border-zinc-200/30">
                  <div>
                    <span className="text-[9px] text-zinc-400 block font-bold">Mentions today</span>
                    <span className="text-base font-extrabold text-zinc-900 dark:text-white mr-1.5">1,284</span>
                    <span className="text-emerald-500 text-[9px] font-bold">▲ 4.2%</span>
                  </div>

                  {/* Miniature chart - bars draw in on scroll */}
                  <div className="flex items-end gap-1 h-8">
                    {[
                      { h: 12, cls: "bg-[#6b4bf2]/30" },
                      { h: 20, cls: "bg-[#6b4bf2]/50" },
                      { h: 16, cls: "bg-[#6b4bf2]/70" },
                      { h: 28, cls: "bg-[#6b4bf2]" },
                      { h: 32, cls: "bg-emerald-500" },
                    ].map((bar, idx) => (
                      <motion.div
                        key={idx}
                        className={`${bar.cls} w-1.5 rounded-sm`}
                        initial={{ height: 0 }}
                        whileInView={{ height: bar.h }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 + idx * 0.08, ease: "easeOut" }}
                      />
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Card 3: Expandable feeds */}
            <motion.div
              variants={fadeUp}
              whileHover={cardHover.whileHover}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col justify-between min-h-[340px]"
            >
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                Analyse content, enrich your workflows, or pull live metrics for market and brand intelligence.
              </p>

              {/* Items List */}
              <div className="space-y-2 mb-6">
                {[
                  "GET /raw/youtube/channel-info",
                  "GET /raw/tiktok/comments",
                  "GET /raw/ig/user-info"
                ].map((item, idx) => {
                  const parts = item.split(" ");
                  return (
                    <motion.div
                      key={idx}
                      onClick={() => setActiveAlertItem(activeAlertItem === idx ? null : idx)}
                      whileHover={{ x: 3 }}
                      className="p-3 bg-[#f4f2ea] dark:bg-zinc-950 border border-zinc-200/20 rounded-xl font-mono text-[11px] flex items-center justify-between text-zinc-800 dark:text-zinc-300 cursor-pointer hover:bg-[#eae8df] transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="text-[#6b4bf2] font-bold">{parts[0]}</span>
                        <span className="font-bold text-zinc-900 dark:text-white">{parts[1]}</span>
                      </span>
                      <motion.span
                        className="text-zinc-400 text-xs inline-block"
                        animate={{ rotate: activeAlertItem === idx ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ⌄
                      </motion.span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Start Trial Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full bg-[#6b4bf2] hover:bg-[#5636dd] text-white text-xs font-bold py-3 rounded-xl transition-colors shadow-sm">
                  Start Free Trial
                </Button>
              </motion.div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* 8. Testimonials Section ("Why Customers Love Lolly") */}
      <section className="py-24 px-6 bg-white dark:bg-zinc-950 transition-colors">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-950 dark:text-white max-w-xl font-sans">
              Why Customers Love Lolly
            </h2>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="w-10 h-10 rounded-full bg-[#f0ede6] hover:bg-zinc-200 flex items-center justify-center text-zinc-700 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="w-10 h-10 rounded-full bg-[#6b4bf2] hover:bg-[#5636dd] flex items-center justify-center text-white transition-colors"
                aria-label="Next"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Testimonial 3-Column Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Column 1: Testimonial text card for Owen Murphy */}
            <motion.div
              variants={fadeUp}
              whileHover={cardHover.whileHover}
              className="bg-[#e7fca7] dark:bg-[#1a2510] text-[#2c3e10] dark:text-[#d4ed9a] rounded-3xl p-8 flex flex-col justify-between border border-[#cbe5a2]/30 min-h-[340px]"
            >
              <p className="text-base font-semibold leading-relaxed mb-8">
                &ldquo;Lolly has transformed the way we understand our customers. Ana&apos;s AI summaries save our team hours every week.&rdquo;
              </p>
              <div>
                <h4 className="font-bold text-sm text-zinc-950 dark:text-white">Owen Murphy</h4>
                <p className="text-xs opacity-75 mb-4 font-medium">Marketing Director at Pietra</p>
                <div className="inline-block bg-[#0b0c10] text-[#e7fca7] dark:bg-white dark:text-zinc-950 font-mono text-[9px] uppercase tracking-wider px-3.5 py-1.5 rounded-full text-center">
                  PIETRA
                </div>
              </div>
            </motion.div>

            {/* Column 2: Photo card of Owen Murphy */}
            <motion.div
              variants={fadeUp}
              whileHover={cardHover.whileHover}
              className="relative rounded-3xl overflow-hidden min-h-[340px] border border-zinc-200/30 shadow-sm"
            >
              <img
                src="/ceo_portrait.png"
                alt="Owen Murphy - Marketing Director at Pietra"
                className="w-full h-full object-cover absolute inset-0"
              />
              {/* Bottom text overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 text-white pt-24">
                <h4 className="font-black text-sm">Owen Murphy</h4>
                <p className="text-xs text-zinc-300 opacity-90 font-medium">Marketing Director at Pietra</p>
              </div>
            </motion.div>

            {/* Column 3: Testimonial text card for Stefan Kollenberg */}
            <motion.div
              variants={fadeUp}
              whileHover={cardHover.whileHover}
              className="bg-[#bdf3df] dark:bg-[#0f2420] text-[#0f443b] dark:text-[#aeeec4] rounded-3xl p-8 flex flex-col justify-between border border-[#aae0cc]/30 min-h-[340px]"
            >
              <p className="text-base font-semibold leading-relaxed mb-8">
                &ldquo;Competitor and industry monitoring have become essential to our marketing strategy. We identify trends and reputation risks before they impact our business.&rdquo;
              </p>
              <div>
                <h4 className="font-bold text-sm text-zinc-950 dark:text-white">Stefan Kollenberg</h4>
                <p className="text-xs opacity-75 mb-4 font-medium">Head of Growth at Clay</p>
                <div className="inline-block bg-[#0b0c10] text-[#bdf3df] dark:bg-white dark:text-zinc-950 font-mono text-[9px] uppercase tracking-wider px-3.5 py-1.5 rounded-full text-center">
                  CLAY
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* 9. The Platform: 9 features grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto" id="platform">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <span className="text-xs font-black text-[#6b4bf2] uppercase tracking-widest block mb-2">The platform //</span>
          <h2 className="text-4xl font-black tracking-tighter text-zinc-950 dark:text-white mb-4">
            One <span className="text-[#6b4bf2]">AI-Powered</span> Social Listening Platform
          </h2>
          <p className="text-base text-zinc-500 dark:text-zinc-400">
            Everything you need to monitor conversations, protect brand reputation, and make confident business decisions.
          </p>
        </motion.div>

        {/* 9 Cards grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {[
            {
              title: "Brand Monitoring",
              desc: "Track mentions of your brand, products, campaigns, and keywords in real time. Stay informed wherever your brand is being discussed.",
              icon: <Activity className="w-5 h-5 text-[#6b4bf2]" />
            },
            {
              title: "Competitor Monitoring",
              desc: "Monitor competitor activity, compare customer sentiment, and understand what's driving their success. Benchmark your performance.",
              icon: <Users className="w-5 h-5 text-[#6b4bf2]" />
            },
            {
              title: "Industry Monitoring",
              desc: "Stay informed about the conversations shaping your industry. Monitor market trends, emerging topics, and industry keywords.",
              icon: <Globe className="w-5 h-5 text-[#6b4bf2]" />
            },
            {
              title: "Sentiment Analysis",
              desc: "Understand how people feel—not just what they say. Automatically identify positive, negative, and neutral conversations.",
              icon: <PieChart className="w-5 h-5 text-[#6b4bf2]" />
            },
            {
              title: "Trend Detection",
              desc: "Spot conversations before they go mainstream. Identify emerging topics and shifting customer interests early enough to act.",
              icon: <TrendingUp className="w-5 h-5 text-[#6b4bf2]" />
            },
            {
              title: "Crisis Monitoring & Alerts",
              desc: "Get instant alerts on spikes in negative sentiment, keywords, or hashtags. Understand where a crisis started and how far it reached.",
              icon: <Shield className="w-5 h-5 text-[#6b4bf2]" />
            },
            {
              title: "AI Visibility Tracking",
              desc: "See how your brand appears in AI-generated answers. Track visibility across AI assistants as more customers discover brands via AI.",
              icon: <Bot className="w-5 h-5 text-[#6b4bf2]" />
            },
            {
              title: "Influencer Discovery",
              desc: "Find creators, journalists, experts, and advocates already influencing conversations in your market. Amplify your brand.",
              icon: <Sparkles className="w-5 h-5 text-[#6b4bf2]" />
            },
            {
              title: "AI Reports & Dashboards",
              desc: "Transform thousands of conversations into clear reports. AI summaries, sentiment breakdowns, and key insights ready to share.",
              icon: <Layers className="w-5 h-5 text-[#6b4bf2]" />
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col justify-between hover:border-[#6b4bf2]/40 transition-colors"
            >
              <div className="space-y-3">
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 0.5 }}
                  className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl w-fit"
                >
                  {feature.icon}
                </motion.div>
                <h4 className="text-base font-bold text-zinc-950 dark:text-white">{feature.title}</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 10. AI Assistant ("Meet Ana") */}
      <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900/10 border-t border-zinc-200/50 dark:border-zinc-800/50 transition-colors" id="ana">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Description Column */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-xs font-black text-[#6b4bf2] uppercase tracking-widest block">AI Assistant //</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-950 dark:text-white leading-tight">
              Meet <span className="text-[#6b4bf2]">Ana.</span> <br />
              Your AI Listening Assistant
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Meet Ana, your AI assistant. Ask questions naturally and receive instant answers powered by AI. Summarise conversations, analyse sentiment, compare competitors, discover trends, and generate executive-ready insights in seconds.
            </p>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Button className="bg-[#6b4bf2] hover:bg-[#5636dd] text-white px-5 py-3 rounded-lg text-xs font-bold shadow-sm transition-colors">
                Try Ana now
              </Button>
            </motion.div>
          </motion.div>

          {/* Right chatbot dashboard */}
          <motion.div
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#e8e4fd] text-[#6b4bf2] flex items-center justify-center font-bold text-xs">
                  Ana
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Ana AI</h4>
                  <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-1">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></span> Listening live
                  </span>
                </div>
              </div>
              <span className="bg-indigo-50 dark:bg-indigo-950/40 text-[#6b4bf2] text-[9px] font-black px-2 py-0.5 rounded-full">
                Interactive Chat
              </span>
            </div>

            {/* Sidebar-style horizontal tabs - shared-layout active pill */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-zinc-100 dark:border-zinc-800">
              {[
                "Latest campaign",
                "Sentiment change",
                "Competitor attention",
                "Today's summary",
                "Trends to watch",
                "Needs attention",
                "Top topics"
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveAnaTab(tab)}
                  className="relative px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors"
                >
                  {activeAnaTab === tab && (
                    <motion.span
                      layoutId="activeAnaTab"
                      className="absolute inset-0 bg-[#6b4bf2] rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className={`relative z-10 ${activeAnaTab === tab ? "text-white" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"}`}>
                    {tab}
                  </span>
                </button>
              ))}
            </div>

            {/* Simulated Chat Dialogue */}
            <div className="space-y-4 font-sans text-xs">

              {/* Question */}
              <div className="flex items-start gap-2 justify-end">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`q-${activeAnaTab}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="bg-[#eae7e0] dark:bg-zinc-800 p-3 rounded-2xl rounded-tr-none max-w-sm"
                  >
                    <span className="text-[10px] font-black text-zinc-500 block mb-1">You</span>
                    <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed font-bold">
                      {activeAnaTab === "Latest campaign" ? "What are customers saying about our latest campaign?" : `Show details for "${activeAnaTab}"`}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Reply */}
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-[#e8e4fd] text-[#6b4bf2] font-bold flex items-center justify-center text-[10px] shrink-0 mt-1">
                  A
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`a-${activeAnaTab}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: 0.05 }}
                    className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/30 p-3 rounded-2xl rounded-tl-none max-w-sm"
                  >
                    <span className="text-[10px] font-black text-[#6b4bf2] block mb-1">Ana</span>

                    {/* Rich details highlighting inside chatbot */}
                    <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                      {activeAnaTab === "Latest campaign" ? (
                        <span>
                          Mostly <span className="text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-1 rounded">positive</span>. Launch mentions are <span className="text-[#6b4bf2] font-bold bg-[#e8e4fd] dark:bg-indigo-950/40 px-1 rounded">up sharply</span> this week, with praise for the creative concentrated on Instagram and TikTok. A small cluster of shipping questions on <span className="text-orange-500 font-bold underline">Reddit</span> is worth a look.
                        </span>
                      ) : (
                        anaReplies[activeAnaTab] || "Analyzing data feed..."
                      )}
                    </p>

                  </motion.div>
                </AnimatePresence>
              </div>

            </div>

          </motion.div>

        </div>
      </section>

      {/* 11. Monitored Channels Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto" id="channels">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <span className="text-xs font-black text-[#6b4bf2] uppercase tracking-widest block mb-2">Channels //</span>
          <h2 className="text-4xl font-bold tracking-tighter text-zinc-950 dark:text-white mb-4">
            Monitor <span className="text-[#6b4bf2]">Every Channel</span> That Matters
          </h2>
          <p className="text-base text-zinc-500 dark:text-zinc-400">
            Wherever conversations happen, Lolly helps you stay connected. Complete visibility across the platforms shaping your business.
          </p>
        </motion.div>

        {/* Channels Grid with active indicator dots */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {[
            "Instagram", "Facebook", "LinkedIn", "X", "TikTok", "YouTube", "Reddit",
            "News", "Blogs", "Forums", "Review Platforms", "Online Communities", "Podcasts", "Websites"
          ].map((channel, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -4, scale: 1.03, borderColor: "#6b4bf2" }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 p-4 rounded-2xl text-center shadow-sm relative overflow-hidden"
            >
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" title="Active Monitoring"></span>
              <span className="text-xs font-bold text-zinc-800 dark:text-white">{channel}</span>
            </motion.div>
          ))}
        </motion.div>
        <p className="text-center text-xs text-zinc-400 mt-8">
          Everything in one platform. Complete visibility across the conversations shaping your business.
        </p>
      </section>

      {/* 12. cURL Sandbox & Reporting Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-zinc-200/50 dark:border-zinc-800/50">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <span className="text-xs font-black text-[#6b4bf2] uppercase tracking-widest block mb-2">Reporting //</span>
          <h2 className="text-4xl font-bold tracking-tighter text-zinc-950 dark:text-white mb-4">
            Report with <span className="text-[#6b4bf2]">Confidence</span>
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Turn thousands of conversations into executive-ready answers—what changed, why it changed, and what to do next.
          </p>
        </motion.div>

        {/* Side-by-side sandbox layout */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-mono text-xs md:text-sm"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Query configuration panel */}
          <motion.div
            variants={fadeUp}
            whileHover={{ scale: 1.005 }}
            className="bg-[#111118] text-white rounded-3xl p-6 border border-zinc-800 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
                <span className="text-zinc-400 uppercase tracking-widest font-bold text-[10px]">Report Query Config //</span>
                <span className="text-zinc-500 text-[10px]">lolly.io/reports</span>
              </div>
              <pre className="text-zinc-300 overflow-x-auto leading-relaxed">
{`lolly.reports.generate({
  format: "weekly",
  components: [
    "sentiment_breakdown",
    "share_of_voice",
    "reputation_alerts"
  ],
  filter: {
    period: "last_7_days",
    keywords: ["summer launch", "pricing"]
  }
})`}
              </pre>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-end">
              <motion.button
                whileHover={{ x: 2 }}
                onClick={() => copyToClipboard(`lolly.reports.generate({...})`)}
                className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={copiedText ? "copied" : "copy"}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    {copiedText ? "Copied!" : "Copy code"}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>

          {/* Report output panel */}
          <motion.div
            variants={fadeUp}
            whileHover={{ scale: 1.005 }}
            className="bg-[#111118] text-white rounded-3xl p-6 border border-zinc-800 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
                <span className="text-zinc-400 uppercase tracking-widest font-bold text-[10px]">Weekly Brand Report //</span>
                <span className="text-[#aeeef7] text-[10px] font-bold bg-[#193d43] px-2 py-0.5 rounded-full">AI Generated</span>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  <div className="bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
                    <span className="text-zinc-400 block mb-0.5 uppercase tracking-wider font-bold">Total mentions</span>
                    <span className="text-white font-extrabold text-xs">12.4k</span> <span className="text-emerald-400 font-bold ml-1">▲ +18%</span>
                  </div>
                  <div className="bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
                    <span className="text-zinc-400 block mb-0.5 uppercase tracking-wider font-bold">Positive sentiment</span>
                    <span className="text-white font-extrabold text-xs">71%</span> <span className="text-emerald-400 font-bold ml-1">▲ +6pts</span>
                  </div>
                  <div className="bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
                    <span className="text-zinc-400 block mb-0.5 uppercase tracking-wider font-bold">Share of voice</span>
                    <span className="text-white font-extrabold text-xs">34%</span> <span className="text-emerald-400 font-bold ml-1">▲ +3pts</span>
                  </div>
                  <div className="bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 border-l-rose-500 border-l-2">
                    <span className="text-zinc-400 block mb-0.5 uppercase tracking-wider font-bold">Reputation risks</span>
                    <span className="text-rose-400 font-bold text-xs bg-rose-950/40 px-1.5 py-0.5 rounded">1 open</span>
                  </div>
                </div>

                <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/40 text-[10px] leading-relaxed text-zinc-300">
                  <span className="font-bold text-[#6b4bf2] uppercase block mb-1">AI Report Summary</span>
                  <span className="font-bold">Launch coverage</span> drove this week’s growth. Sentiment improved after your <span className="text-[#a3e635] font-semibold">support-thread response</span>. One <span className="text-[#6b4bf2] font-semibold">pricing discussion</span> in an industry forum is worth monitoring.
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center text-zinc-500 text-[10px]">
              <span>PDF report generated successfully</span>
              <span>Loaded in 18ms</span>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* 13. FAQ Accordion */}
      <section className="py-24 px-6 bg-[#f7f6f0] dark:bg-zinc-900/10 border-y border-zinc-200/50 dark:border-zinc-800/50 transition-colors" id="faq">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <span className="text-xs font-black text-[#6b4bf2] uppercase tracking-widest block mb-2">FAQ //</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-950 dark:text-white font-sans">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <Accordion type="single" collapsible className="w-full">

              {[
                {
                  value: "faq-1",
                  q: "What is social listening?",
                  a: "Social listening involves monitoring digital conversations on social media, blogs, news portals, and forums to understand what people are saying about your brand, competitors, and industry topics. Lolly uses advanced AI to summarize these discussions and alert you to trends or risks.",
                },
                {
                  value: "faq-2",
                  q: "Which channels does Lolly monitor?",
                  a: "Lolly covers 14 channel types globally, including Instagram, Facebook, LinkedIn, X, TikTok, YouTube, Reddit, online news sites, forums, blogs, review platforms, and podcasts.",
                },
                {
                  value: "faq-3",
                  q: "What can Lolly's AI do?",
                  a: "Lolly's AI automates sentiment analysis, emerging trend detection, crisis monitoring, and visibility tracking in AI-generated answers. It also powers Ana, your conversational listening assistant, to summarize thousands of mentions in seconds.",
                },
                {
                  value: "faq-4",
                  q: "Can I monitor competitors and my industry?",
                  a: "Yes! Lolly offers dedicated features for Competitor and Industry monitoring. You can benchmark competitor sentiment, activity, and visibility, and stay ahead of discussions shaping your market.",
                },
                {
                  value: "faq-5",
                  q: "Does Lolly provide real-time alerts?",
                  a: "Yes. Lolly sends instant smart alerts when spikes in negative sentiment, specific keywords, or campaign hashtags are detected, helping you handle crises before they scale.",
                },
                {
                  value: "faq-6",
                  q: "Which teams is Lolly built for?",
                  a: "Lolly is built for Marketing (campaign metrics), Brand & PR (reputation), Product (customer feedback), Customer Success (issue tracking), Agencies (multiple client monitoring), and Executive Leadership (brand health summaries).",
                },
                {
                  value: "faq-7",
                  q: "Does Lolly provide AI-generated reports?",
                  a: "Yes. Lolly compiles raw mentions data into weekly executive-ready reports with sentiment breakdowns, trend shifts, and key recommendations automatically written by AI.",
                },
                {
                  value: "faq-8",
                  q: "How do I get started with Lolly?",
                  a: 'You can start a 14-day free trial immediately by clicking "Start Free Trial", or request a personalized walkthrough with our sales team by clicking "Book a Demo".',
                },
              ].map((item) => (
                <motion.div key={item.value} variants={fadeUp}>
                  <AccordionItem value={item.value} className="border-b border-zinc-200 dark:border-zinc-800 last:border-b-0">
                    <AccordionTrigger className="text-base font-bold text-zinc-900 dark:text-white py-6">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed pb-6">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}

            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* 14. Bottom final CTA: bold solid-purple block, matching the reference's color-blocked closing CTA */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div
          className="bg-[#aa9ef4] dark:bg-[#3a2f80] rounded-[2.5rem] px-8 py-16 md:p-20 text-center relative overflow-hidden mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[#1a0f3d] dark:text-white mb-6">
            Your Customers Are Already Talking. <br />
            <motion.span
              whileHover={{ scale: 1.05, rotate: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              className="text-[#0b0c10] bg-[#e7fca7] px-3 py-1 rounded-2xl inline-block rotate-[-1.5deg] shadow-sm font-black cursor-pointer"
            >
              Start Listening.
            </motion.span>
          </h2>
          <p className="text-sm md:text-base text-[#1a0f3d] dark:text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Every conversation is an opportunity to learn. Every insight is an opportunity to grow. Uncover the insights that matter and turn conversations into confident business decisions with AI-powered social listening.
          </p>
          <div className="flex justify-center gap-4">
            <Magnetic>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button className="bg-[#0b0c10] hover:bg-zinc-800 text-white rounded-lg px-8 py-4 text-sm font-bold shadow-md transition-colors">
                  Start Free Trial
                </Button>
              </motion.div>
            </Magnetic>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button variant="outline" className="bg-white border-white text-[#1a0f3d] hover:bg-white/95 rounded-lg px-8 py-4 text-sm font-bold shadow-md transition-colors">
                Book a Demo
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Solid near-black bar, matching the reference's "Tell us what you're building" strip */}
        <motion.div
          className="bg-[#0b0c10] rounded-[2rem] px-8 py-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="text-white text-lg md:text-2xl font-black tracking-tight uppercase text-center md:text-left">
            Tell us what you&apos;re building.
          </span>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="shrink-0">
            <Button className="bg-[#e7fca7] hover:bg-[#dff3a1] text-[#0b0c10] rounded-lg px-6 py-3 text-sm font-bold shadow-md transition-colors">
              Request a Demo →
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* 15. Footer */}
      <motion.footer
        className="bg-[#0b0c10] text-zinc-400 pt-20 pb-10 px-6 border-t border-zinc-800"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">

          {/* Logo & Summary */}
          <div className="md:col-span-2 space-y-6">
            <span className="text-2xl font-bold tracking-tight text-white flex items-center">
              lolly
              <span className="w-2.5 h-2.5 rounded-full bg-[#6b4bf2] ml-1"></span>
            </span>
            <p className="text-sm text-zinc-400 max-w-xs leading-relaxed">
              AI-powered social listening platform to monitor conversations, protect brand reputation, and make confident business decisions.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-xs bg-zinc-800 px-2 py-0.5 rounded">G2</span>
              <span className="text-white font-semibold text-xs">4.8 / 5</span>
              <span className="text-amber-500 text-xs">{"★".repeat(5)}</span>
            </div>
          </div>

          {/* Capabilities */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Brand Monitoring</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Competitor Intelligence</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sentiment Analysis</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trend Detection</a></li>
            </ul>
          </div>

          {/* Use cases */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">Teams</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Marketing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Brand & PR</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Product Feedback</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Customer Success</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Social Listening Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Brand Monitoring Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Consumer Trends</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Customer Stories</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span>&copy; {new Date().getFullYear()} Lolly. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </motion.footer>

    </div>
  )
}
