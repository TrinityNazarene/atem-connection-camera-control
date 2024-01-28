import { Commands } from 'atem-connection'

export function constructBooleanProps(boolData: boolean[]): Commands.CameraControlPacket {
	return {
		type: Commands.CameraControlDataType.BOOL,

		boolData,
		numberData: [],
		bigintData: [],
		stringData: '',

		relative: false,
	}
}

export function constructNumberProps(
	type: Commands.CameraControlDataType,
	numberData: number[],
	relative = false
): Commands.CameraControlPacket {
	return {
		type,

		boolData: [],
		numberData,
		bigintData: [],
		stringData: '',

		relative,
	}
}
