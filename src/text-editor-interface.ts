import { Point, Range } from '@susisu/mte-kernel';
import { MarkdownView } from 'obsidian';

export class ObsidianTextEditor {
  private readonly editor: CodeMirror.Editor;

  constructor(editor: CodeMirror.Editor);
  constructor(view: MarkdownView);
  constructor(obj: CodeMirror.Editor | MarkdownView) {
    console.log('constructor called');
    if ('sourceMode' in obj) {
      this.editor = obj.sourceMode.cmEditor;
    } else {
      this.editor = obj;
    }
  }

  public getCursorPosition = (): Point => {
    console.log('getCursorPosition was called');
    const position = this.editor.getCursor();
    return new Point(position.line, position.ch);
  };

  public setCursorPosition = (pos: Point): void => {
    console.log('setCursorPosition was called');
    this.editor.setCursor({ line: pos.row, ch: pos.column });
  };

  public setSelectionRange = (range: Range): void => {
    console.log('setSelectionRange was called');
    this.editor.setSelection(
      { line: range.start.row, ch: range.start.column },
      { line: range.end.row, ch: range.end.column },
    );
  };

  public getLastRow = (): number => {
    console.log('getLastRow was called');
    return this.editor.lastLine();
  };

  public acceptsTableEdit = (row: number): boolean => {
    console.log(`acceptsTableEdit was called on row ${row}`);
    // TODO: What does this function want?
    return true;
  };

  public getLine = (row: number): string => {
    console.log(`getLine was called on line ${row}`);
    return this.editor.getLine(row);
  };

  public insertLine = (row: number, line: string): void => {
    console.log(`insertLine was called at line ${row}`);
    console.log(`New line: ${line}`);

    if (row > this.getLastRow()) {
      this.editor.replaceRange('\n' + line, { line: row, ch: 0 });
    } else {
      this.editor.replaceRange(line + '\n', { line: row, ch: 0 });
    }
  };

  public deleteLine = (row: number): void => {
    console.log(`deleteLine was called on line ${row}`);
    this.editor.replaceRange(
      '',
      { line: row, ch: 0 },
      { line: row + 1, ch: 0 },
    );
  };

  public replaceLines = (
    startRow: number,
    endRow: number,
    lines: string[],
  ): void => {
    console.log('replaceLines was called');
    console.log(`start ${startRow}, end: ${endRow}`);
    console.log(lines);

    // Take one off the endRow and instead go to the end of that line
    const realEndRow = endRow - 1;
    const endRowContents = this.editor.getLine(realEndRow);
    const endRowFinalIndex = endRowContents.length;

    this.editor.replaceRange(
      lines,
      { line: startRow, ch: 0 },
      { line: realEndRow, ch: endRowFinalIndex },
    );
  };

  public transact = (func: Function): void => {
    console.log('transact was called');
    this.editor.operation(() => {
      func();
    });
  };
}
