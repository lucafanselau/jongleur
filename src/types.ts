// ! In here are shared types, used between projects

export type Seek = {
  current: number;
};

export type Seeker = Seek | ((progress: number) => void);
