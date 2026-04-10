export function buildHtmlDocument(project) {
  const fontLink = getFontLink(project.config?.font);
  const fontFamily = getFontFamily(project.config?.font);
  const theme = project.config?.theme || {};

  const primaryColor = theme.primaryColor || '#000000';
  const secondaryColor = theme.secondaryColor || '#a855f7';
  const textColor = theme.textColor || '#111827';
  const radius = theme.borderRadius || '1.5rem';

  // Basis Farbe/Verlauf
  let bgStyle = `background-color: ${theme.backgroundColor || '#f9fafb'};`;
  if (theme.backgroundColor2 && theme.backgroundColor2 !== theme.backgroundColor) {
    bgStyle = `background: linear-gradient(135deg, ${theme.backgroundColor || '#ffffff'}, ${theme.backgroundColor2});`;
  }

  // Zusätzlicher Hintergrundbild-Layer über Pseudo-Element
  let bgImageStyle = '';
  if (theme.backgroundImage) {
    const bgUrl = processUrl(theme.backgroundImage, true);
    const bgSize = theme.backgroundSize === 'contain' ? 'contain' : (theme.backgroundSize === 'repeat' ? 'auto' : 'cover');
    const bgRepeat = theme.backgroundSize === 'repeat' ? 'repeat' : 'no-repeat';
    const bgOpacity = theme.backgroundOpacity ?? 1;
    bgImageStyle = `
      body::before {
        content: "";
        position: fixed;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        background-image: url('${bgUrl}');
        background-size: ${bgSize};
        background-repeat: ${bgRepeat};
        background-position: center;
        opacity: ${bgOpacity};
      }
    `;
  }

  // Generiere den HTML Header inkl. Tailwind CDN
  let html = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(project.name)}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: [${fontFamily}],
            },
            colors: {
              primary: 'var(--theme-primary)',
              secondary: 'var(--theme-secondary)',
            },
            borderRadius: {
              'theme': 'var(--theme-radius)',
            }
          }
        }
      }
    </script>
    ${fontLink}
    <style>
      :root {
        --theme-primary: ${primaryColor};
        --theme-secondary: ${secondaryColor};
        --theme-radius: ${radius};
      }
      body { 
        font-family: ${fontFamily}; 
        color: ${textColor};
        ${bgStyle}
      }
      ${bgImageStyle}
    </style>
</head>
<body class="overflow-x-hidden relative">
`;

  // Iteriere über Blöcke
  const page = project.pages?.[0];
  let blocksHtml = '';
  if (page && page.blocks && page.blocks.length > 0) {
    blocksHtml = page.blocks.map(b => renderBlockToHtml(b, project)).join('\n');
  } else {
    blocksHtml = `<div class="p-10 text-center"><h1 class="text-3xl">Leeres Projekt</h1></div>`;
  }

  let scrollToTopHtml = '';
  if (theme.showScrollToTop) {
    scrollToTopHtml = `
      <button onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" class="fixed bottom-8 right-8 w-12 h-12 bg-primary text-white rounded-full shadow-xl flex items-center justify-center hover:opacity-90 transition-opacity z-50 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
      </button>
    `;
  }

  html += `${blocksHtml}
${scrollToTopHtml}
</body>
</html>`;

  return html;
}

// Rewrites http://localhost:3001/uploads/... to ./assets/... for exports
function processUrl(url, isExport = true) {
  if (!url) return '';
  if (isExport && url.includes('/uploads/')) {
    const filename = url.split('/').pop();
    return `./assets/${filename}`;
  }
  return escapeStyleUrl(url);
}

// Hilfsfunktionen für Font-Mapping
function getFontLink(font) {
  switch (font) {
    case 'Merriweather': return `<link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap" rel="stylesheet">`;
    case 'Outfit': return `<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">`;
    default: return `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">`; // Inter
  }
}

function getFontFamily(font) {
  switch (font) {
    case 'Merriweather': return `"Merriweather", "serif"`;
    case 'Outfit': return `"Outfit", "sans-serif"`;
    case 'Roboto': return `"Roboto", "sans-serif"`;
    case 'Playfair Display': return `"Playfair Display", "serif"`;
    default: return `"Inter", "sans-serif"`;
  }
}

