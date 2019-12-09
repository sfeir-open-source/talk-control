import { GenericEngine } from './generic-client-engine';

export class SpectacleEngine extends GenericEngine {
    /**
     *
     * @param {number} index - position of the slide to go to
     * @param {number} delta - delta
     */
    goToSlide(index, delta = 1) {
        location.hash = `#/${index + delta}`;
    }

    /**
     * @returns {number} Number of slides
     */
    async getSlides() {
        return new Promise(resolve => {
            const frameContainer = document.createElement('div');
            document.body.append(frameContainer);
            const nextSlide = (slide = 0) => {
                const frame = document.createElement('iframe');
                frame.style = 'display:none';
                frameContainer.appendChild(frame);
                frame.onload = () => {
                    const content = frame.contentDocument || frame.contentWindow.document;
                    if (content.querySelector('.spectacle-slide')) {
                        return nextSlide(slide + 1);
                    }
                    // When there is no more slide, resolve the slide number
                    frameContainer.remove();
                    resolve({ slideNumber: slide - 1 });
                };
                frame.src = `${location.origin}${location.pathname}/#/${slide}`;
            };
            nextSlide();
        });
    }

    async getSlideNotes(index) {
        return new Promise(resolve => {
            const frame = document.createElement('iframe');
            frame.style = 'display: none';
            document.body.appendChild(frame);
            frame.onload = () => {
                const content = frame.contentDocument || frame.contentWindow.document;
                const notes = content
                    .querySelector('.spectacle-deck')
                    .querySelector('div')
                    .querySelectorAll(':scope > div')[1]
                    .querySelectorAll(':scope > div')[1];
                frame.remove();
                resolve(notes.innerHTML);
            };
            frame.src = `${location.origin}${location.pathname}/#/${index}?presenter`;
        });
    }
}
