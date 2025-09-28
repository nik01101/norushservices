
import { StaticImageData } from 'next/image';
import img1 from '@/img/gallery/1.png';
import img2 from '@/img/gallery/2.png';
import img3 from '@/img/gallery/3.png';
import img4 from '@/img/gallery/4.png';
import img5 from '@/img/gallery/5.png';
import img6 from '@/img/gallery/6.png';
import img7 from '@/img/gallery/7.png';
import img8 from '@/img/gallery/8.png';
import img9 from '@/img/gallery/9.png';
import img10 from '@/img/gallery/10.png';
import img11 from '@/img/gallery/11.png';
import img12 from '@/img/gallery/12.png';
import img13 from '@/img/gallery/13.png';
import img14 from '@/img/gallery/14.png';
import img15 from '@/img/gallery/15.png';
import img16 from '@/img/gallery/16.png';
import img17 from '@/img/gallery/17.png';
import img18 from '@/img/gallery/18.png';
import img19 from '@/img/gallery/19.png';
import img20 from '@/img/gallery/20.png';
import img21 from '@/img/gallery/21.png';
import img22 from '@/img/gallery/22.png';
import img23 from '@/img/gallery/23.png';
import img24 from '@/img/gallery/24.png';
import img25 from '@/img/gallery/25.png';
import img26 from '@/img/gallery/26.png';
import img27 from '@/img/gallery/27.png';
import img28 from '@/img/gallery/28.png';
import img29 from '@/img/gallery/29.png';
import img30 from '@/img/gallery/30.png';

interface GalleryImage {
  id: number;
  src: StaticImageData;
  alt: string;
  hint: string;
}

export const galleryImages: GalleryImage[] = [
  { id: 1, src: img1, alt: "Assembled white dresser in a bedroom", hint: "furniture assembly" },
  { id: 2, src: img2, alt: "TV mounted on a brick wall", hint: "tv wall mount" },
  { id: 3, src: img3, alt: "Living room with packed moving boxes", hint: "moving boxes" },
  { id: 4, src: img4, alt: "Assembled wooden crib in a nursery", hint: "furniture assembly" },
  { id: 5, src: img5, alt: "Gallery wall of framed photos mounted on a wall", hint: "gallery wall" },
  { id: 6, src: img6, alt: "Old couch being removed from a home", hint: "junk removal" },
  { id: 7, src: img7, alt: "Assembled desk in a home office", hint: "office furniture" },
  { id: 8, src: img8, alt: "Bookshelf assembly in progress", hint: "furniture assembly" },
  { id: 9, src: img9, alt: "Mounting shelves on a wall", hint: "shelf mounting" },
  { id: 10, src: img10, alt: "Moving boxes stacked in a new apartment", hint: "moving service" },
  { id: 11, src: img11, alt: "Assembling a dining table and chairs", hint: "dining set" },
  { id: 12, src: img12, alt: "A completed furniture assembly project", hint: "finished project" },
  { id: 13, src: img13, alt: "Wall mounted television with clean wiring", hint: "tv mount" },
  { id: 14, src: img14, alt: "Removing an old mattress from a bedroom", hint: "junk removal" },
  { id: 15, src: img15, alt: "Assembled child's playhouse", hint: "furniture assembly" },
  { id: 16, src: img16, alt: "Team of movers carrying a sofa", hint: "moving service" },
  { id: 17, src: img17, alt: "Assembling a complex cabinet system", hint: "cabinet assembly" },
  { id: 18, src: img18, alt: "Hanging a heavy mirror on a wall", hint: "mirror mounting" },
  { id: 19, src: img19, alt: "Disposing of old office furniture", hint: "junk removal" },
  { id: 20, src: img20, alt: "Assembling outdoor patio furniture", hint: "patio furniture" },
  { id: 21, src: img21, alt: "A neatly assembled bed frame", hint: "bed assembly" },
  { id: 22, src: img22, alt: "Mounting a soundbar below a TV", hint: "tv mounting" },
  { id: 23, src: img23, alt: "Moving crew loading a truck", hint: "moving truck" },
  { id: 24, src: img24, alt: "Assembling a kitchen island", hint: "kitchen furniture" },
  { id: 25, src: img25, alt: "Removing construction debris", hint: "debris removal" },
  { id: 26, src: img26, alt: "Assembling a metal storage rack", hint: "storage assembly" },
  { id: 27, src: img27, alt: "Hanging artwork on a gallery wall", hint: "artwork mounting" },
  { id: 28, src: img28, alt: "Carefully wrapping furniture for a move", hint: "moving prep" },
  { id: 29, src: img29, alt: "Assembling a bicycle", hint: "bike assembly" },
  { id: 30, src: img30, alt: "Final touches on a furniture assembly", hint: "final assembly" }
];
