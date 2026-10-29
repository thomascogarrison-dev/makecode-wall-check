/**
 * Custom blocks for checking whether sprites can see each other.
 */

/**
 * Wall checks
 */
//% weight=100 color=#440055 icon="\uf0c1"
namespace WallCheck {
    /**
     * Returns true if a wall tile blocks the line between two sprites.
     * @param first first sprite
     * @param second second sprite
     */
    //% block="wall between $first and $second"
    //% blockId=wallcheck_between_sprites
    //% first.shadow=variables_get
    //% second.shadow=variables_get


export function isWallBetween(first: Sprite, second: Sprite): boolean {
    const tileSize = 16

    const dx = second.x - first.x
    const dy = second.y - first.y

    if (dx === 0 && dy === 0) {
        return false
    }

    const startX = Math.floor(first.x / tileSize)
    const startY = Math.floor(first.y / tileSize)

    const endX = Math.floor(second.x / tileSize)
    const endY = Math.floor(second.y / tileSize)

    let tileX = startX
    let tileY = startY

    const stepX = dx > 0 ? 1 : -1
    const stepY = dy > 0 ? 1 : -1

    const deltaX = dx === 0 ? Infinity : tileSize / Math.abs(dx)
    const deltaY = dy === 0 ? Infinity : tileSize / Math.abs(dy)

    let maxX = dx === 0 ? Infinity :
        ((stepX > 0 ? (tileX + 1) * tileSize : tileX * tileSize) - first.x) / dx

    let maxY = dy === 0 ? Infinity :
        ((stepY > 0 ? (tileY + 1) * tileSize : tileY * tileSize) - first.y) / dy

    function isWall(x: number, y: number): boolean {
        // Ignore only the actual starting and ending tiles.
        if ((x === startX && y === startY) ||
            (x === endX && y === endY)) {
            return false
        }

        return tiles.tileAtLocationIsWall(
            tiles.getTileLocation(x, y)
        )
    }

    while (tileX !== endX || tileY !== endY) {

        if (Math.abs(maxX - maxY) < 0.0000001) {

            // Check both tiles beside the corner.
            if (isWall(tileX + stepX, tileY)) return true
            if (isWall(tileX, tileY + stepY)) return true

            tileX += stepX
            tileY += stepY

            maxX += deltaX
            maxY += deltaY

            if (isWall(tileX, tileY)) return true

        } else if (maxX < maxY) {

            tileX += stepX
            maxX += deltaX

            if (isWall(tileX, tileY)) return true

        } else {

            tileY += stepY
            maxY += deltaY

            if (isWall(tileX, tileY)) return true
        }
    }

    return false
}



/**
 * Runs code whenever sprites of these kinds have a clear line of sight.
 * @param kind first sprite kind
 * @param otherKind second sprite kind
 * @param handler code to run
 */
//% block="on $sprite of kind $kind sees $otherSprite of kind $otherKind"
//% blockAllowMultiple=1
//% draggableParameters
export function onSees(
        kind: number,
        otherKind: number,
        handler: (sprite: Sprite, otherSprite: Sprite) => void
    ): void {
        game.onUpdate(function () {
            const firstSprites = sprites.allOfKind(kind)
            const secondSprites = sprites.allOfKind(otherKind)

            for (const sprite of firstSprites) {
                for (const otherSprite of secondSprites) {
                    if (sprite != otherSprite && !isWallBetween(sprite, otherSprite)) {
                        handler(sprite, otherSprite)
                    }
                }
            }
        })
    }
}
