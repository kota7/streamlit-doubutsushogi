import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { ReactNode } from "react"

interface State {
  //numClicks: number
  board: number[]        // board status, length 12
  prisoners: number[]    // prisoner counts, length 6
  isTurn1: boolean       // indicates that the next mover is the player 1 (bottom to top)
  selectedIndex: number  // index of selected cell, negative indicates no cell is selected
  images: string[]       // piece images, length 6 (include empty)
  initData: number[]     // initial state data, length 19
  isFocused: boolean
}

/**
 * This is a React-based component template. The `render()` function is called
 * automatically when your component should be re-rendered.
 */
class DoubutsuShogi extends StreamlitComponentBase<State> {
  public state = {
    board: [-3, -5, -2, 0, -1, 0, 0, 1, 0, 2, 5, 3],
    prisoners: [0, 0, 0, 0, 0, 0],
    isTurn1: true,
    selectedIndex: -1,
    images: ["", "", "", "", ""],
    initData: [-3, -5, -2, 0, -1, 0, 0, 1, 0, 2, 5, 3, 0, 0, 0, 0, 0, 0, 1],
    isFocused: false
    //,numClicks: 0    
  }

  componentDidMount(): void {
    console.log("start componentDidMount")
    this.state.board = this.state.initData.slice(0, 12)
    this.state.prisoners = this.state.initData.slice(12, 18)
    this.state.isTurn1 = this.state.initData[18]===1

    // This is copied from the source of StreamlitComponentBase
    // By this, we tell Streamlit that our height has changed.
    Streamlit.setFrameHeight();  
    /*
    const ret = this.state.board.concat(this.state.prisoners).concat(
      this.state.isTurn1 ? 1 : 2, this._gameStatus())
    Streamlit.setComponentValue(ret)
    */
  }

