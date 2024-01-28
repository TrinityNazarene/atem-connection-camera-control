export interface AtemCameraControlChanges {
	readonly cameraId: number

	changes: string[]
	events: string[]

	unhandledMessages: Array<{ categoryId: number; parameterId: number }>
	invalidMessages: Array<{ categoryId: number; parameterId: number }>
}
