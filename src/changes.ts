export interface AtemCameraControlChanges {
	readonly cameraId: number

	changes: string[]
	events: AtemCameraControlEvents[]

	unhandledMessages: Array<{ categoryId: number; parameterId: number }>
	invalidMessages: Array<{ categoryId: number; parameterId: number }>
}

export enum AtemCameraControlEvents {
	LensAutoIris = 'lens.autoIris',
	LensAutoFocus = 'lens.autoFocus',
	VideoAutoWhiteBalance = 'video.autoWhiteBalance',
	ColorResetToDefault = 'color.resetToDefault',
}
