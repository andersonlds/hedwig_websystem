import { useState, useEffect } from 'react';
import { Music, Instagram, Youtube, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Footer() {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from('hero_config').select('*').eq('id', 1).single();
      if (data) setConfig(data);
    };
    fetchConfig();
  }, []);

  const description = config?.footer_description || 'Progressive Melodic Psytrance project. Explorando as frequências do cosmos através de batidas profundas e atmosferas imersivas.';
  const instagram = config?.social_instagram || '#';
  const soundcloud = config?.social_soundcloud || '#';
  const youtube = config?.social_youtube || '#';
  const bookingEmail = config?.booking_email || 'booking@hedwig.live';

  return (
    <footer className="relative border-t border-border bg-background py-12 nav:py-16 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 nav:px-6 relative z-10">

        {/* Layout multi-coluna acima de 900px, empilhado abaixo */}
        <div className="grid nav:grid-cols-4 gap-8 nav:gap-12">

          {/* Bloco 1: Logo + Descrição */}
          <div className="nav:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-8 w-8 rounded-lg bg-primary grid place-items-center">
                <Music className="text-background h-4 w-4" />
              </div>
              <span className="font-display font-black tracking-widest text-xl text-foreground">HEDWIG</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              {description}
            </p>
          </div>

          {/* Bloco 2: Social — em mobile, inline horizontal; em nav+ vertical */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-primary-glow mb-5">SOCIAL</h4>
            <div className="flex nav:flex-col flex-row flex-wrap gap-4">
              <a href={instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <Instagram className="h-4 w-4 group-hover:text-primary flex-shrink-0" /> Instagram
              </a>
              <a href={soundcloud} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <Music className="h-4 w-4 group-hover:text-primary flex-shrink-0" /> SoundCloud
              </a>
              <a href={youtube} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <Youtube className="h-4 w-4 group-hover:text-primary flex-shrink-0" /> YouTube
              </a>
            </div>
          </div>

          {/* Bloco 3: Booking */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-primary-glow mb-5">BOOKING</h4>
            <a
              href={`mailto:${bookingEmail}`}
              className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors underline underline-offset-4 break-all"
            >
              {bookingEmail} <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="mt-10 nav:mt-16 pt-8 border-t border-border flex flex-col nav:flex-row items-center justify-between gap-4 nav:gap-6">
          <p className="text-xs text-muted-foreground tracking-widest uppercase text-center nav:text-left">
            © {new Date().getFullYear()} HEDWIG. TODOS OS DIREITOS RESERVADOS.
          </p>
          <div className="flex items-center gap-4 nav:gap-8 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase text-center">
            <span className="hidden nav:inline">HEDWIG // SONIC ARCHITECTURE</span>
            <span className="h-1 w-1 bg-primary rounded-full hidden nav:inline" />
            <span>PROGRESSIVE MELODIC PSYTRANCE</span>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mb-48" />
    </footer>
  );
}
