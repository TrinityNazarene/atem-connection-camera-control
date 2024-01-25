import type { Commands } from 'atem-connection'
import { CameraControlDataType } from 'atem-connection/dist/commands'

// TODO - should this use mobx to make this 'reactive?'

export interface AtemCameraControlState {
	readonly cameraId: number

	lens: {
		focus: number
		// autoFocused: boolean
		iris: number
		// autoIris: boolean
		opticalImageStabilisation: boolean
		zoomPosition: number
		zoomSpeed: number
	}

	video: {
		// videomode: number
		whiteBalance: [colorTemperature: number, tint: number]
		// setAutoWhite: boolean
		// restoreAutoWhite: boolean
		exposure: number
		dynamicRangeMode: 0 | 1 | 2
		videoSharpeningLevel: 0 | 1 | 2 | 3
		// recordingFormat: [number, number, number, number]
		// setAutoExpsureMode: number
		shutterAngle: number
		shutterSpeed: number
		gain: number
		iso: number
		// displayLut: [number, boolean]
		ndFilterStop: [number, number]
	}

	// TODO

	// gain: string
	// gainValue: number
	// whiteBalance: string
	// whiteBalanceValue: number
	// liftR: number
	// gammaR: number
	// gainR: number
	// liftG: number
	// gammaG: number
	// gainG: number
	// liftB: number
	// gammaB: number
	// gainB: number
	// liftY: number
	// gammaY: number
	// gainY: number
	// liftRGBY: number[]
	// gainRGBY: number[]
	// gammaRGBY: number[]
	// lumMix: number
	// hue: number
	// shutter: string
	// shutterValue: number
	// contrast: number
	// saturation: number
	// command: string
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
				dynamicRangeMode: 0,
				videoSharpeningLevel: 0,
				// recordingFormat: [number, number, number, number]
				// setAutoExpsureMode: number
				shutterAngle: 0,
				shutterSpeed: 0,
				gain: 0,
				iso: 0,
				// displayLut: [number, boolean]
				ndFilterStop: [0, 0],
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

		const changes: Array<[cameraId: number, path: string]> = []

		for (const command of commands) {
			let path: string | null = null
			switch (command.category) {
				case 0:
					path = this.#applyLensCommand(command)
					break
				case 1:
					path = this.#applyCameraCommand(command)
					break
				default:
					console.log('Unknown command')
					break
			}

			if (path !== null) changes.push([command.source, path])
		}

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

	#applyLensCommand(command: Commands.CameraControlUpdateCommand): string | null {
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
					return null
				}

				const normalisedFocus = command.properties.numberData[0] / 32 + 0.5
				state.lens.focus = normalisedFocus // Math.round(normalisedFocus * 1000) / 1000
				return 'lens.focus'
			}
			case 1: {
				//Auto Focus
				// console.log('auto focus')
				// changed['autoFocused'] = true
				// changed['command'] = 'focus'
				return null
			}
			case 2: {
				if (
					command.properties.type !== CameraControlDataType.FLOAT ||
					command.properties.numberData.length < 1
				) {
					// TODO - report error
					return null
				}

				// let real = (command.properties.numberData[0] >> 11) - 16
				// real += (command.properties.numberData[0] & 0x7ff) / 0x800

				const normalisedIris = command.properties.numberData[0]
				// const normalisedIris = (command.properties.numberData[0] - 1.5) / 8.5
				// console.log('real', real, normalisedIris)
				state.lens.iris = normalisedIris //Math.round(normalisedIris * 1000) / 1000
				return 'lens.iris'
			}
			case 3: {
				//Auto Iris
				// changed['autoIris'] = true
				// changed['command'] = 'iris'
				return null
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
				return null
		}
	}

	#applyCameraCommand(command: Commands.CameraControlUpdateCommand): string | null {
		const state = this.#getOrCreateCamera(command.source)

		// // HACK - adjust scaling
		// if (command.properties.type === CameraControlDataType.FLOAT) {
		// 	for (let i = 0; i < command.properties.numberData.length; i++) {
		// 		command.properties.numberData[i] *= 0x7ff / 0x800
		// 	}
		// }

		switch (command.parameter) {
			case 2: {
				if (
					command.properties.type !== CameraControlDataType.SINT16 ||
					command.properties.numberData.length < 2
				) {
					// TODO - report error
					return null
				}

				state.video.whiteBalance = [command.properties.numberData[0], command.properties.numberData[1]]

				return 'video.whiteBalance'
			}
			// 			case 0x05: {
			// 				//Shutter
			// 				switch (rawCommand.readUInt16BE(18)) {
			// 					case 41667: {
			// 						changed['shutter'] = '1/24'
			// 						break
			// 					}
			// 					case 40000: {
			// 						changed['shutter'] = '1/25'
			// 						break
			// 					}
			// 					case 33333: {
			// 						changed['shutter'] = '1/30'
			// 						break
			// 					}
			// 					case 20000: {
			// 						changed['shutter'] = '1/50'
			// 						break
			// 					}
			// 					case 16667: {
			// 						changed['shutter'] = '1/60'
			// 						break
			// 					}
			// 					case 13333: {
			// 						changed['shutter'] = '1/75'
			// 						break
			// 					}
			// 					case 11111: {
			// 						changed['shutter'] = '1/90'
			// 						break
			// 					}
			// 					case 10000: {
			// 						changed['shutter'] = '1/100'
			// 						break
			// 					}
			// 					case 8333: {
			// 						changed['shutter'] = '1/120'
			// 						break
			// 					}
			// 					case 6667: {
			// 						changed['shutter'] = '1/150'
			// 						break
			// 					}
			// 					case 5556: {
			// 						changed['shutter'] = '1/180'
			// 						break
			// 					}
			// 					case 4000: {
			// 						changed['shutter'] = '1/250'
			// 						break
			// 					}
			// 					case 2778: {
			// 						changed['shutter'] = '1/360'
			// 						break
			// 					}
			// 					case 2000: {
			// 						changed['shutter'] = '1/500'
			// 						break
			// 					}
			// 					case 1379: {
			// 						changed['shutter'] = '1/725'
			// 						break
			// 					}
			// 					case 1000: {
			// 						changed['shutter'] = '1/1000'
			// 						break
			// 					}
			// 					case 690: {
			// 						changed['shutter'] = '1/1450'
			// 						break
			// 					}
			// 					case 500: {
			// 						changed['shutter'] = '1/2000'
			// 						break
			// 					}
			// 				}
			// 				changed['shutterValue'] = rawCommand.readUInt16BE(18)
			// 				changed['command'] = 'shutter'
			// 				break
			// 			}
			// 		}
			// 		break
			case 13: {
				if (
					command.properties.type !== CameraControlDataType.SINT8 ||
					command.properties.numberData.length < 1
				) {
					// TODO - report error
					return null
				}

				state.video.gain = command.properties.numberData[0]
				return 'video.gain'
			}
			default:
				// TODO - log
				return null
		}
	}
}
