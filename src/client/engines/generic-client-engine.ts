export class GenericEngine {
    init(): void {}

    goToSlide(_params: unknown): void {}

    getSlides(): unknown[] {
        return [];
    }

    getSlideNotes(): unknown {
        return null;
    }

    changeSlide(_delta: number): void {}
}
