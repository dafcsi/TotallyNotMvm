import { FogyasztasPipe } from './fogyasztas.pipe';

describe('FogyasztasPipe', () => {
  let pipe: FogyasztasPipe;

  beforeEach(() => {
    pipe = new FogyasztasPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return 0 for empty array', () => {
    expect(pipe.transform([])).toBe(0);
  });

  it('should return 0 for array with 1 element', () => {
    expect(pipe.transform([{ datum: new Date('2023-01-01'), ertek: 1000 }])).toBe(0);
  });

  it('should calculate consumption correctly for ordered data', () => {
    const allasok = [
      { datum: new Date('2023-01-01'), ertek: 1000 },
      { datum: new Date('2023-02-01'), ertek: 1500 },
      { datum: new Date('2023-03-01'), ertek: 2200 }
    ];
    expect(pipe.transform(allasok)).toBe(1200);
  });

  it('should calculate consumption correctly for unordered data', () => {
    const allasok = [
      { datum: new Date('2023-03-01'), ertek: 2200 },
      { datum: new Date('2023-01-01'), ertek: 1000 },
      { datum: new Date('2023-02-01'), ertek: 1500 }
    ];
    expect(pipe.transform(allasok)).toBe(1200);
  });
});