/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Type, RefreshCw, Download, Settings2, Info, Image as ImageIcon, FileCode, FileJson, X, Wand2, Loader2, Sparkles } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { generateMushedFont, FontMap } from './services/generativeFontService';

const FONTS = [
  'Inter',
  'Playfair Display',
  'Space Grotesk',
  'JetBrains Mono',
  'Anton',
  'Libre Baskerville',
  'Cormorant Garamond',
  'Montserrat',
  'Bebas Neue',
  'Abril Fatface',
  'Unbounded',
  'Coral Pixels',
  'DM Mono',
  'EB Garamond',
  'Handjet',
  'Jacquard 12',
  'New Amsterdam',
  'Raleway Dots',
  'Bonbon',
  'Lacquer',
  'Rubik 80s Fade',
  'UnifrakturMaguntia'
];

const COLORS = [
  '#FF4CA9',
  '#0FE641',
  '#FF6600',
  '#874FFF',
  '#6BD0EA',
  '#F5D100',
  '#000000',
];

const Sparkle: React.FC<{ color: string }> = ({ color }) => {
  const randomX = Math.random() * 80 - 40;
  const randomY = Math.random() * 80 - 40;
  const randomScale = Math.random() * 0.6 + 0.4;
  const randomDuration = Math.random() * 0.8 + 0.5;
  const randomRotation = Math.random() * 360;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
      animate={{ 
        opacity: [0, 1, 1, 0], 
        scale: [0, randomScale, randomScale * 1.2, 0],
        x: randomX,
        y: randomY,
        rotate: randomRotation
      }}
      transition={{ 
        duration: randomDuration,
        repeat: Infinity,
        repeatDelay: Math.random() * 0.3,
        ease: "easeOut"
      }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 w-6 h-6"
      style={{ 
        backgroundColor: color,
        WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 2.5c.3 0 .5.2.7.5l2.5 5.8 6.3.6c.4 0 .7.3.7.7 0 .2-.1.3-.2.5l-4.8 4.2 1.4 6.3c.1.4-.2.8-.6.9-.2 0-.4 0-.5-.1l-5.5-3.4-5.5 3.4c-.3.2-.8.1-1-.2-.1-.2-.1-.4-.1-.6l1.4-6.3-4.8-4.2c-.3-.3-.3-.8 0-1.1.1-.1.3-.2.5-.2l6.3-.6 2.5-5.8c.2-.3.4-.5.7-.5z\'/%3E%3C/svg%3E")',
        maskImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 2.5c.3 0 .5.2.7.5l2.5 5.8 6.3.6c.4 0 .7.3.7.7 0 .2-.1.3-.2.5l-4.8 4.2 1.4 6.3c.1.4-.2.8-.6.9-.2 0-.4 0-.5-.1l-5.5-3.4-5.5 3.4c-.3.2-.8.1-1-.2-.1-.2-.1-.4-.1-.6l1.4-6.3-4.8-4.2c-.3-.3-.3-.8 0-1.1.1-.1.3-.2.5-.2l6.3-.6 2.5-5.8c.2-.3.4-.5.7-.5z\'/%3E%3C/svg%3E")',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat'
      }}
    />
  );
};

interface LetterProps {
  char: string;
  index: number;
  kerning: number;
  initialFont?: string;
  generativeGlyph?: { path: string; width: number };
  key?: string;
}

const Letter = ({ char, index, kerning, initialFont, generativeGlyph }: LetterProps) => {
  const [font, setFont] = useState(initialFont || 'Inter');
  const [color, setColor] = useState('#1a1a1a');
  const [weight, setWeight] = useState(400);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered && initialFont) {
      setFont(initialFont);
    }
  }, [initialFont, isHovered]);

  const morph = useCallback(() => {
    const randomFont = FONTS[Math.floor(Math.random() * FONTS.length)];
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const randomWeight = [100, 200, 300, 400, 500, 600, 700, 800, 900][Math.floor(Math.random() * 9)];
    
    setFont(randomFont);
    setColor(randomColor);
    setWeight(randomWeight);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isHovered) {
      morph();
      interval = setInterval(morph, 150);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, morph]);

  if (char === ' ') return <span className="inline-block w-[0.3em]">&nbsp;</span>;
  
  if (generativeGlyph && !isHovered) {
    return (
      <motion.span
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          color: color,
          letterSpacing: `${kerning}em`,
          scale: isHovered ? 1.1 : 1,
        }}
        className="relative inline-block cursor-default select-none transition-all"
        style={{ 
          width: `${(generativeGlyph.width || 60) / 100}em`, 
          height: '1em',
          verticalAlign: 'middle',
          minWidth: '0.5em'
        }}
      >
        <svg 
          viewBox="0 0 100 100" 
          className="absolute inset-0 w-full h-full fill-current"
          style={{ color }}
          preserveAspectRatio="xMidYMid meet"
        >
          <path d={generativeGlyph.path} />
        </svg>
      </motion.span>
    );
  }


  return (
    <motion.span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        fontFamily: font,
        color: color,
        fontWeight: weight,
        letterSpacing: `${kerning}em`,
        scale: isHovered ? 1.1 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        fontFamily: { duration: 0.1 },
        color: { duration: 0.1 },
        fontWeight: { duration: 0.1 },
        letterSpacing: { duration: 0.2 }
      }}
      className="relative inline-block cursor-default select-none transition-all"
      style={{ fontFamily: font }}
    >
      <AnimatePresence>
        {isHovered && (
          <>
            {[...Array(4)].map((_, i) => (
              <Sparkle key={i} color={color} />
            ))}
          </>
        )}
      </AnimatePresence>
      {char}
    </motion.span>
  );
};

