import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body style={{ overflow: 'visible' }}>
        <div id="__next" style={{ overflow: 'visible' }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 