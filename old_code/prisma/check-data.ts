import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

import * as fs from 'fs'

async function main() {
    try {
        const count = await prisma.speakingScenario.count()
        let output = `Speaking Scenarios count: ${count}\n`

        if (count > 0) {
            const first = await prisma.speakingScenario.findFirst()
            output += `First scenario: ${first?.title}\n`
        }
        fs.writeFileSync('check-output.txt', output)
    } catch (e) {
        fs.writeFileSync('check-output.txt', `Error: ${e}`)
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
