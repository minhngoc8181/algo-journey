import { defineTests } from '../../_test-utils';

export default defineTests('text-editor-undo-redo', (t) => {
  t.visible('example-1', { 
    operations: [
      ['TextEditor'],
      ['addText', 'hello'],
      ['getText'],
      ['addText', 'world'],
      ['getText'],
      ['deleteText', 3],
      ['getText'],
      ['undo'],
      ['getText'],
      ['undo'],
      ['getText'],
      ['redo'],
      ['getText'],
      ['addText', '!'],
      ['getText'],
      ['redo'],
      ['getText']
    ],
    expected: [null, null, "hello", null, "helloworld", null, "hellowo", null, "helloworld", null, "hello", null, "helloworld", null, "helloworld!", null, "helloworld!"] 
  });

  t.hidden('empty-undo', {
    operations: [
      ['TextEditor'],
      ['undo'],
      ['redo'],
      ['getText'],
      ['addText', 'test'],
      ['undo'],
      ['undo'], // already at start
      ['getText']
    ],
    expected: [null, null, null, "", null, null, null, ""]
  });
});
