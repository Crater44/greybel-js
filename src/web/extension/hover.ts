import { SignatureDefinitionArg } from 'greyscript-meta';
import Monaco from 'monaco-editor/esm/vs/editor/editor.api';

import { LookupHelper, TypeInfoWithDefinition } from './helper/lookup-type';
import { PseudoHover, PseudoMarkdownString } from './helper/vs';

function formatType(type: string): string {
  const segments = type.split(':');
  if (segments.length === 1) {
    return segments[0];
  }
  return `${segments[0]}<${segments[1]}>`;
}

function formatTypes(types: string[] = []): string {
  return types.map(formatType).join(' or ');
}

export function activate(monaco: typeof Monaco) {
  monaco.languages.registerHoverProvider('greyscript', {
    provideHover(
      document: Monaco.editor.ITextModel,
      position: Monaco.Position,
      _token: Monaco.CancellationToken
    ): Monaco.languages.ProviderResult<Monaco.languages.Hover> {
      const helper = new LookupHelper(monaco, document);
      const astResult = helper.lookupAST(position);

      if (!astResult) {
        return;
      }

      const typeInfo = helper.lookupTypeInfo(astResult);

      if (!typeInfo) {
        return;
      }

      const hoverText = new PseudoMarkdownString('');

      if (typeInfo instanceof TypeInfoWithDefinition) {
        const defintion = typeInfo.definition;
        const args = defintion.arguments || [];
        const example = defintion.example || [];
        const returnValues = formatTypes(defintion.returns) || 'null';
        let headline;

        if (args.length === 0) {
          headline = `(${typeInfo.type}) ${typeInfo.label} (): ${returnValues}`;
        } else {
          const argValues = args
            .map(
              (item: SignatureDefinitionArg) =>
                `${item.label}${item.opt ? '?' : ''}: ${formatType(item.type)}`
            )
            .join(', ');

          headline = `(${typeInfo.type}) ${typeInfo.label} (${argValues}): ${returnValues}`;
        }

        const output = ['```', headline, '```', '***', defintion.description];

        if (example.length > 0) {
          output.push(...['#### Examples:', '```', ...example, '```']);
        }

        hoverText.appendMarkdown(output.join('\n'));

        return new PseudoHover(hoverText).valueOf();
      }

      hoverText.appendCodeblock(
        `${typeInfo.label}: ${formatTypes(typeInfo.type)}`
      );
      return new PseudoHover(hoverText).valueOf();
    }
  });
}