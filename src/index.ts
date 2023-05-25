import { HIT_BRACKETS, MAX_WORKER_THREADS, MESSAGES_DIRECTORY } from "./config"
import { getAllFiles, readFile } from "./utils"
import { getBracket, getBracketName } from "./brackets"
import { Worker } from "worker_threads"
import { UserHits } from "./types"

let analyzedFiles = 0

const spawnWorker = (workerData: string[]): Promise<UserHits> => {
    return new Promise((resolve, reject) => {
        const worker = new Worker("./dist/analysis.js", { workerData })
        worker.on("message", data => {
            if (typeof data === "number") analyzedFiles += data
            else resolve(data)
        })
        worker.on("error", message => reject(message))
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

    const workers = [...Array(totalThreads)]
        .fill(undefined)
        .map((_, i) => spawnWorker(contents.slice(i * filesPerThread, (i + 1) * filesPerThread)))

    const progressInterval = setInterval(() => console.log("Analyzed", analyzedFiles, "files..."), 1000)

    const results = await Promise.all(workers)

    clearInterval(progressInterval)

    const userHits: UserHits = {}

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
