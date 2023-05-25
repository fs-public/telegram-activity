const { assert } = require("./utils")
const { parse, valid } = require("node-html-parser")
const { workerData, parentPort } = require("worker_threads")

const analyzeTelegramHtml = (textRaw: string, userHits: { [name: string]: number }) => {
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

export const analysePartial = () => {
    const userHits: { [name: string]: number } = {}

    for (let i = 0; i < workerData.contents.length; i++) {
        console.log("Analyzing", workerData.files[i])
        analyzeTelegramHtml(workerData.contents[i], userHits)
    }

    parentPort?.postMessage(userHits)
}
