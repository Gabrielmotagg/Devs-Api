const express = require("express")
const axios = require("axios")
const app = express()

app.use(express.json())

const devs = []

const GITHUB_URL = "https://api.github.com/users"

async function getUserfromGitHub(username){
  try { 
  const { data }= await axios.get(`${GITHUB_URL}/${username}`)

  return data
} catch (error) {
  console.log(error.response.data)
}
}

app.post("/devs", async (req, res) =>{
  const { username } = req.body

  const devAlreadyExists = devs.some(dev => dev.username === username)

  if (devAlreadyExists) {
    return res.status(400).json({ message: "Já esxiste um DEV com esse username!" })
  }

  const user = await getUserfromGitHub(username)

  if (!user) {
    return res.status(400).json({message: "Usuario não encontrado no Git Hub"} )
  }

  const dev = {
    id: user.id,
    name: user.name,
    username
  }

  devs.push(dev)

  return res.status(201).json({
    message: "Dev criado com sucesso!",
    dev,
  })
})

app.get("/devs", (req, res) => {
  return res.json(devs)
})
app.listen(3000)