import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getFilePath(filename: string) {
  return path.join(DATA_DIR, filename);
}

export function readData<T>(filename: string, defaultData: T[] = []): T[] {
  ensureDir();
  const filePath = getFilePath(filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

export function writeData<T>(filename: string, data: T[]): void {
  ensureDir();
  const filePath = getFilePath(filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Types
export interface PhotoItem {
  id: string;
  src: string;
  alt: string;
  createdAt: string;
}

export interface BlogItem {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  image: string;
  link: string;
}

export interface ClientItem {
  id: string;
  name: string;
  logo: string;
  website: string;
}

export interface WalletItem {
  id: string;
  name: string;
  symbol: string;
  address: string;
  network: string;
}
