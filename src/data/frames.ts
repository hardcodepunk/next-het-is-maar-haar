import type { ImageMetadata } from "astro";

import flowers from "../assets/portfolio/frames/flowers.webp";
import flowersMask from "../assets/portfolio/frames/flowers-mask.png";
import street from "../assets/portfolio/frames/street.webp";
import streetMask from "../assets/portfolio/frames/street-mask.png";
import stars from "../assets/portfolio/frames/stars.webp";
import starsMask from "../assets/portfolio/frames/stars-mask.png";
import laugh from "../assets/portfolio/frames/laugh.webp";
import laughMask from "../assets/portfolio/frames/laugh-mask.png";
import smileys from "../assets/portfolio/frames/smileys.webp";
import smileysMask from "../assets/portfolio/frames/smileys-mask.png";
import createArt from "../assets/portfolio/frames/create-art.webp";
import createArtMask from "../assets/portfolio/frames/create-art-mask.png";
import fruit from "../assets/portfolio/frames/fruit.webp";
import fruitMask from "../assets/portfolio/frames/fruit-mask.png";
import tropical from "../assets/portfolio/frames/tropical.webp";
import tropicalMask from "../assets/portfolio/frames/tropical-mask.png";
import blueBlob from "../assets/portfolio/frames/blue-blob.webp";
import blueBlobMask from "../assets/portfolio/frames/blue-blob-mask.png";
import hearts from "../assets/portfolio/frames/hearts.webp";
import heartsMask from "../assets/portfolio/frames/hearts-mask.png";
import pinkBlob from "../assets/portfolio/frames/pink-blob.webp";
import pinkBlobMask from "../assets/portfolio/frames/pink-blob-mask.png";

export type Frame = {
  image: ImageMetadata;
  mask: ImageMetadata;
  window: { x: number; y: number; w: number; h: number };
};

export const frames = {
  flowers: { image: flowers, mask: flowersMask, window: { x: 0.0868, y: 0.1481, w: 0.8089, h: 0.7147 } },
  street: { image: street, mask: streetMask, window: { x: 0.1115, y: 0.1139, w: 0.7439, h: 0.7789 } },
  stars: { image: stars, mask: starsMask, window: { x: 0.1277, y: 0.1092, w: 0.705, h: 0.789 } },
  laugh: { image: laugh, mask: laughMask, window: { x: 0.0842, y: 0.116, w: 0.7978, h: 0.7914 } },
  smileys: { image: smileys, mask: smileysMask, window: { x: 0.1293, y: 0.1943, w: 0.7414, h: 0.6216 } },
  "create-art": { image: createArt, mask: createArtMask, window: { x: 0.107, y: 0.1272, w: 0.79, h: 0.742 } },
  fruit: { image: fruit, mask: fruitMask, window: { x: 0.0762, y: 0.1386, w: 0.809, h: 0.7091 } },
  tropical: { image: tropical, mask: tropicalMask, window: { x: 0.127, y: 0.1136, w: 0.7384, h: 0.7933 } },
  "blue-blob": { image: blueBlob, mask: blueBlobMask, window: { x: 0.0262, y: 0.0207, w: 0.9432, h: 0.9545 } },
  hearts: { image: hearts, mask: heartsMask, window: { x: 0.1294, y: 0.1069, w: 0.6899, h: 0.7745 } },
  "pink-blob": { image: pinkBlob, mask: pinkBlobMask, window: { x: 0.0507, y: 0.0459, w: 0.8659, h: 0.9199 } },
} satisfies Record<string, Frame>;

export type FrameKey = keyof typeof frames;
