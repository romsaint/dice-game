export const playRange = [
  'от 1 до 3',
  'от 2 до 4',
  'от 3 до 5',
  'от 4 до 6',
  'четное',
  'нечетное',
  'выход'
] as const; // as const обязательно!

export type TypePlayRange = typeof playRange;
export type TypeConstPlayRange = typeof playRange[number];

export const playRangeKeyboard = [[{text: playRange[0]}, {text: playRange[1]}], [{text: playRange[2]}, {text: playRange[3]}], [{text: playRange[4]}, {text: playRange[5]}], [{text: playRange[6]}]]