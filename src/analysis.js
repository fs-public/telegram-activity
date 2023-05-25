/* eslint-disable */

const { parse, valid } = require("node-html-parser")
const { workerData, parentPort } = require("worker_threads")

const assert = (condition, message) => {
    if (!condition) throw new Error(message || "Error Encountered!")
}

const analyzeTelegramHtml = (textRaw, userHits) => {
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
    const userHits = {}

    for (let i = 0; i < workerData.length; i++) {
        analyzeTelegramHtml(workerData[i], userHits)
        parentPort.postMessage(1)
    }

    parentPort.postMessage(userHits)
}

analysePartial()
