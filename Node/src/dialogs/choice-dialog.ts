import { Library } from 'botbuilder';
import * as common from '../common';
import { Strings } from '../consts';

export function register(library: Library): void {
    library.dialog('choice-dialog', createDialog());
}

function createDialog() {
    return common.createBaseDialog()
        .onBegin((session, args) => {
            session.dialogData.locations = args.locations;

            session.send(Strings.MultipleResultsFound).sendBatch();
        })
        .onDefault((session) => {
            var numberExp = /[+-]?(?:\d+\.?\d*|\d*\.?\d+)/;
            var match = numberExp.exec(session.message.text);
            if (match) {
                var currentNumber = Number(match[0]);
                if (currentNumber > 0 && currentNumber <= session.dialogData.locations.length) {
                    var place = common.processLocation(session.dialogData.locations[currentNumber - 1], true);
                    session.endDialogWithResult({ response: { place: place } });
                    return;
                }
            }

            session.send(Strings.InvalidLocationResponse).sendBatch();
        });
}