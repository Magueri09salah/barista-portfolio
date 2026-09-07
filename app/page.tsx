import { getSiteContent } from "@/lib/site-content";
import { getPhotoMap } from "@/lib/images";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Philosophy } from "@/components/Philosophy";
import { Journey } from "@/components/Journey";
import { Craft } from "@/components/Craft";
import { Skills } from "@/components/Skills";
import { Credentials } from "@/components/Credentials";
import { Gallery } from "@/components/Gallery";
import { Services } from "@/components/Services";
import { Faq } from "@/components/Faq";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

/**
 * Content is loaded once here and handed down, rather than each section
 * fetching for itself — five of these are client components and could not
 * fetch anyway, and one load per page keeps the whole render on a single
 * cached read.
 */
export default async function Home() {
  const [content, photos] = await Promise.all([getSiteContent(), getPhotoMap()]);

  return (
    <>
      <Nav profile={content.profile} navLinks={content.navLinks} />
      <main id="main">
        <Hero profile={content.profile} photos={photos} />
        <About about={content.about} stats={content.stats} photos={photos} />
        <Philosophy principles={content.principles} />
        <Journey milestones={content.milestones} photos={photos} />
        <Craft methods={content.methods} photos={photos} />
        <Skills skillGroups={content.skillGroups} />
        <Credentials credentials={content.credentials} />
        <Gallery gallery={content.gallery} photos={photos} />
        <Services services={content.services} />
        <Faq faqs={content.faqs} />
        <Contact profile={content.profile} enquiryTypes={content.enquiryTypes} photos={photos} />
      </main>
      <Footer profile={content.profile} />
      <WhatsAppButton profile={content.profile} />
    </>
  );
}
