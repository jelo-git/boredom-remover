const express = require('express')
const app = express()
const path = require('path')

app.use(express.json())
app.use(express.static('static/'))


app.get("/",(_,res)=>{
    res.sendFile(path.join(__dirname,'components','main.html'))
})

app.listen(80,()=>{
    console.log("adress: http://localhost/")
})

// const fs = require('fs')
// const rl = require('readline')
// const read = fs.createReadStream('static/words.txt')
// const line = rl.createInterface({input:read,terminal:false})
// var arr = []
// line.on('line',(e)=>{
//     arr.push(e)
// })
// line.on('close',()=>{
//     let js = JSON.stringify(arr)
//     fs.writeFile('static/words.json',js,()=>{
//         console.log('done')
//     })
// })