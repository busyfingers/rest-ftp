import path from 'path'
import express, { Request, Response } from 'express'
import { Client } from 'basic-ftp'
import 'dotenv/config'
import { DownloadResult } from './types'

const app = express()
app.use(express.json())
const port: number = 3000

app.post('/', async (req: Request, res: Response) => {
  const fileName = req.body?.fileName

  if (!fileName) {
    return res.status(400).send()
  }

  try {
    const result = await downloadFile(fileName, res)

    if (!result.success) {
      return res.status(400).send(result.error)
    }
  } catch (error) {
    return res.status(500).send()
  }
})

async function downloadFile(
  fullFilePath: string,
  writeStream: Response
): Promise<DownloadResult> {
  const client = new Client()
  const secure =
    process.env.TLS === 'explicit'
      ? true
      : process.env.TLS === 'implicit'
      ? 'implicit'
      : false

  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: parseInt(process.env.FTP_PORT ?? '21'),
      secure,
    })

    const { dir: filePath, base: fileName } = path.parse(fullFilePath)

    if (filePath) {
      console.log('changing dir')
      await client.cd(filePath)
    }

    const files = await client.list()
    const match = files.some((f) => f.name === fileName)

    if (!match) {
      return { success: false, error: `Unable to find file '${fileName}'` }
    }

    await client.downloadTo(writeStream, fileName)

    return { success: true }
  } catch (err) {
    console.log('err', err)
    throw err
  } finally {
    client.close()
  }
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