  public render = (): ReactNode => {
    // Arguments that are passed to the plugin in Python are accessible
    // via `this.props.args`. Here, we access the "name" arg.
    const piecename = this.props.args["piecename"]
    //const data = this.props.args["data"]
    const prisoner_imgsize = this.props.args["prisoner_imgsize"]
    const cellsize = this.props.args["cellsize"]
    const piece_imgsize = this.props.args["piece_imgsize"]
    const init_data = this.props.args["init_data"]
    this.state.initData = init_data
    console.log("init_data given", init_data)
    console.log(this.state.initData)

    // Streamlit sends us a theme object via props that we can use to ensure
    // that our component has visuals that match the active theme in a
    // streamlit app.
    const { theme } = this.props
    const style: React.CSSProperties = {}

    // Maintain compatibility with older versions of Streamlit that don't send
    // a theme object.
    if (theme) {
      // Use the theme object to style our button border. Alternatively, the
      // theme style is defined in CSS vars.
      const borderStyling = `1px solid ${
        this.state.isFocused ? theme.primaryColor : "gray"
      }`
      style.border = borderStyling
      style.outline = borderStyling
    }
    /*
    if (data.length === 19) {
      this.state.board = data.slice(0, 12)
      this.state.prisoners = data.slice(12, 18)
      this.state.isTurn1 = (data[18] === 1)
    }
    */
    
    console.log("loading piece images")
    const empty  = require(`./pieces/empty.png`)
    const hiyoko = require(`./pieces/${piecename}/hiyoko.png`)
    const zou    = require(`./pieces/${piecename}/zou.png`)
    const kirin  = require(`./pieces/${piecename}/kirin.png`)
    const tori   = require(`./pieces/${piecename}/tori.png`)
    const lion   = require(`./pieces/${piecename}/lion.png`)
    this.state.images = [ empty, hiyoko, zou, kirin, tori, lion ]
    
    const texts = ["", "hiyoko", "zou", "kirin", "tori", "lion"]
    const srcs = this.state.board.map( (i: number) => this.state.images[Math.abs(i)])
    const alts = this.state.board.map( (i: number) => texts[Math.abs(i)])
    const opps = this.state.board.map( (i: number) => i < 0 ? "piece opponent" : i > 0 ? "piece own" : "piece empty")

    return (
      <div>

      <table><tbody>
      <tr>
        <td className="prisoner-cell"><img id="img15" className="prisoner-piece" alt="hiyoko" src={hiyoko} width={prisoner_imgsize} onClick={ (e)=>this.pieceClicked(15) } /><span className="prisoner-value" id="prisoner3">{this.state.prisoners[3]}</span>&nbsp;</td>
        <td className="prisoner-cell"><img id="img16" className="prisoner-piece" alt="zou"    src={zou}    width={prisoner_imgsize} onClick={ (e)=>this.pieceClicked(16) } /><span className="prisoner-value" id="prisoner4">{this.state.prisoners[4]}</span>&nbsp;</td>
        <td className="prisoner-cell"><img id="img17" className="prisoner-piece" alt="kirin"  src={kirin}  width={prisoner_imgsize} onClick={ (e)=>this.pieceClicked(17) } /><span className="prisoner-value" id="prisoner5">{this.state.prisoners[5]}</span>&nbsp;</td>
      </tr>
      </tbody></table>

      <table className="board"><tbody>
      <tr>
        <td className="cell" id="cell0" width={cellsize} height={cellsize}><img id="img0" className={opps[0]} src={srcs[0]} alt={alts[0]} width={piece_imgsize} height={piece_imgsize} onClick={ (e)=>this.pieceClicked(0) } /></td>
        <td className="cell" id="cell1" width={cellsize} height={cellsize}><img id="img1" className={opps[1]} src={srcs[1]} alt={alts[1]} width={piece_imgsize} height={piece_imgsize} onClick={ (e)=>this.pieceClicked(1) } /></td>
        <td className="cell" id="cell2" width={cellsize} height={cellsize}><img id="img2" className={opps[2]} src={srcs[2]} alt={alts[2]} width={piece_imgsize} height={piece_imgsize} onClick={ (e)=>this.pieceClicked(2) } /></td>
      </tr>
      <tr>
        <td className="cell" id="cell3" width={cellsize} height={cellsize}><img id="img3" className={opps[3]} src={srcs[3]} alt={alts[3]} width={piece_imgsize} height={piece_imgsize} onClick={ (e)=>this.pieceClicked(3) } /></td>
        <td className="cell" id="cell4" width={cellsize} height={cellsize}><img id="img4" className={opps[4]} src={srcs[4]} alt={alts[4]} width={piece_imgsize} height={piece_imgsize} onClick={ (e)=>this.pieceClicked(4) } /></td>
        <td className="cell" id="cell5" width={cellsize} height={cellsize}><img id="img5" className={opps[5]} src={srcs[5]} alt={alts[5]} width={piece_imgsize} height={piece_imgsize} onClick={ (e)=>this.pieceClicked(5) } /></td>
      </tr>
      <tr>
        <td className="cell" id="cell6" width={cellsize} height={cellsize}><img id="img6" className={opps[6]} src={srcs[6]} alt={alts[6]} width={piece_imgsize} height={piece_imgsize} onClick={ (e)=>this.pieceClicked(6) } /></td>
        <td className="cell" id="cell7" width={cellsize} height={cellsize}><img id="img7" className={opps[7]} src={srcs[7]} alt={alts[7]} width={piece_imgsize} height={piece_imgsize} onClick={ (e)=>this.pieceClicked(7) } /></td>
        <td className="cell" id="cell8" width={cellsize} height={cellsize}><img id="img8" className={opps[8]} src={srcs[8]} alt={alts[8]} width={piece_imgsize} height={piece_imgsize} onClick={ (e)=>this.pieceClicked(8) } /></td>
      </tr>
      <tr>
        <td className="cell" id="cell9" width={cellsize} height={cellsize}><img id="img9" className={opps[9]} src={srcs[9]} alt={alts[9]} width={piece_imgsize} height={piece_imgsize} onClick={ (e)=>this.pieceClicked(9) } /></td>
        <td className="cell" id="cell10" width={cellsize} height={cellsize}><img id="img10" className={opps[10]} src={srcs[10]} alt={alts[10]} width={piece_imgsize} height={piece_imgsize} onClick={ (e)=>this.pieceClicked(10) } /></td>
        <td className="cell" id="cell11" width={cellsize} height={cellsize}><img id="img11" className={opps[11]} src={srcs[11]} alt={alts[11]} width={piece_imgsize} height={piece_imgsize} onClick={ (e)=>this.pieceClicked(11) } /></td>
      </tr>
      </tbody></table>

      <table><tbody>
      <tr>
        <td className="prisoner-cell"><img id="img12" className="prisoner-piece" alt="hiyoko" src={hiyoko} width={prisoner_imgsize} onClick={ (e)=>this.pieceClicked(12) } /><span className="prisoner-value" id="prisoner0">{this.state.prisoners[0]}</span>&nbsp;</td>
        <td className="prisoner-cell"><img id="img13" className="prisoner-piece" alt="zou"    src={zou}    width={prisoner_imgsize} onClick={ (e)=>this.pieceClicked(13) } /><span className="prisoner-value" id="prisoner1">{this.state.prisoners[1]}</span>&nbsp;</td>
        <td className="prisoner-cell"><img id="img14" className="prisoner-piece" alt="kirin"  src={kirin}  width={prisoner_imgsize} onClick={ (e)=>this.pieceClicked(14) } /><span className="prisoner-value" id="prisoner2">{this.state.prisoners[2]}</span>&nbsp;</td>
      </tr>
      </tbody></table>

      <table><tbody>
      <tr><td>&nbsp;</td></tr>
      <tr className="controls">
        <td className="control"><span id="to-start" className="control-button">&lt;&lt;</span></td>
        <td className="control"><span id="to-prev" className="control-button">&lt;</span></td>
        <td>&nbsp;&nbsp;&nbsp;</td>
        <td className="control"><span id="to-next" className="control-button">&gt;</span></td>
        <td className="control"><span id="to-end" className="control-button">&gt;&gt;</span></td>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
        <td className="control"><span id="board-flip" className="control-button" onClick={ () => this.flipBoard() }>&#8645;</span></td>        
      </tr>
      </tbody></table>
      </div>
    )
  }

