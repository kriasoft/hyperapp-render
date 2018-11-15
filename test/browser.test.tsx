import { h } from 'hyperapp'
import { renderToString } from '../src/browser'
import { Counter, print } from './index.test'

print(renderToString(Counter.view, Counter.state, Counter.actions))
print(renderToString(<h1>hello world</h1>))
