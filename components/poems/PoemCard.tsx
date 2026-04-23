import Link from "next/link";
import Image from "next/image";

interface PoemCardProps {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  moods: string[];
  likesCount: number;
  imageUrl?: string;
}

export default function PoemCard({
  id,
  title,
  author,
  excerpt,
  moods,
  likesCount,
  imageUrl,
}: PoemCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden border border-outline-variant bg-surface-container-lowest transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]">
      {/* Image Container */}
      <Link href={`/poem/${id}`} className="relative aspect-4/3 overflow-hidden bg-surface-container">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center opacity-20">
            <span className="material-symbols-outlined text-6xl">ink_pen</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        <div className="absolute bottom-4 left-4 flex gap-2">
          {moods.slice(0, 1).map((mood) => (
            <span
              key={mood}
              className="rounded-full bg-white/20 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md"
            >
              {mood}
            </span>
          ))}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-start justify-between">
          <Link href={`/poem/${id}`} className="flex flex-col gap-1">
            <h2 className="font-serif text-2xl font-medium text-primary transition-colors group-hover:text-surface-tint">
              {title}
            </h2>
            <p className="font-sans text-[11px] font-bold uppercase tracking-widest text-outline">
              {author}
            </p>
          </Link>
          <button className="text-outline transition-colors hover:text-primary">
            <span className="material-symbols-outlined text-[20px]">bookmark</span>
          </button>
        </div>

        <div className="mb-6 flex-1 font-serif text-lg leading-relaxed text-on-surface-variant/80 italic line-clamp-3">
          &quot;{excerpt}&quot;
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-outline-variant/30 pt-4">
          <Link 
            href={`/poem/${id}`}
            className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
          >
            Hijery
          </Link>
          <div className="flex items-center gap-4 text-outline">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">water_drop</span>
              <span className="font-sans text-[10px]">{likesCount}</span>
            </div>
            <button className="transition-colors hover:text-primary">
              <span className="material-symbols-outlined text-[18px]">ios_share</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
