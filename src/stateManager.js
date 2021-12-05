import { atom } from 'recoil';

const state = atom({
  key: 'state',
  default: {
    da: 1.0,
    db: 0.5,
    f: 0.055,
    k: 0.062,
  },
});

export default state;
