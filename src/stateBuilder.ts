import type { Commands } from 'atem-connection'
import { AtemCameraControlState, VideoSharpeningLevel } from './state.js'
import { ChangesBuilder } from './stateBuilder/builder.js'
import { applyVideoCommand } from './stateBuilder/video.js'
import { applyLensCommand } from './stateBuilder/lens.js'

export class AtemCameraControlStateBuilder {
	readonly #states = new Map<number, AtemCameraControlState>()

	constructor(inputCount: number) {
		this.reset(inputCount)
	}

	static createEmptyState(cameraId: number): AtemCameraControlState {
		return {
			cameraId,

			lens: {
				focus: 0,
				// autoFocused: boolean
				iris: 0,
				// autoIris: boolean
				opticalImageStabilisation: false,
				zoomPosition: 0,
				zoomSpeed: 0,
			},

			// TODO
			video: {
				// videomode: number
				whiteBalance: [0, 0],
				// setAutoWhite: boolean
				// restoreAutoWhite: boolean
				exposure: 0,
				// dynamicRangeMode: 0,
				videoSharpeningLevel: VideoSharpeningLevel.Off,
				// recordingFormat: [number, number, number, number]
				// setAutoExpsureMode: number
				// shutterAngle: 0,
				shutterSpeed: 0,
				gain: 0,
				// iso: 0,
				// displayLut: [number, boolean]
				ndFilterStop: 0,
			},
		}
	}

	reset(inputCount: number): void {
		this.#states.clear()

		for (let i = 1; i <= inputCount; i++) {
			this.#states.set(i, AtemCameraControlStateBuilder.createEmptyState(i))
		}
	}

	get(cameraId: number): AtemCameraControlState | undefined {
		return this.#states.get(cameraId)
	}
	getAll(): AtemCameraControlState[] {
		return Array.from(this.#states.values())
	}

	#getOrCreateCamera(cameraId: number) {
		let state = this.#states.get(cameraId)
		if (!state) {
			state = AtemCameraControlStateBuilder.createEmptyState(cameraId)
			this.#states.set(cameraId, state)
		}
		return state
	}

	applyCommands(commands: Commands.CameraControlUpdateCommand[]): void {
		if (commands.length === 0) return

		//
		console.log(`TODO - apply ${commands.length} commands`)

		const changes = new ChangesBuilder()

		for (const command of commands) {
			const state = this.#getOrCreateCamera(command.source)

			switch (command.category) {
				case 0:
					applyLensCommand(changes, command, state)
					break
				case 1:
					applyVideoCommand(changes, command, state)
					break
				default:
					console.log('Unknown command')
					break
			}
		}

		console.log(`computed changes: ${JSON.stringify(changes.getResult(), undefined, 2)}`)

		// TODO - report paths
		// //Read in the values
		// switch (rawCommand.readUInt8(1)) {
		// 	case 0: {
		// 		break
		// 	}
		// 	case 1: {
		// 	}
		// 	case 8: {
		// 		//Chip
		// 		switch (rawCommand.readUInt8(2)) {
		// 			case 0: {
		// 				//Lift
		// 				changed['liftR'] = rawCommand.readInt16BE(16) / 4096
		// 				changed['liftG'] = rawCommand.readInt16BE(18) / 4096
		// 				changed['liftB'] = rawCommand.readInt16BE(20) / 4096
		// 				changed['liftY'] = rawCommand.readInt16BE(22) / 4096
		// 				changed['liftRGBY'] = [changed['liftR'], changed['liftG'], changed['liftB'], changed['liftY']]
		// 				changed['command'] = 'lift'
		// 				break
		// 			}
		// 			case 1: {
		// 				//Gamma
		// 				changed['gammaR'] = rawCommand.readInt16BE(16) / 8192
		// 				changed['gammaG'] = rawCommand.readInt16BE(18) / 8192
		// 				changed['gammaB'] = rawCommand.readInt16BE(20) / 8192
		// 				changed['gammaY'] = rawCommand.readInt16BE(22) / 8192
		// 				changed['gammaRGBY'] = [
		// 					changed['gammaR'],
		// 					changed['gammaG'],
		// 					changed['gammaB'],
		// 					changed['gammaY'],
		// 				]
		// 				changed['command'] = 'gamma'
		// 				break
		// 			}
		// 			case 2: {
		// 				//Gain
		// 				changed['gainR'] = rawCommand.readInt16BE(16) / 2047.9375
		// 				changed['gainG'] = rawCommand.readInt16BE(18) / 2047.9375
		// 				changed['gainB'] = rawCommand.readInt16BE(20) / 2047.9375
		// 				changed['gainY'] = rawCommand.readInt16BE(22) / 2047.9375
		// 				changed['gainRGBY'] = [changed['gainR'], changed['gainG'], changed['gainB'], changed['gainY']]
		// 				changed['command'] = 'gain'
		// 				break
		// 			}
		// 			case 3: {
		// 				//Aperture
		// 				//Not supported
		// 				break
		// 			}
		// 			case 4: {
		// 				//Contrast
		// 				changed['contrast'] = rawCommand.readInt16BE(18) / 4096
		// 				changed['command'] = 'contrast'
		// 				break
		// 			}
		// 			case 5: {
		// 				//Lum
		// 				changed['lumMix'] = rawCommand.readInt16BE(16) / 2048
		// 				changed['command'] = 'lumMix'
		// 				break
		// 			}
		// 			case 6: {
		// 				//Sat
		// 				changed['hue'] = rawCommand.readInt16BE(16) / 4096
		// 				changed['saturation'] = rawCommand.readInt16BE(18) / 2048
		// 				changed['command'] = 'hueSat'
		// 				break
		// 			}
		// 		}
		// 		break
		// 	}
		// }
	}
}
