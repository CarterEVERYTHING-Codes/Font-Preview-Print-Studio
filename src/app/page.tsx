
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Bookmark, X } from 'lucide-react';
import { fontList } from '@/lib/fonts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Home() {
  const previewText = "Print Studio 3D";
  const thingiverseUrl = "https://www.thingiverse.com/apps/customizer/run?thing_id=739573";
  const [bookmarkedFonts, setBookmarkedFonts] = useState<string[]>([]);

  const toggleBookmark = (fontName: string) => {
    setBookmarkedFonts(prev =>
      prev.includes(fontName)
        ? prev.filter(f => f !== fontName)
        : [...prev, fontName]
    );
  };

  const isBookmarked = (fontName: string) => bookmarkedFonts.includes(fontName);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/PrintStudioLogo.png" alt="Print Studio Logo" width={150} height={40} className="dark:invert"/>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Bookmark className="mr-2 h-4 w-4" />
                  My List ({bookmarkedFonts.length})
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>My Favorite Fonts</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100%-4rem)]">
                  <div className="py-4">
                  {bookmarkedFonts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {bookmarkedFonts.map(fontName => (
                        <Card key={fontName} className="relative overflow-hidden shadow-md flex flex-col">
                          <CardHeader className="p-4 border-b">
                            <CardTitle className="text-base font-medium text-foreground truncate">{fontName}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 flex-grow flex items-center justify-center min-h-[100px]">
                            <p 
                              className="text-3xl text-center break-words"
                              style={{ fontFamily: `'${fontName}', sans-serif` }}
                              title={previewText}
                            >
                              {previewText}
                            </p>
                          </CardContent>
                           <Button 
                              size="icon" 
                              variant="ghost" 
                              className="absolute top-2 right-2 h-8 w-8"
                              onClick={() => toggleBookmark(fontName)}
                            >
                              <X className="h-4 w-4" />
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
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              <Link href={thingiverseUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Customizer
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {fontList.map(([fontName, _]) => (
            <Card key={fontName} className="relative overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col">
              <CardHeader className="p-4 border-b">
                <CardTitle className="text-base font-medium text-foreground truncate">{fontName}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex-grow flex items-center justify-center min-h-[100px]">
                <p 
                  className="text-3xl text-center break-words"
                  style={{ fontFamily: `'${fontName}', sans-serif` }}
                  title={previewText}
                >
                  {previewText}
                </p>
              </CardContent>
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute top-2 right-2 h-8 w-8"
                onClick={() => toggleBookmark(fontName)}
              >
                <Bookmark className={`h-5 w-5 ${isBookmarked(fontName) ? 'fill-current text-primary' : 'text-muted-foreground'}`} />
              </Button>
            </Card>
          ))}
        </div>
      </main>
      <footer className="py-6 border-t mt-8">
        <div className="container text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Print Studio. Fonts sourced from Google Fonts.</p>
        </div>
      </footer>
    </div>
  );
}
