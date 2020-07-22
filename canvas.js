let canvas = document.querySelector('canvas')

let c = canvas.getContext('2d')

// canvas.height = window.innerHeight
// canvas.width = window.innerWidth

let n = 100
let cellSize = 4

canvas.height = n*cellSize
canvas.width = n*cellSize

let grid = new Grid(n, cellSize)

// let boundary = new Rectangle(0, 0, canvas.width, canvas.height)
// let qt = new QuadTree(boundary , 3)

// for(let i = 0; i < 100; i++) {
//     qt.insert(
//         new Point(
//             Math.floor(Math.random() * canvas.width),
//             Math.floor(Math.random() * canvas.height)
//         )
//     )
// }

// console.log(qt)

let paused = true

function mapMouseToCoords(x , y) {
    let gridX = Math.floor(x / cellSize)
    let gridY = Math.floor(y / cellSize)
    return [ gridX, gridY ]
}


const click = (event) => {
    let [ x , y ]  = mapMouseToCoords(
        event.clientY, event.clientX
    )
    qt.insert(new Point(
        event.clientX,
        event.clientY
    ))
}

let keyPressInterval
let mouseX, mouseY

let controls = {
    sand: false,
    water: false
}

const mouseMove = (event) => {
    [ x , y ]= mapMouseToCoords(event.clientY, event.clientX)
    mouseX = x
    mouseY = y
}

const keyUp = (event) => {
    clearInterval(keyPressInterval)
}

canvas.addEventListener("mousemove", mouseMove);
canvas.addEventListener("keyup", keyUp);

window.addEventListener('keypress', (event) => {
    switch (event.keyCode) {
        case 116:
            paused = !paused
            break;
        case 115:
            clearInterval(keyPressInterval)
            keyPressInterval = setInterval(() => {
                grid.turnState(mouseX, mouseY, 'sand')
            }, 50 );
            break;
        case 119:
            clearInterval(keyPressInterval)
            keyPressInterval = setInterval(() => {
                grid.turnState(mouseX, mouseY, 'water')
            }, 50 );
            break;
        case 120:
            clearInterval(keyPressInterval)
        default:
            break;
    }
})

setInterval(() => {
    if(!paused) {
        grid.applyRules()
    }
}, 10)


function init() {
    grid.start()
}

// searchRect = new Rectangle(
//     Math.floor(Math.random() * 400),
//     Math.floor(Math.random() * 400),
//     Math.floor(Math.random() * 200 + 100),
//     Math.floor(Math.random() * 200 + 100)
// )

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0,0, innerWidth, innerHeight)
    
    grid.draw()
    grid.qt.show(cellSize)

    // c.strokeStyle = "#5d5"
    // c.strokeRect(
    //     searchRect.x,
    //     searchRect.y,
    //     searchRect.w,
    //     searchRect.h
    // )

    // for(let p of pointsFounded) {
    //     c.fillStyle = "#5d5"
    //     c.fillRect(
    //         p.x,
    //         p.y,
    //         4,
    //         4
    //     )
    // }

}


init()
animate()