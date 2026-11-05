// Fetches the latest City Game Studio announcements from the Steam Web API
// and writes assets/data/news.json for the website.
// Usage: node scripts/fetch-steam-news.mjs [--input sample.json]

import { readFile, writeFile, mkdir } from 'node:fs/promises';

const APPID = 726840;
const COUNT = 3;
const API = `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${APPID}&count=10&maxlength=0&feeds=steam_community_announcements`;
const CLAN_IMAGE = 'https://clan.akamai.steamstatic.com/images';
const OUT = new URL('../assets/data/news.json', import.meta.url);

function firstImage(text) {
  const patterns = [
    /\[img[^\]]*src="([^"]+)"[^\]]*\]/i,      // [img src="..."][/img]
    /\[img(?:=[^\]]*)?\]\s*([^\s[]+)\s*\[\/img\]/i, // [img]...[/img]
    /<img[^>]*src="([^"]+)"/i,                // <img src="...">
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m && /^https:\/\//.test(m[1])) return m[1];
  }
  return null;
}

function excerpt(text, max = 180) {
  const plain = text
    .replace(/\[h[1-6]\][\s\S]*?\[\/h[1-6]\]/gi, ' ')
    .replace(/\[img[^\]]*\][\s\S]*?\[\/img\]/gi, ' ')
    .replace(/\[img[^\]]*\]/gi, ' ')
    .replace(/\[previewyoutube[^\]]*\][\s\S]*?\[\/previewyoutube\]/gi, ' ')
    .replace(/\[\/?[a-z0-9*]+(?:[ =][^\]]*)?\]/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= max) return plain;
  return plain.slice(0, plain.lastIndexOf(' ', max)).replace(/[,.;:!?\s]+$/, '') + '…';
}

async function load() {
  const i = process.argv.indexOf('--input');
  if (i !== -1) return JSON.parse(await readFile(process.argv[i + 1], 'utf8'));
  const res = await fetch(API, { headers: { 'User-Agent': 'city-game-studio-website' } });
  if (!res.ok) throw new Error(`Steam API answered ${res.status}`);
  return res.json();
}

const data = await load();
const items = (data?.appnews?.newsitems ?? [])
  .filter((n) => n.feedname === 'steam_community_announcements')
  .slice(0, COUNT)
  .map((n) => {
    const contents = String(n.contents ?? '').replaceAll('{STEAM_CLAN_IMAGE}', CLAN_IMAGE);
    return {
      title: n.title,
      url: n.url,
      date: n.date,
      image: firstImage(contents),
      excerpt: excerpt(contents),
    };
  });

if (items.length === 0) {
  console.error('No announcements found, keeping the previous news.json');
  process.exit(0);
}

await mkdir(new URL('.', OUT), { recursive: true });
await writeFile(OUT, JSON.stringify({ items }, null, 2) + '\n');
console.log(`Wrote ${items.length} items:\n` + items.map((n) => `- ${n.title} (image: ${n.image ? 'yes' : 'no'})`).join('\n'));