  // Access method to the html elements
  private _getPrisoner = (index: number) => {
    return document.getElementById(`prisoner${index}`)
  }
  private _getImage = (index: number): HTMLImageElement | undefined => { 
    return document.getElementById(`img${index}`) as HTMLImageElement;
  }

  private _getCell = (index: number): HTMLImageElement | undefined => { 
    return document.getElementById(`cell${index}`) as HTMLImageElement;
  }

  private flipBoard = (): void => {
    // update the state first
    const prev_state = this.state
    this.state.board = prev_state.board.reverse().map( (v: number): number => { return -v })
    this.state.prisoners = prev_state.prisoners.slice(3, 6).concat(prev_state.prisoners.slice(0, 3))
    this.state.isTurn1 = !prev_state.isTurn1
    
    // update the visual
    this._applyCurrentState()

    // report to the python side
    const ret = this.state.board.concat(this.state.prisoners).concat(
      this.state.isTurn1 ? 1 : 2, this._gameStatus())
    Streamlit.setComponentValue(ret)    
  }

  private _applyCurrentState = (): void => {
    // update the visuals to the current state
    // Boards
    Array.from(Array(12).keys()).forEach( (index: number) => {
      this._applyCell(index)
    })
    // Prisoners
    Array.from(Array(6).keys()).forEach( (index: number) => {
      this._applyPrisoner(index)
    })
    // Turn indicator
    // TBA
  }  

  private pieceClicked = (index: number): void => {
    //console.log("state before click event at ", index, this.state)
    if (this._gameStatus() !== 0) { return }  // cannot move anything when the game is over
    if (this.state.selectedIndex < 0) {
      // currently no cell is selected
      // so we try to select the cell
      this._select(index);
    } else {
      // a cell is already selected
      // so we move the piece here if possible
      // otherwise current selection is removed
      if (this._canMove(this.state.selectedIndex, index)) {
        this._movePiece(this.state.selectedIndex, index);
      } else {
        this._unselect();
      }
    }
  }

  private _select = (index: number): void => {
    if (index >= 0 && index < 12) {
      // selecting the piece om the board (ensured it is not empty)
      // cannot do this if the cell has the mover's piece
      if (this.state.isTurn1 && (this.state.board[index] <= 0)) { return } 
      if (!this.state.isTurn1 && (this.state.board[index] >= 0)) { return }
    } else if (index >= 12 && index < 18) {
      // trying to use a prisoner
      if (this.state.prisoners[index-12] < 1) { return }  // no prisoner
      if (this.state.isTurn1 !== (index < 15)) { return } // not my prisoner
    } else {
      return // not valid index value
    }
    const img = this._getImage(index);
    img?.classList.add("selected");
    this.state.selectedIndex = index;
    Array.from(Array(12).keys()).forEach( (index_to: number) => {
      const cell = this._getCell(index_to);
      if (index_to === index) {
        cell?.classList.remove("highlighted")
        cell?.classList.remove("not-highlighted")
      } else if (this._canMove(index, index_to)) {
        cell?.classList.add("highlighted")
        cell?.classList.remove("not-highlighted")
      } else {
        cell?.classList.add("not-highlighted")
        cell?.classList.remove("highlighted")
      }
    })
  }

