import { assert } from "./utils"
import { parse, valid } from "node-html-parser"
import { workerData, parentPort } from "worker_threads"
import { UserHits } from "./types"

const analyzeTelegramHtml = (textRaw: string, userHits: UserHits) => {
    assert(valid(textRaw), "Invalid HTML")

    const root = parse(textRaw) // parsed HTML object
    const nodes = root.querySelectorAll(".from_name")

    for (const node of nodes) {
        assert(node && node.childNodes && node.childNodes.length >= 1, "Invalid from_name node")

        const user = node.childNodes[0].rawText.trim()

        if (userHits[user] === undefined) userHits[user] = 0
        userHits[user] += 1
    }
}

const analysePartial = () => {
    const userHits: UserHits = {}

    for (let i = 0; i < workerData.length; i++) {
        analyzeTelegramHtml(workerData[i], userHits)
        parentPort?.postMessage(1)
    }

    parentPort?.postMessage(userHits)
}

analysePartial()
