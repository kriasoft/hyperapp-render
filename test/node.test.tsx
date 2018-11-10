import { Readable } from 'stream'
import { h } from 'hyperapp'
import { renderToStream, renderToString } from '../src/node'
import { Counter, print } from './index.test'

function printStream(stream: Readable) {
  stream.pipe(process.stdout)
}

print(renderToString(Counter.view, Counter.state, Counter.actions))
print(renderToString(<h1>hello world</h1>))

printStream(renderToStream(Counter.view, Counter.state, Counter.actions))
printStream(renderToStream(<h1>hello world</h1>))
