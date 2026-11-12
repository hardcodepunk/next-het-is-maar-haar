import type { ImageMetadata } from "astro";
import type { FrameKey } from "./frames";

import photo01 from "../assets/portfolio/photos/photo-01.jpg";
import photo02 from "../assets/portfolio/photos/photo-02.jpg";
import photo03 from "../assets/portfolio/photos/photo-03.jpg";
import photo04 from "../assets/portfolio/photos/photo-04.jpg";
import photo05 from "../assets/portfolio/photos/photo-05.jpg";
import photo06 from "../assets/portfolio/photos/photo-06.jpg";
import photo07 from "../assets/portfolio/photos/photo-07.jpg";
import photo08 from "../assets/portfolio/photos/photo-08.jpg";
import photo09 from "../assets/portfolio/photos/photo-09.jpg";
import photo10 from "../assets/portfolio/photos/photo-10.jpg";
import photo11 from "../assets/portfolio/photos/photo-11.jpg";

export type Link = {
  label: string;
  href?: string;
  external?: boolean;
};

export type Price = {
  tier: string;
  amount: number;
};

export type PortfolioItem = {
  photo: ImageMetadata;
  frame: FrameKey;
  alt: string;
  position?: string;
  zoom?: number;
};

const links = {
  portfolio: { label: "portfolio", href: "#portfolio" },
  prices: { label: "prices", href: "#prices" },
  agenda: { label: "agenda", href: "https://hetismaarhaar.youcanbook.me", external: true },
  location: { label: "location" },
  words: { label: "ur words" },
  about: { label: "about me" },
  contact: { label: "contact", href: "#contact" },
} satisfies Record<string, Link>;

export const site = {
  title: "Het is maar haar",
  description: "funky hair for everybody! A queer-friendly, pay-what-you-can hair practice and community of silly beans.",
  tagline: "funky hair for everybody!",
  backgrounds: {
    home: "#d34cf5",
    portfolio: "#a855f7",
    prices: "#0984f4",
  },
  community: [
    "*become part of a community of silly beans<3",
    "where we believe EVERYONE has the right to",
    "play with their hair, appearance and body",
  ],
  nav: [links.portfolio, links.prices, links.agenda, links.location, links.words] satisfies Link[],
  about: links.about satisfies Link,
  mobileNav: [links.portfolio, links.prices, links.agenda, links.contact] as Link[],
  contactTitle: "contact",
  contact: [{ label: "whatsapp" }, { label: "instagram" }, { label: "e-mail" }] satisfies Link[],
  portfolio: {
    title: "PORTFOLIO",
    motto: ["trying to change the", "world, one", "haircut at a time <3"],
    items: [
      { photo: photo01, frame: "flowers", alt: "Curly mullet with short curtain bangs", position: "66% 0%", zoom: 1.23 },
      { photo: photo02, frame: "street", alt: "Short shag with micro bangs" },
      { photo: photo03, frame: "stars", alt: "Long wavy hair with a dreadlock section" },
      { photo: photo04, frame: "laugh", alt: "Copper mullet with blunt bangs", position: "50% 69%" },
      { photo: photo05, frame: "smileys", alt: "Layered cut with curtain bangs", position: "50% 55%" },
      { photo: photo06, frame: "create-art", alt: "Short red layered cut", position: "100% 51%", zoom: 1.14 },
      { photo: photo07, frame: "fruit", alt: "Short cropped cut", position: "50% 63%" },
      { photo: photo08, frame: "tropical", alt: "Bleached buzzed cut" },
      { photo: photo09, frame: "blue-blob", alt: "Curly bob", position: "50% 56%" },
      { photo: photo10, frame: "hearts", alt: "Short textured crop", position: "0% 1%", zoom: 1.23 },
      { photo: photo11, frame: "pink-blob", alt: "Bowl cut with blunt bangs" },
    ] satisfies PortfolioItem[],
  },
  prices: {
    title: "PRICES",
    subtitle: "3 tier prices",
    tiers: [
      { tier: "A", amount: 35 },
      { tier: "B", amount: 45 },
      { tier: "C", amount: 55 },
    ] satisfies Price[],
    principle: ["following the", "pay-what-you-can", "principle"],
    extra: "+ community events",
  },
};
