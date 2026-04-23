import { Release } from '../../types';

interface ReleaseMarqueeProps {
  releases: Release[];
}

export default function ReleaseMarquee({ releases }: ReleaseMarqueeProps) {
  return (
    <div id="lancamentos" className="col-span-12 row-span-1 glass bg-primary/5 rounded-2xl md:rounded-3xl overflow-hidden flex items-center h-20 md:h-24">
      <div className="hidden md:flex flex-shrink-0 font-black text-[10px] text-primary tracking-widest mx-8 border-r border-primary/20 pr-8 h-full items-center uppercase">
        Discografia
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="flex gap-16 animate-marquee w-max items-center py-2 h-full">
          {releases.length > 0 ? [...releases, ...releases].map((release, i) => (
            <a key={`${release.id}-${i}`} href={release.spotifyLink} target="_blank" rel="noreferrer" className="flex items-center gap-4 group/rel">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-800 rounded-lg overflow-hidden border border-white/10 shadow-lg group-hover/rel:border-primary transition-all">
                <img src={release.coverUrl} className="w-full h-full object-cover" alt={release.title} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold uppercase text-white/80 group-hover/rel:text-primary transition-colors">{release.title}</span>
                <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em]">{release.type}</span>
              </div>
            </a>
          )) : (
             <div className="text-[10px] text-white/20 font-mono uppercase tracking-[0.4em] flex gap-12 animate-pulse">
                <span>Synchronizing Sonic Atlas...</span>
                <span>Establishing Neural Link...</span>
                <span>Waiting for Transmission...</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
