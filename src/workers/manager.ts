import { MAX_WORKER_THREADS } from "../config"
import { getDistFile } from "../utils"
import { Worker } from "worker_threads"
import { UserHits } from "../types"

let analyzedFiles = 0

const spawnWorker = (workerData: string[]): Promise<UserHits> => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(getDistFile("./workers/analysis"), { workerData })
        worker.on("message", (data) => {
            if (typeof data === "number") analyzedFiles += data
            else resolve(data)
        })
        worker.on("error", (message) => reject(message))
    })
}

export const analyzeConcurrently = async (contents: string[]) => {
    const totalThreads = Math.min(Math.round(contents.length / 25), MAX_WORKER_THREADS)
    const filesPerThread = Math.ceil(contents.length / totalThreads)

    console.log("Spawning", totalThreads, "worker threads")

    const workers = [...Array(totalThreads)]
        .fill(undefined)
        .map((_, i) => spawnWorker(contents.slice(i * filesPerThread, (i + 1) * filesPerThread)))

    const progressInterval = setInterval(() => console.log("Analyzed", analyzedFiles, "files..."), 1000)

    const results = await Promise.all(workers)

    clearInterval(progressInterval)

    const userHits: UserHits = {}

    results.forEach((resultSlice) => {
        Object.keys(resultSlice).forEach((key) => {
            userHits[key] = (userHits[key] || 0) + (resultSlice[key] || 0)
        })
    })

    return userHits
}
