import { DelegatedPipe } from './delegated.pipe';

describe('DelegatedPipe', () => {
  it('create an instance', () => {
    const pipe = new DelegatedPipe();
    expect(pipe).toBeTruthy();
  });
});
