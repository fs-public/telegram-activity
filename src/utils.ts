import fs from "fs"
import readline from "readline"

// Standard input/output

export const assert = (condition: boolean, message?: string) => {
    if (!condition) throw new Error(message || "Error Encountered!")
}

export const delay = async (time: number) => {
    if (time == 0) return

    await new Promise(resolve => setTimeout(resolve, time))
}

// Files

export const readFile = async (filename: string) => {
    const buffer = await fs.readFileSync(filename)
    return buffer.toString()
}

export const writeFile = async (filename: string, data: string) => {
    return fs.writeFileSync(filename, data)
}

export const getAllFiles = (dir: string) => {
    const results: string[] = []

    const files = fs.readdirSync(dir)

    files.forEach(file => {
        const filePath = dir + "/" + file

        if (!fs.statSync(filePath).isDirectory()) {
            results.push(filePath)
        }
    })

    return results
}
