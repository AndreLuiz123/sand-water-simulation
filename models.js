class Cell {
    constructor(x, y, size) {
        this.x = x
        this.y = y
        this.size = size
        this.state = false
        this.neighboors = {}
        this.type = 'empty'
    }

    draw = (color) => {
        c.fillStyle = color
        c.fillRect(
            this.x * this.size,
            this.y * this.size,
            this.size ,
            this.size
        )
    }

    change = () => {
        this.state = !this.state
    }
}

class Empty extends Cell {
    constructor(x, y, size) {
        super(x, y, size)
        this.color = "#333"
        this.type = 'empty'
    }
}

function Grid(n, cellSize) {
    this.tam = n
    this.cellsSize = cellSize
    this.worldSize = Math.floor(this.tam * this.tam)
    this.cells = Array(this.worldSize)
    this.typesColors = {
        empty: '#aaa',
        sand: 'darkkhaki',
        water: 'blue'
    }
    this.qt = new QuadTree(
        new Rectangle(0, 0, this.tam, this.tam),
        20, 5, 0
    )

    this.start = () => {
        for(let i = 0; i < this.tam; i++) {
            for(let j = 0; j < this.tam; j++) {
                this.cells[ this.mapCoordsToGrid(i,j) ] = new Cell(j, i, this.cellsSize)
            }
        }
    }

    this.turnState = (x, y, type) => {
        if(!this.cells[ this.mapCoordsToGrid(x, y) ].state){
            this.cells[ this.mapCoordsToGrid(x, y) ].type = type
        }
        else {
            this.cells[ this.mapCoordsToGrid(x, y) ].type = 'empty'
        }
        this.cells[ this.mapCoordsToGrid(x, y) ].change()
    }

    this.mapCoordsToGrid = (x,y) => {
        return x*this.tam + y
    }
    this.mapGridToCoords = (coords) => {
        return [ 
            Math.floor(coords / this.tam),
            coords % this.tam 
        ]
    }

    this.copyCell = (cell) => {
        let cloneCell = new Cell(
            JSON.parse(JSON.stringify(cell.x)),
            JSON.parse(JSON.stringify(cell.y)),
            this.cellsSize
        )
        cloneCell.state = JSON.parse(JSON.stringify(cell.state))
        cloneCell.neighboors = JSON.parse(JSON.stringify(cell.neighboors))
        cloneCell.type = JSON.parse(JSON.stringify(cell.type))
        return cloneCell
    }

    this.cellNeighboors = (x,y) => {
        let spaceAvailable = {
            n: [y-1, x],
            ne: [y-1, x+1],
            e: [y, x+1],
            se: [y+1, x+1],
            s: [y+1, x],
            sw: [y+1, x-1],
            w: [y, x-1],
            nw: [y-1, x-1]
        }

        if(!x) {
            delete spaceAvailable.w
            delete spaceAvailable.nw
            delete spaceAvailable.sw
        }
        if(!y) {
            delete spaceAvailable.n
            delete spaceAvailable.ne
            delete spaceAvailable.nw
        }
        if(x === this.tam - 1) {
            delete spaceAvailable.e
            delete spaceAvailable.se
            delete spaceAvailable.ne
        }
        if(y === this.tam - 1) {
            delete spaceAvailable.s
            delete spaceAvailable.se
            delete spaceAvailable.sw
        }
        
        for (let dir in spaceAvailable) {
            if(this.cells[
                this.mapCoordsToGrid(
                    spaceAvailable[dir][0],
                    spaceAvailable[dir][1]
                    )
                ].state) {
                delete spaceAvailable[dir]
            }
        }
        return spaceAvailable
    }

    this.update = () => {
        for(let i = 0; i < this.worldSize; i++) {
            let cell = this.cells[i]
            if( cell.state ){
                cell.neighboors = this.cellNeighboors(cell.x, cell.y)
                this.qt.insert(new Point(cell.x, cell.y, cell))
            }
        }
    }

    this.QTupdate = () => {
        let xPosCells = []
        let yPosCells = []
        for(let i = 0; i < this.worldSize; i++){
            let cell = this.cells[i]
            if(cell.state) {
                cell.neighboors = this.cellNeighboors(cell.x, cell.y)
                this.qt.insert(new Point(cell.x, cell.y, cell))
                xPosCells.push(cell.x)
                yPosCells.push(cell.y)
            }
        }
        let minXPos = Math.min(...xPosCells)
        let maxXPos = Math.max(...xPosCells)
        let minYPos = Math.min(...yPosCells)
        let maxYPos = Math.max(...yPosCells)

        let cellsRange = new Rectangle(
            minXPos - 1, 
            minYPos - 1, 
            Math.abs(maxXPos - minXPos) + 1 ,
            Math.abs(maxYPos - minYPos) + 1
        )

        return this.qt.query(cellsRange)
    }

    this.moveCell = (cell, coords) => {
        //Criando nova celula que será movida
        const newCell = this.copyCell(cell)
        cell.state = false
        //Atualizando coordenadas da celula
        let [ newX, newY ] = this.mapGridToCoords(coords)
        newCell.x = newY
        newCell.y = newX
        // colocando celula na posicao especificada
        this.cells[ coords ] = newCell
    }

    this.checkChange = (cell) => {
            let neighboorCoords = 0
            if(cell.type === 'sand') {
                if(cell.neighboors.s){
                    neighboorCoords = this.mapCoordsToGrid(
                        cell.neighboors.s[0], cell.neighboors.s[1]
                        )
                    }
                else if(cell.neighboors.sw){
                    neighboorCoords = this.mapCoordsToGrid(
                        cell.neighboors.sw[0], cell.neighboors.sw[1]
                        )
                    }
                else if(cell.neighboors.se){
                    neighboorCoords = this.mapCoordsToGrid(
                        cell.neighboors.se[0], cell.neighboors.se[1]
                        )
                }
            }
            else if(cell.type === 'water') {
                if(cell.neighboors.s){
                    neighboorCoords = this.mapCoordsToGrid(
                        cell.neighboors.s[0], cell.neighboors.s[1]
                        )
                    }
                else if(cell.neighboors.sw){
                    neighboorCoords = this.mapCoordsToGrid(
                        cell.neighboors.sw[0], cell.neighboors.sw[1]
                        )
                    }
                else if(cell.neighboors.se){
                    neighboorCoords = this.mapCoordsToGrid(
                        cell.neighboors.se[0], cell.neighboors.se[1]
                        )
                }
                else if(cell.neighboors.e){
                    neighboorCoords = this.mapCoordsToGrid(
                        cell.neighboors.e[0], cell.neighboors.e[1]
                        )
                }
                else if(cell.neighboors.w){
                    neighboorCoords = this.mapCoordsToGrid(
                        cell.neighboors.w[0], cell.neighboors.w[1]
                        )
                }
            }
            if(neighboorCoords && !this.cells[ neighboorCoords ].state ) {
                this.moveCell(cell, neighboorCoords)
                return true
            }
            else {
                return false
            }
    }

    this.applyRules = () => {
        // this.update()
        // for(let i = 0; i < this.worldSize; i++) {
        //     const cell = this.cells[i]
        //     if(cell.state) {
        //         this.checkChange(cell)
        //     }            
        // }

        let activeCells = this.QTupdate()
    
        for(let point of activeCells) {
            const cell = point.userData
            if(cell.state) {
                this.checkChange(cell)
            }  
        }

        this.qt.clear()
        // this.qt = new QuadTree(
        //     new Rectangle(0, 0, this.tam, this.tam),
        //     20, 5, 0
        // )
    }
    
    this.draw = () => {
        for(let i = 0; i < this.worldSize; i++) {
            if(this.cells[i].state){
                this.cells[i].draw(this.typesColors[this.cells[i].type])
            }
        }
    }
}