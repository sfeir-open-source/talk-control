export class GenericEngine {
    init(): void {}

    goToSlide(_params: unknown, _delta = 0): void {}

    getSlides(): unknown[] {
        return [];
    }

    getSlideNotes(): unknown {
        return null;
    }

    changeSlide(_delta: number): void {}
}
