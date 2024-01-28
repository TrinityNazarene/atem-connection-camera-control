import { Commands } from 'atem-connection'
import { ChangesBuilder, assertNever } from './builder.js'
import { AtemCameraControlState } from '../state.js'
import { AtemCameraControlDisplayParameter } from '../ids.js'

export function applyDisplayCommand(
	changes: ChangesBuilder,
	command: Commands.CameraControlUpdateCommand,
	state: AtemCameraControlState
): void {
	const parameter = command.parameter as AtemCameraControlDisplayParameter
	switch (parameter) {
		case AtemCameraControlDisplayParameter.ColorBarEnable: {
			if (!changes.checkMessageParameters(command, Commands.CameraControlDataType.SINT8, 1)) return

			// TODO - should this be expressed in seconds shown?
			state.display.colorBarEnable = command.properties.numberData[0] > 1
			changes.addChange(command.source, 'lens.focus')
			return
		}

		case AtemCameraControlDisplayParameter.Brightness:
		case AtemCameraControlDisplayParameter.ExposureAndFocusTools:
		case AtemCameraControlDisplayParameter.ZebraLevel:
		case AtemCameraControlDisplayParameter.PeakingLevel:
		case AtemCameraControlDisplayParameter.FocusAssist:
		case AtemCameraControlDisplayParameter.ProgramReturnFeedEnable:
		case AtemCameraControlDisplayParameter.TimecodeSource:
			// Not implemented
			changes.addUnhandledMessage(command)
			return

		default:
			assertNever(parameter)
			changes.addUnhandledMessage(command)
			return
	}
}
