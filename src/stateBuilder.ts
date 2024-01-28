import type { Commands } from 'atem-connection'
import { AtemCameraControlState, VideoSharpeningLevel } from './state.js'
import { ChangesBuilder } from './stateBuilder/builder.js'
import { applyVideoCommand } from './stateBuilder/video.js'
import { applyLensCommand } from './stateBuilder/lens.js'
import { applyDisplayCommand } from './stateBuilder/display.js'
import { applyColorCorrectionCommand } from './stateBuilder/colorCorrection.js'

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

			display: {
				colorBarEnable: false,
			},

			colorCorrection: {
				liftAdjust: {
					red: 0,
					green: 0,
					blue: 0,
					luma: 0,
				},
				gammaAdjust: {
					red: 0,
					green: 0,
					blue: 0,
					luma: 0,
				},
				gainAdjust: {
					red: 1,
					green: 1,
					blue: 1,
					luma: 1,
				},
				offsetAdjust: {
					red: 0,
					green: 0,
					blue: 0,
					luma: 0,
				},
				contrastAdjust: {
					pivot: 0.5,
					adj: 1,
				},
				lumaMix: 1,
				colorAdjust: {
					hue: 0,
					saturation: 1,
				},
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
				case 4:
					applyDisplayCommand(changes, command, state)
					break
				case 8:
					applyColorCorrectionCommand(changes, command, state)
					break
				default:
					console.log('Unknown category', command.category)
					break
			}
		}

		console.log(`computed changes: ${JSON.stringify(changes.getResult(), undefined, 2)}`)

		// TODO - report paths
	}
}
