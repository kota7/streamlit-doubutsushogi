import _empty from "./pieces/empty.png"

import _emoji1_hiyoko from "./pieces/emoji1/hiyoko.png"
import _emoji1_zou    from "./pieces/emoji1/zou.png"
import _emoji1_kirin  from "./pieces/emoji1/kirin.png"
import _emoji1_tori   from "./pieces/emoji1/tori.png"
import _emoji1_lion   from "./pieces/emoji1/lion.png"

import _emoji2_hiyoko from "./pieces/emoji2/hiyoko.png"
import _emoji2_zou    from "./pieces/emoji2/zou.png"
import _emoji2_kirin  from "./pieces/emoji2/kirin.png"
import _emoji2_tori   from "./pieces/emoji2/tori.png"
import _emoji2_lion   from "./pieces/emoji2/lion.png"

import _emoji3_hiyoko from "./pieces/emoji3/hiyoko.png"
import _emoji3_zou    from "./pieces/emoji3/zou.png"
import _emoji3_kirin  from "./pieces/emoji3/kirin.png"
import _emoji3_tori   from "./pieces/emoji3/tori.png"
import _emoji3_lion   from "./pieces/emoji3/lion.png"

import _hiragana_hiyoko from "./pieces/hiragana/hiyoko.png"
import _hiragana_zou    from "./pieces/hiragana/zou.png"
import _hiragana_kirin  from "./pieces/hiragana/kirin.png"
import _hiragana_tori   from "./pieces/hiragana/tori.png"
import _hiragana_lion   from "./pieces/hiragana/lion.png"

interface PieceImages {
  emoji1: string[],
  emoji2: string[],
  emoji3: string[],
  hiragana: string[]
}

export const pieceImages: PieceImages = {
  emoji1: [_empty, _emoji1_hiyoko, _emoji1_zou, _emoji1_kirin, _emoji1_tori, _emoji1_lion],
  emoji2: [_empty, _emoji2_hiyoko, _emoji2_zou, _emoji2_kirin, _emoji2_tori, _emoji2_lion],
  emoji3: [_empty, _emoji3_hiyoko, _emoji3_zou, _emoji3_kirin, _emoji3_tori, _emoji3_lion],
  hiragana: [_empty, _hiragana_hiyoko, _hiragana_zou, _hiragana_kirin, _hiragana_tori, _hiragana_lion]
}