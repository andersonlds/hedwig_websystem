interface HedwigLogoProps {
  className?: string;
}

// Uses the actual HEDWIG owl logo image
export default function HedwigLogo({ className = 'h-5 w-5' }: HedwigLogoProps) {
  return (
    <img
      src="/logo/hedwig_logo.png"
      alt="HEDWIG Logo"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}