  private _unselect = (): void => {
    // unselect the selected piece
    const img = this._getImage(this.state.selectedIndex);
    if (img != null) { img.classList.remove("selected") }
    this.state.selectedIndex = -1;
    // remove highlighted and not-highlighted class from all others
    Array.from(Array(12).keys()).forEach( (index: number) => {
      const cell = this._getCell(index);
      cell?.classList.remove("highlighted")
      cell?.classList.remove("not-highlighted")
    })
  }

  private _nextRow(index1: number, index2: number): boolean {
    return (Math.abs(Math.floor(index1/3) - Math.floor(index2/3)) === 1)
  }

  private _sameRow(index1: number, index2: number): boolean {
    return Math.floor(index1/3) === Math.floor(index2/3)
  }

  private _canMove = (index_from: number, index_to: number): boolean => {
    //if ( this._gameStatus() !== 0 ) { return false; }  // game is over, cannot move any piece
    // we do not use game status for this judgement because game status uses this function
    if (index_from < 0 || index_from > 17 || index_to < 0 || index_to > 11) { return false }  // index out of bounds
    if (index_from > 11) {
      // using a piece from prisoner
      const n_prisoner: number = this.state.prisoners[index_from - 12]
      if (n_prisoner < 1) { return false }  // does not have prisoner
      // we can place the piece any empty cells
      return (this.state.board[index_to] === 0) 
    }
    // moving a piece of the board
    const piece_from: number = Math.abs(this.state.board[index_from])
    if (piece_from < 1 || piece_from > 5) { return false }  // not a valid piece
    const owner_from: number = this.state.board[index_from] > 0 ? 1 : this.state.board[index_from] < 0 ? 2 : 0
    if (owner_from === 0) { return false }  // moving from empty cell
    const owner_to: number = this.state.board[index_to] > 0 ? 1 : this.state.board[index_to] < 0 ? 2 : 0
    if (owner_from === owner_to) { return false }  // cannot move on my piece
    // from here, the result depends on the piece to move
    // to make the calculation easier, convert the indices to the first mover viewpoint
    const i1 = owner_from === 1 ? index_from : 11-index_from
    const i2 = owner_from === 1 ? index_to : 11-index_to
    if (piece_from === 1) {
      // hiyoko
      return (i1 - 3 === i2)
    }
    if (piece_from === 2) {
      // zou
      // difference must be 2 or 4 for diagonal moves
      if (![2, 4].includes(Math.abs(i1 - i2))) { return false }  
      // in addition, they must be in neighbor rows, i.e. row difference must be exactly one
      return this._nextRow(i1, i2)
    }
    if (piece_from === 3) {
      // kirin
      const idiff = Math.abs(i1 - i2)
      if (idiff === 1) { 
        // horizontal move, must be in the same row
        return this._sameRow(i1, i2)
      }
      if (idiff === 3) { return true }  // vertical moves are always okay, given indices are valid
      //  // vertical move, must be in the next row
      //  return (Math.abs(Math.floor(i1/3) - Math.floor(i2/3)) === 1)
      //}
      return false  // neither horizontal or vertical move
    }
    if (piece_from === 4) {
      // tori
      const idiff = Math.abs(i1 - i2)
      // vertical move is okay
      if (idiff === 3) { return true }
      if (idiff === 1) {
        // horizontal move, must be in the same row
        return this._sameRow(i1, i2)
      }
      if ([2, 4].includes(idiff) && i1 > i2) {
        // diagonally moving up, must be in the next row
        return this._nextRow(i1, i2)
      }
      return false
    }
    if (piece_from === 5) {
      // lion
      const idiff = Math.abs(i1 - i2)
      //console.log(idiff, i1, i2)
      // vertical move is okay
      if (idiff === 3) { return true }
      if (idiff === 1) {
        // horizontal move, must be in the same row
        return this._sameRow(i1, i2)
      }
      if ([2, 4].includes(idiff)) {
        //console.log(idiff, i1, i2)
        // diagonal, must be in the next row
        return this._nextRow(i1, i2)
      }
      return false
    }
    // this line should not be reached due to the filtering by piece value
    // return false just for the completeness
    return false  
  }

  private _applyCell = (index: number): void => {
    const piece = Math.abs(this.state.board[index])
    const opponent = (this.state.board[index] < 0)
    const img = this._getImage(index)
    if (img != null) {
      img.src = this.state.images[piece]
      if (opponent) { img.classList.add("opponent") } else { img.classList.remove("opponent") }
    }
  }

