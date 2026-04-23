import Image from "next/image";
import Button from "@/components/ui/Button";
import Link from "next/link";

interface PoemOfDayProps {
  id: string;
  title: string;
  author: string;
  authorImage: string;
  excerpt: string;
  imageUrl: string;
}

export default function PoemOfDay({
  id,
  title,
  author,
  authorImage,
  excerpt,
  imageUrl,
}: PoemOfDayProps) {
  return (
    <section className="mb-20 overflow-hidden border border-outline-variant bg-surface-container-lowest">
      <div className="flex flex-col md:flex-row">
        {/* Content Side */}
        <div className="relative flex flex-1 flex-col justify-center p-10 md:p-16">
          {/* Background Icon */}
          <div className="absolute -right-16 -top-16 pointer-events-none opacity-[0.03]">
            <span className="material-symbols-outlined text-[320px]">history_edu</span>
          </div>

          <div className="relative z-10">
            <div className="mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">auto_awesome</span>
              <span className="font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-on-surface-variant">
                Tononkalo anio
              </span>
            </div>

            <h2 className="mb-6 font-serif text-5xl tracking-tight text-primary">
              {title}
            </h2>

            <div className="mb-10 border-l border-outline-variant pl-6">
              <div 
                className="font-serif text-xl italic leading-relaxed text-on-surface-variant/80"
                dangerouslySetInnerHTML={{ __html: excerpt }}
              />
            </div>

            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-outline-variant bg-surface-container-high">
                  <Image
                    src={authorImage}
                    alt={author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="block font-sans text-sm font-medium text-on-surface">
                    {author}
                  </span>
                  <span className="block font-sans text-[12px] text-on-surface-variant/60">
                    Navoaka androany
                  </span>
                </div>
              </div>

              <Link href={`/poem/${id}`}>
                <Button variant="primary" className="group">
                  Hamaky ny tononkalo
                  <span className="material-symbols-outlined ml-2 text-[18px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Image Side */}
        <div className="relative hidden w-2/5 min-h-[400px] border-l border-outline-variant lg:block">
          <Image
            src={imageUrl}
            alt="Abstract artistic representation"
            fill
            className="object-cover opacity-90 mix-blend-multiply filter contrast-125 sepia-[.2]"
          />
        </div>
      </div>
    </section>
  );
}
