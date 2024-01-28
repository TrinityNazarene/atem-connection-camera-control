import { Commands } from 'atem-connection'
import { ChangesBuilder } from './builder.js'
import { AtemCameraControlState } from '../state.js'

export function applyDisplayCommand(
	changes: ChangesBuilder,
	command: Commands.CameraControlUpdateCommand,
	state: AtemCameraControlState
): void {
	switch (command.parameter) {
		case 4: {
			if (!changes.checkMessageParameters(command, Commands.CameraControlDataType.SINT8, 1)) return

			// TODO - should this be expressed in seconds shown?
			state.display.colorBarEnable = command.properties.numberData[0] > 1
			changes.addChange(command.source, 'lens.focus')
			return
		}

		default:
			changes.addUnhandledMessage(command.source, command.category, command.parameter)
			return
	}
}
