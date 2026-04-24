import { Metadata } from "next";
import { getPoem } from "@/lib/firebase/firestore";
import PoemClient from "./PoemClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const poem = await getPoem(id);

  if (!poem) {
    return {
      title: "Tononkalo tsy hita | L'Encre & La Muse",
    };
  }

  const title = `${poem.title} - Tononkalon'i ${poem.authorName}`;
  const description = poem.excerpt || "Vakio ity tononkalo ity ao amin'ny L'Encre & La Muse.";
  const image = poem.imageUrl || "/og-image.png"; // Fallback image

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function Page({ params }: Props) {
  return <PoemClient params={params} />;
}
