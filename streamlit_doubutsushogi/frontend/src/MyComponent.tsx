import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { ReactNode } from "react"
import { pieceImages } from "./images"

interface State {
  //numClicks: number
  board: number[]         // board status, length 12
  prisoners: number[]     // prisoner counts, length 6
  isTurn1: boolean        // indicates that the next mover is the player 1 (bottom to top)
  selectedIndex: number   // index of selected cell, negative indicates no cell is selected
  //images: string[]        // piece images, length 6 (include empty)
  pieceName: keyof typeof pieceImages       // name of piece type to use
  prevData: number[][]    // previous data list, older the first, format in: board + prisoners + [turn]
  nextData: number[][]    // next data list, newer the first, the same format as prevData
  uiWidth: string         // non-default ui width
  isFocused: boolean
}

/**
 * This is a React-based component template. The `render()` function is called
 * automatically when your component should be re-rendered.
 */
class DoubutsuShogi extends StreamlitComponentBase<State> {

  public state = {
    /* game state */
    board: [-3, -5, -2, 0, -1, 0, 0, 1, 0, 2, 5, 3],
    prisoners: [0, 0, 0, 0, 0, 0],
    isTurn1: true,

    /* board selection */
    selectedIndex: -1,

    /* game history */
    prevData: [] as number[][],
    nextData: [] as number[][],

    /* piece image data */
    //images: ["", "", "", "", ""],
    pieceName: "emoji1" as keyof typeof pieceImages,
    /* Sizing */
    uiWidth: "",

    /* something we need? */
    isFocused: false
    //,numClicks: 0    
  }

  /*
  // we may add constructor in the future, but don't know yet
  constructor(props: any) {
    super(props)
    console.log(props)
  }
  */

  componentDidMount(): void {
    //console.log("start componentDidMount")
    this._applyCurrentState()
    this._applySizes()
    this._reportCurrentStatus()  // This make sures that the Python side receives the starting state

    // This is copied from the source of StreamlitComponentBase
    // By this, we tell Streamlit that our height has changed.
    // https://github.com/streamlit/streamlit/blob/develop/component-lib/src/StreamlitReact.tsx
    Streamlit.setFrameHeight();
  }

  componentDidUpdate(): void {
    this._applyCurrentState()
    this._applySizes()
    Streamlit.setFrameHeight();
  }

