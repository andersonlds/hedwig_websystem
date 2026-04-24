import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import SectionHeader from './SectionHeader';
import { Upload, Loader2, Save, Music } from 'lucide-react';

interface HeroConfig {
  subtitle: string;
  title_line1: string;
  title_line2: string;
  spotify_link: string;
  image_url: string;
  playlist_title: string;
  playlist_subtitle: string;
  playlist_link: string;
  vitals_releases: string;
  vitals_countries: string;
  vitals_label: string;
  vitals_value: string;
  footer_description: string;
  social_instagram: string;
  social_soundcloud: string;
  social_youtube: string;
  booking_email: string;
  contact_label: string;
  contact_title_line1: string;
  contact_title_line2: string;
  contact_description: string;
}

export default function ManageHero() {
  const [config, setConfig] = useState<HeroConfig>({
    subtitle: '',
    title_line1: '',
    title_line2: '',
    spotify_link: '',
    image_url: '',
    playlist_title: '',
    playlist_subtitle: '',
    playlist_link: '',
    vitals_releases: '',
    vitals_countries: '',
    vitals_label: '',
    vitals_value: '',
    footer_description: '',
    social_instagram: '',
    social_soundcloud: '',
    social_youtube: '',
    booking_email: '',
    contact_label: '',
    contact_title_line1: '',
    contact_title_line2: '',
    contact_description: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    const { data, error } = await supabase.from('hero_config').select('*').eq('id', 1).single();
    if (!error && data) setConfig(data);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `hero-bg-${Date.now()}.${fileExt}`;
    const filePath = `hero/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(filePath, file);

    if (uploadError) {
      alert('Erro no upload: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(filePath);
    setConfig({ ...config, image_url: publicUrl });
    setUploading(false);
  };

  const handleSave = async () => {
    // 1. Validar se todos os campos estão preenchidos
    const emptyFields = Object.entries(config).filter(([key, value]) => !value);
    if (emptyFields.length > 0) {
      alert("ERRO: Todos os campos são obrigatórios. Por favor, preencha tudo antes de salvar.");
      return;
    }

    setSaving(true);
    
    // 2. Transformar campos de texto em MAIÚSCULO (exceto links e e-mail)
    const upperConfig = { ...config };
    const fieldsToExclude = [
      'spotify_link', 
      'image_url', 
      'playlist_link', 
      'social_instagram', 
      'social_soundcloud', 
      'social_youtube', 
      'booking_email'
    ];

    Object.keys(upperConfig).forEach(key => {
      if (!fieldsToExclude.includes(key) && typeof upperConfig[key as keyof HeroConfig] === 'string') {
        (upperConfig as any)[key] = upperConfig[key as keyof HeroConfig].toUpperCase();
      }
    });

    const { error } = await supabase
      .from('hero_config')
      .upsert({ id: 1, ...upperConfig });

    if (error) {
      alert('Erro ao salvar: ' + error.message);
    } else {
      alert('Configurações salvas!');
      // Atualizar o estado local com os valores processados para o formulário refletir o banco
      setConfig(upperConfig);
    }
    setSaving(false);
  };

  if (loading) return <div className="text-center py-20 uppercase tracking-widest text-xs font-bold opacity-40">Carregando configurações...</div>;

  return (
    <div>
      <SectionHeader title="CONFIGURAÇÃO DO HERO" description="Edite os textos e a imagem de destaque do seu site." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Upload de Imagem — agora em primeiro */}
        <div className="space-y-8 lg:order-2">
          <div className="glass p-6 md:p-10 rounded-[2rem] space-y-6 md:space-y-8">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2 block mb-4">Imagem de Fundo (Background)</label>
              <div className="aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 relative group mb-6">
                 {config.image_url ? (
                   <img src={config.image_url} className="w-full h-full object-cover" alt="Hero" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px] font-bold tracking-widest uppercase">Sem Imagem</div>
                 )}
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="relative">
                       <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                       />
                       <div className="px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] tracking-widest flex items-center gap-2">
                          {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                          ALTERAR IMAGEM
                       </div>
                    </div>
                 </div>
              </div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold leading-relaxed">
                Dica: Use imagens de alta resolução (1920x1080 ou superior). <br />
                Formatos recomendados: JPG ou WebP.
              </p>
           </div>
        </div>

        {/* Formulário — agora em segundo na ordem mas em primeiro visualmente se quisermos */}
        <div className="glass p-6 md:p-10 rounded-[2rem] space-y-6 md:space-y-8 lg:order-1">
           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Subtítulo (Topo)</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" 
                placeholder="Ex: DEEP PROGRESSIVE MELODIC PSYTRANCE" 
                value={config.subtitle} 
                onChange={e => setConfig({...config, subtitle: e.target.value})} 
              />
           </div>

           <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Título Linha 1</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" 
                  placeholder="Ex: A JORNADA" 
                  value={config.title_line1} 
                  onChange={e => setConfig({...config, title_line1: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Título Linha 2</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-primary" 
                  placeholder="Ex: HEDWIG" 
                  value={config.title_line2} 
                  onChange={e => setConfig({...config, title_line2: e.target.value})} 
                />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Link do Spotify (Botão Hero)</label>
              <div className="relative">
                <Music className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-14 pr-6 py-4 text-sm" 
                  placeholder="https://open.spotify.com/..." 
                  value={config.spotify_link} 
                  onChange={e => setConfig({...config, spotify_link: e.target.value})} 
                />
              </div>
           </div>

           <div className="h-px bg-white/5 my-8" />
           <h3 className="text-xs font-black tracking-[0.2em] uppercase text-primary mb-6">Configuração da Playlist</h3>

           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Título da Playlist</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" 
                placeholder="Ex: CURATED SONIC JOURNEY" 
                value={config.playlist_title} 
                onChange={e => setConfig({...config, playlist_title: e.target.value})} 
              />
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Subtítulo da Playlist</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" 
                placeholder="Ex: SPOTIFY OFFICIAL PLAYLIST" 
                value={config.playlist_subtitle} 
                onChange={e => setConfig({...config, playlist_subtitle: e.target.value})} 
              />
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Link da Playlist</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" 
                placeholder="https://open.spotify.com/playlist/..." 
                value={config.playlist_link} 
                onChange={e => setConfig({...config, playlist_link: e.target.value})} 
              />
           </div>

           <div className="h-px bg-white/5 my-8" />
           <h3 className="text-xs font-black tracking-[0.2em] uppercase text-primary mb-6">Métricas (Vitals)</h3>
           
           <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Nº Lançamentos</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" 
                  value={config.vitals_releases} 
                  onChange={e => setConfig({...config, vitals_releases: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Nº Países</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" 
                  value={config.vitals_countries} 
                  onChange={e => setConfig({...config, vitals_countries: e.target.value})} 
                />
              </div>
           </div>

           <div className="space-y-2 mb-6">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Título do Rodapé (Vitals)</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" 
                value={config.vitals_label} 
                onChange={e => setConfig({...config, vitals_label: e.target.value})} 
              />
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Valor do Rodapé (Vitals)</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" 
                value={config.vitals_value} 
                onChange={e => setConfig({...config, vitals_value: e.target.value})} 
              />
           </div>

           <div className="h-px bg-white/5 my-8" />
           <h3 className="text-xs font-black tracking-[0.2em] uppercase text-primary mb-6">Configuração do Rodapé</h3>

           <div className="space-y-2 mb-6">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Descrição do Projeto</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm min-h-[100px]" 
                value={config.footer_description} 
                onChange={e => setConfig({...config, footer_description: e.target.value})} 
              />
           </div>

           <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Instagram (Link)</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" 
                  value={config.social_instagram} 
                  onChange={e => setConfig({...config, social_instagram: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">SoundCloud (Link)</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" 
                  value={config.social_soundcloud} 
                  onChange={e => setConfig({...config, social_soundcloud: e.target.value})} 
                />
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">YouTube (Link)</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" 
                  value={config.social_youtube} 
                  onChange={e => setConfig({...config, social_youtube: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">E-mail para Booking</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" 
                  value={config.booking_email} 
                  onChange={e => setConfig({...config, booking_email: e.target.value})} 
                />
              </div>
           </div>

           <div className="h-px bg-white/5 my-8" />
           <h3 className="text-xs font-black tracking-[0.2em] uppercase text-primary mb-6">Configuração de Contato</h3>

           <div className="space-y-2 mb-6">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Etiqueta Superior (ex: Connect)</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" 
                value={config.contact_label} 
                onChange={e => setConfig({...config, contact_label: e.target.value})} 
              />
           </div>

           <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Título Linha 1</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" 
                  value={config.contact_title_line1} 
                  onChange={e => setConfig({...config, contact_title_line1: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Título Linha 2 (Destaque)</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" 
                  value={config.contact_title_line2} 
                  onChange={e => setConfig({...config, contact_title_line2: e.target.value})} 
                />
              </div>
           </div>

           <div className="space-y-2 mb-6">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Descrição de Contato</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm min-h-[100px]" 
                value={config.contact_description} 
                onChange={e => setConfig({...config, contact_description: e.target.value})} 
              />
           </div>

           <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full py-5 rounded-2xl bg-primary text-background font-black text-xs tracking-[0.3em] flex items-center justify-center gap-3 hover:shadow-glow transition-all"
           >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              SALVAR ALTERAÇÕES
           </button>
        </div>


      </div>
    </div>
  );
}
