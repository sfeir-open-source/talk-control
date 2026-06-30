import '../../../src/client/web-components/timer/timer';

describe('tc-timer', () => {
    let el: HTMLElement;

    beforeEach(async () => {
        el = document.createElement('tc-timer');
        document.body.appendChild(el);
        await (el as any).updateComplete;
    });

    afterEach(() => {
        vi.useRealTimers();
        document.body.innerHTML = '';
    });

    it('affiche 00:00:00 au départ', () => {
        expect((el as any).timerElement.textContent).toBe('00:00:00');
    });

    it('démarre le compteur au premier clic', () => {
        vi.useFakeTimers();
        el.shadowRoot!.querySelector<HTMLElement>('#timer')!.click();
        vi.advanceTimersByTime(3000);
        expect((el as any).timerElement.textContent).toBe('00:00:03');
    });

    it('remet à zéro (synchrone) au second clic', () => {
        vi.useFakeTimers();
        el.shadowRoot!.querySelector<HTMLElement>('#timer')!.click();
        vi.advanceTimersByTime(5000);
        el.shadowRoot!.querySelector<HTMLElement>('#timer')!.click();
        // vérification synchrone avant le 1er tick du nouvel interval
        expect((el as any).timerElement.textContent).toBe('00:00:00');
    });

    it('formatTime(0) → "00", formatTime(5) → "05", formatTime(10) → 10', () => {
        const timer = el as any;
        expect(timer.formatTime(0)).toBe('00');
        expect(timer.formatTime(5)).toBe('05');
        expect(timer.formatTime(10)).toBe(10);
    });
});
