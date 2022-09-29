import { init as initGHIntrinsics } from 'greybel-gh-mock-intrinsics';
import {
  CustomFunction,
  CustomValue,
  Debugger,
  Defaults,
  HandlerContainer,
  Interpreter,
  OperationContext
} from 'greybel-interpreter';
import { init as initIntrinsics } from 'greybel-intrinsics';
import inquirer from 'inquirer';

import { CLIOutputHandler } from './execute';
inquirer.registerPrompt('command', require('inquirer-command-prompt'));

class GrebyelPseudoDebugger extends Debugger {
  debug() {
    return Defaults.Void;
  }

  getBreakpoint(_operationContext: OperationContext): boolean {
    return false;
  }

  interact(_operationContext: OperationContext) {}
}

export interface REPLOptions {
  api?: Map<string, CustomFunction>;
}

export default async function repl(
  options: REPLOptions = {}
): Promise<boolean> {
  const vsAPI = options.api || new Map<string, CustomFunction>();
  let active = true;

  vsAPI.set(
    'exit',
    CustomFunction.createExternal(
      'exit',
      (
        ctx: OperationContext,
        _self: CustomValue,
        args: Map<string, CustomValue>
      ): Promise<CustomValue> => {
        ctx.handler.outputHandler.print(args.get('value')!.toString());
        active = false;
        return Promise.resolve(Defaults.Void);
      }
    ).addArgument('value')
  );

  const interpreter = new Interpreter({
    debugger: new GrebyelPseudoDebugger(),
    handler: new HandlerContainer({
      outputHandler: new CLIOutputHandler()
    }),
    api: initIntrinsics(initGHIntrinsics(vsAPI))
  });

  try {
    /* eslint-disable-next-line no-unmodified-loop-condition */
    while (active) {
      const inputMap = await inquirer.prompt({
        prefix: '>',
        name: 'repl'
      });

      try {
        await interpreter.run(inputMap.repl);
      } catch (err: any) {
        const opc =
          interpreter.apiContext.getLastActive() || interpreter.globalContext;

        console.error(
          `${err.message} at line ${opc.stackItem?.start!.line}:${
            opc.stackItem?.start!.character
          } in ${opc.target}`
        );
      }
    }
  } catch (err: any) {
    console.error(err);

    return false;
  }

  return true;
}
