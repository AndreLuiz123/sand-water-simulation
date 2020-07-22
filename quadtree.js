
class Point {
    constructor(x, y, userData) {
        this.x = x
        this.y = y
        this.userData = userData
    }

    scalePoint() {
        return [
            this.x * this.scale, 
            this.y * this.scale
        ]
    }
}

class Rectangle{
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    contains(point) {
        return (
            (point.x > this.x)&&
            (point.x <= this.x + this.w)&&
            (point.y > this.y)&&
            (point.y <= this.y + this.h)
        )
    }

    intersects(range) {
        return !(
            (this.x + this.w < range.x) ||
            (this.y + this.h < range.y) ||
            (this.x > range.x + range.w)||
            (this.y > range.y + range.h)
        )
    }

    isInside(range) {
        return (
            (range.x <= this.x) &&
            (range.x + range.w >= this.x + this.w) &&
            (range.y <= this.y) &&
            (range.y + range.h >= this.y + this.h)
        )
    }
}

class QuadTree{
    constructor(boundary, n, limit, level=0) {
        this.boundary = boundary
        this.capacity = n
        this.divided = false
        this.limit = limit
        this.level = level
        this.points = []
    }

    subdivide() {
        let x = this.boundary.x
        let y = this.boundary.y
        let w = this.boundary.w
        let h = this.boundary.h
        
        let nwRect = new Rectangle(
            x, 
            y,
            w / 2,
            h / 2
        )
        let neRect = new Rectangle(
            x + (w / 2), 
            y,
            w / 2,
            h / 2
        )
        let swRect = new Rectangle(
            x, 
            y + (h / 2),
            w / 2,
            h / 2
        )
        let seRect = new Rectangle(
            x + (w / 2), 
            y + (h / 2),
            w / 2,
            h / 2
        )
        this.nw = new QuadTree(nwRect, this.capacity, this.limit, this.level + 1)
        this.ne = new QuadTree(neRect, this.capacity, this.limit, this.level + 1)
        this.sw = new QuadTree(swRect, this.capacity, this.limit, this.level + 1)
        this.se = new QuadTree(seRect, this.capacity, this.limit, this.level + 1)
        this.divided = true
    }

    insert(point) {

        if(!this.boundary.contains(point)) {
            return false;
        }

        if(this.points.length < this.capacity) {
            this.points.push(point)
            return true
        }
        else {
            if(!this.divided) {
                this.subdivide()
            }
            if (this.nw.insert(point)) {
                return true
            }
            if (this.ne.insert(point)) {
                return true
            }
            if (this.sw.insert(point)) {
                return true
            }
            if (this.se.insert(point)) {
                return true
            }
        }
    }

    clear() {
        this.points = []
        if(this.nw) {
            this.nw.clear()
        }
        if(this.ne) {
            this.ne.clear()
        }
        if(this.sw) {
            this.sw.clear()
        }
        if(this.se) {
            this.se.clear()
        }
    }

    query(range) {

        let found = []

        if(!this.boundary.intersects(range)) {
            return found
        }
        else {
            if(this.boundary.isInside(range)) {
                found = this.points.copyWithin()
            } else {
                for(let p of this.points) {
                    if(range.contains(p)) {
                        found.push(p)
                    }
                }
            }
        }
        
        if(this.divided) {
            found = found.concat(this.nw.query(range))
            found = found.concat(this.ne.query(range))
            found = found.concat(this.sw.query(range))
            found = found.concat(this.se.query(range))
        }
        return found
    }

    show(scale) {
        c.strokeStyle = "#aaa"
        c.strokeRect(
            this.boundary.x,
            this.boundary.y,
            this.boundary.w,
            this.boundary.h
        )
        
        if(this.divided) {
            this.nw.show()
            this.ne.show()
            this.sw.show()
            this.se.show()
        }

        // c.fillStyle = "#bbb"
        // for(let p of this.points) {
        //     if(p.userData.state) {
        //         c.fillRect(p.x * scale, p.y * scale, 4, 4)
        //     }
        // }
    }
}