  public render = (): ReactNode => {
    // Arguments that are passed to the plugin in Python are accessible
    // via `this.props.args`. Here, we access the "name" arg.
    //console.log(this.props)
    
    /* Args:
      piecename: string
                 Piece image name to show
      ui_width: str or null
                Width of UI
      state: number[] or null
             Data of game state to start with
             board + prisnor + [mover]
    */

    const piecename: keyof typeof pieceImages = this.props.args["piecename"]
    this.state.pieceName = piecename
    const ui_width = this.props.args["ui_width"]
    if (ui_width != null) {
      this.state.uiWidth = ui_width; 
    }
    const state_data = this.props.args["state"]  // non-default board state is given
    if (state_data != null) {
      console.log("board state:", state_data)
      // go to this state
      this.StartFromThisState(state_data)
      this._reportCurrentStatus()
    }

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

    return (
      <div id="main-ui" className="doubutsushogi-ui">

      <div className="prisoner-row">
        <div className="prisoner-cell">
          <img id="img15" className="prisoner-image" alt="hiyoko" src={this._getPieceImage(1)} onClick={ (e)=>this.pieceClicked(15) } />
          <span className="prisoner-value" id="prisoner3">{this.state.prisoners[3]}</span>
        </div>
        <div className="prisoner-cell">
          <img id="img16" className="prisoner-image" alt="zou" src={this._getPieceImage(2)} onClick={ (e)=>this.pieceClicked(16) } />
          <span className="prisoner-value" id="prisoner4">{this.state.prisoners[4]}</span>
        </div>
        <div className="prisoner-cell">
          <img id="img17" className="prisoner-image" alt="kirin" src={this._getPieceImage(3)} onClick={ (e)=>this.pieceClicked(17) } />
          <span className="prisoner-value" id="prisoner5">{this.state.prisoners[5]}</span>
        </div>
        <div className="prisoner-sep"></div>
        <div className="turn-indicator-cell">
          <span id="turn-indicator2" className="turn-indicator">&#9663;</span>
        </div>
      </div>

      <div className="board">
        <div id="row0" className="board-row">
          <div id="cell0" className="piece-cell"><img id="img0" className="piece-image" alt="piece0" onClick={ (e)=>this.pieceClicked(0) }/></div>
          <div id="cell1" className="piece-cell"><img id="img1" className="piece-image" alt="piece1" onClick={ (e)=>this.pieceClicked(1) }/></div>
          <div id="cell2" className="piece-cell"><img id="img2" className="piece-image" alt="piece2" onClick={ (e)=>this.pieceClicked(2) }/></div>
        </div>
        <div id="row1" className="board-row">
          <div id="cell3" className="piece-cell"><img id="img3" className="piece-image" alt="piece3" onClick={ (e)=>this.pieceClicked(3) }/></div>
          <div id="cell4" className="piece-cell"><img id="img4" className="piece-image" alt="piece4" onClick={ (e)=>this.pieceClicked(4) }/></div>
          <div id="cell5" className="piece-cell"><img id="img5" className="piece-image" alt="piece5" onClick={ (e)=>this.pieceClicked(5) }/></div>
        </div>
        <div id="row2" className="board-row">
          <div id="cell6" className="piece-cell"><img id="img6" className="piece-image" alt="piece6" onClick={ (e)=>this.pieceClicked(6) }/></div>
          <div id="cell7" className="piece-cell"><img id="img7" className="piece-image" alt="piece7" onClick={ (e)=>this.pieceClicked(7) }/></div>
          <div id="cell8" className="piece-cell"><img id="img8" className="piece-image" alt="piece8" onClick={ (e)=>this.pieceClicked(8) }/></div>
        </div>
        <div id="row3" className="board-row">
          <div id="cell9" className="piece-cell"><img id="img9" className="piece-image" alt="piece9" onClick={ (e)=>this.pieceClicked(9) }/></div>
          <div id="cell10" className="piece-cell"><img id="img10" className="piece-image" alt="piece10" onClick={ (e)=>this.pieceClicked(10) }/></div>
          <div id="cell11" className="piece-cell"><img id="img11" className="piece-image" alt="piece11" onClick={ (e)=>this.pieceClicked(11) }/></div>
        </div>

      </div>

      <div className="prisoner-row">
        <div className="prisoner-cell">
          <img id="img12" className="prisoner-image" alt="hiyoko" src={this._getPieceImage(1)} onClick={ (e)=>this.pieceClicked(12) } />
          <span className="prisoner-value" id="prisoner3">{this.state.prisoners[0]}</span>
        </div>
        <div className="prisoner-cell">
          <img id="img13" className="prisoner-image" alt="zou" src={this._getPieceImage(2)} onClick={ (e)=>this.pieceClicked(13) } />
          <span className="prisoner-value" id="prisoner4">{this.state.prisoners[1]}</span>
        </div>
        <div className="prisoner-cell">
          <img id="img14" className="prisoner-image" alt="kirin" src={this._getPieceImage(3)} onClick={ (e)=>this.pieceClicked(14) } />
          <span className="prisoner-value" id="prisoner5">{this.state.prisoners[2]}</span>
        </div>
        <div className="prisoner-sep"></div>
        <div className="turn-indicator-cell">
          <span id="turn-indicator1" className="turn-indicator next-mover">&#9650;</span>
        </div>
      </div>

      <div className="control-row">
        <div id="to-start" className="control-button inactive" data-hover="Start" onClick={this.toStart}><strong>&lt;&lt;</strong></div>
        <div id="to-prev" className="control-button inactive" data-hover="Back" onClick={this.toPrev}><strong>&lt;</strong></div>
        <div className="control-sep"></div>
        <div id="to-next" className="control-button inactive" data-hover="Next" onClick={this.toNext}><strong>&gt;</strong></div>
        <div id="to-last" className="control-button inactive" data-hover="End" onClick={this.toLast}><strong>&gt;&gt;</strong></div>
        <div className="control-sep"></div>
        <div className="control-sep"></div>
        <div className="control-sep"></div>
        <div className="control-sep"></div>
        <div id="refresh" className="control-button" data-hover="Initialize" onClick={this.refreshGame}><strong>&#11119;</strong></div>
        <div id="board-flip" className="control-button" data-hover="Flip" onClick={this.flipBoard}><strong>&#8645;</strong></div>
      </div>

      </div>
    )
  }

  // Access method to the html elements
  private _getMainUI = () => {
    return document.getElementById("main-ui")
  }

  private _getPrisoner = (index: number) => {
    return document.getElementById(`prisoner${index}`)
  }

  private _getImage = (index: number): HTMLImageElement | undefined => { 
    return document.getElementById(`img${index}`) as HTMLImageElement;
  }

  private _getCell = (index: number): HTMLImageElement | undefined => { 
    return document.getElementById(`cell${index}`) as HTMLImageElement;
  }

  private _getPrevButton  = () => { return document.getElementById("to-prev") }
  private _getStartButton = () => { return document.getElementById("to-start") }
  private _getNextButton  = () => { return document.getElementById("to-next") }
  private _getLastButton  = () => { return document.getElementById("to-last") }
  
