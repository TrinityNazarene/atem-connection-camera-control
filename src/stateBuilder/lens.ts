import { Commands } from 'atem-connection'
import { ChangesBuilder, assertNever } from './builder.js'
import { AtemCameraControlState } from '../state.js'
import { AtemCameraControlLensParameter } from '../ids.js'

export function applyLensCommand(
	changes: ChangesBuilder,
	command: Commands.CameraControlUpdateCommand,
	state: AtemCameraControlState
): void {
	const parameter = command.parameter as AtemCameraControlLensParameter
	switch (parameter) {
		case AtemCameraControlLensParameter.Focus: {
			if (!changes.checkMessageParameters(command, Commands.CameraControlDataType.FLOAT, 1)) return

			state.lens.focus = command.properties.numberData[0]
			changes.addChange(command.source, 'lens.focus')
			return
		}
		case AtemCameraControlLensParameter.AutoFocus: {
			//Auto Focus
			changes.addEvent(command.source, 'lens.autoFocus')
			return
		}
		case AtemCameraControlLensParameter.ApertureFStop: {
			if (!changes.checkMessageParameters(command, Commands.CameraControlDataType.FLOAT, 1)) return

			// TODO - verify range
			state.lens.iris = command.properties.numberData[0]
			changes.addChange(command.source, 'lens.iris')
			return
		}
		case AtemCameraControlLensParameter.AutoAperture: {
			//Auto Iris
			changes.addEvent(command.source, 'lens.autoIris')
			return
		}
		case AtemCameraControlLensParameter.ApertureNormalised:
		case AtemCameraControlLensParameter.ApertureOrdinal:
		case AtemCameraControlLensParameter.OpticalImageStabilisation:
		case AtemCameraControlLensParameter.SetAbsoluteZoomMM:
		case AtemCameraControlLensParameter.SetAbsoluteZoomNormalised:
		case AtemCameraControlLensParameter.SetContinuousZoomSpeed:
			// Not implemented
			changes.addUnhandledMessage(command)
			return

		// case 8: {
		// 	//Zoom position
		// 	changed['zoomPosition'] = rawCommand.readUInt16BE(16) / 2048
		// 	changed['command'] = 'zoom'
		// 	break
		// }
		// case 9: {
		// 	//Zoom speed
		// 	changed['zoomSpeed'] = rawCommand.readInt16BE(16) / 2048
		// 	changed['command'] = 'zoom'
		// 	break
		// }
		default:
			assertNever(parameter)
			changes.addUnhandledMessage(command)
			return
	}
}