// Entflechtung der Blöcke
function renderBlockToHtml(block, project) {
  const props = block.props || {};

  switch (block.type) {
    case 'NavbarBlock': {
      const parsedLinks = props.links ? props.links.split(',').map(l => l.trim()).filter(l => l.length > 0) : ["Home", "Features", "Preise", "Kontakt"];
      const logoText = escapeHtml(props.logoText || project.name || "Mein Projekt");
      const logoImg = project.config?.logo ? processUrl(project.config.logo, true) : null;
      const linksHtml = parsedLinks.map(l => `<a href="#${escapeHtml(l)}" class="hover:text-primary cursor-pointer transition-colors">${escapeHtml(l)}</a>`).join('\n');
      
      const logoHtml = logoImg 
        ? `<img src="${logoImg}" alt="Logo" class="h-8 max-w-[120px] object-contain" />` 
        : `<div class="w-8 h-8 rounded bg-gray-200 flex items-center justify-center font-bold text-gray-500">L</div>`;

      const btnHtml = props.hideButton ? "" : `
        <div class="hidden md:block">
          <button class="px-5 py-2.5 bg-primary text-white rounded-theme text-sm font-medium hover:opacity-90 transition-opacity pointer-events-none">Get Started</button>
        </div>
      `;

      const customBg = props.bgType === 'custom' && props.bgColor ? `style="background-color: ${escapeHtml(props.bgColor)};"` : '';
      const bgClass = props.bgType === 'transparent' ? 'bg-transparent' : (props.bgType === 'custom' ? '' : 'bg-white');
      const borderClass = props.noShadow || props.bgType === 'transparent' ? 'border-none shadow-none' : 'border-b border-gray-100 shadow-sm';
      const decoHtml = props.showDecoration ? `<div class="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-secondary blur-[50px] opacity-20 pointer-events-none z-0"></div>` : "";
      const anchorAttr = props.anchorId ? `id="${escapeHtml(props.anchorId)}"` : '';

      return `
        <!-- NavbarBlock -->
        <div ${anchorAttr} class="w-full relative overflow-hidden flex items-center justify-between px-8 py-6 mb-4 rounded-theme ${bgClass} ${borderClass}" ${customBg}>
          ${decoHtml}
          <div class="flex items-center gap-3 relative z-10">
            ${logoHtml}
            <span class="font-bold text-xl tracking-tight text-gray-900">${logoText}</span>
          </div>
          <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 relative z-10">
            ${linksHtml}
          </nav>
          <div class="relative z-10">${btnHtml}</div>
        </div>
      `;
    }

    case 'HeroSection': {
      const headline = parseRichText(props.headline || "Dein unglaublicher Slogan steht hier.");
      const subline = parseRichText(props.subline || "Unterstützender Text, der Besuchern genau sagt, was du anbietest und warum sie hier klicken sollten.");
      const buttonText = escapeHtml(props.buttonText || "Mehr erfahren");
      const buttonHtml = props.hideButton ? "" : `<button class="px-8 py-4 bg-primary text-white rounded-theme font-medium shadow-lg hover:opacity-90 transition-opacity">${buttonText}</button>`;

      const customBg = props.bgType === 'custom' && props.bgColor ? `style="background-color: ${escapeHtml(props.bgColor)};"` : '';
      const bgClass = props.bgType === 'transparent' ? 'bg-transparent' : (props.bgType === 'custom' ? '' : 'bg-white');
      const borderClass = props.noShadow || props.bgType === 'transparent' ? 'border-none shadow-none' : 'border border-gray-100 shadow-sm';
      const decoHtml = (props.showDecoration || props.showDecoration === undefined) ? `<div class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-secondary blur-[80px] opacity-20 pointer-events-none z-0"></div>` : "";
      const anchorAttr = props.anchorId ? `id="${escapeHtml(props.anchorId)}"` : '';

      return `
        <!-- HeroSection -->
        <div ${anchorAttr} class="w-full max-w-7xl mx-auto relative overflow-hidden rounded-theme my-4 ${bgClass} ${borderClass}" ${customBg}>
          ${decoHtml}
          <div class="relative z-10 px-8 py-20 md:px-12 md:py-32 flex flex-col items-start justify-center">
            <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 max-w-3xl leading-tight">${headline}</h1>
            <p class="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed">${subline}</p>
            ${buttonHtml}
          </div>
        </div>
      `;
    }

    case 'TextBlock': {
      const title = props.title ? parseRichText(props.title) : "";
      const content = parseRichText(props.content || "Hier ist Platz für deinen Fließtext. Beschreibe detailliert einen Aspekt deines Unternehmens, erkläre ein Produkt oder teile einfach Informationen mit deinen Besuchern. Dieser Block passt sich an die Textmenge an.");
      const align = props.alignment || "left";
      
      const titleHtml = title ? `<h2 class="text-3xl font-bold text-gray-900 mb-6">${title}</h2>` : "";

      const customBg = props.bgType === 'custom' && props.bgColor ? `style="background-color: ${escapeHtml(props.bgColor)};"` : '';
      const bgClass = props.bgType === 'transparent' ? 'bg-transparent' : (props.bgType === 'custom' ? '' : '');
      const borderClass = props.noShadow || props.bgType === 'transparent' ? 'border-none shadow-none' : (props.bgType === 'custom' ? 'border border-gray-100 shadow-sm' : '');
      const paddingClass = props.bgType === 'custom' || props.bgType === 'white' ? 'p-8 md:p-12' : '';
      const decoHtml = props.showDecoration ? `<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-secondary blur-[100px] opacity-15 pointer-events-none z-0"></div>` : "";
      const anchorAttr = props.anchorId ? `id="${escapeHtml(props.anchorId)}"` : '';

      return `
        <!-- TextBlock -->
        <div ${anchorAttr} class="w-full py-16 px-8 md:px-12 my-2 text-${align} max-w-7xl mx-auto relative overflow-hidden rounded-theme ${bgClass} ${borderClass} ${paddingClass}" ${customBg}>
          ${decoHtml}
          <div class="relative z-10">
            ${titleHtml}
            <div class="prose max-w-none text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">${content}</div>
          </div>
        </div>
      `;
    }

    case 'ImageBlock': {
      if (!props.url) return `<div class="w-full py-8 px-4 flex flex-col items-center"><div class="w-full max-w-4xl aspect-[16/9] bg-gray-100 rounded-theme border-2 border-dashed border-gray-300"></div></div>`;
      
      const url = processUrl(props.url, true);
      const alt = escapeHtml(props.alt || "User Logo");
      const captionHtml = props.caption ? `<figcaption class="mt-4 text-center text-sm text-gray-500">${escapeHtml(props.caption)}</figcaption>` : "";

      return `
        <!-- ImageBlock -->
        <div class="w-full py-8 px-4 flex flex-col items-center max-w-7xl mx-auto">
          <figure class="max-w-4xl w-full">
            <img src="${url}" alt="${alt}" class="w-full h-auto rounded-theme shadow-xl object-cover" />
            ${captionHtml}
          </figure>
        </div>
      `;
    }

    case 'ButtonBlock': {
      const label = escapeHtml(props.label || "Klick mich");
      const link = escapeStyleUrl(props.url || "#");
      const align = props.alignment || "center";
      const variant = props.variant || "primary";

      const alignClass = align === 'center' ? 'center' : align === 'right' ? 'end' : 'start';
      let variantClass = "border-2 border-gray-200 text-gray-900 hover:border-primary";
      if (variant === 'primary') variantClass = "bg-primary text-white hover:opacity-90";
      if (variant === 'secondary') variantClass = "bg-secondary text-white hover:opacity-90";

      return `
        <!-- ButtonBlock -->
        <div class="w-full py-6 px-4 flex justify-${alignClass} max-w-7xl mx-auto">
          <a href="${link}" class="inline-flex items-center justify-center px-8 py-4 font-semibold rounded-theme transition-all shadow-sm hover:shadow-md ${variantClass}">
            ${label}
          </a>
        </div>
      `;
    }

    case 'SplitBlock': {
      const imageLeft = props.imageLeft !== false;
      const title = parseRichText(props.title || "Eine starke Aussage für dein Produkt.");
      const text = parseRichText(props.text || "Nutze diesen Text, um den Wert deines Bildes hervorzuheben.");
      const btn = escapeHtml(props.buttonLabel || "");
      const imgUrl = props.imageUrl ? processUrl(props.imageUrl, true) : "https://placehold.co/800x600/f3f4f6/a1a1aa?text=Platzhalter";

      const btnHtml = btn ? `<div><button class="px-6 py-3 bg-white border-2 border-primary text-primary rounded-theme font-bold hover:bg-primary hover:text-white transition-colors">${btn}</button></div>` : "";
      
      const imgHtml = `<div class="w-full h-full min-h-[300px] flex items-center justify-center relative z-10"><img src="${imgUrl}" class="w-full h-full object-cover rounded-theme shadow-xl max-h-[500px]" /></div>`;
      
      const customBg = props.bgType === 'custom' && props.bgColor ? `style="background-color: ${escapeHtml(props.bgColor)};"` : '';
      const bgClassGrid = props.bgType === 'transparent' ? 'bg-transparent' : (props.bgType === 'custom' ? '' : '');
      const borderClassGrid = props.noShadow || props.bgType === 'transparent' ? 'border-none shadow-none' : (props.bgType === 'custom' ? 'border border-gray-100 shadow-sm' : '');
      const paddingClass = props.bgType === 'custom' ? 'p-8 md:p-12' : '';
      
      const decoPositionClass = imageLeft ? "right-0 translate-x-1/3" : "left-0 -translate-x-1/3";
      const decoHtml = props.showDecoration ? `<div class="absolute top-1/2 ${decoPositionClass} -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-secondary blur-[120px] opacity-15 pointer-events-none z-0"></div>` : "";
      
      const txtHtml = `<div class="flex flex-col justify-center h-full px-4 py-8 md:p-12 pl-0 pr-0 relative z-10"><h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">${title}</h2><p class="text-lg text-gray-600 mb-8 leading-relaxed">${text}</p>${btnHtml}</div>`;
      const anchorAttr = props.anchorId ? `id="${escapeHtml(props.anchorId)}"` : '';

      return `
        <!-- SplitBlock -->
        <div ${anchorAttr} class="w-full py-16 overflow-hidden max-w-7xl mx-auto relative">
          ${decoHtml}
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center rounded-theme relative z-10 ${bgClassGrid} ${borderClassGrid} ${paddingClass}" ${customBg}>
            ${imageLeft ? imgHtml + txtHtml : txtHtml + imgHtml}
          </div>
        </div>
      `;
    }

    case 'FeaturesGridBlock': {
      const colStr = props.columns || '3';
      const colClass = colStr === '2' ? 'md:grid-cols-2' : colStr === '4' ? 'md:grid-cols-4' : 'md:grid-cols-3';
      
      const customBg = props.bgType === 'custom' && props.bgColor ? `style="background-color: ${escapeHtml(props.bgColor)};"` : '';
      const bgClassGrid = props.bgType === 'transparent' ? 'bg-transparent' : (props.bgType === 'custom' ? '' : 'bg-white');
      const borderClassGrid = props.noShadow || props.bgType === 'transparent' ? 'border-none shadow-none' : 'border border-gray-100 shadow-sm';

      const getIconSvg = (name) => {
        switch (name) {
          case 'zap': return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
          case 'shield': return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
          case 'heart': return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
          case 'lightbulb': return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`;
          case 'box': return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`;
          default: return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
        }
      };

      let gridContent = "";
      for (let i = 1; i <= parseInt(colStr); i++) {
        const featData = props[`f${i}`] || {};
        const featTitle = parseRichText(featData.title || `Feature ${i}`);
        const featText = parseRichText(featData.text || 'Beschreibung');
        const iconSvg = getIconSvg(featData.icon || 'star');

        gridContent += `
          <div class="flex flex-col items-start gap-4 p-6 rounded-theme hover:shadow-lg transition-shadow ${bgClassGrid} ${borderClassGrid}" ${customBg}>
            <div class="w-12 h-12 bg-primary text-white rounded-theme flex items-center justify-center shadow-md select-none font-bold">
              ${iconSvg}
            </div>
            <h3 class="text-xl font-bold text-gray-900">${featTitle}</h3>
            <p class="text-gray-600 leading-relaxed text-sm md:text-base">${featText}</p>
          </div>
        `;
      }

      const decoHtml = props.showDecoration ? `<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-secondary blur-[120px] opacity-10 pointer-events-none z-0"></div>` : "";
      const anchorAttr = props.anchorId ? `id="${escapeHtml(props.anchorId)}"` : '';

      return `
        <!-- FeaturesGridBlock -->
        <div ${anchorAttr} class="w-full py-16 px-6 max-w-7xl mx-auto relative overflow-hidden">
          ${decoHtml}
          <div class="grid grid-cols-1 ${colClass} gap-x-8 gap-y-12 relative z-10">
            ${gridContent}
          </div>
        </div>
      `;
    }
    case 'VideoBlock': {
      const title = props.title ? parseRichText(props.title) : "";
      const text = props.text ? parseRichText(props.text) : "";
      const url = props.url ? processUrl(props.url, true) : "";
      const autoPlayStr = props.autoPlay !== false ? "autoplay muted loop" : "";
      
      const titleHtml = title ? `<h2 class="text-3xl font-bold mb-4">${title}</h2>` : "";
      const textHtml = text ? `<p class="text-lg text-gray-600 max-w-2xl mx-auto">${text}</p>` : "";
      const headerHtml = (title || text) ? `<div class="max-w-4xl w-full text-center mb-8">${titleHtml}${textHtml}</div>` : "";
      const anchorAttr = props.anchorId ? `id="${escapeHtml(props.anchorId)}"` : '';

      return `
        <!-- VideoBlock -->
        <div ${anchorAttr} class="w-full py-16 px-4 flex flex-col items-center max-w-7xl mx-auto">
          ${headerHtml}
          ${url ? `
          <figure class="max-w-4xl w-full">
            <video src="${url}" controls ${autoPlayStr} class="w-full h-auto rounded-theme shadow-xl object-cover bg-black"></video>
          </figure>` : ''}
        </div>
      `;
    }

    case 'AvatarGridBlock': {
      const colStr = props.columns || '3';
      const colClass = colStr === '2' ? 'md:grid-cols-2' : colStr === '4' ? 'md:grid-cols-4' : 'md:grid-cols-3';
      
      const customBg = props.bgType === 'custom' && props.bgColor ? `style="background-color: ${escapeHtml(props.bgColor)};"` : '';
      const bgClassGrid = props.bgType === 'transparent' ? 'bg-transparent' : (props.bgType === 'custom' ? '' : 'bg-white');
      const borderClassGrid = props.noShadow || props.bgType === 'transparent' ? 'border-none shadow-none' : 'border border-gray-100 shadow-sm';

      let gridContent = "";
      for (let i = 1; i <= parseInt(colStr); i++) {
        const fData = props[`f${i}`] || {};
        const name = parseRichText(fData.name || '');
        const desc = parseRichText(fData.description || '');
        const avatarUrl = fData.avatarUrl ? processUrl(fData.avatarUrl, true) : "";

        const avatarHtml = avatarUrl
          ? `<img src="${avatarUrl}" alt="${escapeHtml(fData.name || '')}" class="w-full h-full object-cover" />`
          : `<div class="w-10 h-10 bg-gray-400 rounded-full select-none"></div>`;

        gridContent += `
          <div class="flex flex-col items-center text-center p-8 rounded-theme ${bgClassGrid} ${borderClassGrid}" ${customBg}>
            <div class="w-24 h-24 rounded-full overflow-hidden mb-6 bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
              ${avatarHtml}
            </div>
            ${name ? `<h4 class="text-xl font-bold mb-2">${name}</h4>` : ''}
            ${desc ? `<p class="text-gray-500 text-sm">${desc}</p>` : ''}
          </div>
        `;
      }

      const anchorAttr = props.anchorId ? `id="${escapeHtml(props.anchorId)}"` : '';

      return `
        <!-- AvatarGridBlock -->
        <div ${anchorAttr} class="w-full py-16 px-4">
          <div class="max-w-7xl mx-auto grid grid-cols-1 ${colClass} gap-8">
            ${gridContent}
          </div>
        </div>
      `;
    }

    case 'CarouselBlock': {
      const slidesCountStr = props.slidesCount || '3';
      const autoPlay = props.autoPlay !== false;
      const anchorAttr = props.anchorId ? `id="${escapeHtml(props.anchorId)}"` : '';

      let slidesContent = "";
      for (let i = 1; i <= parseInt(slidesCountStr); i++) {
        const sData = props[`s${i}`] || {};
        const title = parseRichText(sData.title || "");
        const desc = parseRichText(sData.description || "");
        const image = sData.image ? processUrl(sData.image, true) : "";

        const imageHtml = image 
          ? `<img src="${image}" alt="${escapeHtml(sData.title || '')}" class="w-full h-auto max-h-[60vh] object-contain" />` 
          : `<div class="w-full aspect-[4/3] bg-gray-200"></div>`;

        slidesContent += `
          <div class="snap-center shrink-0 w-[85vw] md:w-[60vw] lg:w-[40vw] flex flex-col items-center bg-white border border-gray-100 rounded-theme shadow-sm overflow-hidden">
            <div class="w-full flex items-center justify-center overflow-hidden relative bg-gray-50">
              ${imageHtml}
            </div>
            ${(title || desc) ? `
              <div class="p-6 text-center w-full">
                ${title ? `<h3 class="text-xl font-bold mb-2">${title}</h3>` : ''}
                ${desc ? `<p class="text-gray-500 text-sm">${desc}</p>` : ''}
              </div>
            ` : ''}
          </div>
        `;
      }

      const blockId = props.anchorId ? escapeHtml(props.anchorId) : 'carousel_' + Math.random().toString(36).substring(2, 9);
      const autoPlayScript = autoPlay ? `
        <script>
          window.addEventListener('load', function() {
            var container = document.getElementById('scroll_container_${blockId}');
            if (!container) return;
            var slides = container.children;
            var currentIndex = 0;
            if (slides.length <= 1) return;
            setInterval(function() {
              currentIndex = (currentIndex + 1) % slides.length;
              var target = slides[currentIndex];
              if (target) {
                container.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
              }
            }, 4000);
          });
        </script>
      ` : '';

      return `
        <!-- CarouselBlock -->
        <div ${anchorAttr ? `id="${blockId}"` : `id="wrap_${blockId}"`} class="w-full py-16 px-4 overflow-hidden relative group">
          <style>
            #scroll_container_${blockId}::-webkit-scrollbar { display: none; }
          </style>
          <div id="scroll_container_${blockId}" class="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8" style="scrollbar-width: none; -ms-overflow-style: none;">
            ${slidesContent}
          </div>
          ${autoPlayScript}
        </div>
      `;
    }

    default:
      return ``;
  }
}

function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function parseRichText(unsafe) {
  if (typeof unsafe !== 'string') return '';
  let parsed = escapeHtml(unsafe);
  parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
  parsed = parsed.replace(/\+\+(.*?)\+\+/g, '<span class="text-primary">$1</span>');
  parsed = parsed.replace(/--(.*?)--/g, '<span class="text-secondary">$1</span>');
  parsed = parsed.replace(/\n/g, '<br>');
  return parsed;
}

function escapeStyleUrl(url) {
  if (typeof url !== 'string') return '';
  return url.replace(/"/g, '%22');
}
