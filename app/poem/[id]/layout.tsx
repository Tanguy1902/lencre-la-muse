import { Metadata } from "next";
import { getPoem } from "@/lib/firebase/firestore";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  let poem = null;
  try {
    poem = await getPoem(id);
  } catch (error) {
    console.warn(`Tsy nahazoana alalana ny metadata ho an'ny: ${id}`, error);
  }

  if (!poem) return { title: "Poème introuvable | L'Encre & La Muse" };

  return {
    title: `${poem.title} - par ${poem.authorName} | Ranomainty sy Aingam-panahy`,
    description: poem.excerpt,
    openGraph: {
      title: poem.title,
      description: poem.excerpt,
      images: [poem.imageUrl || "/og-image.png"],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: poem.title,
      description: poem.excerpt,
      images: [poem.imageUrl || "/og-image.png"],
    },
  };
}

export default function PoemLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
