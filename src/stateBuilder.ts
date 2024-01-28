import type { Commands } from 'atem-connection'
import type { AtemCameraControlState } from './state.js'
import { ChangesBuilder } from './stateBuilder/builder.js'
import { applyVideoCommand } from './stateBuilder/video.js'
import { applyLensCommand } from './stateBuilder/lens.js'
import { applyDisplayCommand } from './stateBuilder/display.js'
import { applyColorCorrectionCommand } from './stateBuilder/colorCorrection.js'
import { createEmptyState } from './emptyState.js'

export class AtemCameraControlStateBuilder {
	readonly #states = new Map<number, AtemCameraControlState>()

	constructor(inputCount: number) {
		this.reset(inputCount)
	}

	reset(inputCount: number): void {
		this.#states.clear()

		for (let i = 1; i <= inputCount; i++) {
			this.#states.set(i, createEmptyState(i))
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
			state = createEmptyState(cameraId)
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
