import { useProjectStore } from '../../../store/useProjectStore';

interface NavbarBlockProps {
  links?: string; // Comma separated list
  logoText?: string;
  hideButton?: boolean;
  bgType?: string;
  bgColor?: string;
  noShadow?: boolean;
  showDecoration?: boolean;
}

export const NavbarBlock = ({ links, logoText, hideButton, bgType = 'default', bgColor, noShadow = false, showDecoration = false }: NavbarBlockProps) => {
  const { activeProject } = useProjectStore();
  const config = activeProject?.config;

  const parsedLinks = links 
    ? links.split(',').map(l => l.trim()).filter(l => l.length > 0)
    : ["Home", "Features", "Preise", "Kontakt"];

  const customBg = bgType === 'custom' && bgColor ? { backgroundColor: bgColor } : {};
  const bgClass = bgType === 'transparent' ? 'bg-transparent' : (bgType === 'custom' ? '' : 'bg-white');
  const borderClass = noShadow || bgType === 'transparent' ? 'border-none shadow-none' : 'border-b border-gray-100 shadow-sm';

  return (
    <div className={`w-full flex items-center justify-between px-8 py-6 mb-4 rounded-theme relative overflow-hidden ${bgClass} ${borderClass}`} style={customBg}>
      {/* Decorative gradient blob */}
      {showDecoration && (
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-secondary blur-[50px] opacity-20 pointer-events-none z-0"></div>
      )}

      {/* Logo Area */}
      <div className="flex items-center gap-3 relative z-10">
        {config?.logo ? (
          <img src={config.logo} alt="Logo" className="h-8 max-w-[120px] object-contain" />
        ) : (
          <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center font-bold text-gray-500">
            L
          </div>
        )}
        <span className="font-bold text-xl tracking-tight text-gray-900">
          {logoText || activeProject?.name || "Mein Projekt"}
        </span>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 relative z-10">
        {parsedLinks.map((link, i) => (
          <a 
            key={i} 
            href={`#${link}`}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(link);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-primary cursor-pointer transition-colors"
          >
            {link}
          </a>
        ))}
      </div>

      {/* Action Area */}
      {!hideButton && (
        <div className="hidden md:block">
          <button className="px-5 py-2.5 bg-primary text-white rounded-theme text-sm font-medium hover:opacity-90 transition-opacity pointer-events-none">
            Get Started
          </button>
        </div>
      )}

      {/* Mobile Menu Icon */}
      <div className="md:hidden flex flex-col gap-1.5 pointer-events-none">
        <div className="w-6 h-0.5 bg-gray-600 rounded"></div>
        <div className="w-6 h-0.5 bg-gray-600 rounded"></div>
        <div className="w-6 h-0.5 bg-gray-600 rounded"></div>
      </div>
    </div>
  );
};
