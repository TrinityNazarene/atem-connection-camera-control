import { AtemCameraControlChanges } from '../state.js'

export class ChangesBuilder {
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
