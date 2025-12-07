
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function main() {
    try {
        const count = await prisma.speakingScenario.count()
        const result = `Count: ${count}`
        console.log(result)
        fs.writeFileSync('db-check-result.txt', result)
    } catch (error) {
        const err = `Error: ${error}`
        console.error(err)
        fs.writeFileSync('db-check-result.txt', err)
    }
}

main()
    .catch(e => {
        const err = `Main Error: ${e}`
        console.error(err)
        fs.writeFileSync('db-check-result.txt', err)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
