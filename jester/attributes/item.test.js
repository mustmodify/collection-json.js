import Item from '../../src/attributes/item.js'

test('receives data', () => {
  let item = new Item({data: [{name: 'age', value: '25'}]})
  expect(item.datum('age')['name']).toBe('age')
  expect(item.datum('age')['value']).toBe('25')
})

test('receives links', () => {
  let item = new Item({links: [{"rel" : "blog", "href" : "http://examples.org/blogs/jdoe", "prompt" : "Blog"}]})
  expect(item.link('blog').href()).toBe("http://examples.org/blogs/jdoe")
  expect(item.link('blog').prompt()).toBe("Blog")
})
