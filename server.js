import express from "express"
import * as http from "http"
import WebSocket from "ws"

const port = 5000
const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ port: 8080, server })

let websockets = []

wss.on("connection", function (ws) {
    websockets.push(ws)

    ws.on("message", function (message) {
        websockets.forEach(function (otherWS) {
            if (ws !== otherWS) {
                otherWS.send(message)
            }
        })
    })

    ws.on("close", function () {
        websockets = websockets.filter(function (otherWS) {
            return ws !== otherWS
        })
    })
})

app.get("/", function (req, res) {
    res.sendFile("./index.html", { root: "." })
})

app.use((function (req, res) {
    res.sendStatus(404)
}))

app.listen(port, function () {
    console.log(`Server up and running at localhost:${port}`)
    console.log(`Websocket server available at localhost:8080`)
})
