import { GenericEngine } from './generic-client-engine.js';

interface ClientSlide {
    h: number;
    v: number;
    f: number;
    fMax: number;
}

export class RevealEngine extends GenericEngine {
    callbackEngine: null = null;

    Reveal: any;

    constructor() {
        super();
        this.Reveal = window.Reveal;
    }

    override init(): void {
        this.Reveal.configure({
            controls: false,
            transition: 'default',
            transitionSpeed: 'fast',
            history: false,
            slideNumber: false,
            keyboard: true,
            touch: false,
            embedded: true
        });
    }

    override goToSlide(indices: ClientSlide, delta = 0): void {
        let slideDelta: ClientSlide = { ...indices };
        const slides = this.getSlides();
        const currentIndex = slides.findIndex(slide => slide.h === indices.h && slide.v === indices.v);
        if (indices.f + delta < slides[currentIndex].fMax) {
            slideDelta.f += delta;
        } else if (currentIndex + delta < slides.length - 1) {
            slideDelta = slides[currentIndex + delta];
        } else {
            slideDelta = slides[slides.length - 1];
        }
        this.Reveal.slide(slideDelta.h, slideDelta.v, slideDelta.f);
    }

    override getSlides(): ClientSlide[] {
        const slides: ClientSlide[] = [];
        const horizontalSlides = document.querySelectorAll('.slides>section');
        horizontalSlides.forEach((slideH, indexH) => {
            const fragmentsH = slideH.querySelectorAll('.fragment');
            const verticalSlides = slideH.querySelectorAll('section');
            if (verticalSlides.length) {
                verticalSlides.forEach((slideV, indexV) => {
                    const fragmentsV = slideV.querySelectorAll('.fragment');
                    slides.push({ h: indexH, v: indexV, f: -1, fMax: fragmentsV.length || -1 });
                });
            } else {
                slides.push({ h: indexH, v: 0, f: -1, fMax: fragmentsH.length || -1 });
            }
        });
        return slides;
    }

    override getSlideNotes(): unknown {
        return this.Reveal.getSlideNotes();
    }
}
