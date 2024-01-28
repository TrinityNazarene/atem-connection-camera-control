import { Commands } from 'atem-connection'
import { ChangesBuilder } from './builder.js'
import { AtemCameraControlState } from '../state.js'

export function applyColorCorrectionCommand(
	changes: ChangesBuilder,
	command: Commands.CameraControlUpdateCommand,
	state: AtemCameraControlState
): void {
	switch (command.parameter) {
		case 0: {
			if (!changes.checkMessageParameters(command, Commands.CameraControlDataType.FLOAT, 4)) return

			state.colorCorrection.liftAdjust = {
				red: command.properties.numberData[0],
				green: command.properties.numberData[1],
				blue: command.properties.numberData[2],
				luma: command.properties.numberData[3],
			}
			changes.addChange(command.source, 'colorCorrection.liftAdjust')
			return
		}
		case 1: {
			if (!changes.checkMessageParameters(command, Commands.CameraControlDataType.FLOAT, 4)) return

			state.colorCorrection.gammaAdjust = {
				red: command.properties.numberData[0],
				green: command.properties.numberData[1],
				blue: command.properties.numberData[2],
				luma: command.properties.numberData[3],
			}
			changes.addChange(command.source, 'colorCorrection.gammaAdjust')
			return
		}
		case 2: {
			if (!changes.checkMessageParameters(command, Commands.CameraControlDataType.FLOAT, 4)) return

			state.colorCorrection.gainAdjust = {
				red: command.properties.numberData[0],
				green: command.properties.numberData[1],
				blue: command.properties.numberData[2],
				luma: command.properties.numberData[3],
			}
			changes.addChange(command.source, 'colorCorrection.gainAdjust')
			return
		}
		case 3: {
			if (!changes.checkMessageParameters(command, Commands.CameraControlDataType.FLOAT, 4)) return

			state.colorCorrection.offsetAdjust = {
				red: command.properties.numberData[0],
				green: command.properties.numberData[1],
				blue: command.properties.numberData[2],
				luma: command.properties.numberData[3],
			}
			changes.addChange(command.source, 'colorCorrection.offsetAdjust')
			return
		}
		case 4: {
			if (!changes.checkMessageParameters(command, Commands.CameraControlDataType.FLOAT, 2)) return

			state.colorCorrection.contrastAdjust = {
				pivot: command.properties.numberData[0],
				adj: command.properties.numberData[1],
			}
			changes.addChange(command.source, 'colorCorrection.contrastAdjust')
			return
		}
		case 5: {
			if (!changes.checkMessageParameters(command, Commands.CameraControlDataType.FLOAT, 1)) return

			state.colorCorrection.lumaMix = command.properties.numberData[0]

			changes.addChange(command.source, 'colorCorrection.lumaMix')
			return
		}
		case 6: {
			if (!changes.checkMessageParameters(command, Commands.CameraControlDataType.FLOAT, 2)) return

			state.colorCorrection.colorAdjust = {
				hue: command.properties.numberData[0],
				saturation: command.properties.numberData[1],
			}

			changes.addChange(command.source, 'colorCorrection.colorAdjust')
			return
		}

		default:
			changes.addUnhandledMessage(command.source, command.category, command.parameter)
			return
	}
}
