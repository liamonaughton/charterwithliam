import Hero from '@/components/Hero';
import WhatsInside from '@/components/WhatsInside';
import Credibility from '@/components/Credibility';
import EmptyLegs from '@/components/EmptyLegs';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <WhatsInside />
      <Credibility />
      <EmptyLegs />
      <Faq />
      <Footer />
    </main>
  );
}
