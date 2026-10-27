//% weight=100 color=#440055 icon="\uf0c1"
namespace WallCheck {

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
