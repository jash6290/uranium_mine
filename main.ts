function fillBox(blockType: number, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
    let step = 12
    for (let x = x1; x <= x2; x += step) {
        for (let y = y1; y <= y2; y += step) {
            for (let z = z1; z <= z2; z += step) {
                blocks.fill(
                    blockType,
                    pos(x, y, z),
                    pos(Math.min(x + step - 1, x2), Math.min(y + step - 1, y2), Math.min(z + step - 1, z2)),
                    FillOperation.Replace
                )
            }
        }
    }
}

function buildHollowBox(wallBlock: number, floorBlock: number, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
    fillBox(wallBlock, x1, y1, z1, x2, y2, z2)
    fillBox(AIR, x1 + 1, y1 + 1, z1 + 1, x2 - 1, y2 - 1, z2 - 1)
    fillBox(floorBlock, x1 + 1, y1, z1 + 1, x2 - 1, y1, z2 - 1)
}

function buildDisc(blockType: number, centerX: number, y: number, centerZ: number, radius: number) {
    for (let x = -radius; x <= radius; x++) {
        for (let z = -radius; z <= radius; z++) {
            if (x * x + z * z <= radius * radius) {
                blocks.place(blockType, pos(centerX + x, y, centerZ + z))
            }
        }
    }
}

function buildCylinder(blockType: number, centerX: number, y1: number, centerZ: number, radius: number, height: number) {
    for (let y = y1; y <= y1 + height; y++) {
        buildDisc(blockType, centerX, y, centerZ, radius)
    }
}

function buildMound(blockType: number, centerX: number, baseY: number, centerZ: number, radius: number, height: number) {
    for (let level = 0; level < height; level++) {
        buildDisc(blockType, centerX, baseY + level, centerZ, radius - level)
    }
}

function buildPath(x1: number, z1: number, x2: number, z2: number) {
    fillBox(COBBLESTONE, x1, 0, z1, x2, 0, z2)
}

function buildSolarRow(startX: number, z: number) {
    fillBox(COAL_BLOCK, startX, 1, z, startX + 54, 1, z + 4)
    fillBox(GLASS, startX, 2, z, startX + 54, 2, z + 4)
    fillBox(IRON_BLOCK, startX, 0, z, startX + 54, 0, z + 4)
}

function buildScene() {
    player.say("Building uranium mine model: mine, beneficiation plant, heap, factory, tailings lake, and solar farm.")

    fillBox(GRASS, -175, -1, -70, 115, -1, 160)

    buildHollowBox(STONE, COBBLESTONE, -165, -16, -18, -35, -4, 18)
    fillBox(AIR, -36, -13, -8, -29, -5, 8)
    fillBox(EMERALD_BLOCK, -35, -4, -18, -35, 3, 18)
    fillBox(EMERALD_BLOCK, -165, 0, -18, -35, 1, 18)
    fillBox(TORCH, -45, 0, -12, -45, 0, 12)

    buildCylinder(GLASS, -5, 0, 0, 18, 10)
    buildCylinder(WATER, -5, 1, 0, 15, 7)
    fillBox(IRON_BLOCK, -23, 0, -18, 13, 0, 18)
    fillBox(GLOWSTONE, -5, 11, 0, -5, 13, 0)

    buildMound(EMERALD_BLOCK, -8, 0, -58, 22, 14)
    buildMound(STONE, -8, 0, -58, 17, 10)

    buildHollowBox(IRON_BLOCK, COBBLESTONE, 35, 0, 25, 105, 18, 82)
    fillBox(GLASS, 36, 19, 26, 104, 19, 81)
    fillBox(AIR, 34, 1, 48, 36, 5, 58)
    fillBox(COAL_BLOCK, 92, 19, 34, 99, 39, 41)
    fillBox(GLOWSTONE, 45, 8, 35, 95, 8, 72)

    buildDisc(SAND, 96, 0, -35, 31)
    buildDisc(WATER, 96, 1, -35, 27)
    buildDisc(GLASS, 96, 2, -35, 12)

    buildSolarRow(48, 112)
    buildSolarRow(48, 124)
    buildSolarRow(48, 136)
    buildSolarRow(48, 148)
    fillBox(IRON_BLOCK, 44, 0, 108, 106, 0, 156)

    buildPath(-35, -3, -24, 3)
    buildPath(13, -3, 35, 3)
    buildPath(-11, -40, -5, -18)
    buildPath(82, -8, 88, 25)
    buildPath(80, 82, 86, 112)

    player.say("Layout legend: west = underground mine, center = float tank, north = heap, east = factory, northeast = tailings lake, southeast = solar farm.")
}

player.onChat("run", function () {
    buildScene()
})
