package game

type Player int

const (
	None Player = iota
	Black
	White
)

type Board struct {
	Size int
	Turn Player
	Grid [][]Player
}

func NewBoard(size int) *Board {
	grid := make([][]Player, size)

	for i := range grid {
		grid[i] = make([]Player, size)
	}

	return &Board{
		Size: size,
		Grid: grid,
		Turn: Black,
	}
}

func (b *Board) PlaceStone(x, y int) (bool, string) {
	if b.Grid[y][x] != None {
		return false, "Position already occupied"
	}

	b.Grid[y][x] = b.Turn
	
	b.Turn = 3 - b.Turn

	return true, "Added stone successfully"
}
