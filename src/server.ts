import express, { Request, Response } from 'express'
import { Client } from 'basic-ftp'
import 'dotenv/config'

const app = express()
app.use(express.json())
const port: number = 3000

app.post('/', async (req: Request, res: Response) => {
  const fileName = req.body?.fileName

  if (!fileName) {
    return res.status(400).send()
  }

  try {
    await downloadFile(fileName, res)
  } catch (error) {
    return res.status(500).send()
  }
})

async function downloadFile(fileName: string, writeStream: Response) {
  const client = new Client()

  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
    })
    await client.downloadTo(writeStream, fileName)
  } catch (err) {
    console.log(err)
    throw err
  }
  client.close()
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
