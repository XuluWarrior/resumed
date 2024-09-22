import puppeteer, { PDFOptions } from 'puppeteer'
import { render } from './render.js'

type Theme<T> = {
  render: (resume: object) => T | Promise<T>
  pdfRenderOptions?: PDFOptions
}

export const exportPdf = async (
  resume: object,
  theme: Theme<string>,
  output: string,
) => {
  const html = await render(resume, theme)

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.setContent(html, { waitUntil: 'networkidle0' })
  await page.pdf({
    path: output,
    format: 'a4',
    printBackground: true,
    ...theme.pdfRenderOptions,
  })
  await browser.close()
}