  private _getTurnIndicator = (index: number) => {
    return document.getElementById(`turn-indicator${index}`)
  }  
  //

  // Piece image data
  private _getPieceImage = (index: number) => {
    return pieceImages[this.state.pieceName][index]
  }
  //

  // Update state with a given data or action
  private refreshGame = (): void => {
    this._setStateData([-3, -5, -2, 0, -1, 0, 0, 1, 0, 2, 5, 3, 0, 0, 0, 0, 0, 0, 1], true)
    this._reportCurrentStatus()  // this also update the visuals due to componentDidUpdate invoked
  }

  private StartFromThisState = (data: number[]): void => {
    if (!this._validateStateData(data)) { return }
    this._setStateData(data, true)
  }

  private _setStateData = (data: number[], clear_history: boolean): void => {
    /*
    if (!this._validateStateData(data)) {
      //console.log("Invalid state data, will not apply")
      return
    }
    */
    //console.log("Going to the state: ", data)
    this.state.board     = data.slice(0, 12)
    this.state.prisoners = data.slice(12, 18)
    this.state.isTurn1   = (data[18] === 1)
    this._unselect()

    if (clear_history) {
      this._clearHistory()
    }
  }

  private _clearHistory = (): void => {
    //console.log("Clearing history")
    this.state.prevData.length = 0
    this.state.nextData.length = 0
    this._updateButtonState()  // apply to visual
  }

  private _validateStateData = (data: number[]): boolean => {
    if (data.length !== 19) {
      console.log("data must be length 19")
      return false
    }
    if (!data.slice(0, 12).every( (n: number) => { return (n >= -5 && n <= 5) }) ) {
      console.log("board piece must be in [-5, 5]")
      return false
    }
    if (!data.slice(12, 18).every( (n:number) => { return (n >= 0 && n <= 2) }) ) {
      console.log("prisoner count must be [0, 2]")
      return false
    }
    if (data[18] !== 1 && data[18] !== 2) {
      console.log("turn must be 1 or 2")
      return false
    }
    return true
  }
  //

  // Size adjustment 
  private _applySizes = (): void => {
    //console.log("Applying sizes...")
    if (this.state.uiWidth !== "") {
      //console.log("UI width to", this.state.uiWidth)
      const mainui = this._getMainUI()
      if (mainui != null) {
        mainui.style.width = this.state.uiWidth
      }
    }
  }
  //

  // Prev and Next funcationality
  private toPrev = (): void => {
    if (this.state.prevData.length === 0) { return }  // nothing to do if there is no previous history
    const data = this.state.prevData.pop()
    if (data == null) { return }  // exit if prev data is null, this should not happen, but just in case

    // add current data to the next
    this.state.nextData.push(this._currentData())
    this._updateButtonState() // we need to change active/inactive status of buttons

    // set the prev data to the board state
    //this._setData(data)
    this._setStateData(data, false)
    // report to the python side
    this._reportCurrentStatus()
  }

  private toNext = (): void => {
    if (this.state.nextData.length === 0) { return }  // nothing to do if there is no leading history
    const data = this.state.nextData.pop()
    if (data == null) { return }  // exit if next data is null, this should not happen, but just in case

    // add current data to the next
    this.state.prevData.push(this._currentData())
    this._updateButtonState() // we need to change active/inactive status of buttons

    // set the prev data to the board state
    //this._setData(data)
    this._setStateData(data, false)
    // report to the python side
    this._reportCurrentStatus()
  }

  private toStart = (): void => {
    if (this.state.prevData.length === 0) { return }  // nothing to do if there is no previous history
    const data = this.state.prevData.shift()  // get the first element, i.e. the oldest board state
    if (data == null) { return }  // exit if prev data is null, this should not happen, but just in case
    
    // move all history to the next
    // note that we need to reverse prevData because the sort order is the opposite
    this.state.nextData.push(this._currentData(), ...this.state.prevData.reverse())
    this.state.prevData.length = 0  // empty prev because we are at the beginning
    this._updateButtonState() // we need to change active/inactive status of buttons

    // set the prev data to the board state
    //this._setData(data)
    this._setStateData(data, false)
    // report to the python side
    this._reportCurrentStatus()
  }

  private toLast = (): void => {
    if (this.state.nextData.length === 0) { return }  // nothing to do if there is no leading history
    const data = this.state.nextData.shift()  // get the first element, i.e. the newest board state
    if (data == null) { return }  // exit if next data is null, this should not happen, but just in case
    
    // move all history to the prev
    // note that we need to reverse nextData because the sort order is the opposite
    this.state.prevData.push(this._currentData(), ...this.state.nextData.reverse())
    this.state.nextData.length = 0  // empty next because we are at the end
    this._updateButtonState() // we need to change active/inactive status of buttons

    // set the prev data to the board state
    //this._setData(data)
    this._setStateData(data, false)
    // report to the python side
    this._reportCurrentStatus()
  }

