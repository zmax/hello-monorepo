// export class UniqleIndex {
//   static _index: number = 0;

//   static get index(): number {
//     return ++UniqleIndex._index;
//   }
// }
let _index: number = 0;

export function getUniqleNumber() {
  return ++_index;
}