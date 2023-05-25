import fs from "fs"

// Assertions

export const assert = (condition: boolean, message?: string) => {
    if (!condition) throw new Error(message || "Error Encountered!")
}

// Files

export const readFile = (filename: string) => {
    return fs.readFileSync(filename).toString()
}

export const writeFile = (filename: string, data: string) => {
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