  private _updateCell = (index: number, piece: number, player1: boolean): void => {
    // change the visual of the cell of the given index to the given piece of the given player
    this.state.board[index] = player1 ? piece : -piece  // update the state
    this._applyCell(index) // update the visual
  }

  private _applyPrisoner = (index: number): void => {
    const num = this._getPrisoner(index)
    if (num != null) { num.innerText = String(this.state.prisoners[index]) }
  }

  private _updatePrisoner = (index: number, value: number): void => {
    // change the visual of the prisoner to the given number
    this.state.prisoners[index] = value
    this._applyPrisoner(index)
  }

  private _incrementPrisoner = (index: number, add: boolean): void => {
    // index must be 0 to 5, corresponding to the index of state.prisoners
    const value = this.state.prisoners[index] + (add ?  + 1 : -1)
    this._updatePrisoner(index, value)
  }

  private _movePiece = (index_from: number, index_to: number): void => {
    // we assume this move is legal
    // should be checked by _canMove before using this function
    if (index_from < 0 || index_from > 17 || index_to < 0 || index_to > 11) { return }  // index out of bounds

    // we define piece here because we need this when return the value to python
    const piece = index_from > 11 ? ((index_from - 12) % 3) + 1 : Math.abs(this.state.board[index_from])
    if (index_from > 11) {
      // using a prisoner
      // change the state and apply to the visual
      this._incrementPrisoner(index_from - 12, false)
      // place the piece
      // change the state and apply to the visual
      //const piece = ((index_from - 12) % 3) + 1
      this._updateCell(index_to, piece, this.state.isTurn1)
    } else {
      // move a piece on the board
      const piece_to = Math.abs(this.state.board[index_to])
      // captured a piece and it is not lion
      if (piece_to >= 1 && piece_to <= 4) {
        // to get the piece index, we first subtract one from piece and take mod(3)
        // this way, (1,4)-> 0, 2-> 1, 3-> 2
        // and add 3 if opponent turn
        this._incrementPrisoner((piece_to - 1) % 3 + (this.state.isTurn1 ? 0 : 3), true)
      }
      //const piece = Math.abs(this.state.board[index_from])
      const promoted = this.state.isTurn1 ? (index_to < 3) : (index_to > 8)
      this._updateCell(index_to, (piece === 1 && promoted) ? 4 : piece, this.state.isTurn1)  // update the target cell
      this._updateCell(index_from, 0, false)                      // update the source cell to empty
    }

    this._unselect()  // after move, we remove the selection
    this.state.isTurn1 = !this.state.isTurn1

    // return component information to the python side
    // return an array of the resulted state (length 19)
    //        and the game status
    //        and action (piece, from_index, to_index)
    const ret = this.state.board.concat(this.state.prisoners).concat(
      this.state.isTurn1 ? 1 : 2, this._gameStatus(), piece, index_from, index_to)
    Streamlit.setComponentValue(ret)
  }

  private _gameStatus = (): number => {
    // returns 0 if the game is not finished yet
    //         winner (1 or 2) if game is over
    // do not take account of intinite repeat (sennichite)
    if ( !this.state.board.includes(-5) ) { return 1 }  // lion of 2 does not exist on the boar
    if ( !this.state.board.includes(5) )  { return 2 }  // lion of 1 does not exist on the boar

    const lion_index1 = this.state.board.indexOf(5)
    if ( lion_index1 >= 0 && lion_index1 < 3) {
      // test "try" by the player 1
      if (![0,1,2,3,4,5].some( (i: number) => this._canMove(i, lion_index1) )) { return 1 }
    }
    const lion_index2 = this.state.board.indexOf(-5)
    if ( lion_index2 >= 9 && lion_index2 < 12) {
      // test "try" by the player 2
      if (![6,7,8,9,10,11].some( (i: number) => this._canMove(i, lion_index2) )) { return 2 }
    }

    return 0
  }

  /** Focus handler for our "Click Me!" button. */
  private _onFocus = (): void => {
    this.setState({ isFocused: true })
  }

  /** Blur handler for our "Click Me!" button. */
  private _onBlur = (): void => {
    this.setState({ isFocused: false })
  }
  
}

// "withStreamlitConnection" is a wrapper function. It bootstraps the
// connection between your component and the Streamlit app, and handles
// passing arguments from Python -> Component.
//
// You don't need to edit withStreamlitConnection (but you're welcome to!).
export default withStreamlitConnection(DoubutsuShogi)
