import { Commands } from 'atem-connection'
import { ChangesBuilder } from './builder.js'
import { AtemCameraControlState } from '../state.js'

export function applyLensCommand(
	changes: ChangesBuilder,
	command: Commands.CameraControlUpdateCommand,
	state: AtemCameraControlState
): void {
	switch (command.parameter) {
		case 0: {
			if (!changes.checkMessageParameters(command, Commands.CameraControlDataType.FLOAT, 1)) return

			// TODO - verify this maths
			const normalisedFocus = command.properties.numberData[0] / 32
			state.lens.focus = normalisedFocus // Math.round(normalisedFocus * 1000) / 1000
			changes.addChange(command.source, 'lens.focus')
			return
		}
		case 1: {
			//Auto Focus
			changes.addEvent(command.source, 'lens.autoFocus')
			return
		}
		case 2: {
			if (!changes.checkMessageParameters(command, Commands.CameraControlDataType.FLOAT, 1)) return

			// TODO - verify range
			state.lens.iris = command.properties.numberData[0]
			changes.addChange(command.source, 'lens.iris')
			return
		}
		case 3: {
			//Auto Iris
			changes.addEvent(command.source, 'lens.autoIris')
			return
		}
		// 			case 8: {
		// 				//Zoom position
		// 				changed['zoomPosition'] = rawCommand.readUInt16BE(16) / 2048
		// 				changed['command'] = 'zoom'
		// 				break
		// 			}
		// 			case 9: {
		// 				//Zoom speed
		// 				changed['zoomSpeed'] = rawCommand.readInt16BE(16) / 2048
		// 				changed['command'] = 'zoom'
		// 				break
		// 			}
		default:
			changes.addUnhandledMessage(command.source, command.category, command.parameter)
			return
	}
}
