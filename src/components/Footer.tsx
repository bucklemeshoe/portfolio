import Link from 'next/link';
import { Container } from '@/components/Container';

export function Footer() {
  return (
    <footer className="mt-32">
      <Container>
        <div className="border-t border-zinc-100 pt-10 pb-16">
          <div className="relative px-4 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-2xl lg:max-w-5xl border border-gray-100 border-dashed rounded-lg p-6">
              <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                <div className="flex gap-6 text-sm font-medium text-zinc-800">
                  <Link href="/#about" className="transition hover:text-zinc-600">About</Link>
                  <Link href="/projects" className="transition hover:text-zinc-600">Projects</Link>
                  <Link href="/contact" className="transition hover:text-zinc-600">Contact</Link>
                  <Link href="/writing" className="transition hover:text-zinc-600">Writing</Link>
                </div>
                <p className="text-sm text-zinc-400">
                  © 2025 Jared Buckley. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
} 