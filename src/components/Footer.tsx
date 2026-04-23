import { Music, Instagram, Youtube, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-background py-16 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-lg bg-primary grid place-items-center">
                <Music className="text-background h-4 w-4" />
              </div>
              <span className="font-display font-black tracking-widest text-xl text-foreground">HEDWIG</span>
            </div>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Progressive Melodic Psytrance project. Explorando as frequências do cosmos através de batidas profundas e atmosferas imersivas.
            </p>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-primary-glow mb-6">SOCIAL</h4>
            <div className="flex flex-col gap-4">
              <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <Instagram className="h-4 w-4 group-hover:text-primary" /> Instagram
              </a>
              <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <Music className="h-4 w-4 group-hover:text-primary" /> SoundCloud
              </a>
              <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <Youtube className="h-4 w-4 group-hover:text-primary" /> YouTube
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-primary-glow mb-6">BOOKING</h4>
            <a 
              href="mailto:booking@hedwig.live" 
              className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors underline underline-offset-4"
            >
              booking@hedwig.live <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-muted-foreground tracking-widest uppercase">
            © {new Date().getFullYear()} HEDWIG PROJECT. TODOS OS DIREITOS RESERVADOS.
          </p>
          <div className="flex items-center gap-8 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
              <span>HEDWIG // SONIC ARCHITECTURE</span>
              <span className="h-1 w-1 bg-primary rounded-full" />
              <span>PROGRESSIVE MELODIC PSYTRANCE</span>
          </div>
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mb-48" />
    </footer>
  );
}
