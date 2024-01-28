import type { Commands } from 'atem-connection'
import { ChangesBuilder } from './builder.js'
import { CameraControlDataType } from 'atem-connection/dist/commands/index.js'
import { AtemCameraControlState } from '../state.js'

export function applyVideoCommand(
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
		case 1: {
			// Gain (up to Camera 4.9)
			return
		}
		case 2: {
			if (command.properties.type !== CameraControlDataType.SINT16 || command.properties.numberData.length < 2) {
				// TODO - report error
				return
			}

			state.video.whiteBalance = [command.properties.numberData[0], command.properties.numberData[1]]

			changes.addChange(command.source, 'video.whiteBalance')
			return
		}
		case 5: {
			if (command.properties.type !== CameraControlDataType.SINT32 || command.properties.numberData.length < 1) {
				// TODO - report error
				return
			}

			const shutterSpeedRaw = 1000000 / command.properties.numberData[0]
			const shutterSpeedRounded =
				shutterSpeedRaw > 1000 ? 10 * Math.round(shutterSpeedRaw / 10) : Math.round(shutterSpeedRaw)

			state.video.exposure = command.properties.numberData[0]
			state.video.shutterSpeed = shutterSpeedRounded

			changes.addChange(command.source, 'video.exposure')
			changes.addChange(command.source, 'video.shutterSpeed')
			return
		}
		case 8: {
			if (command.properties.type !== CameraControlDataType.SINT8 || command.properties.numberData.length < 1) {
				// TODO - report error
				return
			}

			state.video.videoSharpeningLevel = command.properties.numberData[0]

			changes.addChange(command.source, 'video.videoSharpeningLevel')
			return
		}
		case 13: {
			if (command.properties.type !== CameraControlDataType.SINT8 || command.properties.numberData.length < 1) {
				// TODO - report error
				return
			}

			state.video.gain = command.properties.numberData[0]

			changes.addChange(command.source, 'video.gain')
			return
		}
		case 16: {
			if (command.properties.type !== CameraControlDataType.FLOAT || command.properties.numberData.length < 1) {
				// TODO - report error
				return
			}

			state.video.ndFilterStop = command.properties.numberData[0] + 16 // TODO

			changes.addChange(command.source, 'video.ndFilterStop')
			return
		}
		default:
			// TODO - log
			console.log('unhandled video', command.parameter)
			return
	}
}
