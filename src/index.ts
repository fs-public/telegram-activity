import { HIT_BRACKETS, MESSAGES_DIRECTORY } from "./config"
import { assert, getAllFiles, readFile } from "./utils"
import { parse, valid } from "node-html-parser"
import { getBracket, getBracketName } from "./brackets"

// .search points to the first character of the match

const userHits: { [key: string]: number } = {} // global

const analyzeHtml = (textRaw: string) => {
    assert(valid(textRaw), "Invalid HTML")

    const root = parse(textRaw) // parsed HTML object
    const nodes = root.querySelectorAll(".from_name")

    for (let node of nodes) {
        assert(node && node.childNodes && node.childNodes.length >= 1, "Invalid from_name node")

        const user = node.childNodes[0].rawText.trim()

        if (userHits[user] === undefined) userHits[user] = 0
        userHits[user] += 1
    }
}

const main = async () => {
    // Initialize /////////////////////////////////////////
    console.log("Telegram Activity Analysis")

    const textsRaw: string[] = []

    const files = getAllFiles(MESSAGES_DIRECTORY)

    for (let file of files) {
        textsRaw.push(await readFile(file))
    }

    console.log("All", files.length, "files loaded.")

    // Parse /////////////////////////////////////////
    for (let i = 0; i < textsRaw.length; i++) {
        if (i % 10 === 0) console.log("Analyzing", files[i])
        analyzeHtml(textsRaw[i])
    }

    const users = Object.keys(userHits)

    console.log("All files parsed and users counted. Total unique users:", users.length)

    // Cumulative /////////////////////////////////////////
    const userCountPerBracket: { [key: string]: number } = {}
    for (let i = 0; i < HIT_BRACKETS.length + 1; i++) {
        userCountPerBracket[getBracketName(i)] = 0
    }

    for (let u of users) {
        const bracket = getBracket(userHits[u])
        userCountPerBracket[getBracketName(bracket)] += 1
    }

    console.table(userCountPerBracket)
}

main()
