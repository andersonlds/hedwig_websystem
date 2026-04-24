import { useState, useEffect } from 'react';
import { Music, Instagram, Youtube, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import HedwigLogo from './HedwigLogo';

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
  const email = config?.booking_email || 'booking@hedwig.live';

  return (
    <footer className="relative border-t border-border bg-background py-12 min-[900px]:py-16 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 min-[900px]:px-6 relative z-10">

        {/* Multi-coluna acima de 900px, empilhado abaixo */}
        <div className="grid min-[900px]:grid-cols-4 gap-8 min-[900px]:gap-12">

          {/* Logo + Descrição */}
          <div className="min-[900px]:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-8 w-8 rounded-lg bg-primary grid place-items-center overflow-hidden p-0.5">
                <HedwigLogo className="text-background h-full w-full" />
              </div>
              <span className="font-display font-black tracking-widest text-xl text-foreground">HEDWIG</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              {description}
            </p>
          </div>

          {/* Social — horizontal em mobile, vertical em nav+ */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-primary-glow mb-4 min-[900px]:mb-6">SOCIAL</h4>
            <div className="flex min-[900px]:flex-col flex-row flex-wrap gap-4">
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

          {/* Booking */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-primary-glow mb-4 min-[900px]:mb-6">BOOKING</h4>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors underline underline-offset-4 break-all"
            >
              {email} <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="mt-10 min-[900px]:mt-16 pt-8 border-t border-border flex flex-col min-[900px]:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground tracking-widest uppercase text-center min-[900px]:text-left">© {new Date().getFullYear()} HEDWIG. TODOS OS DIREITOS RESERVADOS</p>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mb-48" />
    </footer>
  );
}
