import { TypePlayRange } from "../consts/playRange";

export type TypeDicePlay = { msg: "Вы Проиграли!!", randomNum: number, gift: string} | { msg: "Вы выиграли!!", randomNum: number, gift: string  } | null