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

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Philosophy />
        <Journey />
        <Craft />
        <Skills />
        <Credentials />
        <Gallery />
        <Services />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
