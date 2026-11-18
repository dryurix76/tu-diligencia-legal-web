import Image from 'next/image';
import type { Post } from '@/lib/posts';
import { POST_ALT } from '@/lib/postAlt';

// Cover for a blog post: brand colour block, or the post's photo with a colour
// wash so the big italic word still reads.
export default function PostCover({ p, img, height, word = 72, kicker = false, priority = false, sizes = '(max-width: 760px) 100vw, 33vw', radius = 4, wordColor }: {
  p: Post; img?: string; height: number | string; word?: number | string; kicker?: boolean; priority?: boolean; sizes?: string; radius?: number; wordColor?: string;
}) {
  const fg = img ? 'var(--paper)' : wordColor || p.fg;
  return (
    <div style={{ height, borderRadius: radius, background: p.bg, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: 24 }}>
      {img && (
        <>
          <Image src={img} alt={POST_ALT[p.slug] || ''} fill priority={priority} sizes={sizes} style={{ objectFit: 'cover' }} />
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${p.bg}99 0%, transparent 28%, transparent 45%, ${p.bg}d9 100%)` }} />
        </>
      )}
      {kicker && <span className="mono" style={{ position: 'absolute', top: 22, left: 24, fontSize: 11, letterSpacing: '0.2em', color: fg, opacity: 0.9, zIndex: 1 }}>{p.kicker}</span>}
      <span className="serif" style={{ position: 'relative', fontSize: word, fontStyle: 'italic', lineHeight: 0.88, letterSpacing: '-0.035em', color: fg, textShadow: img ? '0 2px 18px color-mix(in srgb, var(--ink) 35%, transparent)' : undefined }}>{p.word}</span>
    </div>
  );
}
