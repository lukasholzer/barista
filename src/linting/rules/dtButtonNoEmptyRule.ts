import { AttrAst, ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { isButtonAttr, isButtonElement } from '../helpers';

class DtButtonVisitor extends BasicTemplateAstVisitor {

  // tslint:disable-next-line no-any
  visitElement(element: ElementAst, context: any): any {
    this._validateElement(element);
    super.visitElement(element, context);
  }
  
  // tslint:disable-next-line no-any
  private _validateElement(element: ElementAst): any {
    if (!isButtonElement(element)) {
      return;
    }

    const attrs: AttrAst[] = element.attrs;
    const isButton = attrs.some((attr) => isButtonAttr(attr));
    const startOffset = element.sourceSpan.start.offset;
    const endOffset = element.sourceSpan.end.offset;

    if (isButton) {
      if (element.children.length < 1) {
        // tslint:disable-next-line max-line-length
        this.addFailureFromStartToEnd(startOffset, endOffset, 'A dt-button must always contain text. Make sure that this is the case even if you use nested components to render text.');
      }
    }
  }
}

/**
 * The dtButtonNoEmptyRule ensures that a button always contains text/content.
 *
 * The following examples pass the button lint checks:
 * <button dt-button>Button text</button>
 * <button dt-button><my-text-component></my-text-component></button>
 *
 * For the following example the linter throws an error:
 * <button dt-button></button>, content required
 */
// tslint:disable-next-line:max-classes-per-file
export class Rule extends Rules.AbstractRule {

  static readonly metadata: IRuleMetadata = {
    // tslint:disable-next-line max-line-length
    description: 'Ensures that a button is never empty.',
    // tslint:disable-next-line no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A button must always contain text or another component that renders text.',
    ruleName: 'dt-button-no-empty',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtButtonVisitor,
      }),
    );
  }
}