import { useState } from 'react';
import { Type, Image as ImageIcon, LayoutTemplate, Link, X, Navigation, Grid, Columns, Upload, ChevronDown, ChevronUp, Film, Users, GalleryHorizontal } from 'lucide-react';
import { DraggableBlockType } from './DraggableBlockType';
import { useProjectStore } from '../../store/useProjectStore';
import { api } from '../../lib/api';

const AVAILABLE_BLOCKS = [
  { type: 'NavbarBlock', label: 'Navigation', icon: Navigation },
  { type: 'HeroSection', label: 'Hero Header', icon: LayoutTemplate },
  { type: 'CarouselBlock', label: 'Carousel Slider', icon: GalleryHorizontal },
  { type: 'AvatarGridBlock', label: 'Avatar Cards', icon: Users },
  { type: 'FeaturesGridBlock', label: 'Features Grid', icon: Grid },
  { type: 'SplitBlock', label: 'Spalten Layout', icon: Columns },
  { type: 'TextBlock', label: 'Text Block', icon: Type },
  { type: 'ImageBlock', label: 'Bild', icon: ImageIcon },
  { type: 'VideoBlock', label: 'Video', icon: Film },
  { type: 'ButtonBlock', label: 'Button', icon: Link },
];

export const Sidebar = () => {
  const { activeProject, setActiveProject, selectedBlockId, setSelectedBlockId, updateBlock } = useProjectStore();
  const [globalSettingsOpen, setGlobalSettingsOpen] = useState(false);

  if (!activeProject) return null;

  const selectedBlock = activeProject.pages[0].blocks.find(b => b.id === selectedBlockId);
  const theme = activeProject.config?.theme || {};

  const updateTheme = (updates: Partial<typeof theme>) => {
    setActiveProject({
      ...activeProject,
      config: {
        ...activeProject.config,
        theme: { ...theme, ...updates }
      }
    });
  };

  const handleFileUpload = async (file: File, blockId: string, property: string) => {
    try {
      const url = await api.uploadFile(file);
      updateBlock(blockId, { [property]: url });
    } catch(err) {
      alert("Fehler beim Hochladen.");
      console.error(err);
    }
  };

  return (
    <aside className="w-80 bg-white border-r border-gray-200 shrink-0 flex flex-col h-full">
      {selectedBlock ? (
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="text-sm font-bold text-gray-800">Block bearbeiten</h3>
            <button onClick={() => setSelectedBlockId(null)} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
              <X size={18} className="text-gray-500" />
            </button>
          </div>
          <div className="p-6 flex-1 overflow-auto space-y-6">
            <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded text-xs font-mono inline-block">
              {selectedBlock.type}
            </div>

            {/* Inpsector: Navbar */}
            {selectedBlock.type === 'NavbarBlock' && (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Logo Name / Title</label>
                  <input 
                    type="text"
                    value={selectedBlock.props.logoText || ''} 
                    onChange={e => updateBlock(selectedBlock.id, { logoText: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-black mb-4"
                    placeholder="Mein Projekt"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Navigations-Links</label>
                  <p className="text-xs text-gray-400 mb-2">Kommagetrennte Wörter (z.B. Home, Über uns, Kontakt)</p>
                  <textarea 
                    value={selectedBlock.props.links || ''} 
                    onChange={e => updateBlock(selectedBlock.id, { links: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-20 focus:ring-1 focus:ring-black"
                    placeholder="Home, Über uns, Kontakt"
                  />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <input 
                    type="checkbox" 
                    id="hideBtnNav"
                    checked={selectedBlock.props.hideButton || false}
                    onChange={e => updateBlock(selectedBlock.id, { hideButton: e.target.checked })}
                  />
                  <label htmlFor="hideBtnNav" className="text-sm font-medium text-gray-700">Button ausblenden?</label>
                </div>
              </>
            )}

            {/* Inpsector: HeroSection */}
            {selectedBlock.type === 'HeroSection' && (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Überschrift</label>
                  <textarea 
                    value={selectedBlock.props.headline || ''} 
                    onChange={e => updateBlock(selectedBlock.id, { headline: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-20 focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Untertitel</label>
                  <textarea 
                    value={selectedBlock.props.subline || ''} 
                    onChange={e => updateBlock(selectedBlock.id, { subline: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent min-h-[100px]"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Tipp: ++Farbe++, **Fett**, *Kursiv* (kombinierbar: ++*Fett & Farbig*++)</p>
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                  <input 
                    type="checkbox" 
                    id="hideBtnHero"
                    checked={!selectedBlock.props.hideButton}
                    onChange={e => updateBlock(selectedBlock.id, { hideButton: !e.target.checked })}
                  />
                  <label htmlFor="hideBtnHero" className="text-sm font-medium text-gray-700">Button anzeigen?</label>
                </div>

                {!selectedBlock.props.hideButton && (
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Button Text</label>
                    <input 
                      type="text"
                      value={selectedBlock.props.buttonText || ''} 
                      onChange={e => updateBlock(selectedBlock.id, { buttonText: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-black"
                    />
                  </div>
                )}
              </>
            )}

            {/* Inpsector: TextBlock */}
            {selectedBlock.type === 'TextBlock' && (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Titel (Optional)</label>
                  <input 
                    type="text"
                    value={selectedBlock.props.title || ''} 
                    onChange={e => updateBlock(selectedBlock.id, { title: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Text-Inhalt</label>
                  <textarea 
                    value={selectedBlock.props.content || ''} 
                    onChange={e => updateBlock(selectedBlock.id, { content: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-40 focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Ausrichtung</label>
                  <select 
                    value={selectedBlock.props.alignment || 'left'} 
                    onChange={e => updateBlock(selectedBlock.id, { alignment: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-black"
                  >
                    <option value="left">Links</option>
                    <option value="center">Mittig</option>
                    <option value="right">Rechts</option>
                  </select>
                </div>
              </>
            )}

            {/* Inpsector: FeaturesGridBlock */}
            {selectedBlock.type === 'FeaturesGridBlock' && (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Anzahl Spalten</label>
                  <select 
                    value={selectedBlock.props.columns || '3'} 
                    onChange={e => updateBlock(selectedBlock.id, { columns: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-black"
                  >
                    <option value="2">2 Spalten</option>
                    <option value="3">3 Spalten</option>
                    <option value="4">4 Spalten</option>
                  </select>
                </div>

                {Array.from({ length: parseInt(selectedBlock.props.columns || '3') }).map((_, i) => {
                  const fKey = `f${i + 1}`;
                  const defaultData = [
                    { icon: 'star', title: 'Feature 1', text: 'Beschreibe hier dein erstes tolles Feature.' },
                    { icon: 'zap', title: 'Feature 2', text: 'Was macht dein Produkt oder deinen Service einzigartig?' },
                    { icon: 'shield', title: 'Feature 3', text: 'Überzeuge die Kunden mit handfesten Argumenten.' },
                    { icon: 'heart', title: 'Feature 4', text: 'Ein weiteres wichtiges Merkmal.' }
                  ][i] || {};
                  
                  const fData = selectedBlock.props[fKey] || defaultData;
                  
                  return (
                    <div key={i} className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-xs font-bold text-gray-600 mb-3">Zelle {i + 1}</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-medium text-gray-500 uppercase mb-1 block">Titel</label>
                          <input 
                            type="text" 
                            value={fData.title || ''} 
                            onChange={e => updateBlock(selectedBlock.id, { [fKey]: { ...fData, title: e.target.value }})}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-medium text-gray-500 uppercase mb-1 block">Text</label>
                          <textarea 
                            value={fData.text || ''} 
                            onChange={e => updateBlock(selectedBlock.id, { [fKey]: { ...fData, text: e.target.value }})}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm h-16 focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-medium text-gray-500 uppercase mb-1 block">Icon</label>
                          <select 
                            value={fData.icon || 'star'} 
                            onChange={e => updateBlock(selectedBlock.id, { [fKey]: { ...fData, icon: e.target.value }})}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-black"
                          >
                            <option value="star">Stern (Star)</option>
                            <option value="zap">Blitz (Zap)</option>
                            <option value="shield">Schild (Shield)</option>
                            <option value="heart">Herz (Heart)</option>
                            <option value="lightbulb">Idee (Lightbulb)</option>
                            <option value="box">Box (Box)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
            {/* Inpsector: AvatarGridBlock */}
            {selectedBlock.type === 'AvatarGridBlock' && (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Anzahl Spalten</label>
                  <select 
                    value={selectedBlock.props.columns || '3'} 
                    onChange={e => updateBlock(selectedBlock.id, { columns: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-black"
                  >
                    <option value="2">2 Spalten</option>
                    <option value="3">3 Spalten</option>
                    <option value="4">4 Spalten</option>
                  </select>
                </div>

                {Array.from({ length: parseInt(selectedBlock.props.columns || '3') }).map((_, i) => {
                  const fKey = `f${i + 1}`;
                  const defaultData = [
                    { name: 'Max Mustermann', description: 'Gründer & CEO' },
                    { name: 'Erika Musterfrau', description: 'Head of Design' },
                    { name: 'John Doe', description: 'Lead Developer' },
                    { name: 'Jane Smith', description: 'Marketing' }
                  ][i] || {};
                  
                  const fData = selectedBlock.props[fKey] || defaultData;
                  
                  return (
                    <div key={i} className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-xs font-bold text-gray-600 mb-3">Avatar {i + 1}</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-medium text-gray-500 uppercase mb-1 block">Bild</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="URL..."
                              value={fData.avatarUrl || ''} 
                              onChange={e => updateBlock(selectedBlock.id, { [fKey]: { ...fData, avatarUrl: e.target.value }})}
                              className="flex-1 w-0 border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-black"
                            />
                            <label className="p-1 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 transition-colors shrink-0">
                              <Upload size={16} />
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={async e => {
                                  if (e.target.files && e.target.files[0]) {
                                    try {
                                      const url = await api.uploadFile(e.target.files[0]);
                                      updateBlock(selectedBlock.id, { [fKey]: { ...fData, avatarUrl: url }});
                                    } catch(err) {
                                      alert("Fehler beim Hochladen.");
                                    }
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-medium text-gray-500 uppercase mb-1 block">Name</label>
                          <input 
                            type="text" 
                            value={fData.name || ''} 
                            onChange={e => updateBlock(selectedBlock.id, { [fKey]: { ...fData, name: e.target.value }})}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-medium text-gray-500 uppercase mb-1 block">Beschreibung/Rolle</label>
                          <textarea 
                            value={fData.description || ''} 
                            onChange={e => updateBlock(selectedBlock.id, { [fKey]: { ...fData, description: e.target.value }})}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm h-16 focus:ring-1 focus:ring-black"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* Inpsector: CarouselBlock */}
            {selectedBlock.type === 'CarouselBlock' && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <input 
                    type="checkbox" 
                    id="autoPlayCarousel"
                    checked={selectedBlock.props.autoPlay ?? true}
                    onChange={e => updateBlock(selectedBlock.id, { autoPlay: e.target.checked })}
                  />
                  <label htmlFor="autoPlayCarousel" className="text-sm font-medium text-gray-700">Auto-Play (Swipen)</label>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Anzahl Slides</label>
                  <select 
                    value={selectedBlock.props.slidesCount || '3'} 
                    onChange={e => updateBlock(selectedBlock.id, { slidesCount: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-black"
                  >
                    <option value="3">3 Slides</option>
                    <option value="4">4 Slides</option>
                    <option value="5">5 Slides</option>
                    <option value="6">6 Slides</option>
                  </select>
                </div>

                {Array.from({ length: parseInt(selectedBlock.props.slidesCount || '3') }).map((_, i) => {
                  const sKey = `s${i + 1}`;
                  const defaultData = { title: `Slide ${i + 1}`, description: `Beispielbeschreibung für Slide ${i + 1}` };
                  const sData = selectedBlock.props[sKey] || defaultData;
                  
                  return (
                    <div key={i} className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-xs font-bold text-gray-600 mb-3">Slide {i + 1}</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-medium text-gray-500 uppercase mb-1 block">Bild</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="URL..."
                              value={sData.image || ''} 
                              onChange={e => updateBlock(selectedBlock.id, { [sKey]: { ...sData, image: e.target.value }})}
                              className="flex-1 w-0 border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-black"
                            />
                            <label className="p-1 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 transition-colors shrink-0">
                              <Upload size={16} />
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={async e => {
                                  if (e.target.files && e.target.files[0]) {
                                    try {
                                      const url = await api.uploadFile(e.target.files[0]);
                                      updateBlock(selectedBlock.id, { [sKey]: { ...sData, image: url }});
                                    } catch(err) {
                                      alert("Fehler beim Hochladen.");
                                    }
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-medium text-gray-500 uppercase mb-1 block">Titel (Optional)</label>
                          <input 
                            type="text" 
                            value={sData.title || ''} 
                            onChange={e => updateBlock(selectedBlock.id, { [sKey]: { ...sData, title: e.target.value }})}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-medium text-gray-500 uppercase mb-1 block">Text (Optional)</label>
                          <textarea 
                            value={sData.description || ''} 
                            onChange={e => updateBlock(selectedBlock.id, { [sKey]: { ...sData, description: e.target.value }})}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm h-16 focus:ring-1 focus:ring-black"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* Inpsector: VideoBlock */}
            {selectedBlock.type === 'VideoBlock' && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <input 
                    type="checkbox" 
                    id="autoPlayVideo"
                    checked={selectedBlock.props.autoPlay ?? true}
                    onChange={e => updateBlock(selectedBlock.id, { autoPlay: e.target.checked })}
                  />
                  <label htmlFor="autoPlayVideo" className="text-sm font-medium text-gray-700">Auto-Play & Loop</label>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Titel</label>
                  <input 
                    type="text"
                    value={selectedBlock.props.title || ''} 
                    onChange={e => updateBlock(selectedBlock.id, { title: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Beschreibung</label>
                  <textarea 
                    value={selectedBlock.props.text || ''} 
                    onChange={e => updateBlock(selectedBlock.id, { text: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-24 focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Video (URL oder Upload)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="https://...mp4"
                      value={selectedBlock.props.url || ''} 
                      onChange={e => updateBlock(selectedBlock.id, { url: e.target.value })}
                      className="flex-1 w-0 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-black"
                    />
                    <label className="px-3 py-2 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 transition-colors shrink-0">
                      <Upload size={18} />
                      <input 
                        type="file" 
                        accept="video/*" 
                        className="hidden" 
                        onChange={async e => {
                          if (e.target.files && e.target.files[0]) {
                            try {
                              const url = await api.uploadFile(e.target.files[0]);
                              updateBlock(selectedBlock.id, { url });
                            } catch(err) {
                              alert("Fehler beim Hochladen.");
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Inpsector: SplitBlock */}
            {selectedBlock.type === 'SplitBlock' && (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Titel</label>
                  <input 
                    type="text"
                    value={selectedBlock.props.title || ''} 
                    onChange={e => updateBlock(selectedBlock.id, { title: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Text</label>
                  <textarea 
                    value={selectedBlock.props.text || ''} 
                    onChange={e => updateBlock(selectedBlock.id, { text: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-20 focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Bild</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input 
                      type="text"
                      placeholder="https://..."
                      value={selectedBlock.props.imageUrl || ''} 
                      onChange={e => updateBlock(selectedBlock.id, { imageUrl: e.target.value })}
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-black"
                    />
                    <label className="p-2 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 transition-colors">
                      <Upload size={16} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0], selectedBlock.id, 'imageUrl');
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                  <input 
                    type="checkbox" 
                    id="swapSides"
                    checked={selectedBlock.props.imageLeft !== false}
                    onChange={e => updateBlock(selectedBlock.id, { imageLeft: e.target.checked })}
                  />
                  <label htmlFor="swapSides" className="text-sm font-medium text-gray-700">Bild auf der linken Seite?</label>
                </div>
              </>
            )}

            {/* Inpsector: ImageBlock */}
            {selectedBlock.type === 'ImageBlock' && (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Bild</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input 
                      type="text"
                      placeholder="https://..."
                      value={selectedBlock.props.url || ''} 
                      onChange={e => updateBlock(selectedBlock.id, { url: e.target.value })}
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-black"
                    />
                    <label className="p-2 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 transition-colors">
                      <Upload size={16} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0], selectedBlock.id, 'url');
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Alt-Text</label>
                  <input 
                    type="text"
                    value={selectedBlock.props.alt || ''} 
                    onChange={e => updateBlock(selectedBlock.id, { alt: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Bildunterschrift (Optional)</label>
                  <input 
                    type="text"
                    value={selectedBlock.props.caption || ''} 
                    onChange={e => updateBlock(selectedBlock.id, { caption: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-black"
                  />
                </div>
              </>
            )}

            {/* Inpsector: ButtonBlock */}
            {selectedBlock.type === 'ButtonBlock' && (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Label</label>
                  <input 
                    type="text"
                    value={selectedBlock.props.label || ''} 
                    onChange={e => updateBlock(selectedBlock.id, { label: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Link (URL)</label>
                  <input 
                    type="text"
                    value={selectedBlock.props.url || ''} 
                    onChange={e => updateBlock(selectedBlock.id, { url: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Variante</label>
                  <select 
                    value={selectedBlock.props.variant || 'primary'} 
                    onChange={e => updateBlock(selectedBlock.id, { variant: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-black"
                  >
                    <option value="primary">Primär (Brand Color)</option>
                    <option value="secondary">Sekundär (Accent Color)</option>
                    <option value="outline">Outline</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Ausrichtung</label>
                  <select 
                    value={selectedBlock.props.alignment || 'center'} 
                    onChange={e => updateBlock(selectedBlock.id, { alignment: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-black"
                  >
                    <option value="left">Links</option>
                    <option value="center">Mittig</option>
                    <option value="right">Rechts</option>
                  </select>
                </div>
              </>
            )}
            
            {/* Geerbte Design-Einstellungen für ALLE Blöcke */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Block Darstellung</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Hintergrund</label>
                  <select 
                    value={selectedBlock.props.bgType || 'default'} 
                    onChange={e => updateBlock(selectedBlock.id, { bgType: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-black"
                  >
                    <option value="default">Standard (Card)</option>
                    <option value="transparent">Transparent</option>
                    <option value="custom">Eigene Farbe</option>
                  </select>
                </div>

                {selectedBlock.props.bgType === 'custom' && (
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Block-Farbe</label>
                    <div className="relative">
                      <input 
                        type="color" 
                        value={selectedBlock.props.bgColor || '#ffffff'}
                        onChange={e => updateBlock(selectedBlock.id, { bgColor: e.target.value })}
                        className="w-full h-8 rounded cursor-pointer border border-gray-300 p-0" 
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="noShadow"
                    checked={selectedBlock.props.noShadow || false}
                    onChange={e => updateBlock(selectedBlock.id, { noShadow: e.target.checked })}
                  />
                  <label htmlFor="noShadow" className="text-sm font-medium text-gray-700">Rahmen & Schatten verbergen</label>
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="showDecoration"
                    checked={selectedBlock.props.showDecoration || false}
                    onChange={e => updateBlock(selectedBlock.id, { showDecoration: e.target.checked })}
                  />
                  <label htmlFor="showDecoration" className="text-sm font-medium text-gray-700">Dekorativer Farbverlauf (Blob)</label>
                </div>

                <div className="pt-2 border-t mt-2">
                  <label className="text-xs font-medium text-gray-700 block mb-1">Block-ID (für Navigation)</label>
                  <input 
                    type="text"
                    placeholder="z.B. BAUEN"
                    value={selectedBlock.props.anchorId || ''} 
                    onChange={e => updateBlock(selectedBlock.id, { anchorId: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-black"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Wird in der NavBar genutzt, um genau hierher zu springen.</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => {
                const newPages = [...activeProject.pages];
                newPages[0].blocks = newPages[0].blocks.filter(b => b.id !== selectedBlock.id);
                useProjectStore.getState().setActiveProject({ ...activeProject, pages: newPages });
              }}
              className="mt-8 w-full py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              Block löschen
            </button>
          </div>
        </div>
      ) : (
         <div className="flex flex-col h-full overflow-hidden">
          <div className="border-b border-gray-200 shrink-0 bg-gray-50 flex flex-col">
            <button 
              onClick={() => setGlobalSettingsOpen(!globalSettingsOpen)}
              className="p-4 flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer w-full text-left"
            >
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Globale Einstellungen</h3>
              {globalSettingsOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>
            
            {globalSettingsOpen && (
              <div className="p-6 pt-2 space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar border-t border-gray-100">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-sm font-medium text-gray-700">Hauptfarbe</label>
                  <div className="relative">
                    <input 
                      type="color" 
                      value={theme.primaryColor || '#000000'}
                      onChange={e => updateTheme({ primaryColor: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0" 
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <label className="text-sm font-medium text-gray-700">Sekundärfarbe</label>
                  <div className="relative">
                    <input 
                      type="color" 
                      value={theme.secondaryColor || '#a855f7'}
                      onChange={e => updateTheme({ secondaryColor: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0" 
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <label className="text-sm font-medium text-gray-700">Textfarbe</label>
                  <div className="relative">
                    <input 
                      type="color" 
                      value={theme.textColor || '#111827'}
                      onChange={e => updateTheme({ textColor: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0" 
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 border-t pt-4 mt-2">
                  <label className="text-sm font-medium text-gray-700">Hintergrund 1</label>
                  <div className="relative">
                    <input 
                      type="color" 
                      value={theme.backgroundColor || '#f9fafb'}
                      onChange={e => updateTheme({ backgroundColor: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0" 
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Hintergrund 2</label>
                    <p className="text-[10px] text-gray-500">Für Farbverlauf</p>
                  </div>
                  <div className="relative">
                    <input 
                      type="color" 
                      value={theme.backgroundColor2 || theme.backgroundColor || '#f9fafb'}
                      onChange={e => updateTheme({ backgroundColor2: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Oder: Hintergrundbild</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      placeholder="https://..."
                      value={theme.backgroundImage || ''} 
                      onChange={e => updateTheme({ backgroundImage: e.target.value })}
                      className="flex-1 w-0 border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-black"
                    />
                    <label className="p-1 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 transition-colors shrink-0">
                      <Upload size={14} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={async e => {
                          if (e.target.files && e.target.files[0]) {
                            try {
                              const url = await api.uploadFile(e.target.files[0]);
                              updateTheme({ backgroundImage: url });
                            } catch(err) {
                              alert("Fehler beim Hochladen.");
                            }
                          }
                        }}
                      />
                    </label>
                  </div>

                  {theme.backgroundImage && (
                    <div className="mt-3 space-y-3 p-3 bg-gray-100 rounded-lg">
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">Darstellung (Fit)</label>
                        <select 
                          value={theme.backgroundSize || 'cover'}
                          onChange={e => updateTheme({ backgroundSize: e.target.value })}
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-black"
                        >
                          <option value="cover">Ausfüllen (Cover)</option>
                          <option value="contain">Einpassen (Contain)</option>
                          <option value="repeat">Kacheln (Repeat)</option>
                        </select>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-medium text-gray-600 block">Sichtbarkeit (Opacity)</label>
                          <span className="text-[10px] text-gray-500">{Math.round((theme.backgroundOpacity ?? 1) * 100)}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0.05" 
                          max="1" 
                          step="0.05"
                          value={theme.backgroundOpacity ?? 1}
                          onChange={e => updateTheme({ backgroundOpacity: parseFloat(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 mt-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Ecken (Radius)</label>
                  <select 
                    value={theme.borderRadius || '1.5rem'}
                    onChange={e => updateTheme({ borderRadius: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black"
                  >
                    <option value="0px">Eckig (0px)</option>
                    <option value="0.5rem">Leicht rund (md)</option>
                    <option value="1rem">Rundum (xl)</option>
                    <option value="1.5rem">Modern (3xl)</option>
                    <option value="9999px">Pillenform (full)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Schriftart</label>
                  <select 
                    value={activeProject.config?.font || 'Inter'}
                    onChange={e => setActiveProject({ ...activeProject, config: { ...activeProject.config, font: e.target.value }})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black"
                  >
                    <option value="Inter">Inter (Serifenlos)</option>
                    <option value="Roboto">Roboto (Klassisch)</option>
                    <option value="Outfit">Outfit (Modern)</option>
                    <option value="Merriweather">Merriweather (Serifen)</option>
                    <option value="Playfair Display">Playfair Display (Elegant)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t mt-2">
                  <input 
                    type="checkbox" 
                    id="showScrollToTop"
                    checked={theme.showScrollToTop || false}
                    onChange={e => updateTheme({ showScrollToTop: e.target.checked })}
                  />
                  <label htmlFor="showScrollToTop" className="text-sm font-medium text-gray-700">"Nach Oben" Pfeil anzeigen</label>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Globales Logo</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      placeholder="Logo URL"
                      value={activeProject.config?.logo || ''} 
                      onChange={e => setActiveProject({ ...activeProject, config: { ...activeProject.config, logo: e.target.value }})}
                      className="flex-1 w-0 border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-black"
                    />
                    <label className="p-1 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 transition-colors shrink-0">
                      <Upload size={14} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={async e => {
                          if (e.target.files && e.target.files[0]) {
                            try {
                              const url = await api.uploadFile(e.target.files[0]);
                              setActiveProject({ ...activeProject, config: { ...activeProject.config, logo: url }});
                            } catch(err) {
                              alert("Fehler beim Hochladen.");
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-6 flex-1 overflow-auto bg-white">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Bausteine</h3>
            <div className="grid grid-cols-2 gap-3">
              {AVAILABLE_BLOCKS.map((block) => (
                <DraggableBlockType 
                  key={block.type}
                  type={block.type}
                  label={block.label}
                  icon={block.icon}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
