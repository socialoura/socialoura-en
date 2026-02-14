import { Review } from "@/types/product";

export const reviews: Review[] = [
  {
    id: "1",
    author: "Sophie M.",
    rating: 5,
    date: "Il y a 2 jours",
    comment: "Service impeccable ! J'ai reçu mes abonnés en quelques minutes et ils sont tous réels. Je recommande vivement !",
    verified: true,
  },
  {
    id: "2",
    author: "Thomas L.",
    rating: 5,
    date: "Il y a 3 jours",
    comment: "Très satisfait de mon achat. La livraison a été rapide et le service client est très réactif. Je reviendrai !",
    verified: true,
  },
  {
    id: "3",
    author: "Marie D.",
    rating: 5,
    date: "Il y a 5 jours",
    comment: "Excellent service ! Les abonnés sont de qualité et mon compte a vraiment décollé. Merci beaucoup !",
    verified: true,
  },
  {
    id: "4",
    author: "Lucas B.",
    rating: 4,
    date: "Il y a 1 semaine",
    comment: "Bon service dans l'ensemble. Livraison rapide et abonnés de qualité. Petit bémol sur le délai de réponse du support.",
    verified: true,
  },
  {
    id: "5",
    author: "Emma R.",
    rating: 5,
    date: "Il y a 1 semaine",
    comment: "Je suis ravie ! Mon compte Instagram a gagné en visibilité et l'engagement est au top. Service professionnel.",
    verified: true,
  },
  {
    id: "6",
    author: "Alexandre P.",
    rating: 5,
    date: "Il y a 2 semaines",
    comment: "Parfait ! Exactement ce que je cherchais. Les abonnés sont actifs et interagissent avec mon contenu.",
    verified: true,
  },
  {
    id: "7",
    author: "Camille F.",
    rating: 5,
    date: "Il y a 2 semaines",
    comment: "Service au top ! Livraison instantanée et qualité irréprochable. Je recommande les yeux fermés.",
    verified: true,
  },
  {
    id: "8",
    author: "Hugo M.",
    rating: 4,
    date: "Il y a 3 semaines",
    comment: "Très bon service. Les abonnés sont réels et actifs. Seul petit point : j'aurais aimé plus d'options de paiement.",
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
