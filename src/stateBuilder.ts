import type { Commands } from 'atem-connection'
import { CameraControlDataType } from 'atem-connection/dist/commands'
import { AtemCameraControlChanges, AtemCameraControlState, VideoSharpeningLevel } from './state'

class ChangesBuilder {
	readonly #changes = new Map<number, AtemCameraControlChanges>()

	getResult(): AtemCameraControlChanges[] {
		return Array.from(this.#changes.values())
	}

	#getEntry(cameraId: number): AtemCameraControlChanges {
		let entry = this.#changes.get(cameraId)
		if (!entry) {
			entry = {
				cameraId,
				changes: [],
				events: [],
			}
			this.#changes.set(cameraId, entry)
		}
		return entry
	}

	addChange(cameraId: number, path: string): void {
		const entry = this.#getEntry(cameraId)
		if (!entry.changes.includes(path)) {
			entry.changes.push(path)
		}
	}
	addEvent(cameraId: number, event: string): void {
		const entry = this.#getEntry(cameraId)
		if (!entry.events.includes(event)) {
			entry.events.push(event)
		}
	}
}

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
				// shutterSpeed: 0,
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
			switch (command.category) {
				case 0:
					this.#applyLensCommand(changes, command)
					break
				case 1:
					this.#applyCameraCommand(changes, command)
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

	#applyLensCommand(changes: ChangesBuilder, command: Commands.CameraControlUpdateCommand): void {
		const state = this.#getOrCreateCamera(command.source)

		// // HACK - adjust scaling
		// if (command.properties.type === CameraControlDataType.FLOAT) {
		// 	for (let i = 0; i < command.properties.numberData.length; i++) {
		// 		command.properties.numberData[i] *= 0x7ff / 0x800
		// 	}
		// }
		switch (command.parameter) {
			case 0: {
				if (
					command.properties.type !== CameraControlDataType.FLOAT ||
					command.properties.numberData.length < 1
				) {
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
				if (
					command.properties.type !== CameraControlDataType.FLOAT ||
					command.properties.numberData.length < 1
				) {
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

	#applyCameraCommand(changes: ChangesBuilder, command: Commands.CameraControlUpdateCommand): void {
		const state = this.#getOrCreateCamera(command.source)

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
				if (
					command.properties.type !== CameraControlDataType.SINT16 ||
					command.properties.numberData.length < 2
				) {
					// TODO - report error
					return
				}

				state.video.whiteBalance = [command.properties.numberData[0], command.properties.numberData[1]]

				changes.addChange(command.source, 'video.whiteBalance')
				return
			}
			case 5: {
				if (
					command.properties.type !== CameraControlDataType.SINT32 ||
					command.properties.numberData.length < 1
				) {
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
				if (
					command.properties.type !== CameraControlDataType.SINT8 ||
					command.properties.numberData.length < 1
				) {
					// TODO - report error
					return
				}

				state.video.videoSharpeningLevel = command.properties.numberData[0]

				changes.addChange(command.source, 'video.videoSharpeningLevel')
				return
			}
			case 13: {
				if (
					command.properties.type !== CameraControlDataType.SINT8 ||
					command.properties.numberData.length < 1
				) {
					// TODO - report error
					return
				}

				state.video.gain = command.properties.numberData[0]

				changes.addChange(command.source, 'video.gain')
				return
			}
			case 16: {
				if (
					command.properties.type !== CameraControlDataType.FLOAT ||
					command.properties.numberData.length < 1
				) {
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
}
