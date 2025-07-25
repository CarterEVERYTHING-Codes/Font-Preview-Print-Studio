
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ExternalLink, Bookmark, X, Moon, Sun, Search } from 'lucide-react';
import { fontList, fontCategories } from '@/lib/fonts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';

function FontCard({ fontName, onBookmark, isBookmarked, previewText, thingiverseUrl }: { fontName: string, onBookmark: (fontName: string) => void, isBookmarked: boolean, previewText: string, thingiverseUrl: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFontLoading, setIsFontLoading] = useState(true);
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  const loadFont = useCallback(() => {
    if (isFontLoaded || !fontName) return;

    setIsFontLoading(true);
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}&display=swap`;
    
    if (document.querySelector(`link[href="${fontUrl}"]`)) {
        setIsFontLoaded(true);
        setIsFontLoading(false);
        return;
    }

    const link = document.createElement('link');
    link.href = fontUrl;
    link.rel = 'stylesheet';
    link.onload = () => {
      document.fonts.load(`1em "${fontName}"`).then(() => {
        setIsFontLoaded(true);
        setIsFontLoading(false);
      }).catch(() => {
        setIsFontLoaded(true); 
        setIsFontLoading(false);
      });
    };
    link.onerror = () => {
        setIsFontLoading(false);
    };
    document.head.appendChild(link);
  }, [fontName, isFontLoaded]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadFont();
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [loadFont]);

  return (
    <Card ref={cardRef} className="relative overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col group min-h-[250px]">
      <CardHeader className="p-4 border-b">
        <CardTitle className="text-xl font-semibold text-foreground truncate text-center">{fontName}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex-grow flex items-center justify-center min-h-[150px]">
        {isFontLoading && !isFontLoaded && <p className="text-muted-foreground">Loading...</p>}
        <p
          className="text-5xl text-center break-words"
          style={{ fontFamily: isFontLoaded ? `'${fontName}', sans-serif` : 'sans-serif' }}
          title={previewText}
        >
          {previewText}
        </p>
      </CardContent>
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="h-12 w-12"
          onClick={() => onBookmark(fontName)}
          aria-label={`Bookmark ${fontName}`}
        >
          <Bookmark className={`h-8 w-8 transition-colors ${isBookmarked ? 'fill-primary text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
        </Button>
      </div>
       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)]">
         <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            <Link href={thingiverseUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-5 w-5" />
              Customize
            </Link>
          </Button>
      </div>
    </Card>
  );
}


export default function Home() {
  const previewText = "Print Studio 3D";
  const thingiverseUrl = "https://www.thingiverse.com/apps/customizer/run?thing_id=739573";
  const [bookmarkedFonts, setBookmarkedFonts] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [theme, setTheme] = useState('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState('popular');

  useEffect(() => {
    setIsClient(true);
    try {
      const savedFonts = localStorage.getItem('bookmarkedFonts');
      if (savedFonts) {
        setBookmarkedFonts(JSON.parse(savedFonts));
      }
      const savedTheme = localStorage.getItem('theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
      document.documentElement.className = newTheme;
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
  };

  const toggleBookmark = (fontName: string) => {
    const updatedBookmarks = bookmarkedFonts.includes(fontName)
      ? bookmarkedFonts.filter(f => f !== fontName)
      : [...bookmarkedFonts, fontName];
    
    setBookmarkedFonts(updatedBookmarks);
    try {
      localStorage.setItem('bookmarkedFonts', JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
  };

  const isBookmarked = (fontName: string) => bookmarkedFonts.includes(fontName);

  const filteredAndSortedFonts = fontList
    .filter(([fontName, _, category]) => {
      const matchesSearch = fontName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter ? category === activeFilter : true;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortOrder === 'popular') {
        return b[1] - a[1];
      }
      if (sortOrder === 'alphabetical') {
        return a[0].localeCompare(b[0]);
      }
      return 0;
    });

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <img 
                src="/PrintStudioLogo.png" 
                alt="Print Studio Logo" 
                width="150" 
                height="40" 
                className="dark:invert"
              />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="lg">
                  <Bookmark className="mr-2 h-5 w-5" />
                  My List ({isClient ? bookmarkedFonts.length : 0})
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>My Favorite Fonts</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100%-4rem)]">
                  <div className="py-4">
                  {isClient && bookmarkedFonts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {bookmarkedFonts.map(fontName => (
                        <Card key={fontName} className="relative overflow-hidden shadow-lg flex flex-col">
                          <CardHeader className="p-4 border-b">
                            <CardTitle className="text-xl font-semibold text-foreground truncate">{fontName}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-6 flex-grow flex items-center justify-center min-h-[120px]">
                            <p 
                              className="text-4xl text-center break-words"
                              style={{ fontFamily: `'${fontName}', sans-serif` }}
                              title={previewText}
                            >
                              {previewText}
                            </p>
                          </CardContent>
                           <Button 
                              size="lg" 
                              variant="ghost" 
                              className="absolute top-2 right-2 h-10 w-10"
                              onClick={() => toggleBookmark(fontName)}
                            >
                              <X className="h-6 w-6" />
                            </Button>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-10">Your list is empty. Add fonts by clicking the bookmark icon.</p>
                  )}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Search for a font..."
              className="w-full pl-10 pr-4 py-2 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={!activeFilter ? 'default' : 'outline'}
              onClick={() => setActiveFilter(null)}
            >
              All
            </Button>
            {fontCategories.map(category => (
              <Button
                key={category}
                variant={activeFilter === category ? 'default' : 'outline'}
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </Button>
            ))}
             <div className="ml-auto">
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Sort by Popularity</SelectItem>
                  <SelectItem value="alphabetical">Sort by A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {filteredAndSortedFonts.map(([fontName, _]) => (
            <FontCard 
              key={fontName}
              fontName={fontName}
              onBookmark={toggleBookmark}
              isBookmarked={isBookmarked(fontName)}
              previewText={previewText}
              thingiverseUrl={thingiverseUrl}
            />
          ))}
        </div>
        {filteredAndSortedFonts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl font-semibold text-muted-foreground">No fonts found</p>
            <p className="text-muted-foreground mt-2">Try a different search term or filter.</p>
          </div>
        )}
      </main>
      <footer className="py-6 border-t mt-8">
        <div className="container text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Print Studio. Fonts sourced from Google Fonts.</p>
        </div>
      </footer>
    </div>
  );
}

    