  /*
  private _setData = (data: number[]): void => {
    // update state
    this.state.board = data.slice(0, 12)
    this.state.prisoners = data.slice(12, 18)
    this.state.isTurn1 = (data[18] === 1)
    // update visual
    this._applyCurrentState()    
  }
  */

  private _currentData = (): number[] => {
    return this.state.board.concat(this.state.prisoners).concat(
      this.state.isTurn1 ? 1 : 2
    )
  }

  private _updateButtonState = (): void => {
    // todo. maybe rename to _apply?
    const prev_button = this._getPrevButton()
    const start_button = this._getStartButton()
    //console.log(prev_button, start_button)
    if (this.state.prevData.length > 0) {
      prev_button?.classList.remove("inactive")
      start_button?.classList.remove("inactive")
    } else {
      prev_button?.classList.add("inactive")
      start_button?.classList.add("inactive")
    }

    const next_button = this._getNextButton()
    const last_button = this._getLastButton()
    if (this.state.nextData.length > 0) {
      next_button?.classList.remove("inactive")
      last_button?.classList.remove("inactive")
    } else {
      next_button?.classList.add("inactive")
      last_button?.classList.add("inactive")
    }
  }

  // Flip board functionality
  private flipBoard = (): void => {
    // update the state first
    const prev_state = this.state
    this.state.board = prev_state.board.reverse().map( (v: number): number => { return -v })
    this.state.prisoners = prev_state.prisoners.slice(3, 6).concat(prev_state.prisoners.slice(0, 3))
    this.state.isTurn1 = !prev_state.isTurn1
    // we also flip the history data
    this.state.prevData = this.state.prevData.map(this._flipData)
    this.state.nextData = this.state.nextData.map(this._flipData)
    
    // update the visual
    this._applyCurrentState()

    // report to the python side
    this._reportCurrentStatus()
  }

  private _reportCurrentStatus = (): void => {
    // report current game state to python, with no action
    const ret = this.state.board.concat(this.state.prisoners).concat(
      this.state.isTurn1 ? 1 : 2, this._gameStatus())
    Streamlit.setComponentValue(ret)
  }
  private _flipData = (data: number[]): number[] => {
    // flip a single game data
    return data.slice(0, 12).reverse().map( (v: number): number => { return -v })
      .concat(data.slice(15, 18))
      .concat(data.slice(12, 15))
      .concat(data[18]===1 ? 2 : 1) 
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
    this._applyTurn()
    // Buttons
    this._updateButtonState()
  }
  //

  // Piece click functionality
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
        // store current state to the prev storage
        this.state.prevData.push(this._currentData())
        this._movePiece(this.state.selectedIndex, index);
        // delete the next data because we have branched out
        // we are currently support only one line of history, no branching
        this.state.nextData.length = 0
        this._updateButtonState() // we need to change active/inactive status of buttons
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
    // apply the cell value to the visual
    const piece = Math.abs(this.state.board[index])
    const opponent = (this.state.board[index] < 0)
    const img = this._getImage(index)
    if (img != null) {
      img.src = this._getPieceImage(piece)
      if (opponent) { img.classList.add("opponent") } else { img.classList.remove("opponent") }
    }
  }

  private _updateCell = (index: number, piece: number, player1: boolean): void => {
    // change the visual of the cell of the given index to the given piece of the given player
    this.state.board[index] = player1 ? piece : -piece  // update the state
    this._applyCell(index) // update the visual
  }

  private _applyPrisoner = (index: number): void => {
    // apply the prisoner value to the visual
    const num = this._getPrisoner(index)
    if (num != null) { num.innerText = String(this.state.prisoners[index]) }
  }

  private _updatePrisoner = (index: number, value: number): void => {
    // change the visual of the prisoner to the given number
    this.state.prisoners[index] = value
    this._applyPrisoner(index)
  }

  private _applyTurn = (): void => {
    // apply the turn information to the visual
    const turn1 = this._getTurnIndicator(1)
    const turn2 = this._getTurnIndicator(2)
    if (this._gameStatus() !== 0) {
      // game is over, no player is to play
      turn1?.classList.remove("next-mover")
      turn2?.classList.remove("next-mover")
    } else if (this.state.isTurn1) {
      turn1?.classList.add("next-mover")
      turn2?.classList.remove("next-mover")
    } else {
      turn1?.classList.remove("next-mover")
      turn2?.classList.add("next-mover")
    }
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
      this._updateCell(index_from, 0, false)                                                 // update the source cell to empty
    }

    this._unselect()  // after move, we remove the selection
    this.state.isTurn1 = !this.state.isTurn1
    this._applyTurn()

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