export default function App() {
  const [text, setText] = useState('Type Morph');
  const [fontSize, setFontSize] = useState(120);
  const [kerning, setKerning] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [customFontMap, setCustomFontMap] = useState<Record<string, string>>({});
  const [isCustomFontActive, setIsCustomFontActive] = useState(false);
  const [generativeFontMap, setGenerativeFontMap] = useState<FontMap | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const textContainerRef = useRef<HTMLDivElement>(null);

  const generateRandomFontMap = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;':\",./<>? ".split("");
    const newMap: Record<string, string> = {};
    chars.forEach(char => {
      newMap[char] = FONTS[Math.floor(Math.random() * FONTS.length)];
    });
    setCustomFontMap(newMap);
    setIsCustomFontActive(true);
    setGenerativeFontMap(null);
  };

  const handleGenerateAIFont = async () => {
    if (!text.trim()) return;
    setIsGenerating(true);
    try {
      const fontMap = await generateMushedFont(FONTS, text);
      if (Object.keys(fontMap).length > 0) {
        setGenerativeFontMap(prev => ({ ...prev, ...fontMap }));
        setIsCustomFontActive(false);
      } else {
        // Better Fallback: Use the "Random Collection" logic if AI fails
        const fallbackMap: Record<string, string> = {};
        text.split('').forEach(char => {
          if (char === ' ') return;
          fallbackMap[char] = FONTS[Math.floor(Math.random() * FONTS.length)];
        });
        setCustomFontMap(fallbackMap);
        setIsCustomFontActive(true);
        setGenerativeFontMap(null);
        console.warn("AI font generation failed, falling back to random collection.");
      }
    } catch (error) {
      console.error("Font generation failed:", error);
      alert("An error occurred while generating the font.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadFontMap = () => {
    const data = JSON.stringify(generativeFontMap || customFontMap, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `mushed-font-recipe-${Date.now()}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const handleReset = () => {
    setText('Type Morph');
    setFontSize(120);
    setKerning(0);
    setIsCustomFontActive(false);
    setCustomFontMap({});
    setGenerativeFontMap(null);
    setResetKey(prev => prev + 1);
  };

  const exportPNG = async () => {
    if (!textContainerRef.current) return;
    const dataUrl = await htmlToImage.toPng(textContainerRef.current, {
      style: { 
        padding: '40px',
        whiteSpace: 'nowrap',
        width: 'max-content',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    });
    const link = document.createElement('a');
    link.download = `kinzas-typewriter-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    setShowExportMenu(false);
  };

  const exportSVG = async () => {
    if (!textContainerRef.current) return;
    const dataUrl = await htmlToImage.toSvg(textContainerRef.current, {
      style: { 
        padding: '40px',
        whiteSpace: 'nowrap',
        width: 'max-content',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    });
    const link = document.createElement('a');
    link.download = `kinzas-typewriter-${Date.now()}.svg`;
    link.href = dataUrl;
    link.click();
    setShowExportMenu(false);
  };

  const exportCSS = () => {
    const snippet = `
/* kinza's typewriter Export */
<div style="font-size: ${fontSize}px; letter-spacing: ${kerning}em; text-align: center; white-space: nowrap;">
  ${text.split('').map(char => `<span style="font-family: 'Inter';">${char}</span>`).join('')}
</div>

/* Note: You will need to import the fonts used in your project. */
@import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Coral+Pixels&family=DM+Mono&family=EB+Garamond&family=Handjet&family=Jacquard+12&family=New+Amsterdam&family=Raleway+Dots&family=Inter&family=Playfair+Display&family=Space+Grotesk&family=JetBrains+Mono&family=Anton&family=Libre+Baskerville&family=Cormorant+Garamond&family=Montserrat&family=Bebas+Neue&family=Unbounded&display=swap');
    `;
    const blob = new Blob([snippet], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `type-morph-snippet-${Date.now()}.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
    setShowExportMenu(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-black/5 bg-white/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
            <Type size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter lowercase font-eb-garamond">kinza's typewriter</h1>
            <p className="text-[10px] text-black/40 font-mono uppercase tracking-widest">what's your type?</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 relative">
          <button 
            onClick={() => setShowControls(!showControls)}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <Settings2 size={20} />
          </button>
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="px-6 py-2.5 bg-black text-white text-xl font-bold lowercase tracking-tighter rounded-full hover:bg-black/80 transition-all flex items-center gap-2 font-eb-garamond"
          >
            <Download size={18} />
            export
          </button>

          <AnimatePresence>
            {showExportMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-48 bg-white border border-black/10 shadow-2xl rounded-2xl p-2 z-50 overflow-hidden"
              >
                <div className="flex justify-between items-center mb-2 px-2 py-1 border-b border-black/5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-black/40">Export</span>
                  <button onClick={() => setShowExportMenu(false)} className="p-1 hover:bg-black/5 rounded-full">
                    <X size={12} />
                  </button>
                </div>
                
                <div className="flex flex-col gap-1">
                  <button onClick={exportPNG} className="flex items-center gap-2 p-2 hover:bg-black/5 rounded-lg transition-all text-left">
                    <ImageIcon size={14} className="text-pink-500" />
                    <span className="text-[10px] font-bold uppercase">PNG</span>
                  </button>
                  
                  <button onClick={exportSVG} className="flex items-center gap-2 p-2 hover:bg-black/5 rounded-lg transition-all text-left">
                    <FileCode size={14} className="text-blue-500" />
                    <span className="text-[10px] font-bold uppercase">SVG</span>
                  </button>

                  <button onClick={exportCSS} className="flex items-center gap-2 p-2 hover:bg-black/5 rounded-lg transition-all text-left">
                    <FileJson size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase">Code</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="flex-1 relative flex flex-col items-center justify-center p-12">
        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Text Display Area */}
        <div 
          ref={textContainerRef}
          className="relative max-w-full text-center leading-none tracking-tighter break-words p-10"
          style={{ fontSize: `${fontSize}px` }}
        >
          {text.split('').map((char: string, i: number) => (
            <Letter 
              key={`${resetKey}-${i}-${char}`} 
              char={char} 
              index={i} 
              kerning={kerning} 
              initialFont={isCustomFontActive ? customFontMap[char] : undefined}
              generativeGlyph={generativeFontMap?.[char]}
            />
          ))}
        </div>

        {/* Floating Input Controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-30"
            >
              <div className="bg-white border border-black/10 shadow-2xl rounded-3xl p-3 backdrop-blur-xl">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-black/30 mb-1 block">Input Text</label>
                      <input 
                        type="text" 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type something..."
                        className="w-full bg-black/5 border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-black/5 transition-all outline-none"
                      />
                    </div>
                    <div className="w-28">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-black/30 mb-1 block">Size: {fontSize}px</label>
                      <input 
                        type="range" 
                        min="20" 
                        max="300" 
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full accent-black h-1.5"
                      />
                    </div>
                    <div className="w-28">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-black/30 mb-1 block">Kerning: {kerning}em</label>
                      <input 
                        type="range" 
                        min="-0.1" 
                        max="1" 
                        step="0.01"
                        value={kerning}
                        onChange={(e) => setKerning(parseFloat(e.target.value))}
                        className="w-full accent-black h-1.5"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-black/5">
                    <div className="flex gap-1.5 items-center">
                      <button 
                        onClick={handleGenerateAIFont}
                        disabled={isGenerating}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${
                          generativeFontMap 
                            ? 'bg-black text-white' 
                            : 'bg-black/5 text-black hover:bg-black/10 disabled:opacity-50'
                        }`}
                      >
                        {isGenerating ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                        {isGenerating ? 'Mushing...' : generativeFontMap ? 'Regenerate AI' : 'AI Font'}
                      </button>

                      <button 
                        onClick={generateRandomFontMap}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${
                          isCustomFontActive 
                            ? 'bg-black text-white' 
                            : 'bg-black/5 text-black hover:bg-black/10'
                        }`}
                      >
                        <Wand2 size={10} />
                        {isCustomFontActive ? 'Regenerate Collection' : 'Random Collection'}
                      </button>
                      
                      {(isCustomFontActive || generativeFontMap) && (
                        <button 
                          onClick={downloadFontMap}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-all"
                        >
                          <Download size={10} />
                          Download
                        </button>
                      )}
                    </div>
                    <button 
                      onClick={handleReset}
                      className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 hover:text-black/60 transition-colors"
                    >
                      <RefreshCw size={10} />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer / Info */}
      <footer className="p-6 flex justify-between items-center text-[10px] font-mono text-black/40 uppercase tracking-widest border-t border-black/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-black/5 rounded-full">
            <div className={`w-2 h-2 rounded-full ${generativeFontMap ? 'bg-emerald-500 animate-pulse' : isCustomFontActive ? 'bg-blue-500' : 'bg-black/20'}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/60">
              {generativeFontMap ? 'AI MUSH ACTIVE' : isCustomFontActive ? 'COLLECTION MUSH' : 'STANDARD'}
            </span>
          </div>
          <span>Active Fonts: {FONTS.length}</span>
          <span>•</span>
          <span>Interactions: Realtime</span>
        </div>
        <div className="flex items-center gap-1">
          <Info size={12} />
          <span>Move cursor to experiment</span>
        </div>
      </footer>
    </div>
  );
}
