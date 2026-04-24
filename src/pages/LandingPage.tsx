import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Hero from '../components/landing/Hero';
import Vitals from '../components/landing/Vitals';
import Agenda from '../components/landing/Agenda';
import Multimedia from '../components/landing/Multimedia';
import Gallery from '../components/landing/Gallery';
import ReleaseMarquee from '../components/landing/ReleaseMarquee';
import Contact from '../components/landing/Contact';
import { useSupabaseQuery } from '../hooks/useSupabase';
import { Show, Release, GalleryPhoto } from '../types';

export default function LandingPage() {
  const { data: releases } = useSupabaseQuery<Release>('releases', 'order_index', true);
  const { data: shows } = useSupabaseQuery<Show>('shows', 'date', true);
  const { data: photos } = useSupabaseQuery<GalleryPhoto>('gallery', 'order_index', true);

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-5 lg:p-8 flex flex-col gap-4 md:gap-5 lg:gap-6 max-w-7xl mx-auto">
      <Navbar />

      <main className="grid grid-cols-12 gap-4 md:gap-5 lg:gap-6 mt-20">
        <Hero />
        <Vitals />
        <Agenda shows={shows} />
        <Multimedia />
        <Gallery photos={photos} />
        <ReleaseMarquee releases={releases} />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
