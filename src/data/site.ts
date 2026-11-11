export type Link = {
  label: string;
  href?: string;
  external?: boolean;
};

export type Price = {
  tier: string;
  amount: number;
};

export const site = {
  title: "Het is maar haar",
  description: "funky hair for everybody! A queer-friendly, pay-what-you-can hair practice and community of silly beans.",
  tagline: "funky hair for everybody!",
  community: [
    "*become part of a community of silly beans<3",
    "where we believe EVERYONE has the right to",
    "play with their hair, appearance and body",
  ],
  nav: [
    { label: "portfolio", href: "#portfolio" },
    { label: "prices", href: "#prices" },
    { label: "agenda", href: "https://hetismaarhaar.youcanbook.me", external: true },
    { label: "location" },
    { label: "ur words" },
  ] satisfies Link[],
  about: { label: "about me" } satisfies Link,
  contactTitle: "contact",
  contact: [
    { label: "whatsapp" },
    { label: "instagram" },
    { label: "e-mail" },
  ] satisfies Link[],
  portfolio: {
    title: "PORTFOLIO",
    motto: ["trying to change the", "world, one", "haircut at a time <3"],
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
