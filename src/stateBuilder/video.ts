import { Commands } from 'atem-connection'
import { ChangesBuilder } from './builder.js'
import { AtemCameraControlState } from '../state.js'

export function applyVideoCommand(
	changes: ChangesBuilder,
	command: Commands.CameraControlUpdateCommand,
	state: AtemCameraControlState
): void {
	switch (command.parameter) {
		case 1: {
			// Gain (up to Camera 4.9)
			return
		}
		case 2: {
			if (!changes.checkMessageParameters(command, Commands.CameraControlDataType.SINT16, 2)) return

			state.video.whiteBalance = [command.properties.numberData[0], command.properties.numberData[1]]

			changes.addChange(command.source, 'video.whiteBalance')
			return
		}
		case 5: {
			if (!changes.checkMessageParameters(command, Commands.CameraControlDataType.SINT32, 1)) return

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
			if (!changes.checkMessageParameters(command, Commands.CameraControlDataType.SINT8, 1)) return

			state.video.videoSharpeningLevel = command.properties.numberData[0]

			changes.addChange(command.source, 'video.videoSharpeningLevel')
			return
		}
		case 13: {
			if (!changes.checkMessageParameters(command, Commands.CameraControlDataType.SINT8, 1)) return

			state.video.gain = command.properties.numberData[0]

			changes.addChange(command.source, 'video.gain')
			return
		}
		case 16: {
			if (!changes.checkMessageParameters(command, Commands.CameraControlDataType.FLOAT, 1)) return

			state.video.ndFilterStop = command.properties.numberData[0]

			changes.addChange(command.source, 'video.ndFilterStop')
			return
		}
		default:
			changes.addUnhandledMessage(command.source, command.category, command.parameter)
			return
	}
}
