import { HIT_BRACKETS, MAX_WORKER_THREADS, MESSAGES_DIRECTORY } from "./config"
import { getAllFiles, readFile } from "./utils"
import { getBracket, getBracketName } from "./brackets"
import { Worker } from "worker_threads"

const spawnWorker = (workerData: any): Promise<{ [name: string]: number }> => {
    return new Promise(resolve => {
        const worker = new Worker("./src/analysis.js", { workerData })
        worker.on("message", data => resolve(data))
        //worker.on("error")
    })
}

const main = async () => {
    // Initialize /////////////////////////////////////////
    console.log("Telegram Activity Analysis")

    const files = getAllFiles(MESSAGES_DIRECTORY)

    const contents = files.map(file => readFile(file))

    console.log("All", files.length, "files loaded.")

    // Analyze /////////////////////////////////////////

    const totalThreads = Math.min(Math.round(files.length / 25), MAX_WORKER_THREADS)
    const filesPerThread = Math.ceil(files.length / totalThreads)

    console.log("Spawning", totalThreads, "worker threads")

    const workers = [...Array(totalThreads)].fill(undefined).map((_, i) => {
        const from = i * filesPerThread
        const to = (i + 1) * filesPerThread
        return spawnWorker({ files: files.slice(from, to), contents: contents.slice(from, to) })
    })

    const results = await Promise.all(workers)

    const userHits: { [name: string]: number } = {}

    results.forEach(resultSlice => {
        Object.keys(resultSlice).forEach(key => {
            userHits[key] = (userHits[key] || 0) + (resultSlice[key] || 0)
        })
    })

    const users = Object.keys(userHits)

    console.log("All files parsed and users counted. Total unique users:", users.length)

    // Cumulative sums /////////////////////////////////////////

    const userCounts = [...Array(HIT_BRACKETS.length + 1)].fill(0)

    users.forEach(user => userCounts[getBracket(userHits[user])]++)

    // Output as a nice table
    const userHitsWithKeys = Object.fromEntries(userCounts.map((hits, i) => [getBracketName(i), hits]))
    console.table(userHitsWithKeys)
}

main()
