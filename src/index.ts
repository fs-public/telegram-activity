import { HIT_BRACKETS, MESSAGES_DIRECTORY, OUTPUT_FILENAME } from "./config"
import { getAllFiles, readFile, writeFile } from "./utils"
import { getBracket, getBracketName } from "./brackets"
import { analyzeConcurrently } from "./workers/manager"
import { stringify } from "csv-stringify/sync"

const main = async () => {
    // Initialize /////////////////////////////////////////
    console.log("Telegram Activity Analysis")
    console.log("fs-public\n")

    const contents = getAllFiles(MESSAGES_DIRECTORY).map((file) => readFile(file))

    console.log("All", contents.length, "files loaded.")

    // Analyze /////////////////////////////////////////

    const userHits = await analyzeConcurrently(contents)

    const users = Object.keys(userHits)

    console.log("All files parsed and users counted. Total unique users:", users.length)

    // Cumulative sums /////////////////////////////////////////

    const userCounts = [...Array(HIT_BRACKETS.length + 1)].fill(0)

    users.forEach((user) => userCounts[getBracket(userHits[user])]++)

    // Outputs /////////////////////////////////////////

    const userHitsWithKeys = Object.fromEntries(userCounts.map((hits, i) => [getBracketName(i), hits]))
    console.table(userHitsWithKeys)

    writeFile(
        OUTPUT_FILENAME,
        stringify(
            userCounts.map((count, i) => ({ bracket: getBracketName(i), count })),
            {
                header: true,
                columns: { bracket: "Bracket", count: "UniqueUsers" },
            }
        )
    )
}

main()
