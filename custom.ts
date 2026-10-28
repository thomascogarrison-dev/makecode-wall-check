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
        const dx = second.x - first.x
        const dy = second.y - first.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 1) {
            return false
        }

        const steps = Math.ceil(distance / 4)

        for (let i = 1; i < steps; i++) {
            const t = i / steps
            const px = first.x + dx * t
            const py = first.y + dy * t

            const location = tiles.getTileLocation(
                Math.floor(px / 16),
                Math.floor(py / 16)
            )

            if (tiles.tileAtLocationIsWall(location)) {
                return true
            }
        }

        return false
    }

    /**
     * Runs the code inside whenever sprites of these kinds have a clear line of sight.
     * This checks all pairs each game update, not just sprites that physically overlap.
     * @param kind first sprite kind
     * @param otherKind second sprite kind
     * @param handler code to run when there is no wall between them
     */
    //% block="on $sprite of kind $kind sees $otherSprite of kind $otherKind"
//% blockAllowMultiple=1
//% draggableParameters
//% handlerStatement
    //% block="on $sprite of kind $kind sees $otherSprite of kind $otherKind"
    //% blockId=wallcheck_on_sees
    //% kind.shadow=spritekind
    //% otherKind.shadow=spritekind
    //% draggableParameters
    //% handlerStatement=1
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
