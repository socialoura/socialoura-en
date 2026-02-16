import { Review } from "@/types/product";

export const reviews: Review[] = [
  {
    id: "1",
    author: "Sarah M.",
    rating: 5,
    date: "2 days ago",
    comment: "Great service! Delivery was smooth and gradual, and my profile visibility really improved. Highly recommend for anyone looking to grow their audience.",
    verified: true,
  },
  {
    id: "2",
    author: "James L.",
    rating: 5,
    date: "3 days ago",
    comment: "Very satisfied with the results. The delivery was fast and the support team was super responsive. Will definitely use again!",
    verified: true,
  },
  {
    id: "3",
    author: "Emily D.",
    rating: 5,
    date: "5 days ago",
    comment: "Excellent growth service! My account engagement increased noticeably and the quality is top-notch. Thank you!",
    verified: true,
  },
  {
    id: "4",
    author: "Michael B.",
    rating: 4,
    date: "1 week ago",
    comment: "Good service overall. Fast delivery and quality results. Support response could be a bit quicker, but still solid.",
    verified: true,
  },
  {
    id: "5",
    author: "Jessica R.",
    rating: 5,
    date: "1 week ago",
    comment: "Love it! My Instagram profile gained so much more visibility and the engagement is amazing. Very professional service.",
    verified: true,
  },
  {
    id: "6",
    author: "Alex P.",
    rating: 5,
    date: "2 weeks ago",
    comment: "Exactly what I needed. The growth was natural-looking and my content is getting way more reach now. A+ service.",
    verified: true,
  },
  {
    id: "7",
    author: "Rachel F.",
    rating: 5,
    date: "2 weeks ago",
    comment: "Super fast delivery and outstanding quality. I've tried other services before but this is by far the best. Recommended!",
    verified: true,
  },
  {
    id: "8",
    author: "David M.",
    rating: 4,
    date: "3 weeks ago",
    comment: "Really good promotion service. The results are real and my audience grew steadily. Would love to see more payment options though.",
    verified: true,
  },
];

function hashStringToUint32(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function getRandomReviews(count: number = 4, seed?: string | number): Review[] {
  if (count <= 0) return [];

  const resolvedSeed =
    typeof seed === "number"
      ? seed
      : typeof seed === "string"
        ? hashStringToUint32(seed)
        : 0;

  const rng = mulberry32(resolvedSeed);
  const arr = [...reviews];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr.slice(0, count);
}

export function getAverageRating(): number {
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
