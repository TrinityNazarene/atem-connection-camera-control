import type { Commands } from 'atem-connection'
import { ChangesBuilder } from './builder.js'
import { CameraControlDataType } from 'atem-connection/dist/commands/index.js'
import { AtemCameraControlState } from '../state.js'

export function applyLensCommand(
	changes: ChangesBuilder,
	command: Commands.CameraControlUpdateCommand,
	state: AtemCameraControlState
): void {
	// // HACK - adjust scaling
	// if (command.properties.type === CameraControlDataType.FLOAT) {
	// 	for (let i = 0; i < command.properties.numberData.length; i++) {
	// 		command.properties.numberData[i] *= 0x7ff / 0x800
	// 	}
	// }
	switch (command.parameter) {
		case 0: {
			if (command.properties.type !== CameraControlDataType.FLOAT || command.properties.numberData.length < 1) {
				// TODO - report error
				return
			}

			const normalisedFocus = command.properties.numberData[0] / 32 + 0.5
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
			if (command.properties.type !== CameraControlDataType.FLOAT || command.properties.numberData.length < 1) {
				// TODO - report error
				return
			}

			// let real = (command.properties.numberData[0] >> 11) - 16
			// real += (command.properties.numberData[0] & 0x7ff) / 0x800
			const normalisedIris = command.properties.numberData[0]
			// const normalisedIris = (command.properties.numberData[0] - 1.5) / 8.5
			// console.log('real', real, normalisedIris)
			state.lens.iris = normalisedIris //Math.round(normalisedIris * 1000) / 1000
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
			// TODO - unused
			console.log('unhandled source', command.parameter)
			return
	}
}
